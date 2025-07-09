namespace ivan_api.DTOs.Public
{
    /// <summary>
    /// Public view of event data - excludes sensitive management information
    /// </summary>
    public class PublicEventDTO
    {
        public int EventId { get; set; }
        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; } = string.Empty; // From Organizations join
        public string EventName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty; // From EventCategories join
        public string StatusName { get; set; } = string.Empty; // From EventStatus join
        public string? Description { get; set; }
        public string? ShortDescription { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? RegistrationStartDate { get; set; }
        public DateTime? RegistrationEndDate { get; set; }
        public string? Location { get; set; }
        public string? DetailedAddress { get; set; }
        public string? WardCommune { get; set; }
        public string? District { get; set; }
        public string? Province { get; set; }
        public int? MaxVolunteers { get; set; }
        public int MinVolunteers { get; set; }
        public int CurrentVolunteers { get; set; }
        public string? RequiredSkills { get; set; }
        public string? AgeRequirement { get; set; }
        public string? GenderRequirement { get; set; }
        public string? Requirements { get; set; }
        public string? Benefits { get; set; }
        public string? BannerImageUrl { get; set; }
        public string? GalleryImages { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsUrgent { get; set; }
        public int ViewCount { get; set; }
        public int RegistrationCount { get; set; }
        public decimal Rating { get; set; }
        public int RatingCount { get; set; }
        public string? EventType { get; set; }
    }

    /// <summary>
    /// Filters for public event search
    /// </summary>
    public class PublicEventFiltersDTO
    {
        public string? Search { get; set; }
        public int? CategoryId { get; set; }
        public int? OrganizationId { get; set; }
        public string? Province { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool? IsFeatured { get; set; }
        public bool? IsUrgent { get; set; }
        public int Page { get; set; } = 1;
        public int Size { get; set; } = 20;
    }
}
