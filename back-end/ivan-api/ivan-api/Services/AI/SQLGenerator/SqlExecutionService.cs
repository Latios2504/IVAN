using Microsoft.Data.SqlClient;
using System.Data;

namespace ivan_api.Services.AI.SQLGenerator
{
    // Simple internal models (no need for separate DTO files)
    public class SqlExecutionRequest
    {
        public string SqlQuery { get; set; } = string.Empty;
        public int? MaxRows { get; set; } = 1000;
        public int? TimeoutSeconds { get; set; } = 30;
        public bool IncludeMetadata { get; set; } = true;
        public string? UserContext { get; set; }
    }

    public class SqlExecutionResponse
    {
        public bool Success { get; set; }
        public object? Data { get; set; }
        public string? ErrorMessage { get; set; }
        public int? RowsAffected { get; set; }
        public int? TotalRows { get; set; }
        public List<string>? ColumnNames { get; set; }
        public List<object>? ColumnTypes { get; set; }
        public string? ExecutionTime { get; set; }
        public string? QueryType { get; set; }
    }

    public class SqlExecutionService : ISqlExecutionService
    {
        private readonly string _connectionString;
        private readonly ILogger<SqlExecutionService> _logger;

            public SqlExecutionService(IConfiguration configuration, ILogger<SqlExecutionService> logger)
            {
                _connectionString = configuration.GetConnectionString("MyCnn") ??
                    throw new ArgumentNullException("Database connection string not found");
                _logger = logger;
            }

            public async Task<SqlExecutionResponse> ExecuteSqlAsync(SqlExecutionRequest request)
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();

                try
                {
                    // Validate SQL query for security
                    if (!IsQuerySafe(request.SqlQuery))
                    {
                        return new SqlExecutionResponse
                        {
                            Success = false,
                            ErrorMessage = "Query contains potentially dangerous operations"
                        };
                    }

                    using var connection = new SqlConnection(_connectionString);
                    await connection.OpenAsync();

                    // Determine query type
                    var queryType = GetQueryType(request.SqlQuery);

                    if (queryType == "SELECT")
                    {
                        return await ExecuteSelectQueryAsync(request.SqlQuery, request.MaxRows ?? 1000);
                    }
                    else
                    {
                        return await ExecuteNonQueryAsync(request.SqlQuery);
                    }
                }
                catch (Exception ex)
                {
                    stopwatch.Stop();
                    _logger.LogError(ex, "Error executing SQL query");

                    return new SqlExecutionResponse
                    {
                        Success = false,
                        ErrorMessage = $"Database error: {ex.Message}",
                        ExecutionTime = $"{stopwatch.ElapsedMilliseconds}ms"
                    };
                }
            }

            public async Task<SqlExecutionResponse> ExecuteSelectQueryAsync(string sqlQuery, int maxRows = 1000)
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();

                try
                {
                    using var connection = new SqlConnection(_connectionString);
                    await connection.OpenAsync();

                    using var command = new SqlCommand(sqlQuery, connection);
                    command.CommandTimeout = 30; // 30 seconds timeout

                    using var reader = await command.ExecuteReaderAsync();
                    var dataTable = new DataTable();
                    dataTable.Load(reader);

                    stopwatch.Stop();

                    // Limit rows if necessary
                    var limitedData = dataTable.AsEnumerable().Take(maxRows).ToList();
                    var limitedTable = limitedData.Any() ? limitedData.CopyToDataTable() : dataTable.Clone();

                    return new SqlExecutionResponse
                    {
                        Success = true,
                        Data = ConvertDataTableToObject(limitedTable),
                        ColumnNames = dataTable.Columns.Cast<DataColumn>().Select(c => c.ColumnName).ToList(),
                        ColumnTypes = dataTable.Columns.Cast<DataColumn>().Select(c => (object)c.DataType.Name).ToList(),
                        TotalRows = dataTable.Rows.Count,
                        RowsAffected = limitedData.Count,
                        QueryType = "SELECT",
                        ExecutionTime = $"{stopwatch.ElapsedMilliseconds}ms"
                    };
                }
                catch (Exception ex)
                {
                    stopwatch.Stop();
                    _logger.LogError(ex, "Error executing SELECT query");

                    return new SqlExecutionResponse
                    {
                        Success = false,
                        ErrorMessage = $"SELECT query error: {ex.Message}",
                        ExecutionTime = $"{stopwatch.ElapsedMilliseconds}ms"
                    };
                }
            }

            public async Task<SqlExecutionResponse> ExecuteNonQueryAsync(string sqlQuery)
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();

                try
                {
                    using var connection = new SqlConnection(_connectionString);
                    await connection.OpenAsync();

                    using var command = new SqlCommand(sqlQuery, connection);
                    command.CommandTimeout = 30;

                    var rowsAffected = await command.ExecuteNonQueryAsync();
                    stopwatch.Stop();

                    return new SqlExecutionResponse
                    {
                        Success = true,
                        RowsAffected = rowsAffected,
                        QueryType = GetQueryType(sqlQuery),
                        ExecutionTime = $"{stopwatch.ElapsedMilliseconds}ms"
                    };
                }
                catch (Exception ex)
                {
                    stopwatch.Stop();
                    _logger.LogError(ex, "Error executing non-query SQL");

                    return new SqlExecutionResponse
                    {
                        Success = false,
                        ErrorMessage = $"Non-query execution error: {ex.Message}",
                        ExecutionTime = $"{stopwatch.ElapsedMilliseconds}ms"
                    };
                }
            }



            private bool IsQuerySafe(string sqlQuery)
            {
                if (string.IsNullOrWhiteSpace(sqlQuery))
                    return false;

                var upperQuery = sqlQuery.ToUpper();

                // Block dangerous operations
                var dangerousKeywords = new[]
                {
                "DROP", "DELETE", "TRUNCATE", "ALTER", "CREATE", "INSERT", "UPDATE",
                "EXEC", "EXECUTE", "xp_", "sp_", "OPENROWSET", "OPENDATASOURCE"
            };

                // Allow only SELECT queries for now (can be expanded later)
                if (!upperQuery.TrimStart().StartsWith("SELECT"))
                {
                    return false;
                }

                // Check for dangerous keywords
                if (dangerousKeywords.Any(keyword => upperQuery.Contains(keyword)))
                {
                    return false;
                }

                return true;
            }

            private string GetQueryType(string sqlQuery)
            {
                var upperQuery = sqlQuery.Trim().ToUpper();

                if (upperQuery.StartsWith("SELECT"))
                    return "SELECT";
                if (upperQuery.StartsWith("INSERT"))
                    return "INSERT";
                if (upperQuery.StartsWith("UPDATE"))
                    return "UPDATE";
                if (upperQuery.StartsWith("DELETE"))
                    return "DELETE";

                return "UNKNOWN";
            }

            private object ConvertDataTableToObject(DataTable dataTable)
            {
                var rows = new List<Dictionary<string, object?>>();

                foreach (DataRow row in dataTable.Rows)
                {
                    var dict = new Dictionary<string, object?>();
                    foreach (DataColumn col in dataTable.Columns)
                    {
                        dict[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                    }
                    rows.Add(dict);
                }

                return rows;
            }
        }
    }