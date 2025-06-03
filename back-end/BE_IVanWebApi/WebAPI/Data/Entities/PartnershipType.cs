using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Data.Entities
{
    //[Table("partnership_types")]
    public class PartnershipType
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;
        [MaxLength(1000)]
        public string? Description { get; set; }

        public DateTime? CreatedAt { get; set; }

        public virtual ICollection<PartnerCollaboration> PartnerCollaborations { get; set; } = new List<PartnerCollaboration>();
    }
}
