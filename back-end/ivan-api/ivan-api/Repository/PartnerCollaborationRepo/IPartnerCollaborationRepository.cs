using ivan_api.DTOs.Common;
using ivan_api.DTOs.PartnerCollaboration;

namespace ivan_api.Repository.PartnerCollaborationRepo
{
    public interface IPartnerCollaborationRepository
    {
        Task<PagedResultDto<CollaborationViewList>> GetPartnerCollaborationsAsync(int PageNumber, int PageSize);
        Task<CollaborationDetailDto?> GetCollaborationDetailAsync(int collaborationId);
    }
}
