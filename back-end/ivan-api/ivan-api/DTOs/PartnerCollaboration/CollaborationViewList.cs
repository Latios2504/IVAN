using ivan_api.Models;

namespace ivan_api.DTOs.PartnerCollaboration
{
    public class CollaborationViewList
    {
        public int CollaborationId { get; set; }

        public int OrganizationId { get; set; }

        public string OrganizationName { get; set; } = null!;

        public int PartnerId { get; set; }

        public string PartnerName { get; set; } = null!;

        public int TypeId { get; set; }

        public string TypeName { get; set; } = null!;

        public string CollaborationName { get; set; } = null!;

        public DateOnly StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        public string? Status { get; set; }

        public decimal? Budget { get; set; }

        public string? Currency { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
