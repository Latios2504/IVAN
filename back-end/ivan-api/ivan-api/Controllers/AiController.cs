using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.Services.AI.Interfaces;
using ivan_api.Configuration;
using Microsoft.Extensions.Options;
using ivan_api.DTOs.AI;
using ivan_api.Services.AI;
using ivan_api.Services.DatabaseSchema.Interfaces;
using ivan_api.Services.AI.SQLGenerator.Interfaces;
using ivan_api.Services.AI.SQLGenerator.Services;
using ivan_api.Models;
using ivan_api.Repository.VolunteerProfileRepo;
using ivan_api.Services.VolunteerProfileServ;
using ivan_api.Repository.EventRepo;
using ivan_api.Services.EventServ;
using ivan_api.Repository.CoordinatorTaskRepo;
using ivan_api.Services.CoordinatorTaskServ;
using System.Text.Json.Serialization;
using ivan_api.Services.PartnerCollaborationServ;
using ivan_api.Repository.PartnerCollaborationRepo;
using ivan_api.Services.PublicContentServ;
using ivan_api.Services.PasswordHashingSer;
using ivan_api.Services.JwtTokenSer;
using ivan_api.Services.EmailSer;

namespace ivan_api.Controllers;

/// <summary>
/// Controller for general AI operations
/// Handles model listing and configuration endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly IAiProviderFactory _aiProviderFactory;
    private readonly ISqlExecutionService _sqlExecutionService;
    private readonly IAiCustomInstructionService _aiCustomInstructionService;
    private readonly ILogger<AiController> _logger;

    public AiController(
        IAiProviderFactory aiProviderFactory,
        ISqlExecutionService sqlExecutionService,
        IAiCustomInstructionService aiCustomInstructionService,
        ILogger<AiController> logger)
    {
        _aiProviderFactory = aiProviderFactory;
        _sqlExecutionService = sqlExecutionService;
        _aiCustomInstructionService = aiCustomInstructionService;
        _logger = logger;
    }

    /// <summary>
    /// Get available AI models from all providers
    /// </summary>
    [HttpGet("models")]
    public async Task<ActionResult<List<string>>> GetAvailableModels()
    {
        try
        {
            var providers = await _aiProviderFactory.GetEnabledProvidersAsync();
            var allModels = new List<string>();

            foreach (var provider in providers)
            {
                var models = await provider.GetAvailableModelsAsync();
                allModels.AddRange(models);
            }

            // Remove duplicates and sort
            var uniqueModels = allModels.Distinct().OrderBy(m => m).ToList();

            return Ok(new { success = true, data = uniqueModels });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available models");
            return StatusCode(500, new { success = false, message = "Error retrieving models" });
        }
    }

    /// <summary>
    /// Get current AI configuration
    /// </summary>
    [HttpGet("configuration")]
    public async Task<ActionResult<object>> GetConfiguration()
    {
        try
        {
            var providers = await _aiProviderFactory.GetEnabledProvidersAsync();
            var config = new
            {
                enabledProviders = providers.Select(p => p.ProviderName).ToList(),
                providerCount = providers.Count,
                // TODO: Phase 2 - Add configuration details from Custom Instructions
                status = "Simplified AI System - Phase 1"
            };

            return Ok(new { success = true, data = config });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting AI configuration");
            return StatusCode(500, new { success = false, message = "Error retrieving configuration" });
        }
    }

    /// <summary>
    /// Send a query to AI with simplified workflow
    /// </summary>
    [HttpPost("query")]
    public async Task<ActionResult<object>> SendQuery([FromBody] AiQueryRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid request data", errors = ModelState });
            }

            // Get available providers
            var providers = await _aiProviderFactory.GetEnabledProvidersAsync();
            if (!providers.Any())
            {
                return StatusCode(500, new { success = false, message = "No AI providers available" });
            }

            // Select provider based on preferred model
            var provider = providers.First();
            if (!string.IsNullOrEmpty(request.PreferredModel))
            {
                provider = providers.FirstOrDefault(p => 
                    p.GetCapabilities().SupportedModels.Contains(request.PreferredModel)) ?? providers.First();
            }

            // TODO: Phase 2 - Implement Custom Instructions-driven workflow
            // For now, send a simple AI query without complex orchestration
            var simplePrompt = $"Bạn là trợ lý AI của hệ thống quản lý tình nguyện viên IVAN. Hãy trả lời câu hỏi sau bằng tiếng Việt: {request.Query}";
            
            var result = await provider.SendPromptAsync(simplePrompt, request.PreferredModel);

            var response = new
            {
                success = result.Success,
                response = result.Response,
                modelUsed = result.Model,
                errorMessage = result.ErrorMessage,
                executionTimeMs = result.ResponseTimeMs,
                generatedAt = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                customInstructionUsed = false, // TODO: Phase 2 - Implement custom instruction detection
                isSqlQuery = false, // TODO: Phase 2 - Implement keyword-based SQL detection
                queryIntent = "General",
                confidence = 1.0
            };

            return Ok(new { success = true, data = response });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending AI query");
            return StatusCode(500, new { success = false, message = "Error processing AI query" });
        }
    }

    // TODO: Phase 2 - Implement simplified SQL execution logic based on Custom Instructions
    // TODO: Phase 2 - Implement keyword matching and database schema retrieval
    // TODO: Phase 2 - Implement natural language response generation
}