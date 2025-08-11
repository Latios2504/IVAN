using ivan_api.Models;

namespace ivan_api.Repository.SupportRequestRepo
{
    public interface ISupportRequestRepository
    {
        Task<List<SupportRequest>> GetAllAsync(string? status = null, int? categoryId = null);
        Task<List<SupportRequest>> GetByUserIdAsync(int userId);
        Task<SupportRequest?> GetByIdAsync(int requestId);
        Task<SupportRequest> CreateAsync(SupportRequest request);
        Task<bool> UpdateAsync(SupportRequest request);
        Task<List<SupportCategory>> GetCategoriesAsync();
        Task<bool> AddCommentAsync(SupportRequestComment comment);
        Task<List<SupportRequestComment>> GetCommentsAsync(int requestId, bool includeInternal = false);
        Task<bool> SaveChangesAsync();
    }
}
