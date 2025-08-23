using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.EventManage
{
    public class UpdateEventStatusDto
    {
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty;
    }
}