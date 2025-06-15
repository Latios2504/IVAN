namespace ivan_api.DTOs;

public class GoogleSheetsRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public string SheetId { get; set; } = string.Empty;
    public string Range { get; set; } = "A1:Z100";
    public string Action { get; set; } = "read_data";
}

public class GoogleSheetsResponseDTO
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Data { get; set; } = string.Empty;
    public string Query { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty; // Changed to string to handle n8n format
    public object? RawData { get; set; }
}

public class GoogleSheetsN8nRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public string SheetId { get; set; } = string.Empty;
    public string Range { get; set; } = "A1:Z100";
    public string Action { get; set; } = "read_data";
}
