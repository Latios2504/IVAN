using ivan_api.DTOs.Common;
using ivan_api.DTOs.PartnerCollaboration;
using ivan_api.Repository.PartnerCollaborationRepo;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Services.PartnerCollaborationServ
{
    public class PartnerCollaborationService : IPartnerCollaborationService
    {
        private readonly IPartnerCollaborationRepository _partnerCollaborationRepository;

        public PartnerCollaborationService(IPartnerCollaborationRepository partnerCollaborationRepository)
        {
            _partnerCollaborationRepository = partnerCollaborationRepository;
        }

        public async Task<CollaborationDetailDto> GetCollaborationDetail(int collaborationId)
        {
            return await _partnerCollaborationRepository.GetCollaborationDetailAsync(collaborationId)
                   ?? throw new Exception($"Không tìm thấy collaboration với ID {collaborationId}");
        }

        public async Task<PagedResultDto<CollaborationViewList>> GetList(int pageNumber, int pageSize)
        {
            return await _partnerCollaborationRepository.GetPartnerCollaborationsAsync(pageNumber, pageSize);
        }
    }
}
