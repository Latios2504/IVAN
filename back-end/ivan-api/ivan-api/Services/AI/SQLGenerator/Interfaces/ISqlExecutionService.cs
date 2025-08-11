using ivan_api.DTOs.AI.SqlGenerator;

namespace ivan_api.Services.AI.SQLGenerator.Interfaces
{
    public interface ISqlExecutionService
    {
        Task<SqlExecutionResponseDto> ExecuteSqlAsync(SqlExecutionRequestDto request);
        Task<SqlExecutionResponseDto> ExecuteSelectQueryAsync(string sqlQuery, int maxRows = 1000);
        Task<SqlExecutionResponseDto> ExecuteNonQueryAsync(string sqlQuery);
    }
} 