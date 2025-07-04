using ivan_api.DTOs.Common;
using ivan_api.DTOs.PartnerCollaboration;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Services.PartnerCollaborationServ
{
    public interface IPartnerCollaborationService
    {
        Task<PagedResultDto<CollaborationViewList>> GetList(int pageNumber, int pageSize);
        Task<CollaborationDetailDto> GetCollaborationDetail(int collaborationId);

        Task<int> CreateCollaboration(PartnerCollaborationCreateDto dto);

    }
}
