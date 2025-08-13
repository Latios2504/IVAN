using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.EventManage
{
    public class CreateEventDto
    {
        [Required]
        public int OrganizationId { get; set; }

        [Required, StringLength(300)]
        public string EventName { get; set; } = default!;

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int StatusId { get; set; } = 1; // Default to Planning status

        [StringLength(500)]
        public string? ShortDescription { get; set; }

        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

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

        public int? MaxVolunteers { get; set; }
        public int MinVolunteers { get; set; } = 1;

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

        public string? GalleryImages { get; set; } // JSON array

        public bool IsFeatured { get; set; } = false;
        public bool IsUrgent { get; set; } = false;
    }
}
