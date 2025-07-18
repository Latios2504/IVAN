using ivan_api.DTOs;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.Feedback;
using ivan_api.Models;

namespace ivan_api.Services.FeedbackServ
{
    public interface IFeedbackService
    {
        Task<PagedResultDto<FeedbackListDTO>> getListAllFeedback(int PageNumber, int PageSize);
        Task<PagedResultDto<FeedbackListDTO>> getListFeedbackByEvent(int eventId, int PageNumber, int PageSize);
        Task<PagedResultDto<FeedbackListDTO>> getListFeedbackByUser(int userId, int PageNumber, int PageSize);

        Task<FeedbackUpdateDTO> updateFeedback(FeedbackUpdateDTO dto); 
    }
}
