namespace ivan_api.DTOs.Common;

/// Standard API response wrapper for all endpoints
public class ApiResponseDTO<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = new();

    // Helper: success
    public static ApiResponseDTO<T> Ok(T data, string message = "Success")
    {
        return new ApiResponseDTO<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    // Helper: fail
    public static ApiResponseDTO<T> Fail(string message, List<string>? errors = null)
    {
        return new ApiResponseDTO<T>
        {
            Success = false,
            Message = message,
            Errors = errors
        };
    }

    // Helper: forbidden
    public static ApiResponseDTO<T> Forbidden(string message = "Forbidden")
    {
        return new ApiResponseDTO<T>
        {
            Success = false,
            Message = message
        };
    }

    // Helper: conflict
    public static ApiResponseDTO<T> Conflict(string message = "Conflict")
    {
        return new ApiResponseDTO<T>
        {
            Success = false,
            Message = message
        };
    }

    public static ApiResponseDTO<T> NotFound(string message) => new()
    {
        Success = false,
        Message = message
    };

    public static ApiResponseDTO<T> BadRequest(string message, List<string>? errors = null) => new()
    {
        Success = false,
        Message = message,
        Errors = errors
    };

    public static ApiResponseDTO<T> Error(string message, List<string>? errors = null) => new()
    {
        Success = false,
        Message = message,
        Errors = errors
    };
}

