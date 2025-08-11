using ivan_api.DTOs.Feedback;
using ivan_api.Models;

namespace ivan_api.Repository.FeedbackRepo
{
    public interface IFeedbackRepository
    {
        Task<List<Feedback>> getListAllFeedback();
        Task<List<Feedback>> getListFeedbackByEvent(int eventId);
        Task<List<Feedback>> getListFeedbackByUser(int userId);

        Task<Feedback> updateFeedback(FeedbackUpdateDTO dto);
    }
}
