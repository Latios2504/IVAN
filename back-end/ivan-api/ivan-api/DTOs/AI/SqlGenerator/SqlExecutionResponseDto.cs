namespace ivan_api.DTOs.AI.SqlGenerator
{
    public class SqlExecutionResponseDto
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
} 