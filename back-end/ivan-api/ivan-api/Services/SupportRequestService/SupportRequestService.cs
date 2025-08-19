using AutoMapper;
using ivan_api.DTOs.SupportRequest;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ivan_api.Services.SupportRequestService
{
    public class SupportRequestService : ISupportRequestService
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMapper _mapper;
        public SupportRequestService(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<SupportRequestDto> AddSupportRequestAsync(AddSupportRequestDto dto, int userId)
        {
            var category = await _context.SupportCategories.FindAsync(dto.CategoryId);
            if (category == null)
                throw new Exception("Category not found");

            var supportRequest = new SupportRequest
            {
                UserId = userId,
                CategoryId = dto.CategoryId,
                Subject = dto.Subject,
                Description = dto.Description,
                Priority = dto.Priority,
                Status = "Open",
                AttachmentUrls = JsonSerializer.Serialize(dto.AttachmentUrls),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.SupportRequests.Add(supportRequest);
            await _context.SaveChangesAsync();

            return _mapper.Map<SupportRequestDto>(supportRequest);
        }
        public async Task<SupportRequestDto> GetSupportRequestForAdminAsync(int requestId )
        {
            var supportRequest = await _context.SupportRequests
                .Include(sr => sr.Category)
                .FirstOrDefaultAsync(sr => sr.RequestId == requestId);

            if (supportRequest == null)
                throw new Exception("Support request not found");

            return _mapper.Map<SupportRequestDto>(supportRequest);
        }
        public async Task<SupportRequestDto> GetSupportRequestForOrganizationAsync(int requestId, int userId)
        {
            var supportRequest = await _context.SupportRequests
                .Include(sr => sr.Category)
                .FirstOrDefaultAsync(sr => sr.RequestId == requestId && sr.UserId == userId);

            if (supportRequest == null)
                throw new Exception("Support request not found or you don't have permission to view");

            return _mapper.Map<SupportRequestDto>(supportRequest);
        }
        public async Task<List<SupportRequestDto>> ListSupportRequestsAsync(string status, string priority, int? categoryId, int page, int pageSize)
        {
            var query = _context.SupportRequests
                .Include(sr => sr.Category)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(sr => sr.Status == status);

            if (!string.IsNullOrEmpty(priority))
                query = query.Where(sr => sr.Priority == priority);

            if (categoryId.HasValue)
                query = query.Where(sr => sr.CategoryId == categoryId.Value);

            var supportRequests = await query
                .OrderByDescending(sr => sr.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return _mapper.Map<List<SupportRequestDto>>(supportRequests);
        }
        public async Task<SupportRequestDto> UpdateSupportRequestAsync(int requestId, UpdateSupportRequestDto dto, int adminId)
        {
            var supportRequest = await _context.SupportRequests
                .Include(sr => sr.Category)
                .FirstOrDefaultAsync(sr => sr.RequestId == requestId);

            if (supportRequest == null)
                throw new Exception("Support request not found");

            supportRequest.Status = dto.Status ?? supportRequest.Status;
            supportRequest.AssignedTo = dto.AssignedTo ?? supportRequest.AssignedTo;
            supportRequest.Resolution = dto.Resolution ?? supportRequest.Resolution;
            supportRequest.SatisfactionRating = dto.SatisfactionRating ?? supportRequest.SatisfactionRating;
            supportRequest.SatisfactionFeedback = dto.SatisfactionFeedback ?? supportRequest.SatisfactionFeedback;
            supportRequest.UpdatedAt = DateTime.UtcNow;

            if (dto.AssignedTo.HasValue && !supportRequest.AssignedDate.HasValue)
                supportRequest.AssignedDate = DateTime.UtcNow;

            if (dto.Resolution != null)
            {
                supportRequest.ResolvedBy = adminId;
                supportRequest.ResolvedDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return _mapper.Map<SupportRequestDto>(supportRequest);
        }
    }
}
