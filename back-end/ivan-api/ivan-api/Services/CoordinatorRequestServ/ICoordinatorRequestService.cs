using ivan_api.DTOs.Common;
using ivan_api.DTOs.CoordinatorRequests;

namespace ivan_api.Services.CoordinatorRequestServ
{
    public interface ICoordinatorRequestService
    {
        Task<ApiResponseDTO<object>> CreateAsync(
            int organizationId,
            int requesterUserId,
            CreateCoordinatorRequestDto dto);

        Task<ApiResponseDTO<List<CoordinatorRequestListItemDto>>> ListAsync(string? statusFilter = null);
        Task<ApiResponseDTO<object>> UpdateAsync(int requestId, int adminUserId, UpdateCoordinatorRequestDto dto);
    }
}
