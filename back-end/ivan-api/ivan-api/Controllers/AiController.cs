using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.Services.AI.Interfaces;
using ivan_api.Configuration;
using Microsoft.Extensions.Options;
using ivan_api.DTOs.AI;
using ivan_api.Services.AI;
using ivan_api.Services.AI.SQLGenerator.Utils;
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
using ivan_api.Services.AI.SQLGenerator.Prompts;

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
    private readonly IAiProviderFactory _providerFactory;
    private readonly IAiPromptOrchestrator _promptOrchestrator;
    private readonly QueryAnalyzer _queryAnalyzer;
    private readonly SqlDetectionService _sqlDetectionService;
    private readonly ISqlExecutionService _sqlExecutionService;
    private readonly IAiCustomInstructionService _customInstructionService;
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<AiController> _logger;
    private readonly ILoggerFactory _loggerFactory;
    private readonly AiModelConfiguration _geminiConfig;

    public AiController(
        IAiProviderFactory providerFactory,
        IAiPromptOrchestrator promptOrchestrator,
        QueryAnalyzer queryAnalyzer,
        SqlDetectionService sqlDetectionService,
        ISqlExecutionService sqlExecutionService,
        IAiCustomInstructionService customInstructionService,
        VolunteerManagementSystemContext context,
        ILogger<AiController> logger,
        ILoggerFactory loggerFactory,
        IOptions<AiModelConfiguration> geminiConfig)
    {
        _providerFactory = providerFactory;
        _promptOrchestrator = promptOrchestrator;
        _queryAnalyzer = queryAnalyzer;
        _sqlDetectionService = sqlDetectionService;
        _sqlExecutionService = sqlExecutionService;
        _customInstructionService = customInstructionService;
        _context = context;
        _logger = logger;
        _loggerFactory = loggerFactory;
        _geminiConfig = geminiConfig.Value;
    }

    /// <summary>
    /// Get available AI models from all providers
    /// </summary>
    [HttpGet("models")]
    public async Task<ActionResult<List<string>>> GetAvailableModels()
    {
        try
        {
            var providers = await _providerFactory.GetEnabledProvidersAsync();
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
            var providers = await _providerFactory.GetEnabledProvidersAsync();
            var config = new
            {
                currentModel = _geminiConfig.DefaultModel,
                availableModels = _geminiConfig.AvailableModels,
                maxTokens = _geminiConfig.MaxTokens,
                temperature = _geminiConfig.Temperature,
                enabledProviders = providers.Select(p => p.ProviderName).ToList(),
                providerCount = providers.Count
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
    /// Send a query to AI with optional custom instruction and automatic SQL detection
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

            // Analyze query intent and context
            var queryIntent = await _queryAnalyzer.AnalyzeQueryAsync(request.Query);
            
            // Use orchestrator to build the appropriate prompt
            var promptResult = await _promptOrchestrator.BuildPromptAsync(
                request.Query, 
                request.CustomInstructionId, 
                queryIntent.IsSqlQuery
            );

            if (!promptResult.Success)
            {
                _logger.LogWarning("Failed to build prompt: {ErrorMessage}", promptResult.ErrorMessage);
                return StatusCode(500, new { success = false, message = "Error building AI prompt" });
            }

            var sqlData = new object();
            var sqlExecuted = false;

            // Try SQL execution if this is a SQL query
            if (queryIntent.IsSqlQuery)
            {
                _logger.LogInformation("Query detected as SQL query. Relevant tables: {Tables}", 
                    string.Join(", ", promptResult.RelevantTables));
                
                try
                {
                    var sqlResult = await TryExecuteSqlQueryAsync(promptResult, request);
                    sqlExecuted = sqlResult.success;
                    sqlData = sqlResult.sqlData;
                    
                    if (sqlExecuted)
                    {
                        _logger.LogInformation("SQL execution successful");
                    }
                    else
                    {
                        _logger.LogWarning("SQL execution failed, falling back to regular AI response");
                    }
                }
                catch (Exception sqlEx)
                {
                    _logger.LogWarning(sqlEx, "SQL generation/execution failed, falling back to regular AI response");
                }
            }
            else
            {
                _logger.LogInformation("Query not detected as SQL query. Query: {Query}, IsSqlQuery: {IsSqlQuery}", 
                    request.Query, queryIntent.IsSqlQuery);
            }

            // Get available providers
            var providers = await _providerFactory.GetEnabledProvidersAsync();
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

            if (sqlExecuted)
            {
                // Generate natural language response from SQL data
                var naturalLanguageResponse = await GenerateNaturalLanguageResponseAsync(sqlData, request.Query, provider, request.PreferredModel ?? "");
                
                // Return natural language response instead of raw SQL data
                var sqlResponse = new
                {
                    success = true,
                    response = naturalLanguageResponse,
                    modelUsed = "SQL-Generated",
                    errorMessage = "",
                    executionTimeMs = 0,
                    generatedAt = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    customInstructionUsed = promptResult.CustomInstructionUsed,
                    isSqlQuery = true,
                    queryIntent = queryIntent.QueryType.ToString(),
                    confidence = queryIntent.Confidence
                };

                return Ok(new { success = true, data = sqlResponse });
            }
            else
            {
                // Send regular AI query
                var result = await provider.SendPromptAsync(promptResult.FinalPrompt, request.PreferredModel);

                var response = new
                {
                    success = result.Success,
                    response = result.Response,
                    modelUsed = result.Model,
                    errorMessage = result.ErrorMessage,
                    executionTimeMs = result.ResponseTimeMs,
                    generatedAt = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    customInstructionUsed = promptResult.CustomInstructionUsed,
                    isSqlQuery = queryIntent.IsSqlQuery,
                    queryIntent = queryIntent.QueryType.ToString(),
                    confidence = queryIntent.Confidence,
                    suggestedActions = queryIntent.SuggestedActions,
                    sqlData = sqlData
                };

                return Ok(new { success = true, data = response });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending AI query");
            return StatusCode(500, new { success = false, message = "Error processing AI query" });
        }
    }

    private async Task<(bool success, object sqlData)> TryExecuteSqlQueryAsync(PromptResult promptResult, AiQueryRequest request)
    {
        var sqlData = new object();

        // Get available providers
        var providers = await _providerFactory.GetEnabledProvidersAsync();
        if (!providers.Any()) return (false, sqlData);

        // Select provider
        var provider = providers.First();
        if (!string.IsNullOrEmpty(request.PreferredModel))
        {
            provider = providers.FirstOrDefault(p => 
                p.GetCapabilities().SupportedModels.Contains(request.PreferredModel)) ?? providers.First();
        }

        // If no relevant tables found, try to get default tables for the query
        if (!promptResult.RelevantTables.Any())
        {
            _logger.LogInformation("No relevant tables found, attempting to detect tables from query");
            promptResult.RelevantTables = await _sqlDetectionService.GetRelevantTableNamesAsync(request.Query);
        }

        // If still no tables found, use common volunteer tables
        if (!promptResult.RelevantTables.Any())
        {
            _logger.LogInformation("Still no relevant tables found, using default volunteer tables");
            promptResult.RelevantTables = new List<string> { "Events", "EventRegistrations", "VolunteerProfiles" };
        }

        try
        {
            // Get table relationships for better SQL generation
            var relationships = await _sqlDetectionService.GetTableRelationshipsAsync();
            var tableColumns = await _sqlDetectionService.GetTableColumnsAsync();

            // Build dynamic SQL prompt using database metadata
            var sqlPromptLogger = _loggerFactory.CreateLogger<SqlGenerationPrompt>();
            var sqlPrompt = new SqlGenerationPrompt(_context, sqlPromptLogger);
            var systemPrompt = await sqlPrompt.BuildSystemPromptAsync(promptResult.CustomInstructionUsed);
            var userPrompt = await sqlPrompt.BuildUserPromptAsync(request.Query, promptResult.RelevantTables);

            // Generate SQL using AI
            var sqlResult = await provider.SendPromptAsync($"{systemPrompt}\n\n{userPrompt}", request.PreferredModel);

            if (!sqlResult.Success || string.IsNullOrEmpty(sqlResult.Response))
            {
                _logger.LogWarning("No SQL generated by AI provider");
                return (false, sqlData);
            }

            // Clean up the SQL response (remove markdown, explanations, etc.)
            var cleanSql = CleanSqlResponse(sqlResult.Response);
            
            _logger.LogInformation("Generated SQL: {Sql}", cleanSql);

            // Execute the SQL
            var executionRequest = new ivan_api.DTOs.AI.SqlGenerator.SqlExecutionRequestDto
            {
                SqlQuery = cleanSql,
                MaxRows = 1000,
                TimeoutSeconds = 30
            };
            var executionResult = await _sqlExecutionService.ExecuteSqlAsync(executionRequest);
            
            if (executionResult.Success)
            {
                sqlData = new
                {
                    sql = cleanSql,
                    data = executionResult.Data,
                    columns = executionResult.ColumnNames,
                    columnTypes = executionResult.ColumnTypes,
                    rowCount = executionResult.TotalRows
                };
                
                _logger.LogInformation("SQL execution successful. Rows returned: {RowCount}", executionResult.TotalRows);
                return (true, sqlData);
            }
            else
            {
                _logger.LogError("SQL execution failed: {Error}", executionResult.ErrorMessage);
                return (false, sqlData);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in SQL generation/execution");
            return (false, sqlData);
        }
    }

    /// <summary>
    /// Clean up SQL response from AI
    /// </summary>
    private string CleanSqlResponse(string response)
    {
        if (string.IsNullOrEmpty(response))
            return string.Empty;

        // Remove markdown code blocks
        response = response.Replace("```sql", "").Replace("```", "");
        
        // Split into lines and process
        var lines = response.Split('\n', StringSplitOptions.RemoveEmptyEntries);
        var sqlLines = new List<string>();
        
        foreach (var line in lines)
        {
            var trimmedLine = line.Trim();
            
            // Skip empty lines
            if (string.IsNullOrEmpty(trimmedLine))
                continue;
                
            // Skip lines that are likely explanations
            if (trimmedLine.StartsWith("Here's") || 
                trimmedLine.StartsWith("The SQL") ||
                trimmedLine.StartsWith("This query") ||
                trimmedLine.StartsWith("Generated SQL:") ||
                trimmedLine.StartsWith("Query:") ||
                trimmedLine.StartsWith("Answer:") ||
                trimmedLine.StartsWith("Response:"))
            {
                continue;
            }
            
            // Check if this line contains SQL keywords
            var upperLine = trimmedLine.ToUpperInvariant();
            if (upperLine.StartsWith("SELECT") || 
                upperLine.StartsWith("WITH") ||
                upperLine.StartsWith("INSERT") ||
                upperLine.StartsWith("UPDATE") ||
                upperLine.StartsWith("DELETE") ||
                upperLine.StartsWith("--") ||
                upperLine.StartsWith("/*") ||
                upperLine.Contains("FROM") ||
                upperLine.Contains("WHERE") ||
                upperLine.Contains("JOIN") ||
                upperLine.Contains("GROUP BY") ||
                upperLine.Contains("ORDER BY") ||
                upperLine.Contains("HAVING") ||
                upperLine.Contains("UNION") ||
                upperLine.Contains("AS") ||
                upperLine.Contains("COUNT") ||
                upperLine.Contains("SUM") ||
                upperLine.Contains("AVG") ||
                upperLine.Contains("MAX") ||
                upperLine.Contains("MIN"))
            {
                sqlLines.Add(trimmedLine);
            }
        }
        
        var cleanSql = string.Join("\n", sqlLines);
        
        // Validate and fix common SQL issues
        cleanSql = ValidateAndFixSql(cleanSql);
        
        return cleanSql;
    }

    /// <summary>
    /// Validate and fix common SQL syntax issues
    /// </summary>
    private string ValidateAndFixSql(string sql)
    {
        if (string.IsNullOrEmpty(sql))
            return sql;

        var upperSql = sql.ToUpperInvariant();
        
        // Check for empty SELECT clause
        if (upperSql.Contains("SELECT") && !upperSql.Contains("SELECT *"))
        {
            // Check if SELECT has columns specified
            var selectIndex = upperSql.IndexOf("SELECT");
            var fromIndex = upperSql.IndexOf("FROM");
            
            if (selectIndex >= 0 && fromIndex > selectIndex)
            {
                var selectClause = sql.Substring(selectIndex + 6, fromIndex - selectIndex - 6).Trim();
                if (string.IsNullOrWhiteSpace(selectClause) || selectClause.Trim() == "")
                {
                    // Fix empty SELECT clause based on context
                    if (upperSql.Contains("EVENTS"))
                    {
                        sql = sql.Replace("SELECT", "SELECT EventId, EventName, StartDate, EndDate, Location, MaxVolunteers, CurrentVolunteers");
                    }
                    else if (upperSql.Contains("VOLUNTEERPROFILES"))
                    {
                        sql = sql.Replace("SELECT", "SELECT VolunteerId, University, Major, VolunteerHours, Rating, IsVerified");
                    }
                    else if (upperSql.Contains("EVENTREGISTRATIONS"))
                    {
                        sql = sql.Replace("SELECT", "SELECT RegistrationId, EventId, VolunteerId, ApplicationDate, StatusId");
                    }
                    else
                    {
                        sql = sql.Replace("SELECT", "SELECT *");
                    }
                }
            }
        }
        
        // Check for empty FROM clause
        if (upperSql.Contains("FROM") && !upperSql.Contains("FROM "))
        {
            var fromIndex = upperSql.IndexOf("FROM");
            var whereIndex = upperSql.IndexOf("WHERE");
            var orderIndex = upperSql.IndexOf("ORDER BY");
            var groupIndex = upperSql.IndexOf("GROUP BY");
            
            var endIndex = sql.Length;
            if (whereIndex > fromIndex) endIndex = whereIndex;
            if (orderIndex > fromIndex && orderIndex < endIndex) endIndex = orderIndex;
            if (groupIndex > fromIndex && groupIndex < endIndex) endIndex = groupIndex;
            
            var fromClause = sql.Substring(fromIndex + 4, endIndex - fromIndex - 4).Trim();
            if (string.IsNullOrWhiteSpace(fromClause))
            {
                // Add default table based on context
                if (upperSql.Contains("EVENT") || upperSql.Contains("HOẠT ĐỘNG") || upperSql.Contains("SỰ KIỆN"))
                {
                    sql = sql.Replace("FROM", "FROM Events");
                }
                else if (upperSql.Contains("VOLUNTEER") || upperSql.Contains("TÌNH NGUYỆN"))
                {
                    sql = sql.Replace("FROM", "FROM VolunteerProfiles");
                }
                else
                {
                    sql = sql.Replace("FROM", "FROM Events");
                }
            }
        }
        
        // Ensure proper spacing
        sql = sql.Replace("SELECT", " SELECT ")
                .Replace("FROM", " FROM ")
                .Replace("WHERE", " WHERE ")
                .Replace("ORDER BY", " ORDER BY ")
                .Replace("GROUP BY", " GROUP BY ")
                .Replace("JOIN", " JOIN ")
                .Replace("LEFT JOIN", " LEFT JOIN ")
                .Replace("RIGHT JOIN", " RIGHT JOIN ")
                .Replace("INNER JOIN", " INNER JOIN ");
        
        // Clean up multiple spaces
        while (sql.Contains("  "))
        {
            sql = sql.Replace("  ", " ");
        }
        
        return sql.Trim();
    }

    /// <summary>
    /// Generate natural language response from SQL execution results
    /// </summary>
    private async Task<string> GenerateNaturalLanguageResponseAsync(object sqlData, string originalQuery, IAiProvider provider, string preferredModel)
    {
        try
        {
            // Extract data from sqlData object
            var sqlDataDict = sqlData as dynamic;
            if (sqlDataDict == null) return "Không thể phân tích dữ liệu từ cơ sở dữ liệu.";

            var rowCount = sqlDataDict.rowCount ?? 0;
            var data = sqlDataDict.data as List<Dictionary<string, object>> ?? new List<Dictionary<string, object>>();
            var columns = sqlDataDict.columns as List<string> ?? new List<string>();

            if (rowCount == 0)
            {
                return "Không tìm thấy dữ liệu phù hợp với yêu cầu của bạn trong cơ sở dữ liệu.";
            }

            // Create analysis prompt
            var analysisPrompt = $@"
Bạn là một trợ lý AI chuyên phân tích dữ liệu từ hệ thống quản lý tình nguyện viên IVAN. 
Hãy phân tích kết quả dữ liệu sau và trả lời bằng tiếng Việt một cách tự nhiên, dễ hiểu.

Câu hỏi gốc: ""{originalQuery}""

Dữ liệu tìm được:
- Số lượng bản ghi: {rowCount}
- Các cột dữ liệu: {string.Join(", ", columns)}

Dữ liệu chi tiết (tối đa 10 bản ghi đầu tiên):
{FormatDataForAnalysis(data.Take(10).ToList(), columns)}

Hãy trả lời bằng tiếng Việt một cách tự nhiên, bao gồm:
1. Tóm tắt kết quả tìm được
2. Phân tích dữ liệu (nếu có số liệu thống kê)
3. Đưa ra nhận xét hoặc gợi ý (nếu phù hợp)

Trả lời ngắn gọn, tự nhiên và hữu ích. Không cần hiển thị bảng dữ liệu.";

            var result = await provider.SendPromptAsync(analysisPrompt, preferredModel);
            
            if (result.Success && !string.IsNullOrEmpty(result.Response))
            {
                return result.Response.Trim();
            }
            else
            {
                return $"Đã tìm thấy {rowCount} bản ghi phù hợp với yêu cầu của bạn.";
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating natural language response");
            return "Đã tìm thấy dữ liệu nhưng có lỗi khi phân tích. Vui lòng thử lại.";
        }
    }

    /// <summary>
    /// Format data for analysis prompt
    /// </summary>
    private string FormatDataForAnalysis(List<Dictionary<string, object>> data, List<string> columns)
    {
        if (!data.Any()) return "Không có dữ liệu";

        var formattedData = new List<string>();
        
        foreach (var row in data)
        {
            var rowData = new List<string>();
            foreach (var column in columns)
            {
                var value = row.ContainsKey(column) ? row[column]?.ToString() ?? "NULL" : "NULL";
                rowData.Add($"{column}: {value}");
            }
            formattedData.Add($"- {string.Join(" | ", rowData)}");
        }

        return string.Join("\n", formattedData);
    }
} 