using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ivan_api.Models;
using ivan_api.Configuration;

namespace ivan_api.Services.AIQueryServ;

public class IntelligentSQLGenerator
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<IntelligentSQLGenerator> _logger;
    private readonly GeminiConfiguration _geminiConfig;
    private readonly HttpClient _httpClient;

    public IntelligentSQLGenerator(
        VolunteerManagementSystemContext context, 
        ILogger<IntelligentSQLGenerator> logger,
        GeminiConfiguration geminiConfig,
        HttpClient httpClient)
    {
        _context = context;
        _logger = logger;
        _geminiConfig = geminiConfig;
        _httpClient = httpClient;
    }

    public async Task<string> ProcessIntelligentQueryAsync(string naturalLanguageQuery)
    {
        try
        {
            // **STEP 1: Get database schema context**
            var databaseContext = GetDatabaseContextAsync();
            
            // **STEP 2: AI generates SQL from natural language**
            var sqlQuery = await GenerateSQLWithAIAsync(naturalLanguageQuery, databaseContext);
            
            if (string.IsNullOrEmpty(sqlQuery))
            {
                return "AI không thể tạo truy vấn SQL phù hợp cho câu hỏi này.";
            }

            _logger.LogInformation("AI Generated SQL: {SQL}", sqlQuery);

            // **STEP 3: Execute the AI-generated SQL**
            var rawResults = await ExecuteAIGeneratedSQLAsync(sqlQuery);
            
            // **STEP 4: AI analyzes and formats the results**
            var finalAnswer = await AnalyzeResultsWithAIAsync(naturalLanguageQuery, rawResults, sqlQuery);
            
            return finalAnswer;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in intelligent SQL generation");
            return $"Có lỗi xảy ra khi xử lý câu hỏi: {ex.Message}";
        }
    }

    private string GetDatabaseContextAsync()
    {
        // **COMPACT DATABASE SCHEMA FOR EFFICIENT TOKEN USAGE**
        return """
            TABLES:
            VolunteerProfiles: VolunteerId(PK), UserId(FK), TotalHoursVolunteered(int), Rating(decimal), University, Major, IsVerified
            Users: UserId(PK), Email, IsActive, CreatedAt
            Events: EventId(PK), EventName, StartDate, EndDate, MaxVolunteers, CategoryId(FK), IsActive
            EventRegistrations: RegistrationId(PK), EventId(FK), VolunteerId(FK), ActualHours, Performance, Rating
            EventCategories: CategoryId(PK), CategoryName
            TaskAssignments: AssignmentId(PK), TaskId(FK), VolunteerId(FK), HoursWorked, Performance
            VolunteerSkills: VolunteerId(FK), SkillId(FK)
            Skills: SkillId(PK), SkillName

            KEY METRIC: TotalHoursVolunteered (main volunteer activity measure)
            SAMPLE: Top volunteer has 402 hours, 5 active volunteers total
            """;
    }

    private async Task<string> GenerateSQLWithAIAsync(string naturalQuery, string databaseContext)
    {
        var prompt = $"""
            Generate SQL for IVAN Volunteer Management System.

            Question: {naturalQuery}

            Schema: {databaseContext}

            Rules:
            - Return ONLY executable SQL Server query
            - No markdown, no comments, no explanations
            - Use TotalHoursVolunteered for volunteer metrics
            - Use proper JOINs and handle NULLs
            - For ranking: ORDER BY with TOP N
            - For counting: COUNT(*) with WHERE

            SQL:
            """;

        return await CallGeminiForSQLAsync(prompt);
    }

    private async Task<string> CallGeminiForSQLAsync(string prompt)
    {
        try
        {
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.0, // Zero temperature for precise SQL generation
                    maxOutputTokens = 300, // Much lower - only need SQL
                    topP = 0.8,
                    stopSequences = new[] { ";" } // Stop after SQL statement
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={_geminiConfig.ApiKey}", content);
            
            if (response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<JsonElement>(responseBody);
                
                if (result.TryGetProperty("candidates", out var candidates) && 
                    candidates.GetArrayLength() > 0)
                {
                    var firstCandidate = candidates[0];
                    if (firstCandidate.TryGetProperty("content", out var contentProp) &&
                        contentProp.TryGetProperty("parts", out var parts) &&
                        parts.GetArrayLength() > 0)
                    {
                        var sqlText = parts[0].GetProperty("text").GetString();
                        
                        // Clean up the SQL (remove markdown, comments, etc.)
                        return CleanGeneratedSQL(sqlText);
                    }
                }
            }
            
            return string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Gemini for SQL generation");
            return string.Empty;
        }
    }

    private string CleanGeneratedSQL(string? rawSQL)
    {
        if (string.IsNullOrWhiteSpace(rawSQL))
            return string.Empty;

        // Remove any potential markdown (should be minimal now)
        var cleaned = rawSQL.Replace("```sql", "").Replace("```", "").Trim();
        
        // Remove comment lines only if they exist
        if (cleaned.Contains("--"))
        {
            var lines = cleaned.Split('\n');
            var cleanedLines = lines.Where(line => !line.Trim().StartsWith("--")).ToList();
            cleaned = string.Join("\n", cleanedLines).Trim();
        }
        
        return cleaned;
    }

    private async Task<List<Dictionary<string, object?>>> ExecuteAIGeneratedSQLAsync(string sql)
    {
        try
        {
            using var command = _context.Database.GetDbConnection().CreateCommand();
            command.CommandText = sql;
            
            if (_context.Database.GetDbConnection().State != System.Data.ConnectionState.Open)
            {
                await _context.Database.OpenConnectionAsync();
            }
            
            using var reader = await command.ExecuteReaderAsync();
            var results = new List<Dictionary<string, object?>>();
            
            while (await reader.ReadAsync())
            {
                var row = new Dictionary<string, object?>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    var value = reader.GetValue(i);
                    row[reader.GetName(i)] = value == DBNull.Value ? null : value;
                }
                results.Add(row);
            }
            
            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing AI-generated SQL: {SQL}", sql);
            throw;
        }
    }

    private async Task<string> AnalyzeResultsWithAIAsync(string originalQuestion, List<Dictionary<string, object?>> results, string sqlQuery)
    {
        var resultsJson = JsonSerializer.Serialize(results, new JsonSerializerOptions 
        { 
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping 
        });

        var prompt = $"""
            You are an AI assistant for the IVAN Volunteer Management System.
            
            ORIGINAL USER QUESTION (Vietnamese): "{originalQuestion}"
            
            SQL QUERY EXECUTED:
            {sqlQuery}
            
            QUERY RESULTS (JSON):
            {resultsJson}
            
            INSTRUCTIONS:
            1. Analyze the data and provide a professional answer in Vietnamese
            2. Be specific with numbers, names, and details from the actual data
            3. Format the response in a user-friendly way with proper Vietnamese formatting
            4. Use emojis sparingly for visual appeal
            5. If it's a ranking/top list, format it as a numbered list
            6. Include relevant statistics and insights
            7. DO NOT mention SQL, technical details, or show raw data
            8. Answer as if you're a knowledgeable assistant who understands the volunteer system
            
            RESPONSE (Vietnamese):
            """;

        return await CallGeminiForAnalysisAsync(prompt);
    }

    private async Task<string> CallGeminiForAnalysisAsync(string prompt)
    {
        try
        {
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.3, // Slightly higher for more natural language
                    maxOutputTokens = 2000,
                    topP = 0.9
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={_geminiConfig.ApiKey}", content);
            
            if (response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<JsonElement>(responseBody);
                
                if (result.TryGetProperty("candidates", out var candidates) && 
                    candidates.GetArrayLength() > 0)
                {
                    var firstCandidate = candidates[0];
                    if (firstCandidate.TryGetProperty("content", out var contentProp) &&
                        contentProp.TryGetProperty("parts", out var parts) &&
                        parts.GetArrayLength() > 0)
                    {
                        return parts[0].GetProperty("text").GetString() ?? "Không thể phân tích kết quả.";
                    }
                }
            }
            
            return "Không thể kết nối đến AI để phân tích kết quả.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Gemini for result analysis");
            return "Có lỗi xảy ra khi phân tích kết quả.";
        }
    }
}
