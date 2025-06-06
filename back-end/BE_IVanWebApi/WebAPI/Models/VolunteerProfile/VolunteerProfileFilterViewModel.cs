namespace WebAPI.Models.VolunteerProfile
{
    public class VolunteerProfileFilterViewModel
    {
        public string Skill { get; set; }
        public string Location { get; set; } // City hoặc Province
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
