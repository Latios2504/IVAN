using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.EventManage
{
    public class CreateEventDto
    {
        [Required]
        public int OrganizationId { get; set; }

        [Required, StringLength(200)]
        public string EventName { get; set; } = default!;

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [StringLength(500)]
        public string? ShortDescription { get; set; }

        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [StringLength(200)]
        public string? Location { get; set; }
    }
}
