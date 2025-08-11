namespace ivan_api.Services.AI.SQLGenerator
{
    public interface ISqlExecutionService
    {
        Task<SqlExecutionResponse> ExecuteSqlAsync(SqlExecutionRequest request);
        Task<SqlExecutionResponse> ExecuteSelectQueryAsync(string sqlQuery, int maxRows = 1000);
        Task<SqlExecutionResponse> ExecuteNonQueryAsync(string sqlQuery);
    }
} 