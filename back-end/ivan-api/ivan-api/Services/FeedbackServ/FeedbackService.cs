using AutoMapper;
using ivan_api.DTOs;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.Feedback;
using ivan_api.Repository.FeedbackRepo;

namespace ivan_api.Services.FeedbackServ
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IFeedbackRepository _repo;
        private readonly IMapper _mapper;
        public FeedbackService(IFeedbackRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }
        public async Task<PagedResultDto<FeedbackListDTO>> getListAllFeedback(int PageNumber, int PageSize)
        {
            var feedbacks = await _repo.getListAllFeedback();
            var listFeedbackDTO = _mapper.Map<List<FeedbackListDTO>>(feedbacks);

            var totalCount = listFeedbackDTO.Count();
            var pagedFeedbacks = listFeedbackDTO
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ToList();

            return new PagedResultDto<FeedbackListDTO>
            {
                Items = pagedFeedbacks,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };

        }

        public async Task<PagedResultDto<FeedbackListDTO>> getListFeedbackByEvent(int eventId, int PageNumber, int PageSize)
        {
            var feedbacks = await _repo.getListFeedbackByEvent(eventId);
            var listFeedbackDTO = _mapper.Map<List<FeedbackListDTO>>(feedbacks);

            var totalCount = listFeedbackDTO.Count();
            var pagedFeedbacks = listFeedbackDTO
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ToList();

            return new PagedResultDto<FeedbackListDTO>
            {
                Items = pagedFeedbacks,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }

        public async Task<PagedResultDto<FeedbackListDTO>> getListFeedbackByUser(int userId, int PageNumber, int PageSize)
        {
            var feedbacks = await _repo.getListFeedbackByUser(userId);
            var listFeedbackDTO = _mapper.Map<List<FeedbackListDTO>>(feedbacks);

            var totalCount = listFeedbackDTO.Count();
            var pagedFeedbacks = listFeedbackDTO
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ToList();

            return new PagedResultDto<FeedbackListDTO>
            {
                Items = pagedFeedbacks,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }

        public async Task<FeedbackUpdateDTO> updateFeedback(FeedbackUpdateDTO dto)
        {
            try
            {
                var feedback = await _repo.updateFeedback(dto);
                if (feedback == null)
                {
                    throw new KeyNotFoundException("Feedback not found");
                }
                return new FeedbackUpdateDTO
                {
                    idFeedback = feedback.FeedbackId,
                    Content = feedback.Content,
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Feedback not found", ex);
            }
        }
    }
}
