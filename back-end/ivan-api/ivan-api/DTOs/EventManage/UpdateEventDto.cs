using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.EventManage
{
    public class UpdateEventDto
    {
        [StringLength(200)]
        public string? EventName { get; set; }

        public int? CategoryId { get; set; }
        public int? StatusId { get; set; }

        [StringLength(500)]
        public string? ShortDescription { get; set; }

        public string? Description { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        [StringLength(200)]
        public string? Location { get; set; }
    }
}
