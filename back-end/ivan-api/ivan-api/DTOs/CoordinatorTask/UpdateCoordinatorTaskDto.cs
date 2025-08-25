using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.CoordinatorTask
{
    public class UpdateCoordinatorTaskDto
    {
        [Required]
        public int EventId { get; set; }
        
        [Required]
        public int CoordinatorId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string TaskName { get; set; } = null!;
        
        [StringLength(2000)]
        public string? Description { get; set; }
        
        public DateTime? DueDate { get; set; }
        
        [StringLength(20)]
        public string? Priority { get; set; }
        
        [StringLength(50)]
        public string? Status { get; set; }
        
        [StringLength(100)]
        public string? Category { get; set; }
        
        [Range(0, 999.99)]
        public decimal? EstimatedHours { get; set; }
        
        [Range(0, 999.99)]
        public decimal? ActualHours { get; set; }
        
        public DateTime? CompletedAt { get; set; }
        
        [StringLength(1000)]
        public string? Notes { get; set; }
    }
}