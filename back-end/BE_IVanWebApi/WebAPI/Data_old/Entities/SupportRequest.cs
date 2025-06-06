using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Data_old.Entities
{
    //[Table("support_requests")]
    public class SupportRequest
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string TicketNumber { get; set; } = null!;
        [Required]
        public int CategoryId { get; set; }
        [Required]
        [MaxLength(300)]
        public string Title { get; set; } = null!;
        [Required]
        [MaxLength(1000)]
        public string Description { get; set; } = null!;
        [MaxLength(50)]
        public string? Priority { get; set; }
        [MaxLength(50)]
        public string? Status { get; set; }

        public int? RequestedBy { get; set; }
        [MaxLength(255)]
        public string? RequesterEmail { get; set; }
        [MaxLength(20)]
        public string? RequesterPhone { get; set; }
        [MaxLength(200)]
        public string? RequesterName { get; set; }

        public int? OrganizationId { get; set; }

        public int? EventId { get; set; }

        public int? AssignedTo { get; set; }
        [MaxLength(1000)]
        public string? Resolution { get; set; }
        [MaxLength(1000)]
        public string? InternalNotes { get; set; }
        [MaxLength(1000)]
        public string? Attachments { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime? ResolvedAt { get; set; }

        public DateTime? ClosedAt { get; set; }

        public int? SatisfactionRating { get; set; }
        [MaxLength(1000)]
        public string? SatisfactionFeedback { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public virtual User? AssignedToNavigation { get; set; }

        public virtual SupportRequestCategory Category { get; set; } = null!;

        public virtual Event? Event { get; set; }

        public virtual OrganizationProfile? Organization { get; set; }

        public virtual User? RequestedByNavigation { get; set; }
    }
}
