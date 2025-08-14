namespace ivan_api.DTOs.Common
{
    public class ProfileCompletionDto
    {
        public int CompletionPercentage { get; set; }
        public List<string> MissingFields { get; set; } = new List<string>();
    }
}
