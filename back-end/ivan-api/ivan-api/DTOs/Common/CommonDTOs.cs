namespace ivan_api.DTOs.Common;

/// <summary>
/// Standard API response wrapper for all endpoints
/// </summary>
/// <typeparam name="T">Type of data being returned</typeparam>
public class ApiResponseDTO<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = new();
}

/// <summary>
/// Simple success response for operations that don't return data
/// </summary>
public class SuccessResponseDTO
{
    public string Message { get; set; } = string.Empty;
}
