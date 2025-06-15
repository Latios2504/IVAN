using System.Text;
using System.Text.Json;
using ivan_api.Configuration;
using ivan_api.DTOs;

namespace ivan_api.Services;

public class GoogleSheetsService : IGoogleSheetsService
{
    private readonly HttpClient _httpClient;
    private readonly GoogleSheetsConfiguration _config;
    private readonly ILogger<GoogleSheetsService> _logger;
    private readonly Dictionary<string, (GoogleSheetsResponseDTO Data, DateTime CachedAt)> _cache;

    public GoogleSheetsService(
        HttpClient httpClient,
        GoogleSheetsConfiguration config,
        ILogger<GoogleSheetsService> logger)
    {
        _httpClient = httpClient;
        _config = config;
        _logger = logger;
        _cache = new Dictionary<string, (GoogleSheetsResponseDTO, DateTime)>();
    }

    public async Task<ApiResponseDTO<GoogleSheetsResponseDTO>> ReadSheetDataAsync(string query, string? sheetId = null, string? range = null)
    {
        try
        {
            var effectiveSheetId = sheetId ?? _config.DefaultSheetId;
            var effectiveRange = range ?? _config.DefaultRange;

            if (string.IsNullOrWhiteSpace(effectiveSheetId))
            {
                return new ApiResponseDTO<GoogleSheetsResponseDTO>
                {
                    Success = false,
                    Message = "Sheet ID không được cung cấp",
                    Data = null
                };
            }

            // Check cache first
            var cacheKey = $"{effectiveSheetId}_{effectiveRange}_{query}";
            if (_config.EnableCache && _cache.ContainsKey(cacheKey))
            {
                var cachedItem = _cache[cacheKey];
                if (DateTime.Now.Subtract(cachedItem.CachedAt).TotalMinutes < _config.CacheExpiryMinutes)
                {
                    _logger.LogInformation("Returning cached data for sheet {SheetId}", effectiveSheetId);
                    return new ApiResponseDTO<GoogleSheetsResponseDTO>
                    {
                        Success = true,
                        Message = "Dữ liệu từ cache",
                        Data = cachedItem.Data
                    };
                }
                else
                {
                    _cache.Remove(cacheKey);
                }
            }            _logger.LogInformation("Calling n8n webhook to read Google Sheet {SheetId}", effectiveSheetId);

            var requestDto = new GoogleSheetsN8nRequestDTO
            {
                Query = query,
                SheetId = effectiveSheetId,
                Range = effectiveRange,
                Action = "read_data"
            };

            var json = JsonSerializer.Serialize(requestDto, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            _logger.LogInformation("Sending request to n8n URL: {Url} with payload: {Payload}", _config.N8nWebhookUrl, json);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Set timeout
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(_config.TimeoutSeconds));

            var response = await _httpClient.PostAsync(_config.N8nWebhookUrl, content, cts.Token);

            _logger.LogInformation("n8n response status: {StatusCode}", response.StatusCode);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("n8n webhook error: {StatusCode} - {Content}", response.StatusCode, errorContent);

                return new ApiResponseDTO<GoogleSheetsResponseDTO>
                {
                    Success = false,
                    Message = "Không thể kết nối với n8n service để đọc Google Sheets",
                    Data = null
                };
            }            var responseContent = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("n8n response content: {Content}", responseContent);
            
            // Check if response contains actual data about volunteer count
            if (responseContent.Contains("Tổng số dòng dữ liệu:") || responseContent.Contains("tình nguyện viên"))
            {
                _logger.LogInformation("Response contains volunteer count data");
            }
            else
            {
                _logger.LogWarning("Response does not contain expected volunteer count data");
            }
            
            // Handle case where n8n returns template expressions
            GoogleSheetsResponseDTO? sheetsResponse;
            try
            {
                sheetsResponse = JsonSerializer.Deserialize<GoogleSheetsResponseDTO>(responseContent, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });
            }
            catch (JsonException ex)
            {
                _logger.LogWarning("Failed to parse n8n response as JSON, trying to extract data manually: {Error}", ex.Message);
                
                // Fallback: create a response manually
                sheetsResponse = new GoogleSheetsResponseDTO
                {
                    Success = responseContent.Contains("\"success\":true"),
                    Message = "Dữ liệu từ n8n (parsed manually)",
                    Data = ExtractDataFromResponse(responseContent),
                    Query = query,
                    Timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                };
            }

            _logger.LogInformation("Processed response: Success={Success}, DataLength={DataLength}", 
                sheetsResponse?.Success, sheetsResponse?.Data?.Length);

            if (sheetsResponse != null)
            {
                // Cache the response
                if (_config.EnableCache)
                {
                    _cache[cacheKey] = (sheetsResponse, DateTime.Now);
                }

                _logger.LogInformation("Successfully retrieved data from Google Sheet {SheetId}", effectiveSheetId);

                return new ApiResponseDTO<GoogleSheetsResponseDTO>
                {
                    Success = true,
                    Message = "Dữ liệu đã được lấy thành công từ Google Sheets",
                    Data = sheetsResponse
                };
            }

            return new ApiResponseDTO<GoogleSheetsResponseDTO>
            {
                Success = false,
                Message = "Không nhận được dữ liệu từ Google Sheets",
                Data = null
            };
        }
        catch (TaskCanceledException)
        {
            _logger.LogError("Timeout when calling n8n webhook for Google Sheets");
            return new ApiResponseDTO<GoogleSheetsResponseDTO>
            {
                Success = false,
                Message = "Timeout khi đọc dữ liệu từ Google Sheets",
                Data = null
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reading Google Sheet data");
            return new ApiResponseDTO<GoogleSheetsResponseDTO>
            {
                Success = false,
                Message = "Lỗi khi đọc dữ liệu từ Google Sheets",
                Data = null
            };
        }
    }    public async Task<ApiResponseDTO<GoogleSheetsResponseDTO>> ReadSheetDataForAIAsync(string userQuery, string? sheetId = null)
    {
        return await ReadSheetDataAsync($"AI Query: {userQuery}", sheetId);
    }

    private string ExtractDataFromResponse(string responseContent)
    {
        try
        {
            // Try to extract actual data from the n8n response
            // This is a temporary workaround for template expression issues
            
            if (responseContent.Contains("D? li?u da du?c l?y thành công") || 
                responseContent.Contains("Dữ liệu đã được lấy thành công"))
            {
                return "Dữ liệu từ Google Sheets đã được lấy thành công. " +
                       "Vui lòng kiểm tra n8n workflow để đảm bảo template expressions được resolve đúng cách. " +
                       "Hiện tại đang sử dụng fallback response.";
            }
            
            return "Không thể extract dữ liệu từ n8n response";
        }
        catch
        {
            return "Lỗi khi extract dữ liệu từ response";
        }
    }
}
