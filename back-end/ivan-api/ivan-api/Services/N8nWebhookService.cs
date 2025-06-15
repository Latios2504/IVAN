using System.Text;
using System.Text.Json;
using ivan_api.DTOs;

namespace ivan_api.Services
{
    public class N8nWebhookService : IN8nWebhookService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<N8nWebhookService> _logger;

        public N8nWebhookService(
            HttpClient httpClient,
            IConfiguration configuration,
            ILogger<N8nWebhookService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendUserRegistrationAsync(int userId, string email, string roleName)
        {
            try
            {
                var webhookUrl = _configuration["N8n:UserRegistrationWebhookUrl"];
                
                if (string.IsNullOrEmpty(webhookUrl))
                {
                    _logger.LogWarning("N8N webhook URL not configured");
                    return;
                }

                var payload = new
                {
                    userId = userId,
                    email = email,
                    role = roleName,
                    registrationDate = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"),
                    source = "IVAN_Website"
                };

                var jsonContent = JsonSerializer.Serialize(payload, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                _logger.LogInformation("Sending user registration webhook to N8N for user {UserId}", userId);

                var response = await _httpClient.PostAsync(webhookUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Successfully sent user registration webhook for user {UserId}", userId);
                }
                else
                {
                    _logger.LogWarning("Failed to send user registration webhook for user {UserId}. Status: {StatusCode}", 
                        userId, response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending user registration webhook for user {UserId}", userId);
                // Don't throw - webhook failure shouldn't break registration
            }
        }
    }
}
