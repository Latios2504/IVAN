namespace WebAPI.Models.VolunteerProfile
{
    public class VolunteerProfileViewDto
    {
        public int VolunteerId { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = "";
        public string? University { get; set; }
        public int? YearOfStudy { get; set; }
        public string? Motivation { get; set; }
        public decimal? Rating { get; set; }
    }
}
