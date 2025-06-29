using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ivan_api.Services.AIMultiModelServ;
using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;

namespace ivan_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AIMultiModelController : ControllerBase
{
    private readonly IMultiModelAIService _multiModelService;
    private readonly ILogger<AIMultiModelController> _logger;

    public AIMultiModelController(
        IMultiModelAIService multiModelService,
        ILogger<AIMultiModelController> logger)
    {
        _multiModelService = multiModelService;
        _logger = logger;
    }

    /// <summary>
    /// Get all available AI models and their configurations
    /// </summary>
    [HttpGet("models")]
    public async Task<ActionResult<List<AIModelConfigurationDTO>>> GetAvailableModelsAsync()
    {
        try
        {
            var models = await _multiModelService.GetAvailableModelsAsync();
            return Ok(models);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available models");
            return StatusCode(500, "Lỗi lấy danh sách mô hình AI");
        }
    }

    /// <summary>
    /// Get the optimal model for a specific query and category
    /// </summary>
    [HttpPost("models/optimal")]
    public async Task<ActionResult<AIModelConfigurationDTO>> GetOptimalModelAsync([FromBody] GetOptimalModelRequestDTO request)
    {
        try
        {
            var model = await _multiModelService.GetOptimalModelForQueryAsync(request.Query, request.Category);
            return Ok(model);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting optimal model for category {Category}", request.Category);
            return StatusCode(500, "Lỗi tìm mô hình AI tối ưu");
        }
    }

    /// <summary>
    /// Configure or update an AI model
    /// </summary>
    [HttpPost("models/configure")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult> ConfigureModelAsync([FromBody] AIModelConfigurationDTO configuration)
    {
        try
        {
            var success = await _multiModelService.ConfigureModelAsync(configuration);
            
            if (!success)
                return BadRequest("Không thể cấu hình mô hình AI");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error configuring model {ModelId}", configuration.ModelId);
            return StatusCode(500, "Lỗi cấu hình mô hình AI");
        }
    }

    /// <summary>
    /// Process a query with the best available model
    /// </summary>
    [HttpPost("process/best")]
    public async Task<ActionResult<AIModelResponseDTO>> ProcessWithBestModelAsync([FromBody] ProcessQueryRequestDTO request)
    {
        try
        {
            var response = await _multiModelService.ProcessWithBestModelAsync(
                request.Query, 
                request.Category, 
                request.InstructionProfile);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing query with best model for category {Category}", request.Category);
            return StatusCode(500, "Lỗi xử lý câu hỏi với mô hình AI");
        }
    }

    /// <summary>
    /// Process a query with fallback models if primary fails
    /// </summary>
    [HttpPost("process/fallback")]
    public async Task<ActionResult<AIModelResponseDTO>> ProcessWithFallbackAsync([FromBody] ProcessQueryRequestDTO request)
    {
        try
        {
            var response = await _multiModelService.ProcessWithFallbackAsync(
                request.Query, 
                request.Category, 
                request.InstructionProfile);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing query with fallback for category {Category}", request.Category);
            return StatusCode(500, "Lỗi xử lý câu hỏi với mô hình dự phòng");
        }
    }

    /// <summary>
    /// Process a query with multiple models and compare results
    /// </summary>
    [HttpPost("process/multi")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<List<AIModelResponseDTO>>> ProcessWithMultipleModelsAsync([FromBody] ProcessMultiModelRequestDTO request)
    {
        try
        {
            var responses = await _multiModelService.ProcessWithMultipleModelsAsync(
                request.Query, 
                request.Category, 
                request.MaxModels);

            return Ok(responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing query with multiple models for category {Category}", request.Category);
            return StatusCode(500, "Lỗi xử lý câu hỏi với nhiều mô hình AI");
        }
    }

    /// <summary>
    /// Check health status of all AI models
    /// </summary>
    [HttpGet("health")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Dictionary<string, bool>>> CheckModelHealthAsync()
    {
        try
        {
            var healthStatus = await _multiModelService.CheckModelHealthAsync();
            return Ok(healthStatus);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking model health");
            return StatusCode(500, "Lỗi kiểm tra tình trạng mô hình AI");
        }
    }

    /// <summary>
    /// Get performance metrics for all AI models
    /// </summary>
    [HttpGet("performance")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<Dictionary<string, double>>> GetModelPerformanceAsync()
    {
        try
        {
            var metrics = await _multiModelService.GetModelPerformanceMetricsAsync();
            return Ok(metrics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting model performance metrics");
            return StatusCode(500, "Lỗi lấy thông số hiệu suất mô hình AI");
        }
    }

    /// <summary>
    /// Test a specific AI model with a query
    /// </summary>
    [HttpPost("test/{modelId}")]
    [Authorize(Roles = "Admin,Coordinator")]
    public async Task<ActionResult<AIModelResponseDTO>> TestModelAsync(string modelId, [FromBody] TestModelRequestDTO request)
    {
        try
        {
            var response = await _multiModelService.TestModelAsync(modelId, request.TestQuery);
            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing model {ModelId}", modelId);
            return StatusCode(500, "Lỗi kiểm tra mô hình AI");
        }
    }

    /// <summary>
    /// Process a specialized data analysis query
    /// </summary>
    [HttpPost("process/data-analysis")]
    public async Task<ActionResult<AIModelResponseDTO>> ProcessDataAnalysisAsync([FromBody] DataAnalysisRequestDTO request)
    {
        try
        {
            var response = await _multiModelService.ProcessDataAnalysisQueryAsync(request.Query, request.Data);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing data analysis query");
            return StatusCode(500, "Lỗi xử lý phân tích dữ liệu");
        }
    }

    /// <summary>
    /// Process a conversation query with context
    /// </summary>
    [HttpPost("process/conversation")]
    public async Task<ActionResult<AIModelResponseDTO>> ProcessConversationAsync([FromBody] ConversationQueryRequestDTO request)
    {
        try
        {
            var response = await _multiModelService.ProcessConversationQueryAsync(request.Query, request.ConversationContext);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing conversation query");
            return StatusCode(500, "Lỗi xử lý câu hỏi trong cuộc trò chuyện");
        }
    }

    /// <summary>
    /// Process an emergency query with highest priority
    /// </summary>
    [HttpPost("process/emergency")]
    public async Task<ActionResult<AIModelResponseDTO>> ProcessEmergencyAsync([FromBody] EmergencyQueryRequestDTO request)
    {
        try
        {
            var response = await _multiModelService.ProcessEmergencyQueryAsync(request.Query);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing emergency query");
            return StatusCode(500, "Lỗi xử lý câu hỏi khẩn cấp");
        }
    }
}

// Additional DTOs for the multi-model controller
public class GetOptimalModelRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

public class ProcessQueryRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? InstructionProfile { get; set; }
}

public class ProcessMultiModelRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int MaxModels { get; set; } = 3;
}

public class TestModelRequestDTO
{
    public string TestQuery { get; set; } = string.Empty;
}

public class DataAnalysisRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public Dictionary<string, object> Data { get; set; } = new();
}

public class ConversationQueryRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public string ConversationContext { get; set; } = string.Empty;
}

public class EmergencyQueryRequestDTO
{
    public string Query { get; set; } = string.Empty;
}
