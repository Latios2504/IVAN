using ivan_api.DTOs.Common;
using ivan_api.DTOs.SupportRequest;

namespace ivan_api.Services.SupportRequestServ
{
    public interface ISupportRequestService
    {
        Task<ApiResponseDTO<List<SupportRequestResponseDTO>>> GetAllRequestsAsync(string? status = null, int? categoryId = null);
        Task<ApiResponseDTO<List<SupportRequestResponseDTO>>> GetUserRequestsAsync(int userId);
        Task<ApiResponseDTO<SupportRequestResponseDTO>> GetRequestByIdAsync(int requestId);
        Task<ApiResponseDTO<SupportRequestResponseDTO>> CreateRequestAsync(int? userId, SupportRequestCreateDTO dto);
        Task<ApiResponseDTO<bool>> UpdateRequestAsync(int requestId, SupportRequestUpdateDTO dto, int adminUserId);
        Task<ApiResponseDTO<List<SupportCategoryDTO>>> GetCategoriesAsync();
        Task<ApiResponseDTO<bool>> AddCommentAsync(int requestId, string comment, int userId, bool isInternal = false);
        Task<ApiResponseDTO<bool>> AddCommentWithAttachmentAsync(int requestId, string comment, int userId, bool isInternal = false, List<string>? attachmentUrls = null);
    }
}
