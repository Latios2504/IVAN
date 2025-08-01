namespace ivan_api.DTOs.EventManage
{
    public class EventDto
    {
        public int EventId { get; set; }
        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; } = default!;
        public string EventName { get; set; } = default!;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = default!;
        public int StatusId { get; set; }
        public string StatusName { get; set; } = default!;
        public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? RegistrationStartDate { get; set; }
        public DateTime? RegistrationEndDate { get; set; }
        public string? Location { get; set; }
        public string? DetailedAddress { get; set; }
        public string? Province { get; set; }
        public string? District { get; set; }
        public string? WardCommune { get; set; }
        public int? MaxVolunteers { get; set; }
        public int MinVolunteers { get; set; }
        public int CurrentVolunteers { get; set; }
        public string? RequiredSkills { get; set; }
        public string? AgeRequirement { get; set; }
        public string? GenderRequirement { get; set; }
        public string? Requirements { get; set; }
        public string? Benefits { get; set; }
        public string? ContactPerson { get; set; }
        public string? ContactPhone { get; set; }
        public string? ContactEmail { get; set; }
        public string? BannerImageUrl { get; set; }
        public string? GalleryImages { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsUrgent { get; set; }
        public int Priority { get; set; }
        public int ViewCount { get; set; }
        public int RegistrationCount { get; set; }
        public decimal? Rating { get; set; }
        public int? RatingCount { get; set; }
        public string? EventType { get; set; }
        public decimal? Budget { get; set; }
        public string Currency { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
