using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.EventManage
{
    public class UpdateEventDto
    {
        [StringLength(300)]
        public string? EventName { get; set; }

        public int? CategoryId { get; set; }
        public int? StatusId { get; set; }

        [StringLength(500)]
        public string? ShortDescription { get; set; }

        public string? Description { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? RegistrationStartDate { get; set; }
        public DateTime? RegistrationEndDate { get; set; }

        [StringLength(500)]
        public string? Location { get; set; }

        [StringLength(1000)]
        public string? DetailedAddress { get; set; }

        [StringLength(100)]
        public string? Province { get; set; }

        [StringLength(100)]
        public string? District { get; set; }

        [StringLength(100)]
        public string? WardCommune { get; set; }

        public int? MaxVolunteers { get; set; }
        public int? MinVolunteers { get; set; }

        [StringLength(1000)]
        public string? RequiredSkills { get; set; }

        [StringLength(100)]
        public string? AgeRequirement { get; set; }

        [StringLength(20)]
        public string? GenderRequirement { get; set; }

        [StringLength(2000)]
        public string? Requirements { get; set; }

        [StringLength(2000)]
        public string? Benefits { get; set; }

        [StringLength(200)]
        public string? ContactPerson { get; set; }

        [StringLength(20)]
        public string? ContactPhone { get; set; }

        [StringLength(255)]
        public string? ContactEmail { get; set; }

        [StringLength(500)]
        public string? BannerImageUrl { get; set; }

        public string? GalleryImages { get; set; }

        public bool? IsFeatured { get; set; }
        public bool? IsUrgent { get; set; }
        public int? Priority { get; set; }

        [StringLength(100)]
        public string? EventType { get; set; }

        public decimal? Budget { get; set; }

        [StringLength(3)]
        public string? Currency { get; set; }
    }
}
