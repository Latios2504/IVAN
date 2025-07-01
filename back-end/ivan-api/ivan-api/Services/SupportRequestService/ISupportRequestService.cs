using ivan_api.DTOs.SupportRequest;

namespace ivan_api.Services.SupportRequestService
{
    public interface ISupportRequestService
    {
        Task<SupportRequestDto> AddSupportRequestAsync(AddSupportRequestDto dto, int userId);
        Task<SupportRequestDto> GetSupportRequestForAdminAsync(int requestId);
        Task<SupportRequestDto> GetSupportRequestForOrganizationAsync(int requestId, int userId);
        Task<List<SupportRequestDto>> ListSupportRequestsAsync(string status, string priority, int? categoryId, int page, int pageSize);
        Task<SupportRequestDto> UpdateSupportRequestAsync(int requestId, UpdateSupportRequestDto dto, int adminId);
    }
}
