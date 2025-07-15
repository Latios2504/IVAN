using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using ivan_api.Configuration;
using ivan_api.DTOs.AI;
using ivan_api.Services.AI.Interfaces;

namespace ivan_api.Services.AI.Providers;

/// <summary>
/// OpenRouter AI provider implementation for free-tier access
/// </summary>
public class OpenRouterAiProvider : IAiProvider
{
    private readonly HttpClient _httpClient;
    private readonly AiModelConfiguration _config;
    private readonly ILogger<OpenRouterAiProvider> _logger;

    public string ProviderName => "OpenRouter";
    public AiProviderType ProviderType => AiProviderType.OpenRouter;
    public bool IsEnabled => _config.IsEnabled;

    public OpenRouterAiProvider(HttpClient httpClient, AiModelConfiguration config, ILogger<OpenRouterAiProvider> logger)
    {
        _httpClient = httpClient;
        _config = config;
        _logger = logger;
        
        // Set up HTTP client headers for OpenRouter
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_config.ApiKey}");
        _httpClient.DefaultRequestHeaders.Add("HTTP-Referer", "https://ivan-volunteer.com");
        _httpClient.DefaultRequestHeaders.Add("X-Title", "IVAN AI Testing Playground");
    }

    public async Task<AiTestResult> SendPromptAsync(string prompt, CancellationToken cancellationToken = default)
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        var result = new AiTestResult
        {
            ProviderName = ProviderName,
            Model = _config.DefaultModel,
            Prompt = prompt
        };

        try
        {
            var requestBody = new
            {
                model = _config.DefaultModel,
                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content = prompt
                    }
                },
                max_tokens = _config.MaxTokens,
                temperature = _config.Temperature
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_config.BaseUrl, content, cancellationToken);

            stopwatch.Stop();
            result.ResponseTimeMs = (int)stopwatch.ElapsedMilliseconds;

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
                var openRouterResponse = JsonSerializer.Deserialize<OpenRouterResponse>(responseContent);

                if (openRouterResponse?.Choices?.Any() == true)
                {
                    result.Success = true;
                    result.Response = openRouterResponse.Choices[0]?.Message?.Content ?? "No response";
                    result.TokensUsed = openRouterResponse.Usage?.TotalTokens ?? 0;
                }
                else
                {
                    result.Success = false;
                    result.ErrorMessage = "No valid response from OpenRouter";
                }
            }
            else
            {
                result.Success = false;
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                result.ErrorMessage = $"HTTP {response.StatusCode}: {errorContent}";
            }
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            result.ResponseTimeMs = (int)stopwatch.ElapsedMilliseconds;
            result.Success = false;
            result.ErrorMessage = ex.Message;
            _logger.LogError(ex, "Error calling OpenRouter API");
        }

        return result;
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
                model = modelToUse,
                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content = prompt
                    }
                },
                max_tokens = _config.MaxTokens,
                temperature = _config.Temperature
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_config.BaseUrl, content, cancellationToken);
            stopwatch.Stop();
            result.ResponseTimeMs = (int)stopwatch.ElapsedMilliseconds;

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogInformation($"OpenRouter API call successful for model {modelToUse}. Response length: {responseContent.Length}");

                try
                {
                    var openRouterResponse = JsonSerializer.Deserialize<OpenRouterResponse>(responseContent);
                    
                    if (openRouterResponse?.Choices?.Any() == true && 
                        !string.IsNullOrEmpty(openRouterResponse.Choices[0]?.Message?.Content))
                    {
                        result.Response = openRouterResponse.Choices[0].Message.Content;
                        result.Success = true;
                    }
                    else
                    {
                        result.Success = false;
                        result.ErrorMessage = "No valid response from OpenRouter";
                    }
                }
                catch (JsonException ex)
                {
                    result.Success = false;
                    result.ErrorMessage = $"Failed to parse OpenRouter response: {ex.Message}";
                    _logger.LogError(ex, $"Failed to parse OpenRouter JSON response for model {modelToUse}");
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
            _logger.LogError(ex, $"Error calling OpenRouter API with model {modelToUse}");
        }

        return result;
    }


    public Services.AI.Interfaces.AiProviderCapabilities GetCapabilities()
    {
        return new Services.AI.Interfaces.AiProviderCapabilities
        {
            MaxTokens = _config.MaxTokens,
            RequestsPerMinute = _config.RequestsPerMinute,
            RequestsPerDay = _config.RequestsPerDay,
            SupportedModels = _config.AvailableModels?.Any() == true 
                ? _config.AvailableModels 
                : new List<string> { _config.DefaultModel },
            SupportsStreaming = true,
            SupportsFunctionCalling = false
        };
    }

    public async Task<List<string>> GetAvailableModelsAsync(CancellationToken cancellationToken = default)
    {
        // Return available models from configuration
        var models = _config.AvailableModels?.Any() == true 
            ? _config.AvailableModels 
            : new List<string> { _config.DefaultModel };
            
        return await Task.FromResult(models);
    }

    // OpenRouter API response models
    private class OpenRouterResponse
    {
        [JsonPropertyName("choices")]
        public List<OpenRouterChoice>? Choices { get; set; }
        [JsonPropertyName("usage")]
        public OpenRouterUsage? Usage { get; set; }
    }

    private class OpenRouterChoice
    {
        [JsonPropertyName("message")]
        public OpenRouterMessage? Message { get; set; }
    }

    private class OpenRouterMessage
    {
        [JsonPropertyName("content")]
        public string? Content { get; set; }
    }

    private class OpenRouterUsage
    {
        [JsonPropertyName("total_tokens")]
        public int TotalTokens { get; set; }
        [JsonPropertyName("prompt_tokens")]
        public int PromptTokens { get; set; }
        [JsonPropertyName("completion_tokens")]
        public int CompletionTokens { get; set; }
    }
}
