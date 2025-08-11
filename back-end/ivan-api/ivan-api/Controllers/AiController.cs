using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.Services.AI.Interfaces;
using ivan_api.DTOs.AI;
using ivan_api.Services.DatabaseSchema.Interfaces;
using ivan_api.Services.AI.SQLGenerator;
using ivan_api.Models;

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
    private readonly ISchemaService _schemaService;
    private readonly ILogger<AiController> _logger;

    public AiController(
        IAiProviderFactory aiProviderFactory,
        ISqlExecutionService sqlExecutionService,
        IAiCustomInstructionService aiCustomInstructionService,
        ISchemaService schemaService,
        ILogger<AiController> logger)
    {
        _aiProviderFactory = aiProviderFactory;
        _sqlExecutionService = sqlExecutionService;
        _aiCustomInstructionService = aiCustomInstructionService;
        _schemaService = schemaService;
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
    /// Send a query to AI with custom instruction support
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

        var providers = await _aiProviderFactory.GetEnabledProvidersAsync();
        if (!providers.Any())
        {
            return StatusCode(500, new { success = false, message = "No AI providers available" });
        }

        var provider = providers.First();
        if (!string.IsNullOrEmpty(request.PreferredModel))
        {
            provider = providers.FirstOrDefault(p => 
                p.GetCapabilities().SupportedModels.Contains(request.PreferredModel)) ?? providers.First();
        }

        AiCustomInstruction? customInstruction = null;
        if (request.CustomInstructionId.HasValue)
        {
            var instructionDto = await _aiCustomInstructionService.GetCustomInstructionByIdAsync(request.CustomInstructionId.Value);
            if (instructionDto != null)
            {
                customInstruction = new AiCustomInstruction
                {
                    InstructionId = instructionDto.InstructionId,
                    InstructionName = instructionDto.InstructionName,
                    SystemPrompt = instructionDto.SystemPrompt,
                    BehaviorInstructions = instructionDto.BehaviorInstructions,
                    IsActive = instructionDto.IsActive
                };
            }
        }

        // Step 1: Generate SQL query
        string sqlGenerationPrompt;
        object? sqlData = null;
        string? generatedSql = null;

        if (customInstruction != null)
        {
            var schemaDescription = await _schemaService.GetDatabaseSchemaDescriptionAsync();
            sqlGenerationPrompt = $@"{customInstruction.SystemPrompt}

DATABASE SCHEMA INFORMATION:
{schemaDescription}

{customInstruction.BehaviorInstructions}

{(string.IsNullOrEmpty(BuildClientMemoryContext()) ? string.Empty : BuildClientMemoryContext() + "\n\n")}

User Query: {request.Query}

BƯỚC 1: Tạo câu SQL chính xác để truy vấn dữ liệu. Chỉ trả về SQL trong code block, không cần giải thích gì thêm.";
        }
        else
        {
            var memoryForSql = BuildClientMemoryContext();
            if (!string.IsNullOrEmpty(memoryForSql))
            {
                sqlGenerationPrompt = $"Dựa trên bối cảnh sau đây, hãy tạo câu SQL để trả lời câu hỏi. Chỉ trả về SQL trong code block.\n\n{memoryForSql}\n\nCâu hỏi: {request.Query}";
            }
            else
            {
                sqlGenerationPrompt = $"Tạo câu SQL để trả lời câu hỏi: {request.Query}";
            }
        }

        var sqlResult = await provider.SendPromptAsync(sqlGenerationPrompt, request.PreferredModel);
        
        if (sqlResult.Success && !string.IsNullOrEmpty(sqlResult.Response))
        {
            generatedSql = ExtractSqlFromResponse(sqlResult.Response);
            if (!string.IsNullOrEmpty(generatedSql))
            {
                try
                {
                    _logger.LogInformation($"Generated SQL query: {generatedSql}");
                    var dbResult = await _sqlExecutionService.ExecuteSelectQueryAsync(generatedSql);
                    _logger.LogInformation($"SQL execution result - Success: {dbResult.Success}, Rows: {dbResult.TotalRows}");
                    
                    if (dbResult.Success)
                    {
                        sqlData = new
                        {
                            sqlGenerated = generatedSql,
                            data = dbResult.Data,
                            totalRows = dbResult.TotalRows,
                            rowsReturned = dbResult.RowsAffected,
                            executionTime = dbResult.ExecutionTime
                        };
                    }
                    else
                    {
                        _logger.LogWarning($"SQL execution failed: {dbResult.ErrorMessage}");
                    }
                }
                catch (Exception sqlEx)
                {
                    _logger.LogWarning(sqlEx, "SQL execution failed");
                }
            }
        }

        // Step 2: Generate natural language response
        string finalResponsePrompt;

        // Build optional client-provided memory context into the prompt
        string BuildClientMemoryContext()
        {
            try
            {
                if ((request.ClientMessages == null || request.ClientMessages.Count == 0) && string.IsNullOrWhiteSpace(request.ClientSummary))
                {
                    return string.Empty;
                }

                var contextParts = new List<string>();
                if (!string.IsNullOrWhiteSpace(request.ClientSummary))
                {
                    contextParts.Add($"Conversation summary (client-provided): {request.ClientSummary}");
                }

                if (request.ClientMessages != null && request.ClientMessages.Count > 0)
                {
                    // Keep a compact representation
                    var lines = request.ClientMessages
                        .TakeLast(10)
                        .Select(m => $"{(m.Role?.ToLowerInvariant()=="assistant"?"Assistant":"User")}: {m.Content}");
                    contextParts.Add("Recent messages:\n" + string.Join("\n", lines));
                }

                return string.Join("\n\n", contextParts);
            }
            catch
            {
                return string.Empty;
            }
        }
        var clientMemoryContext = BuildClientMemoryContext();

        if (customInstruction != null && sqlData != null)
        {
            var dataJson = System.Text.Json.JsonSerializer.Serialize(sqlData);
            finalResponsePrompt = $@"{customInstruction.SystemPrompt}

{customInstruction.BehaviorInstructions}

{(string.IsNullOrEmpty(clientMemoryContext) ? string.Empty : clientMemoryContext + "\n\n")}

User Query: {request.Query}

BƯỚC 2: Dựa trên kết quả truy vấn sau đây, hãy trả lời câu hỏi của người dùng bằng tiếng Việt tự nhiên. KHÔNG hiển thị SQL hay dữ liệu thô:

Kết quả truy vấn: {dataJson}

Hãy trả lời một cách thân thiện và dễ hiểu.";
        }
        else if (customInstruction != null)
        {
            finalResponsePrompt = $@"{customInstruction.SystemPrompt}

{customInstruction.BehaviorInstructions}

{(string.IsNullOrEmpty(clientMemoryContext) ? string.Empty : clientMemoryContext + "\n\n")}

User Query: {request.Query}

Không thể truy xuất dữ liệu từ cơ sở dữ liệu. Hãy trả lời: 'Không thể truy xuất dữ liệu lúc này, xin vui lòng thử lại sau.'";
        }
        else
        {
            finalResponsePrompt = $"Bạn là trợ lý AI của hệ thống quản lý tình nguyện viên IVAN. {(string.IsNullOrEmpty(clientMemoryContext) ? string.Empty : "Dưới đây là bối cảnh cuộc trò chuyện trước đó: " + clientMemoryContext + " ")}Hãy trả lời câu hỏi sau bằng tiếng Việt: {request.Query}";
        }

        var finalResult = await provider.SendPromptAsync(finalResponsePrompt, request.PreferredModel);

        var response = new
        {
            success = finalResult.Success,
            response = finalResult.Response,
            modelUsed = finalResult.Model,
            errorMessage = finalResult.ErrorMessage,
            executionTimeMs = finalResult.ResponseTimeMs,
            generatedAt = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            customInstructionUsed = customInstruction?.InstructionName ?? "Default",
            sqlData = sqlData,
            sqlGenerated = generatedSql
        };

        return Ok(new { success = true, data = response });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error sending AI query");
        return StatusCode(500, new { success = false, message = "Error processing AI query" });
    }
}

    /// <summary>
    /// Extract SQL query from AI response
    /// </summary>
    private string ExtractSqlFromResponse(string response)
    {
        if (string.IsNullOrEmpty(response)) return string.Empty;

        _logger.LogInformation($"Attempting to extract SQL from response: {response.Substring(0, Math.Min(200, response.Length))}...");

        // Look for SQL code blocks first
        var sqlBlockPattern = @"```sql\s*(.*?)\s*```";
        var match = System.Text.RegularExpressions.Regex.Match(response, sqlBlockPattern, 
            System.Text.RegularExpressions.RegexOptions.Singleline | System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        
        if (match.Success)
        {
            var extractedSql = match.Groups[1].Value.Trim();
            _logger.LogInformation($"Found SQL in code block: {extractedSql}");
            return extractedSql;
        }

        // Look for SELECT statements anywhere in the response
        var selectPattern = @"(SELECT\s+.*?(?:;|$|\r?\n\s*$))";
        var selectMatch = System.Text.RegularExpressions.Regex.Match(response, selectPattern, 
            System.Text.RegularExpressions.RegexOptions.Singleline | System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Multiline);
        
        if (selectMatch.Success)
        {
            var extractedSql = selectMatch.Groups[1].Value.Trim().TrimEnd(';');
            _logger.LogInformation($"Found SELECT statement: {extractedSql}");
            return extractedSql;
        }

        _logger.LogInformation("No SQL query patterns found in response");
        return string.Empty;
    }

}