using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.AI.SQLGenerator.Prompts;

/// <summary>
/// Service for building SQL generation prompts using dynamic database metadata
/// </summary>
public class SqlGenerationPrompt
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<SqlGenerationPrompt> _logger;

    public SqlGenerationPrompt(VolunteerManagementSystemContext context, ILogger<SqlGenerationPrompt> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Build system prompt for SQL generation using dynamic metadata
    /// </summary>
    public async Task<string> BuildSystemPromptAsync(string customInstruction = "")
    {
        try
        {
            // Get dynamic schema information
            var tableSchemas = await _context.TableSchemas
                .Include(ts => ts.TableColumns)
                .Include(ts => ts.TableKeywords)
                .ToListAsync();

            var relationships = await _context.TableRelationships
                .Include(tr => tr.FromTable)
                .Include(tr => tr.ToTable)
                .ToListAsync();

            // Build schema context dynamically
            var schemaContext = await BuildSchemaContextAsync(tableSchemas, relationships);
            var relationshipsContext = await BuildRelationshipsContextAsync(relationships);

            var basePrompt = $@"
You are an expert SQL developer specializing in SQL Server for a Volunteer Management System (IVAN). Your task is to convert natural language queries into accurate SQL statements that retrieve relevant data.

CRITICAL RULES:
1. Always use SQL Server syntax (T-SQL)
2. Use EXACT table and column names as provided in the schema - DO NOT translate to Vietnamese
3. The main table for events is called 'Events' (NOT 'HoatDong' or 'SuKien')
4. The main table for volunteers is called 'VolunteerProfiles' (NOT 'TinhNguyenVien' or 'Volunteers')
5. Event registrations are in 'EventRegistrations' table
6. Include appropriate JOINs when multiple tables are involved
7. Use parameterized queries when possible for security
8. Add comments to explain complex logic
9. Return ONLY the SQL query, no explanations
10. Handle NULL values appropriately
11. Use proper date formatting for SQL Server (YYYY-MM-DD)
12. For active/available events, use IsActive = 1 and check dates

MANDATORY SQL STRUCTURE RULES:
- ALWAYS specify specific columns in SELECT clause - NEVER use SELECT * or empty SELECT
- ALWAYS specify table name in FROM clause
- ALWAYS use proper WHERE conditions
- For volunteer queries, ALWAYS include: VolunteerId, University, Major, VolunteerHours, Rating, IsVerified
- For event queries, ALWAYS include: EventId, EventName, StartDate, EndDate, Location, MaxVolunteers, CurrentVolunteers
- For registration queries, ALWAYS include: RegistrationId, EventId, VolunteerId, ApplicationDate, StatusId

CRITICAL WARNING - VOLUNTEER NAMES:
- VolunteerProfiles table does NOT have a FullName column
- To get volunteer names, you MUST JOIN through Users → UserProfiles
- Use: up.FirstName + ' ' + up.LastName as FullName
- NEVER use vp.FullName (this column does not exist)
- NEVER use table name 'Volunteers' (correct table is 'VolunteerProfiles')

IMPORTANT RELATIONSHIPS:
- VolunteerProfiles.UserId → Users.UserId → UserProfiles.UserId (to get volunteer names)
- VolunteerProfiles does NOT have FullName column - use UserProfiles.FirstName + UserProfiles.LastName
- Events.OrganizationId → Organizations.OrganizationId (to get organization info)
- EventRegistrations.EventId → Events.EventId (to get event info)
- EventRegistrations.VolunteerId → VolunteerProfiles.VolunteerId (to get volunteer info)

DATABASE SCHEMA:
{schemaContext}

TABLE RELATIONSHIPS:
{relationshipsContext}

{customInstruction}

EXAMPLES:
- ""Tôi có thể tham gia hoạt động tình nguyện nào?"" → 
  SELECT EventId, EventName, Description, StartDate, EndDate, Location, MaxVolunteers, CurrentVolunteers, RegistrationStartDate, RegistrationEndDate
  FROM Events 
  WHERE IsActive = 1 AND StartDate >= GETDATE() AND CurrentVolunteers < MaxVolunteers
  ORDER BY StartDate ASC

- ""Có những tình nguyện viên nào trong hệ thống"" → 
  SELECT vp.VolunteerId, up.FirstName + ' ' + up.LastName as FullName, vp.University, vp.Major, vp.VolunteerHours, vp.Rating, vp.IsVerified 
  FROM VolunteerProfiles vp 
  JOIN Users u ON vp.UserId = u.UserId 
  JOIN UserProfiles up ON u.UserId = up.UserId 
  WHERE u.IsActive = 1

- ""Danh sách tình nguyện viên đã đăng ký sự kiện"" → 
  SELECT vp.VolunteerId, up.FirstName + ' ' + up.LastName as FullName, er.RegistrationId, e.EventName, er.ApplicationDate 
  FROM VolunteerProfiles vp 
  JOIN Users u ON vp.UserId = u.UserId 
  JOIN UserProfiles up ON u.UserId = up.UserId 
  JOIN EventRegistrations er ON vp.VolunteerId = er.VolunteerId 
  JOIN Events e ON er.EventId = e.EventId

- ""Thống kê số lượng đăng ký theo sự kiện"" → 
  SELECT e.EventName, COUNT(er.RegistrationId) as RegistrationCount 
  FROM Events e 
  LEFT JOIN EventRegistrations er ON e.EventId = er.EventId 
  GROUP BY e.EventId, e.EventName

- ""Danh sách tình nguyện viên đã xác minh"" → 
  SELECT vp.VolunteerId, up.FirstName + ' ' + up.LastName as FullName, vp.University, vp.Major, vp.VolunteerHours, vp.Rating 
  FROM VolunteerProfiles vp 
  JOIN Users u ON vp.UserId = u.UserId 
  JOIN UserProfiles up ON u.UserId = up.UserId 
  WHERE vp.IsVerified = 1

- ""Tìm tình nguyện viên theo tên"" → 
  SELECT vp.VolunteerId, up.FirstName + ' ' + up.LastName as FullName, vp.University, vp.Major 
  FROM VolunteerProfiles vp 
  JOIN Users u ON vp.UserId = u.UserId 
  JOIN UserProfiles up ON u.UserId = up.UserId 
  WHERE up.FirstName LIKE '%Nguyen%' OR up.LastName LIKE '%Nguyen%'

- ""Hoạt động tình nguyện gần đây nhất"" → 
  SELECT TOP 1 EventId, EventName, StartDate, EndDate, Location, Description, MaxVolunteers, CurrentVolunteers
  FROM Events 
  WHERE IsActive = 1 
  ORDER BY StartDate DESC

IMPORTANT: Use the EXACT table names from the schema above. Do not translate table or column names to Vietnamese.
For volunteer names, always JOIN through Users → UserProfiles to get FirstName + LastName.
NEVER use vp.FullName - this column does not exist in VolunteerProfiles table.
NEVER use table name 'Volunteers' - the correct table is 'VolunteerProfiles'.
ALWAYS specify specific columns in SELECT clause - NEVER leave SELECT empty.
Remember: Focus on the most relevant tables based on the query keywords and provide accurate, efficient SQL queries.";

            return basePrompt;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error building system prompt");
            return GetFallbackSystemPrompt(customInstruction);
        }
    }

    /// <summary>
    /// Build user prompt with context
    /// </summary>
    public async Task<string> BuildUserPromptAsync(string query, List<string> relevantTables)
    {
        try
        {
            var tableContext = await BuildTableContextAsync(relevantTables);
            
            return $@"
User Query: {query}

Relevant Tables: {string.Join(", ", relevantTables)}

{tableContext}

Please generate a SQL query to answer this question. Focus on the most relevant tables and provide an efficient query.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error building user prompt");
            return $"User Query: {query}\n\nPlease generate a SQL query to answer this question.";
        }
    }

    /// <summary>
    /// Build schema context from database metadata
    /// </summary>
    private async Task<string> BuildSchemaContextAsync(List<TableSchema> tableSchemas, List<TableRelationship> relationships)
    {
        var schemaContext = new List<string>();

        foreach (var tableSchema in tableSchemas)
        {
            var columns = tableSchema.TableColumns.Select(tc => 
                $"{tc.ColumnName} ({tc.DataType ?? "unknown"})" + 
                (!string.IsNullOrEmpty(tc.Description) ? $" - {tc.Description}" : "")
            ).ToList();

            var keywords = tableSchema.TableKeywords.Select(tk => tk.Keyword).ToList();
            
            schemaContext.Add($@"
Table: {tableSchema.TableName}
Description: {tableSchema.Description ?? "No description"}
Keywords: {string.Join(", ", keywords)}
Columns: {string.Join(", ", columns)}");
        }

        return string.Join("\n", schemaContext);
    }

    /// <summary>
    /// Build relationships context from database metadata
    /// </summary>
    private async Task<string> BuildRelationshipsContextAsync(List<TableRelationship> relationships)
    {
        var relationshipContext = new List<string>();

        foreach (var rel in relationships)
        {
            relationshipContext.Add($"{rel.FromTable}.{rel.FromColumn} → {rel.ToTable}.{rel.ToColumn} ({rel.RelationshipType})");
        }

        return string.Join("\n", relationshipContext);
    }

    /// <summary>
    /// Build detailed context for specific tables
    /// </summary>
    private async Task<string> BuildTableContextAsync(List<string> tableNames)
    {
        try
        {
            var tableContexts = new List<string>();

            foreach (var tableName in tableNames)
            {
                var tableSchema = await _context.TableSchemas
                    .Include(ts => ts.TableColumns)
                    .Include(ts => ts.TableKeywords)
                    .FirstOrDefaultAsync(ts => ts.TableName == tableName);

                if (tableSchema != null)
                {
                    var columns = tableSchema.TableColumns.Select(tc => 
                        $"{tc.ColumnName} ({tc.DataType ?? "unknown"})" + 
                        (!string.IsNullOrEmpty(tc.Description) ? $" - {tc.Description}" : "")
                    ).ToList();

                    var keywords = tableSchema.TableKeywords.Select(tk => tk.Keyword).ToList();

                    tableContexts.Add($@"
Table: {tableSchema.TableName}
Description: {tableSchema.Description ?? "No description"}
Keywords: {string.Join(", ", keywords)}
Columns: {string.Join(", ", columns)}");
                }
            }

            return string.Join("\n", tableContexts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error building table context");
            return $"Focus on tables: {string.Join(", ", tableNames)}";
        }
    }

    /// <summary>
    /// Fallback system prompt when metadata is unavailable
    /// </summary>
    private string GetFallbackSystemPrompt(string customInstruction)
    {
        return $@"
You are an expert SQL developer specializing in SQL Server for a Volunteer Management System (IVAN). Your task is to convert natural language queries into accurate SQL statements.

CRITICAL RULES:
1. Always use SQL Server syntax (T-SQL)
2. Use EXACT table and column names - DO NOT translate to Vietnamese
3. The main table for events is called 'Events' (NOT 'HoatDong' or 'SuKien')
4. The main table for volunteers is called 'VolunteerProfiles' (NOT 'TinhNguyenVien')
5. Event registrations are in 'EventRegistrations' table
6. Include appropriate JOINs when multiple tables are involved
7. Use parameterized queries when possible for security
8. Add comments to explain complex logic
9. Return ONLY the SQL query, no explanations
10. Handle NULL values appropriately
11. For active/available events, use IsActive = 1 and check dates

{customInstruction}

Common Tables: Events, EventRegistrations, VolunteerProfiles, Organizations, Partners, Certificates, Feedback, OnSiteTasks, TaskAssignments

IMPORTANT: Use the EXACT table names listed above. Do not translate table or column names to Vietnamese.

Remember: Focus on the most relevant tables based on the query keywords and provide accurate, efficient SQL queries.";
    }
} 