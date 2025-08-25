using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.CoordinatorRequests
{
    public class CreateCoordinatorRequestDto
    {
        [Required, EmailAddress]
        public string CandidateEmail { get; set; } = default!;

        [Required, StringLength(200)]
        public string FullName { get; set; } = default!;

        [Required, StringLength(100)]
        public string Position { get; set; } = default!;

        [Required, StringLength(100)]
        public string Department { get; set; } = default!;

        [Required, StringLength(1000)]
        public string Responsibilities { get; set; } = default!;

        [Required]
        public DateOnly HireDate { get; set; }

        public int? ManagerUserId { get; set; }
    }
}
