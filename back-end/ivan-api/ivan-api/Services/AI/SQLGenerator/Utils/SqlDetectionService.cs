using Microsoft.EntityFrameworkCore;
using ivan_api.Models;
using Microsoft.Extensions.Logging;

namespace ivan_api.Services.AI.SQLGenerator.Utils;

/// <summary>
/// Service for detecting SQL queries and analyzing query intent
/// </summary>
public class SqlDetectionService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<SqlDetectionService> _logger;

    public SqlDetectionService(VolunteerManagementSystemContext context, ILogger<SqlDetectionService> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Check if a query should be treated as a SQL query
    /// </summary>
    public async Task<bool> IsSqlQueryAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return false;

        var lowerQuery = query.ToLowerInvariant();

        // Check for explicit SQL keywords (existing logic)
        var sqlKeywords = new[]
        {
            "select", "from", "where", "insert", "update", "delete", "create", "drop", "alter",
            "table", "database", "index", "view", "procedure", "function", "trigger",
            "join", "inner join", "left join", "right join", "outer join",
            "group by", "order by", "having", "union", "intersect", "except"
        };

        if (sqlKeywords.Any(keyword => lowerQuery.Contains(keyword)))
        {
            return true;
        }

        // NEW: Check for data retrieval patterns in natural language
        var dataRetrievalKeywords = new[]
        {
            // Vietnamese data retrieval keywords
            "tình nguyện", "volunteer", "hoạt động", "activity", "sự kiện", "event",
            "có thể", "nào", "gì", "bao nhiêu", "ở đâu", "khi nào", "ai", "tại sao",
            "thống kê", "báo cáo", "danh sách", "liệt kê", "tìm kiếm", "lọc",
            "đăng ký", "registration", "tham gia", "participate", "hỗ trợ", "support",
            "tổ chức", "organization", "đối tác", "partner", "chứng chỉ", "certificate",
            "phản hồi", "feedback", "đánh giá", "rating", "lịch trình", "schedule",
            "công việc", "task", "nhiệm vụ", "assignment", "kỹ năng", "skill"
        };

        // Check if query contains data retrieval keywords
        if (dataRetrievalKeywords.Any(keyword => lowerQuery.Contains(keyword)))
        {
            // Check if it's a question pattern
            var questionPatterns = new[] { "?", "nào", "gì", "bao nhiêu", "ở đâu", "khi nào", "ai", "tại sao", "làm sao", "thế nào" };
            if (questionPatterns.Any(pattern => lowerQuery.Contains(pattern)))
            {
                return true;
            }
        }

        return false;
    }

    /// <summary>
    /// Get relevant table names based on query content using database metadata
    /// </summary>
    public async Task<List<string>> GetRelevantTableNamesAsync(string query)
    {
        var relevantTables = new List<string>();
        var lowerQuery = query.ToLowerInvariant();

        try
        {
            // Load all table schemas with keywords to client first to avoid EF translation issues
            var allTableSchemas = await _context.TableSchemas
                .Include(ts => ts.TableKeywords)
                .ToListAsync();

            // Find relevant tables by checking keywords in memory
            var relevantTableSchemas = allTableSchemas
                .Where(ts => ts.TableKeywords.Any(tk => lowerQuery.Contains(tk.Keyword.ToLowerInvariant())))
                .ToList();

            // Add table names that have matching keywords
            foreach (var tableSchema in relevantTableSchemas)
            {
                if (!relevantTables.Contains(tableSchema.TableName))
                {
                    relevantTables.Add(tableSchema.TableName);
                }
            }

            // If no tables found by keywords, try direct table name matching
            if (!relevantTables.Any())
            {
                var allTableNames = allTableSchemas.Select(ts => ts.TableName).ToList();

                foreach (var tableName in allTableNames)
                {
                    if (lowerQuery.Contains(tableName.ToLowerInvariant()))
                    {
                        relevantTables.Add(tableName);
                    }
                }
            }

            _logger.LogInformation("Found {Count} relevant tables for query: {Tables}", 
                relevantTables.Count, string.Join(", ", relevantTables));

            return relevantTables;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting relevant table names for query: {Query}", query);
            return new List<string>();
        }
    }

    /// <summary>
    /// Get table names from database schema
    /// </summary>
    public async Task<List<string>> GetTableNamesFromSchemaAsync()
    {
        try
        {
            return await _context.TableSchemas
                .Select(ts => ts.TableName)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting table names from schema");
            return new List<string>();
        }
    }

    /// <summary>
    /// Get table relationships for better SQL generation
    /// </summary>
    public async Task<List<TableRelationship>> GetTableRelationshipsAsync()
    {
        try
        {
            var relationships = await _context.TableRelationships
                .Include(tr => tr.FromTable)
                .Include(tr => tr.ToTable)
                .ToListAsync();

            return relationships.Select(tr => new TableRelationship
            {
                FromTable = tr.FromTable.TableName,
                FromColumn = tr.FromColumn,
                ToTable = tr.ToTable.TableName,
                ToColumn = tr.ToColumn,
                RelationshipType = tr.RelationshipType
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting table relationships");
            return new List<TableRelationship>();
        }
    }

    /// <summary>
    /// Get table columns for better SQL generation
    /// </summary>
    public async Task<Dictionary<string, List<TableColumn>>> GetTableColumnsAsync()
    {
        try
        {
            var tableColumns = await _context.TableColumns
                .Include(tc => tc.TableSchema)
                .ToListAsync();

            return tableColumns
                .GroupBy(tc => tc.TableSchema.TableName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(tc => new TableColumn
                    {
                        ColumnName = tc.ColumnName,
                        DataType = tc.DataType,
                        Description = tc.Description
                    }).ToList()
                );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting table columns");
            return new Dictionary<string, List<TableColumn>>();
        }
    }

    /// <summary>
    /// Get relevant keywords for a query (for backward compatibility)
    /// </summary>
    public async Task<List<string>> GetRelevantKeywordsAsync(string query)
    {
        try
        {
            var relevantTables = await GetRelevantTableNamesAsync(query);
            var keywords = new List<string>();

            foreach (var tableName in relevantTables)
            {
                var tableKeywords = await _context.TableKeywords
                    .Include(tk => tk.TableSchema)
                    .Where(tk => tk.TableSchema.TableName == tableName)
                    .Select(tk => tk.Keyword)
                    .ToListAsync();

                keywords.AddRange(tableKeywords);
            }

            return keywords.Distinct().ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting relevant keywords for query: {Query}", query);
            return new List<string>();
        }
    }

    /// <summary>
    /// Get relevant relationships for a query (for backward compatibility)
    /// </summary>
    public async Task<List<string>> GetRelevantRelationshipsAsync(string query, List<string> tableNames)
    {
        try
        {
            var relationships = await GetTableRelationshipsAsync();
            var relevantRelationships = new List<string>();

            foreach (var rel in relationships)
            {
                if (tableNames.Contains(rel.FromTable) || tableNames.Contains(rel.ToTable))
                {
                    relevantRelationships.Add($"{rel.FromTable}.{rel.FromColumn} → {rel.ToTable}.{rel.ToColumn} ({rel.RelationshipType})");
                }
            }

            return relevantRelationships;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting relevant relationships for query: {Query}", query);
            return new List<string>();
        }
    }
}

/// <summary>
/// Helper classes for table metadata
/// </summary>
public class TableRelationship
{
    public string FromTable { get; set; } = string.Empty;
    public string FromColumn { get; set; } = string.Empty;
    public string ToTable { get; set; } = string.Empty;
    public string ToColumn { get; set; } = string.Empty;
    public string RelationshipType { get; set; } = string.Empty;
}

public class TableColumn
{
    public string ColumnName { get; set; } = string.Empty;
    public string? DataType { get; set; }
    public string? Description { get; set; }
} 