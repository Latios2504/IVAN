using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.AI.SqlGenerator
{
    public class SqlExecutionRequestDto
    {
        [Required]
        public string SqlQuery { get; set; } = string.Empty;
        
        public int? MaxRows { get; set; } = 1000;
        
        public int? TimeoutSeconds { get; set; } = 30;
        
        public bool IncludeMetadata { get; set; } = true;
        
        public string? UserContext { get; set; }
    }
} 