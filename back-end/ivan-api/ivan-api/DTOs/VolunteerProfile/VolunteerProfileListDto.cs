namespace ivan_api.DTOs.VolunteerProfile
{
    public class VolunteerProfileListDto
    {
        // DTO cơ bản dùng cho danh sách (Admin xem nhiều hồ sơ)
        public int VolunteerId { get; set; }
        public string FullName { get; set; } = null!;
        public string? University { get; set; }
        public string? Major { get; set; }
        public int? YearOfStudy { get; set; }
        public int VolunteerHours { get; set; }
        public decimal? Rating { get; set; }
    }

}
