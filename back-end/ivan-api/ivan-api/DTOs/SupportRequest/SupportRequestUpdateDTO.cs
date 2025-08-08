namespace ivan_api.DTOs.SupportRequest
{
    public class SupportRequestUpdateDTO
    {
        public string? Status { get; set; }
        public int? AssignedTo { get; set; }
        public string? Resolution { get; set; }
        public string? Priority { get; set; }
    }
}
