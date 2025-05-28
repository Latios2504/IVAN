namespace WebAPI.Models.VolunteerProfile
{
    public class VolunteerProfileViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName => $"{FirstName} {LastName}";
        public string Phone { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Province { get; set; }
        public string EmergencyContactName { get; set; }
        public string EmergencyContactPhone { get; set; }
        public string Skills { get; set; }
        public string Interests { get; set; }
        public string Availability { get; set; }
        public int VolunteerHoursCompleted { get; set; }
        public string ProfilePictureUrl { get; set; }
        public string Bio { get; set; }
        public string FacebookUrl { get; set; }
        public string EducationLevel { get; set; }
        public string Occupation { get; set; }
        public string Company { get; set; }
        public bool IsBackgroundChecked { get; set; }
        public DateTime? BackgroundCheckDate { get; set; }
    }
}
