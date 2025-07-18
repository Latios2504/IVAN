namespace ivan_api.Constants;

/// <summary>
/// Constants for AI models and providers
/// </summary>
public static class AiModelConstants
{
    /// <summary>
    /// AI Provider names
    /// </summary>
    public static class Providers
    {
        public const string Gemini = "Gemini";
        public const string OpenRouter = "OpenRouter";
        public const string Custom = "Custom";
    }

    /// <summary>
    /// Gemini AI models
    /// </summary>
    public static class GeminiModels
    {
        public const string Gemini25Flash = "gemini-2.5-flash";
        public const string Gemini15Pro = "gemini-1.5-pro";
        public const string Gemini15Flash = "gemini-1.5-flash";
        public const string GeminiPro = "gemini-pro";
        public const string GeminiProVision = "gemini-pro-vision";
    }

    /// <summary>
    /// OpenRouter AI models (free tier)
    /// </summary>
    public static class OpenRouterModels
    {
        public const string DeepSeekR1Free = "deepseek/deepseek-r1:free";
        public const string DeepSeekChatV3Free = "deepseek/deepseek-chat-v3-0324:free";
        public const string Phi3Mini4KFree = "microsoft/phi-3-mini-4k-instruct:free";
        public const string Gemma2BFree = "google/gemma-2b-it:free";
        public const string Llama38BFree = "meta-llama/llama-3-8b-instruct:free";
        public const string Mistral7BFree = "mistralai/mistral-7b-instruct:free";
        public const string Zephyr7BFree = "huggingface/zephyr-7b-beta:free";
        public const string OpenChat7BFree = "openchat/openchat-7b:free";
        public const string MythoMist7BFree = "gryphe/mythomist-7b:free";
        public const string Toppy7BFree = "undi95/toppy-m-7b:free";
    }

    /// <summary>
    /// Default configuration values
    /// </summary>
    public static class Defaults
    {
        public const string DefaultGeminiModel = GeminiModels.Gemini25Flash;
        public const string DefaultOpenRouterModel = OpenRouterModels.DeepSeekR1Free;
        public const int DefaultMaxTokens = 1000;
        public const double DefaultTemperature = 0.7;
        public const int DefaultTimeoutSeconds = 30;
        public const int DefaultCacheExpiryHours = 1;
        public const int DefaultMaxCacheSize = 100;
    }

    /// <summary>
    /// Rate limiting constants
    /// </summary>
    public static class RateLimits
    {
        public const int GeminiRequestsPerMinute = 15;
        public const int GeminiRequestsPerDay = 1000;
        public const int OpenRouterRequestsPerMinute = 10;
        public const int OpenRouterRequestsPerDay = 500;
    }

    /// <summary>
    /// API endpoints
    /// </summary>
    public static class Endpoints
    {
        public const string GeminiBaseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
        public const string OpenRouterBaseUrl = "https://openrouter.ai/api/v1/chat/completions";
    }

    /// <summary>
    /// Error messages
    /// </summary>
    public static class ErrorMessages
    {
        public const string RateLimitExceeded = "Rate limit exceeded. Please wait a moment before trying again.";
        public const string AuthenticationFailed = "API authentication failed. Please check your API key configuration.";
        public const string InvalidRequestFormat = "Invalid request format. The model may not support this type of query.";
        public const string ModelNotFound = "The specified model was not found or is not available.";
        public const string ProviderNotFound = "The specified provider was not found or is not enabled.";
        public const string InstructionNotFound = "The specified instruction was not found.";
        public const string UnauthorizedAccess = "You don't have permission to access this resource.";
    }

    /// <summary>
    /// Cache key prefixes
    /// </summary>
    public static class CacheKeys
    {
        public const string InstructionTestPrefix = "instruction_test:";
        public const string ProviderHealthPrefix = "provider_health:";
        public const string ModelListPrefix = "model_list:";
        public const string ConfigurationPrefix = "config:";
    }

    /// <summary>
    /// Analytics constants
    /// </summary>
    public static class Analytics
    {
        public const string DefaultIntent = "instruction_test";
        public const int MaxAnalyticsRecords = 500;
        public const int MaxInstructionAnalytics = 100;
        public const int AnalyticsRetentionDays = 30;
    }
}