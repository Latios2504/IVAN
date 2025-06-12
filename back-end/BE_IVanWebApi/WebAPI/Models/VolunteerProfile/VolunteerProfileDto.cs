namespace WebAPI.Models.VolunteerProfile
{
    public class VolunteerProfileDto
    {
        public int UserId { get; set; }
        public string? StudentId { get; set; }
        public string? University { get; set; }
        public string? Major { get; set; }
        public int? YearOfStudy { get; set; }
        public string? Motivation { get; set; }
        public string? Experience { get; set; }
        public string? Availability { get; set; }
    }
}
