using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.CoordinatorTask
{
    public class UpdateTaskStatusDto
    {
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = null!;
    }
}