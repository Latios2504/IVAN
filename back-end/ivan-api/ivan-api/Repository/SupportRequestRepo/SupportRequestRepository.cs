using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Repository.SupportRequestRepo
{
    public class SupportRequestRepository : ISupportRequestRepository
    {
        private readonly VolunteerManagementSystemContext _context;

        public SupportRequestRepository(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<List<SupportRequest>> GetAllAsync(string? status = null, int? categoryId = null)
        {
            var query = _context.SupportRequests
                .Include(sr => sr.User)
                    .ThenInclude(u => u.UserProfiles)
                .Include(sr => sr.Category)
                .Include(sr => sr.AssignedToNavigation!)
                    .ThenInclude(u => u.UserProfiles)
                .Include(sr => sr.ResolvedByNavigation!)
                    .ThenInclude(u => u.UserProfiles)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(sr => sr.Status == status);
            }

            if (categoryId.HasValue)
            {
                query = query.Where(sr => sr.CategoryId == categoryId.Value);
            }

            return await query.OrderByDescending(sr => sr.CreatedAt).ToListAsync();
        }

        public async Task<List<SupportRequest>> GetByUserIdAsync(int userId)
        {
            return await _context.SupportRequests
                .Include(sr => sr.Category)
                .Include(sr => sr.AssignedToNavigation!)
                    .ThenInclude(u => u.UserProfiles)
                .Include(sr => sr.ResolvedByNavigation!)
                    .ThenInclude(u => u.UserProfiles)
                .Where(sr => sr.UserId == userId)
                .OrderByDescending(sr => sr.CreatedAt)
                .ToListAsync();
        }

        public async Task<SupportRequest?> GetByIdAsync(int requestId)
        {
            return await _context.SupportRequests
                .Include(sr => sr.User)
                    .ThenInclude(u => u.UserProfiles)
                .Include(sr => sr.Category)
                .Include(sr => sr.AssignedToNavigation!)
                    .ThenInclude(u => u.UserProfiles)
                .Include(sr => sr.ResolvedByNavigation!)
                    .ThenInclude(u => u.UserProfiles)
                .Include(sr => sr.SupportRequestComments)
                    .ThenInclude(c => c.User)
                        .ThenInclude(u => u.UserProfiles)
                .FirstOrDefaultAsync(sr => sr.RequestId == requestId);
        }

        public async Task<SupportRequest> CreateAsync(SupportRequest request)
        {
            request.CreatedAt = DateTime.Now;
            request.UpdatedAt = DateTime.Now;
            request.Status = "Pending";
            
            _context.SupportRequests.Add(request);
            await _context.SaveChangesAsync();
            return request;
        }

        public async Task<bool> UpdateAsync(SupportRequest request)
        {
            request.UpdatedAt = DateTime.Now;
            _context.SupportRequests.Update(request);
            return await SaveChangesAsync();
        }

        public async Task<List<SupportCategory>> GetCategoriesAsync()
        {
            return await _context.SupportCategories
                .Where(sc => sc.IsActive == true)
                .OrderBy(sc => sc.CategoryName)
                .ToListAsync();
        }

        public async Task<bool> AddCommentAsync(SupportRequestComment comment)
        {
            comment.CreatedAt = DateTime.Now;
            _context.SupportRequestComments.Add(comment);
            return await SaveChangesAsync();
        }

        public async Task<List<SupportRequestComment>> GetCommentsAsync(int requestId, bool includeInternal = false)
        {
            var query = _context.SupportRequestComments
                .Include(c => c.User)
                    .ThenInclude(u => u.UserProfiles)
                .Where(c => c.RequestId == requestId);

            if (!includeInternal)
            {
                query = query.Where(c => c.IsInternal != true);
            }

            return await query.OrderBy(c => c.CreatedAt).ToListAsync();
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }
    }
}
