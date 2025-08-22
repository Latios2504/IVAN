using AutoMapper;
using ivan_api.DTOs.EventManage;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Repository.EventRepo;
using ivan_api.Repository.SupportRequestRepo;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.EventServ
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly VolunteerManagementSystemContext _context;
        private readonly ISupportRequestRepository _supportRequestRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<EventService> _logger;

        public EventService(
            IEventRepository eventRepository,
            ISupportRequestRepository supportRequestRepository,
            IMapper mapper,
            ILogger<EventService> logger,
            VolunteerManagementSystemContext context)
        {
            _eventRepository = eventRepository;
            _supportRequestRepository = supportRequestRepository;
            _mapper = mapper;
            _logger = logger;
            _context = context;
        }

        public async Task<int> CreateAsync(CreateEventDto dto)
        {
            try
            {
                var eventEntity = _mapper.Map<Event>(dto);
                eventEntity.CreatedAt = DateTime.UtcNow;
                eventEntity.UpdatedAt = DateTime.UtcNow;
                eventEntity.IsActive = true;

                await _eventRepository.AddAsync(eventEntity);
                return eventEntity.EventId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating event");
                throw;
            }
        }

        public async Task<int> CreateEventFromSupportRequestAsync(CreateEventFromSupportRequestDto dto, int organizationId)
        {
            try
            {
                // Validate support request exists and belongs to organization
                var supportRequest = await _supportRequestRepository.GetByIdAsync(dto.SupportRequestId);
                if (supportRequest == null)
                {
                    throw new ArgumentException($"Support request with ID {dto.SupportRequestId} not found");
                }

                // Create event entity from DTO
                var eventEntity = new Event
                {
                    OrganizationId = organizationId,
                    EventName = dto.EventName,
                    CategoryId = dto.CategoryId,
                    StatusId = dto.StatusId,
                    ShortDescription = dto.ShortDescription,
                    Description = dto.Description,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    RegistrationStartDate = dto.RegistrationStartDate,
                    RegistrationEndDate = dto.RegistrationEndDate,
                    Location = dto.Location,
                    DetailedAddress = dto.DetailedAddress,
                    Province = dto.Province,
                    District = dto.District,
                    MaxVolunteers = dto.MaxVolunteers,
                    MinVolunteers = dto.MinVolunteers,
                    RequiredSkills = dto.RequiredSkills,
                    AgeRequirement = dto.AgeRequirement,
                    GenderRequirement = dto.GenderRequirement,
                    Requirements = dto.Requirements,
                    Benefits = dto.Benefits,
                    ContactPerson = dto.ContactPerson,
                    ContactPhone = dto.ContactPhone,
                    ContactEmail = dto.ContactEmail,
                    BannerImageUrl = dto.BannerImageUrl,
                    GalleryImages = dto.GalleryImages,
                    IsFeatured = dto.IsFeatured,
                    IsUrgent = dto.IsUrgent,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                await _eventRepository.AddAsync(eventEntity);

                // If linking is enabled, update support request status or add reference
                if (dto.LinkToSupportRequest)
                {
                    // Add a comment to the support request indicating event was created
                    var comment = new SupportRequestComment
                    {
                        RequestId = dto.SupportRequestId,
                        UserId = 0, // System comment
                        Comment = $"Event '{dto.EventName}' has been created from this support request. Event ID: {eventEntity.EventId}",
                        IsInternal = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    await _supportRequestRepository.AddCommentAsync(comment);
                }

                _logger.LogInformation("Event {EventId} created from support request {SupportRequestId}", eventEntity.EventId, dto.SupportRequestId);
                return eventEntity.EventId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating event from support request {SupportRequestId}", dto.SupportRequestId);
                throw;
            }
        }

        public async Task<bool> UpdateAsync(int id, UpdateEventDto dto)
        {
            try
            {
                var existingEvent = await _eventRepository.GetByIdAsync(id);
                if (existingEvent == null) return false;

                _mapper.Map(dto, existingEvent);
                existingEvent.UpdatedAt = DateTime.UtcNow;

                return await _eventRepository.UpdateAsync(existingEvent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating event {EventId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id, int organizationId)
        {
            return await _eventRepository.DeleteAsync(id, organizationId);
        }

        public async Task<PagedResultDto<EventDto>> GetEventsAsync(EventFilterDto filters)
        {
            return await _eventRepository.GetEventsAsync(filters);
        }

        public async Task<EventDto?> GetEventAsync(int id)
        {
            var eventEntity = await _eventRepository.GetByIdAsync(id);
            return eventEntity != null ? _mapper.Map<EventDto>(eventEntity) : null;
        }

        public async Task<IEnumerable<EventCategoryDto>> GetCategoriesAsync()
        {
            var categories = await _eventRepository.GetCategoriesAsync();
            return _mapper.Map<IEnumerable<EventCategoryDto>>(categories);
        }

        public async Task<IEnumerable<EventStatusDto>> GetStatusesAsync()
        {
            var statuses = await _eventRepository.GetStatusesAsync();
            return _mapper.Map<IEnumerable<EventStatusDto>>(statuses);
        }

        public async Task<Event> GetEventNotDTO(int eventID)
        {
            return await _context.Events
                .Include(e => e.Organization)
                .Include(e => e.Category)
                .Include(e => e.Status)
                .FirstOrDefaultAsync(e => e.EventId == eventID);
        }
    }
}