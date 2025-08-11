using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.EventManage
{
    public class UpdateEventStatusDto
    {
        [Required]
        public int StatusId { get; set; }
        
        public string? Reason { get; set; }
    }
}
