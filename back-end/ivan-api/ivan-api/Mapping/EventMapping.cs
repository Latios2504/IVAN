using AutoMapper;
using ivan_api.DTOs.EventManage;
using ivan_api.Models;

namespace ivan_api.Mapping
{
    public class EventMapping : Profile
    {
        public EventMapping()
        {
            // CreateEventDto → Event
            CreateMap<CreateEventDto, Event>()
                .ForMember(dest => dest.EventId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore());

            // UpdateEventDto → Event (for partial updates)
            CreateMap<UpdateEventDto, Event>()
                .ForMember(dest => dest.EventId, opt => opt.Ignore())
                .ForMember(dest => dest.OrganizationId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore())
                .ForMember(dest => dest.StatusId, opt => opt.Ignore()) // Don't update StatusId through general update
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Event → EventDto
            CreateMap<Event, EventDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.CategoryName : string.Empty))
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status != null ? src.Status.StatusName : string.Empty))
                .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(src => src.Organization != null ? src.Organization.OrganizationName : string.Empty))
                .ForMember(dest => dest.MinVolunteers, opt => opt.MapFrom(src => src.MinVolunteers ?? 1))
                .ForMember(dest => dest.VolunteersRegistered, opt => opt.MapFrom(s => s.CurrentVolunteers ?? 0))
                .ForMember(dest => dest.IsFeatured, opt => opt.MapFrom(src => src.IsFeatured ?? false))
                .ForMember(dest => dest.IsUrgent, opt => opt.MapFrom(src => src.IsUrgent ?? false))
                .ForMember(d => d.CurrentVolunteers, o => o.MapFrom(s => s.CurrentVolunteers ?? 0))
                .ForMember(d => d.RegistrationCount, o => o.MapFrom(s => s.RegistrationCount ?? 0))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt ?? DateTime.MinValue))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt ?? DateTime.MinValue));

            // EventCategory → EventCategoryDto
            CreateMap<EventCategory, EventCategoryDto>()
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? false));

            // EventStatus → EventStatusDto
            CreateMap<EventStatus, EventStatusDto>()
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? false));
        }
    }
}
