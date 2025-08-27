namespace ivan_api.DTOs.EventManage
{
    public class EventDto
    {
        // Core Identity
        public int EventId { get; set; }
        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; } = default!;
        public string EventName { get; set; } = default!;
        
        // Categorization
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = default!;
        public int StatusId { get; set; }
        public string StatusName { get; set; } = default!;
        
        // Content
        public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        
        // Dates
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? RegistrationStartDate { get; set; }
        public DateTime? RegistrationEndDate { get; set; }
        
        // Location
        public string? Location { get; set; }
        public string? DetailedAddress { get; set; }
        public string? Province { get; set; }
        public string? District { get; set; }
        
        // Volunteers
        public int? MaxVolunteers { get; set; }
        public int MinVolunteers { get; set; }
        public int? VolunteersRegistered { get; set; }
        
        // Requirements
        public string? RequiredSkills { get; set; }
        public string? AgeRequirement { get; set; }
        public string? GenderRequirement { get; set; }
        public string? Requirements { get; set; }
        public string? Benefits { get; set; }
        
        // Contact
        public string? ContactPerson { get; set; }
        public string? ContactPhone { get; set; }
        public string? ContactEmail { get; set; }
        
        // Media
        public string? BannerImageUrl { get; set; }
        public string? GalleryImages { get; set; }
        
        // Features
        public bool IsFeatured { get; set; }
        public bool IsUrgent { get; set; }
        
        // Audit
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public int? CurrentVolunteers { get; set; }
        public int? RegistrationCount { get; set; }
    }
}
