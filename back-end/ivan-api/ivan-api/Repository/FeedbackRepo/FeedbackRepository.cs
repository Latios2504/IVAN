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
    }
}
