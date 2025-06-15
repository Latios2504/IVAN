namespace ivan_api.Configuration;

public class GoogleSheetsConfiguration
{
    public string N8nWebhookUrl { get; set; } = string.Empty;
    public string DefaultSheetId { get; set; } = string.Empty;
    public string DefaultRange { get; set; } = "A1:Z100";
    public int TimeoutSeconds { get; set; } = 30;
    public bool EnableCache { get; set; } = true;
    public int CacheExpiryMinutes { get; set; } = 5;
}
