using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using ivan_api.Configuration;
using ivan_api.DTOs.AI;
using ivan_api.Services.AI.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ivan_api.Services.AI.Providers;

/// <summary>
/// Gemini AI provider implementation for free-tier access
/// </summary>
public class GeminiAiProvider : IAiProvider
{
    private readonly HttpClient _httpClient;
    private readonly AiModelConfiguration _config;
    private readonly ILogger<GeminiAiProvider> _logger;

    public string ProviderName => "Gemini";
    public AiProviderType ProviderType => AiProviderType.Gemini;
    public bool IsEnabled => _config.IsEnabled;

    public GeminiAiProvider(HttpClient httpClient, IOptionsMonitor<AiModelConfiguration> config, ILogger<GeminiAiProvider> logger)
    {
        _httpClient = httpClient;
        _config = config.Get("Gemini");
        _logger = logger;
    }

    public async Task<AiTestResult> SendPromptAsync(string prompt, CancellationToken cancellationToken = default)
    {
        return await SendPromptAsync(prompt, null, cancellationToken);
    }

    public async Task<AiTestResult> SendPromptAsync(string prompt, string? modelName = null, CancellationToken cancellationToken = default)
    {
        var modelToUse = !string.IsNullOrEmpty(modelName) ? modelName : _config.DefaultModel;
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        var result = new AiTestResult
        {
            ProviderName = ProviderName,
            Model = modelToUse,
            Prompt = prompt
        };

        try
        {
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = _config.Temperature,
                    maxOutputTokens = _config.MaxTokens
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"{_config.BaseUrl}/{modelToUse}:generateContent?key={_config.ApiKey}";
            var response = await _httpClient.PostAsync(url, content, cancellationToken);

            stopwatch.Stop();
            result.ResponseTimeMs = (int)stopwatch.ElapsedMilliseconds;

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
                
                // Log for debugging specific model issues
                if (!string.IsNullOrEmpty(responseContent))
                {
                    _logger.LogInformation($"Gemini API call successful for model {modelToUse}. Response length: {responseContent.Length}");
                }
                
                try
                {
                    var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(responseContent);

                    if (geminiResponse?.Candidates?.Any() == true)
                    {
                        var candidate = geminiResponse.Candidates[0];
                        
                        // Check if response was truncated due to token limits
                        if (candidate.FinishReason == "MAX_TOKENS")
                        {
                            result.Success = false;
                            result.ErrorMessage = "Response was truncated due to token limit. Try increasing maxOutputTokens or shortening your prompt.";
                            _logger.LogWarning($"Gemini model {modelToUse} response truncated due to MAX_TOKENS limit");
                            return result;
                        }
                        
                        // Extract text from response parts
                        var allText = candidate?.Content?.Parts?
                            .Where(p => !string.IsNullOrEmpty(p.Text))
                            .Select(p => p.Text)
                            .ToList();
                            
                        if (allText?.Any() == true)
                        {
                            result.Success = true;
                            result.Response = string.Join("", allText);
                            result.TokensUsed = geminiResponse.UsageMetadata?.TotalTokenCount ?? 0;
                        }
                        else
                        {
                            result.Success = false;
                            result.ErrorMessage = "Gemini returned a response but with no text content. This may be due to content filtering or token limits.";
                            _logger.LogWarning($"Gemini model {modelToUse} returned candidate but no text parts. FinishReason: {candidate.FinishReason}");
                        }
                    }
                    else
                    {
                        result.Success = false;
                        result.ErrorMessage = "No valid response from Gemini - no candidates found";
                        _logger.LogWarning($"Gemini model {modelToUse} returned no candidates in response");
                    }
                }
                catch (JsonException ex)
                {
                    result.Success = false;
                    result.ErrorMessage = $"Failed to parse Gemini response: {ex.Message}";
                    _logger.LogError(ex, $"Failed to parse Gemini JSON response for model {modelToUse}. Response: {responseContent}");
                }
            }
            else
            {
                result.Success = false;
                result.ErrorMessage = $"HTTP {response.StatusCode}: {await response.Content.ReadAsStringAsync(cancellationToken)}";
            }
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            result.ResponseTimeMs = (int)stopwatch.ElapsedMilliseconds;
            result.Success = false;
            result.ErrorMessage = ex.Message;
            _logger.LogError(ex, $"Error calling Gemini API with model {modelToUse}");
        }

        return result;
    }

    public async Task<List<string>> GetAvailableModelsAsync(CancellationToken cancellationToken = default)
    {
        // Return available models from configuration
        var models = _config.AvailableModels?.Any() == true 
            ? _config.AvailableModels 
            : new List<string> { _config.DefaultModel };
            
        return await Task.FromResult(models);
    }

    public AiProviderCapabilities GetCapabilities()
    {
        return new AiProviderCapabilities
        {
            MaxTokens = _config.MaxTokens,
            RequestsPerMinute = _config.RequestsPerMinute,
            RequestsPerDay = _config.RequestsPerDay,
            SupportedModels = _config.AvailableModels?.Any() == true 
                ? _config.AvailableModels 
                : new List<string> { _config.DefaultModel },
            SupportsStreaming = false,
            SupportsFunctionCalling = true
        };
    }

    // Gemini API response models
    private class GeminiResponse
    {
        [JsonPropertyName("candidates")]
        public List<GeminiCandidate>? Candidates { get; set; }
        
        [JsonPropertyName("usageMetadata")]
        public GeminiUsageMetadata? UsageMetadata { get; set; }
    }

    private class GeminiCandidate
    {
        [JsonPropertyName("content")]
        public GeminiContent? Content { get; set; }
        
        [JsonPropertyName("finishReason")]
        public string? FinishReason { get; set; }
    }

    private class GeminiContent
    {
        [JsonPropertyName("parts")]
        public List<GeminiPart>? Parts { get; set; }
    }

    private class GeminiPart
    {
        [JsonPropertyName("text")]
        public string? Text { get; set; }
    }

    private class GeminiUsageMetadata
    {
        [JsonPropertyName("totalTokenCount")]
        public int TotalTokenCount { get; set; }
    }
}
