using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Data.Entities
{
    //[Table("support_request_categories")]
    public class SupportRequestCategory
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;
        [MaxLength(1000)]
        public string? Description { get; set; }
        [MaxLength(50)]
        public string? Icon { get; set; }
        [MaxLength (7)]
        public string? Color { get; set; }

        public bool? IsActive { get; set; }

        public DateTime? CreatedAt { get; set; }

        public virtual ICollection<SupportRequest> SupportRequests { get; set; } = new List<SupportRequest>();
    }
}
