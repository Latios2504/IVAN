using AutoMapper;
using ivan_api.DTOs.EventManage;
using ivan_api.Models;

namespace ivan_api.Mapping.Profiles
{
    public class EventProfile : Profile
    {
        public EventProfile()
        {
            // Entity → DTO
            CreateMap<Event, EventDto>()
                .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(src => src.Organization.OrganizationName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.StatusName))
                .ForMember(dest => dest.MinVolunteers, opt => opt.MapFrom(src => src.MinVolunteers ?? 1))
                .ForMember(dest => dest.CurrentVolunteers, opt => opt.MapFrom(src => src.CurrentVolunteers ?? 0))
                .ForMember(dest => dest.IsFeatured, opt => opt.MapFrom(src => src.IsFeatured ?? false))
                .ForMember(dest => dest.IsUrgent, opt => opt.MapFrom(src => src.IsUrgent ?? false))
                .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.Priority ?? 0))
                .ForMember(dest => dest.ViewCount, opt => opt.MapFrom(src => src.ViewCount ?? 0))
                .ForMember(dest => dest.RegistrationCount, opt => opt.MapFrom(src => src.RegistrationCount ?? 0))
                .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => src.Currency ?? "VND"))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt ?? DateTime.MinValue))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt ?? DateTime.MinValue));

            // CreateEventDto → Entity
            CreateMap<CreateEventDto, Event>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

            // UpdateEventDto → Entity (chỉ map những trường khác null)
            CreateMap<UpdateEventDto, Event>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // EventCategory → EventCategoryDto
            CreateMap<EventCategory, EventCategoryDto>();

            // EventStatus → EventStatusDto
            CreateMap<EventStatus, EventStatusDto>();
        }
    }
}
