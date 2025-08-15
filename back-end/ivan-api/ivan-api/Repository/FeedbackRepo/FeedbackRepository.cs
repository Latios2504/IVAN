using AutoMapper;
using DocumentFormat.OpenXml.Spreadsheet;
using ivan_api.DTOs.Feedback;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Repository.FeedbackRepo
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        public FeedbackRepository(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<List<Feedback>> getListFeedbackByUser(int userId)
        {
            var feedbacks = _context.Feedbacks.Where(x => x.UserId == userId)
                .Include(f => f.Category)
                .ToListAsync();

            return await feedbacks;
        }

        public async Task<List<Feedback>> getListAllFeedback()
        {
            var feedbacks = _context.Feedbacks
                .Include(f => f.Category)
                .ToListAsync();

            return await feedbacks;
        }

        public async Task<List<Feedback>> getListFeedbackByEvent(int eventId)
        {
            var feedbacks = _context.Feedbacks.Where(x => x.EventId == eventId)
                .Include(f => f.Category)
                .ToListAsync();

            return await feedbacks;
        }

        public async Task<Feedback> updateFeedback(FeedbackUpdateDTO dto)
        {
            var feedback = await _context.Feedbacks.FirstOrDefaultAsync(f => f.FeedbackId == dto.idFeedback);
            if (feedback == null)
            {
                throw new KeyNotFoundException("Feedback not found");
            }
            feedback.Content = dto.Content;
            await _context.SaveChangesAsync();
            return feedback;
        }

        public async Task<Feedback> addFeedback(FeedbackCreateDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            // Kiểm tra event tồn tại
            var eventExists = await _context.Events.AnyAsync(e => e.EventId == dto.EventId);
            if (!eventExists)
                throw new KeyNotFoundException($"Event with ID {dto.EventId} not found");

            // Kiểm tra category tồn tại
            var categoryExists = await _context.FeedbackCategories.AnyAsync(c => c.CategoryId == dto.CategoryId);
            if (!categoryExists)
                throw new KeyNotFoundException($"Feedback category with ID {dto.CategoryId} not found");

            var feedback = new Feedback
            {
                EventId = dto.EventId,
                UserId = dto.UserId,
                CategoryId = dto.CategoryId,
                Subject = dto.Subject,
                Content = dto.Content,
                Rating = dto.Rating,
                IsAnonymous = dto.IsAnonymous,
                IsPublic = dto.IsPublic,
                AttachmentUrls = dto.AttachmentUrls,
                Status = "Pending",
                IsVerified = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            // Load thêm Category để trả về đầy đủ
            await _context.Entry(feedback).Reference(f => f.Category).LoadAsync();

            return feedback;
        }

        public async Task<bool> deleteFeedback(int feedbackId, int userId, bool isAdmin)
        {
            var feedback = await _context.Feedbacks
                .FirstOrDefaultAsync(f => f.FeedbackId == feedbackId);

            if (feedback == null)
                throw new KeyNotFoundException($"Feedback with ID {feedbackId} not found");

            // Nếu không phải Admin thì chỉ được xóa feedback của mình
            if (!isAdmin && feedback.UserId != userId)
                throw new UnauthorizedAccessException("You are not authorized to delete this feedback");

            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
