using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.Services.AI.Interfaces;
using ivan_api.DTOs.AI;
using ivan_api.Services.DatabaseSchema.Interfaces;
using ivan_api.Services.AI.SQLGenerator;
using ivan_api.Models;
using ivan_api.DTOs.Common;

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
    private readonly ivan_api.Services.AuthenticationSer.IAuthenticationService _authenticationService;
    private readonly ILogger<AiController> _logger;

    public AiController(
        IAiProviderFactory aiProviderFactory,
        ISqlExecutionService sqlExecutionService,
        IAiCustomInstructionService aiCustomInstructionService,
        ISchemaService schemaService,
        ivan_api.Services.AuthenticationSer.IAuthenticationService authenticationService,
        ILogger<AiController> logger)
    {
        _aiProviderFactory = aiProviderFactory;
        _sqlExecutionService = sqlExecutionService;
        _aiCustomInstructionService = aiCustomInstructionService;
        _schemaService = schemaService;
        _authenticationService = authenticationService;
        _logger = logger;
    }

    /// <summary>
    /// Get available AI models from all providers
    /// </summary>
    [HttpGet("models")]
    public async Task<ActionResult<ApiResponseDTO<List<string>>>> GetAvailableModels()
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

            return Ok(new ApiResponseDTO<List<string>>
            {
                Success = true,
                Data = uniqueModels,
                Message = "Available AI models retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available models");
            return StatusCode(500, new ApiResponseDTO<List<string>>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Error retrieving models" }
            });
        }
    }

    /// <summary>
    /// Get current AI configuration
    /// </summary>
    [HttpGet("configuration")]
    public async Task<ActionResult<ApiResponseDTO<object>>> GetConfiguration()
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

            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Data = config,
                Message = "AI configuration retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting AI configuration");
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Error retrieving configuration" }
            });
        }
    }

    /// <summary>
    /// Send a query to AI with custom instruction support
    /// </summary>
    [HttpPost("query")]
public async Task<ActionResult<ApiResponseDTO<object>>> SendQuery([FromBody] AiQueryRequest request)
{
    try
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            return BadRequest(new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors
            });
        }

        // Get user context from JWT claims
        var userContext = await _authenticationService.GetUserContextForAiAsync(User);
        _logger.LogInformation("AI Query from user: {UserContext}", userContext.GetContextDescription());

        var providers = await _aiProviderFactory.GetEnabledProvidersAsync();
        if (!providers.Any())
        {
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "No AI providers available",
                Errors = new List<string> { "No AI providers are currently enabled" }
            });
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
            var userContextPrompt = BuildUserContextPrompt(userContext);
            sqlGenerationPrompt = $@"{customInstruction.SystemPrompt}

DATABASE SCHEMA INFORMATION:
{schemaDescription}

{userContextPrompt}

{customInstruction.BehaviorInstructions}

{(string.IsNullOrEmpty(BuildClientMemoryContext()) ? string.Empty : BuildClientMemoryContext() + "\n\n")}

User Query: {request.Query}

BƯỚC 1: Tạo câu SQL chính xác để truy vấn dữ liệu. Chỉ trả về SQL trong code block, không cần giải thích gì thêm.";
        }
        else
        {
            var memoryForSql = BuildClientMemoryContext();
            var userContextPrompt = BuildUserContextPrompt(userContext);
            if (!string.IsNullOrEmpty(memoryForSql))
            {
                sqlGenerationPrompt = $"Dựa trên bối cảnh sau đây, hãy tạo câu SQL để trả lời câu hỏi. Chỉ trả về SQL trong code block.\n\n{userContextPrompt}\n\n{memoryForSql}\n\nCâu hỏi: {request.Query}";
            }
            else
            {
                sqlGenerationPrompt = $"{userContextPrompt}\n\nTạo câu SQL để trả lời câu hỏi: {request.Query}";
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
            var userContextPrompt = BuildUserContextPrompt(userContext);
            finalResponsePrompt = $@"{customInstruction.SystemPrompt}

{userContextPrompt}

{customInstruction.BehaviorInstructions}

{(string.IsNullOrEmpty(clientMemoryContext) ? string.Empty : clientMemoryContext + "\n\n")}

User Query: {request.Query}

BƯỚC 2: Dựa trên kết quả truy vấn sau đây, hãy trả lời câu hỏi của người dùng bằng tiếng Việt tự nhiên. KHÔNG hiển thị SQL hay dữ liệu thô:

Kết quả truy vấn: {dataJson}

Hãy trả lời một cách thân thiện và dễ hiểu.";
        }
        else if (customInstruction != null)
        {
            var userContextPrompt = BuildUserContextPrompt(userContext);
            finalResponsePrompt = $@"{customInstruction.SystemPrompt}

{userContextPrompt}

{customInstruction.BehaviorInstructions}

{(string.IsNullOrEmpty(clientMemoryContext) ? string.Empty : clientMemoryContext + "\n\n")}

User Query: {request.Query}

Không thể truy xuất dữ liệu từ cơ sở dữ liệu. Hãy trả lời: 'Không thể truy xuất dữ liệu lúc này, xin vui lòng thử lại sau.'";
        }
        else
        {
            var userContextPrompt = BuildUserContextPrompt(userContext);
            finalResponsePrompt = $"Bạn là trợ lý AI của hệ thống quản lý tình nguyện viên IVAN. {userContextPrompt} {(string.IsNullOrEmpty(clientMemoryContext) ? string.Empty : "Dưới đây là bối cảnh cuộc trò chuyện trước đó: " + clientMemoryContext + " ")}Hãy trả lời câu hỏi sau bằng tiếng Việt: {request.Query}";
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
            userContext = userContext.GetContextDescription(),
            sqlData = sqlData,
            sqlGenerated = generatedSql
        };

        return Ok(new ApiResponseDTO<object>
        {
            Success = true,
            Data = response,
            Message = "AI query processed successfully"
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error sending AI query");
        return StatusCode(500, new ApiResponseDTO<object>
        {
            Success = false,
            Message = "Internal server error",
            Errors = new List<string> { "Error processing AI query" }
        });
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

    /// <summary>
    /// Build user context prompt for AI to understand user's role and data access scope
    /// </summary>
    private string BuildUserContextPrompt(UserContextInfo userContext)
    {
        var contextParts = new List<string>();

        // Add role information
        contextParts.Add($"THÔNG TIN NGƯỜI DÙNG HIỆN TẠI:");
        contextParts.Add($"- Role: {userContext.RoleName}");
        contextParts.Add($"- User ID: {userContext.UserId}");

        // Add role-specific context and data access rules
        if (userContext.IsAdmin)
        {
            contextParts.Add("- Quyền: Toàn quyền truy cập tất cả dữ liệu trong hệ thống");
            contextParts.Add("- Phạm vi: Có thể xem thông tin của tất cả tổ chức, đối tác, tình nguyện viên");
        }
        else if (userContext.IsOrganization && userContext.OrganizationId.HasValue)
        {
            contextParts.Add($"- Organization ID: {userContext.OrganizationId.Value}");
            contextParts.Add("- Phạm vi: Chỉ được truy cập dữ liệu của tổ chức này");
            contextParts.Add("- Có thể xem: Events, volunteers đăng ký, coordinators của tổ chức");
            contextParts.Add($"- QUAN TRỌNG: Trong SQL queries, PHẢI filter OrganizationId = {userContext.OrganizationId.Value}");
        }
        else if (userContext.IsPartner && userContext.PartnerId.HasValue)
        {
            contextParts.Add($"- Partner ID: {userContext.PartnerId.Value}");
            contextParts.Add("- Phạm vi: Chỉ được truy cập dữ liệu liên quan đến đối tác này");
            contextParts.Add("- Có thể xem: Collaborations, partnerships của đối tác");
            contextParts.Add($"- QUAN TRỌNG: Trong SQL queries, PHẢI filter PartnerId = {userContext.PartnerId.Value}");
        }
        else if (userContext.IsVolunteer && userContext.VolunteerId.HasValue)
        {
            contextParts.Add($"- Volunteer ID: {userContext.VolunteerId.Value}");
            contextParts.Add("- Phạm vi: Chỉ được truy cập dữ liệu cá nhân của tình nguyện viên này");
            contextParts.Add("- Có thể xem: Registrations, schedules, certificates của bản thân");
            contextParts.Add($"- QUAN TRỌNG: Trong SQL queries, PHẢI filter VolunteerId = {userContext.VolunteerId.Value}");
        }
        else if (userContext.IsCoordinator && userContext.CoordinatorId.HasValue)
        {
            contextParts.Add($"- Coordinator ID: {userContext.CoordinatorId.Value}");
            contextParts.Add("- Phạm vi: Được truy cập dữ liệu của tổ chức và các events được quản lý");
            contextParts.Add("- Có thể xem: Tasks, schedules, volunteers trong các events được phân công");
            contextParts.Add($"- QUAN TRỌNG: Trong SQL queries, PHẢI filter dựa trên CoordinatorId = {userContext.CoordinatorId.Value}");
        }

        contextParts.Add("");
        contextParts.Add("QUY TẮC BẢO MẬT QUAN TRỌNG:");
        contextParts.Add("1. Luôn áp dụng filter phù hợp với role trong SQL queries");
        contextParts.Add("2. Nếu user không có quyền truy cập, từ chối một cách lịch sự");

        return string.Join("\n", contextParts);
    }

}
