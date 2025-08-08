using AutoMapper;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.SupportRequest;
using ivan_api.Models;
using ivan_api.Repository.SupportRequestRepo;

namespace ivan_api.Services.SupportRequestServ
{
    public class SupportRequestService : ISupportRequestService
    {
        private readonly ISupportRequestRepository _repository;
        private readonly IMapper _mapper;

        public SupportRequestService(ISupportRequestRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<ApiResponseDTO<List<SupportRequestResponseDTO>>> GetAllRequestsAsync(string? status = null, int? categoryId = null)
        {
            try
            {
                var requests = await _repository.GetAllAsync(status, categoryId);
                var response = requests.Select(MapToResponseDTO).ToList();
                
                return new ApiResponseDTO<List<SupportRequestResponseDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách yêu cầu hỗ trợ thành công",
                    Data = response
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<SupportRequestResponseDTO>>
                {
                    Success = false,
                    Message = "Lỗi khi lấy danh sách yêu cầu hỗ trợ",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<List<SupportRequestResponseDTO>>> GetUserRequestsAsync(int userId)
        {
            try
            {
                var requests = await _repository.GetByUserIdAsync(userId);
                var response = requests.Select(MapToResponseDTO).ToList();
                
                return new ApiResponseDTO<List<SupportRequestResponseDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách yêu cầu của người dùng thành công",
                    Data = response
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<SupportRequestResponseDTO>>
                {
                    Success = false,
                    Message = "Lỗi khi lấy danh sách yêu cầu của người dùng",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<SupportRequestResponseDTO>> GetRequestByIdAsync(int requestId)
        {
            try
            {
                var request = await _repository.GetByIdAsync(requestId);
                if (request == null)
                {
                    return new ApiResponseDTO<SupportRequestResponseDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy yêu cầu hỗ trợ"
                    };
                }

                var response = MapToResponseDTO(request);
                
                return new ApiResponseDTO<SupportRequestResponseDTO>
                {
                    Success = true,
                    Message = "Lấy thông tin yêu cầu hỗ trợ thành công",
                    Data = response
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<SupportRequestResponseDTO>
                {
                    Success = false,
                    Message = "Lỗi khi lấy thông tin yêu cầu hỗ trợ",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<SupportRequestResponseDTO>> CreateRequestAsync(int userId, SupportRequestCreateDTO dto)
        {
            try
            {
                var request = new SupportRequest
                {
                    UserId = userId,
                    CategoryId = dto.CategoryId,
                    Subject = dto.Subject,
                    Description = dto.Description,
                    Priority = dto.Priority,
                    AttachmentUrls = dto.AttachmentUrls != null && dto.AttachmentUrls.Any() 
                        ? string.Join(",", dto.AttachmentUrls) 
                        : null
                };

                var createdRequest = await _repository.CreateAsync(request);
                
                // Get full request with includes
                var fullRequest = await _repository.GetByIdAsync(createdRequest.RequestId);
                var response = MapToResponseDTO(fullRequest!);
                
                return new ApiResponseDTO<SupportRequestResponseDTO>
                {
                    Success = true,
                    Message = "Tạo yêu cầu hỗ trợ thành công",
                    Data = response
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<SupportRequestResponseDTO>
                {
                    Success = false,
                    Message = "Lỗi khi tạo yêu cầu hỗ trợ",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<bool>> UpdateRequestAsync(int requestId, SupportRequestUpdateDTO dto, int adminUserId)
        {
            try
            {
                var request = await _repository.GetByIdAsync(requestId);
                if (request == null)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Không tìm thấy yêu cầu hỗ trợ"
                    };
                }

                // Update fields if provided
                if (!string.IsNullOrEmpty(dto.Status))
                {
                    request.Status = dto.Status;
                    if (dto.Status == "Resolved" && !request.ResolvedDate.HasValue)
                    {
                        request.ResolvedDate = DateTime.Now;
                        request.ResolvedBy = adminUserId;
                    }
                }

                if (dto.AssignedTo.HasValue)
                {
                    request.AssignedTo = dto.AssignedTo.Value;
                    request.AssignedDate = DateTime.Now;
                }

                if (!string.IsNullOrEmpty(dto.Resolution))
                {
                    request.Resolution = dto.Resolution;
                }

                if (!string.IsNullOrEmpty(dto.Priority))
                {
                    request.Priority = dto.Priority;
                }

                var success = await _repository.UpdateAsync(request);
                
                return new ApiResponseDTO<bool>
                {
                    Success = success,
                    Message = success ? "Cập nhật yêu cầu hỗ trợ thành công" : "Cập nhật yêu cầu hỗ trợ thất bại",
                    Data = success
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "Lỗi khi cập nhật yêu cầu hỗ trợ",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<List<SupportCategoryDTO>>> GetCategoriesAsync()
        {
            try
            {
                var categories = await _repository.GetCategoriesAsync();
                var response = _mapper.Map<List<SupportCategoryDTO>>(categories);
                
                return new ApiResponseDTO<List<SupportCategoryDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách danh mục thành công",
                    Data = response
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<SupportCategoryDTO>>
                {
                    Success = false,
                    Message = "Lỗi khi lấy danh sách danh mục",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<bool>> AddCommentAsync(int requestId, string comment, int userId, bool isInternal = false)
        {
            try
            {
                var requestExists = await _repository.GetByIdAsync(requestId);
                if (requestExists == null)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Không tìm thấy yêu cầu hỗ trợ"
                    };
                }

                var commentEntity = new SupportRequestComment
                {
                    RequestId = requestId,
                    UserId = userId,
                    Comment = comment,
                    IsInternal = isInternal
                };

                var success = await _repository.AddCommentAsync(commentEntity);
                
                return new ApiResponseDTO<bool>
                {
                    Success = success,
                    Message = success ? "Thêm bình luận thành công" : "Thêm bình luận thất bại",
                    Data = success
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "Lỗi khi thêm bình luận",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        private SupportRequestResponseDTO MapToResponseDTO(SupportRequest request)
        {
            return new SupportRequestResponseDTO
            {
                RequestId = request.RequestId,
                UserId = request.UserId,
                UserName = request.User?.UserProfiles?.FirstOrDefault()?.FullName ?? request.User?.Email ?? "",
                UserEmail = request.User?.Email ?? "",
                CategoryId = request.CategoryId,
                CategoryName = request.Category?.CategoryName ?? "",
                Subject = request.Subject,
                Description = request.Description,
                Priority = request.Priority ?? "Medium",
                Status = request.Status ?? "Open",
                AssignedTo = request.AssignedTo,
                AssignedToName = request.AssignedToNavigation?.UserProfiles?.FirstOrDefault()?.FullName ?? 
                               request.AssignedToNavigation?.Email,
                AssignedDate = request.AssignedDate,
                Resolution = request.Resolution,
                ResolvedBy = request.ResolvedBy,
                ResolvedByName = request.ResolvedByNavigation?.UserProfiles?.FirstOrDefault()?.FullName ?? 
                               request.ResolvedByNavigation?.Email,
                ResolvedDate = request.ResolvedDate,
                SatisfactionRating = request.SatisfactionRating,
                SatisfactionFeedback = request.SatisfactionFeedback,
                AttachmentUrls = !string.IsNullOrEmpty(request.AttachmentUrls) 
                    ? request.AttachmentUrls.Split(new char[] { ',' }).ToList() 
                    : new List<string>(),
                CreatedAt = request.CreatedAt,
                UpdatedAt = request.UpdatedAt,
                Comments = request.SupportRequestComments?.Select(c => new SupportRequestCommentDTO
                {
                    CommentId = c.CommentId,
                    UserId = c.UserId,
                    UserName = c.User?.UserProfiles?.FirstOrDefault()?.FullName ?? c.User?.Email ?? "",
                    Comment = c.Comment,
                    IsInternal = c.IsInternal ?? false,
                    AttachmentUrls = !string.IsNullOrEmpty(c.AttachmentUrls) 
                        ? c.AttachmentUrls.Split(new char[] { ',' }).ToList() 
                        : new List<string>(),
                    CreatedAt = c.CreatedAt
                }).ToList()
            };
        }
    }
}
