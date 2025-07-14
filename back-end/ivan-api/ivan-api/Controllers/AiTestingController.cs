using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.AI;
using ivan_api.DTOs.Authentication;
using ivan_api.Services.AI;

namespace ivan_api.Controllers;

/// <summary>
/// Controller for AI Testing Playground functionality
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // Require authentication
public class AiTestingController : ControllerBase
{
    private readonly AiTestingPlaygroundService _aiTestingService;
    private readonly ILogger<AiTestingController> _logger;

    public AiTestingController(
        AiTestingPlaygroundService aiTestingService,
        ILogger<AiTestingController> logger)
    {
        _aiTestingService = aiTestingService;
        _logger = logger;
    }

    /// <summary>
    /// Test a single prompt across multiple AI providers
    /// </summary>
    [HttpPost("test")]
    public async Task<ActionResult<MultiModelTestResponse>> TestMultipleProviders(
        [FromBody] MultiModelTestRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Prompt))
            {
                return BadRequest("Prompt cannot be empty");
            }

            _logger.LogInformation($"Starting multi-model test for user {User.Identity?.Name}");
            
            var result = await _aiTestingService.TestMultipleProvidersAsync(request, cancellationToken);
            
            _logger.LogInformation($"Multi-model test completed with {result.Results.Count} results");
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during multi-model testing");
            return StatusCode(500, "An error occurred during testing");
        }
    }

    /// <summary>
    /// Test with database context integration
    /// </summary>
    [HttpPost("test-with-database")]
    public async Task<ActionResult<MultiModelTestResponse>> TestWithDatabase(
        [FromBody] DatabaseIntegratedTestRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Query))
            {
                return BadRequest("Query cannot be empty");
            }

            _logger.LogInformation($"Starting database-integrated test for user {User.Identity?.Name}");
            
            var result = await _aiTestingService.TestWithDatabaseContextAsync(request, cancellationToken);
            
            _logger.LogInformation($"Database-integrated test completed");
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during database-integrated testing");
            return StatusCode(500, "An error occurred during database testing");
        }
    }

    /// <summary>
    /// Get status and health of all AI providers
    /// </summary>
    [HttpGet("providers/status")]
    public async Task<ActionResult<ApiResponseDTO<List<AiProviderStatus>>>> GetProviderStatus(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var statuses = await _aiTestingService.GetProviderStatusAsync(cancellationToken);
            
            return Ok(new ApiResponseDTO<List<AiProviderStatus>>
            {
                Success = true,
                Message = "Provider status retrieved successfully",
                Data = statuses
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting provider status");
            return StatusCode(500, "An error occurred while checking provider status");
        }
    }

    /// <summary>
    /// Get available models from all providers
    /// </summary>
    [HttpGet("providers/models")]
    public async Task<ActionResult<ApiResponseDTO<Dictionary<string, List<string>>>>> GetAvailableModels(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var models = await _aiTestingService.GetAllAvailableModelsAsync(cancellationToken);
            
            return Ok(new ApiResponseDTO<Dictionary<string, List<string>>>
            {
                Success = true,
                Message = "Available models retrieved successfully",
                Data = models
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available models");
            return StatusCode(500, "An error occurred while fetching models");
        }
    }

    /// <summary>
    /// Quick health check endpoint
    /// </summary>
    [HttpGet("health")]
    public async Task<ActionResult<object>> HealthCheck(CancellationToken cancellationToken = default)
    {
        try
        {
            var statuses = await _aiTestingService.GetProviderStatusAsync(cancellationToken);
            var healthyCount = statuses.Count(s => s.IsHealthy);
            var totalCount = statuses.Count;

            return Ok(new
            {
                Status = healthyCount > 0 ? "Healthy" : "Unhealthy",
                HealthyProviders = healthyCount,
                TotalProviders = totalCount,
                Timestamp = DateTime.UtcNow,
                Providers = statuses.Select(s => new
                {
                    s.ProviderName,
                    s.IsHealthy,
                    s.IsEnabled,
                    s.LastError
                })
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during health check");
            return StatusCode(500, new
            {
                Status = "Error",
                Message = "Health check failed",
                Timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Get sample prompts for testing
    /// </summary>
    [HttpGet("sample-prompts")]
    public ActionResult<List<object>> GetSamplePrompts()
    {
        var samplePrompts = new List<object>
        {
            new
            {
                Category = "Basic",
                Prompt = "Hello, how are you?",
                Description = "Simple greeting test"
            },
            new
            {
                Category = "Creative",
                Prompt = "Write a short poem about volunteering",
                Description = "Creative writing test"
            },
            new
            {
                Category = "Analytical",
                Prompt = "Explain the benefits of volunteer management systems",
                Description = "Analytical thinking test"
            },
            new
            {
                Category = "Technical",
                Prompt = "How would you implement a REST API for volunteer registration?",
                Description = "Technical knowledge test"
            },
            new
            {
                Category = "Vietnamese",
                Prompt = "Viết một đoạn văn ngắn về tầm quan trọng của hoạt động tình nguyện",
                Description = "Vietnamese language test"
            },
            new
            {
                Category = "Database",
                Prompt = "How many volunteer organizations are currently active in the system?",
                Description = "Database query test (requires database context)"
            }
        };

        return Ok(samplePrompts);
    }

    /// <summary>
    /// Test a specific provider with custom parameters
    /// </summary>
    [HttpPost("test-provider/{providerName}")]
    public async Task<ActionResult<AiTestResult>> TestSpecificProvider(
        string providerName,
        [FromBody] object request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Extract prompt from request body
            var prompt = "";
            if (request is System.Text.Json.JsonElement jsonElement && 
                jsonElement.TryGetProperty("prompt", out var promptProperty))
            {
                prompt = promptProperty.GetString() ?? "";
            }

            if (string.IsNullOrWhiteSpace(prompt))
            {
                return BadRequest("Prompt is required");
            }

            var multiModelRequest = new MultiModelTestRequest
            {
                Prompt = prompt,
                ProviderNames = new List<string> { providerName },
                RunSimultaneously = false,
                TimeoutSeconds = 30
            };

            var result = await _aiTestingService.TestMultipleProvidersAsync(multiModelRequest, cancellationToken);
            
            var providerResult = result.Results.FirstOrDefault();
            if (providerResult == null)
            {
                return NotFound($"Provider '{providerName}' not found or not available");
            }

            return Ok(providerResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing specific provider {ProviderName}", providerName);
            return StatusCode(500, "An error occurred during provider testing");
        }
    }
}
