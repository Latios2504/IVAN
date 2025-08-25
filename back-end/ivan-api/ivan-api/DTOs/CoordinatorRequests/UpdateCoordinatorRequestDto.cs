using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.CoordinatorRequests
{
    public class UpdateCoordinatorRequestDto
    {
        [Required]
        public string Action { get; set; } = default!; // APPROVE | REJECT

        public string? Note { get; set; }
    }
}
