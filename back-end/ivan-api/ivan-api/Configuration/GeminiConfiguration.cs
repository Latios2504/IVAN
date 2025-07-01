namespace ivan_api.Configuration;

public class GeminiConfiguration
{
    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public string Model { get; set; } = "gemini-2.5-flash";
    public int MaxTokens { get; set; } = 1000;
    public double Temperature { get; set; } = 0.7;
    
    // Helper property to get the full URL
    public string GetFullUrl(string? customModel = null)
    {
        if (!string.IsNullOrEmpty(BaseUrl))
        {
            return BaseUrl; // Use full URL if provided (backward compatibility)
        }
        
        // Use custom model for testing or default model
        var modelToUse = customModel ?? Model;
        return $"https://generativelanguage.googleapis.com/v1beta/models/{modelToUse}:generateContent";
    }
}
