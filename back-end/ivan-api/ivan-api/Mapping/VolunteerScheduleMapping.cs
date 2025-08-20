using AutoMapper;
using ivan_api.DTOs.VolunteerSchedule;
using ivan_api.Models;

namespace ivan_api.Mapping
{
    public class VolunteerScheduleMapping : Profile
    {
        public VolunteerScheduleMapping()
        {
            // VolunteerSchedule → VolunteerScheduleDTO
            CreateMap<VolunteerSchedule, VolunteerScheduleDTO>()
                .ForMember(dest => dest.VolunteerName, opt => opt.MapFrom(src => 
                    src.Volunteer != null && src.Volunteer.User != null && src.Volunteer.User.UserProfiles.Any() 
                        ? $"{src.Volunteer.User.UserProfiles.First().FirstName} {src.Volunteer.User.UserProfiles.First().LastName}".Trim()
                        : "Unknown"))
                .ForMember(dest => dest.VolunteerEmail, opt => opt.MapFrom(src => 
                    src.Volunteer != null && src.Volunteer.User != null 
                        ? src.Volunteer.User.Email 
                        : string.Empty))
                .ForMember(dest => dest.VolunteerPhone, opt => opt.MapFrom(src => 
                    src.Volunteer != null && src.Volunteer.User != null && src.Volunteer.User.UserProfiles.Any() 
                        ? src.Volunteer.User.UserProfiles.First().PhoneNumber 
                        : null))
                .ForMember(dest => dest.EventName, opt => opt.MapFrom(src => 
                    src.Event != null ? src.Event.EventName : null))
                .ForMember(dest => dest.EventLocation, opt => opt.MapFrom(src => 
                    src.Event != null ? src.Event.Location : null))
                .ForMember(dest => dest.CreatedByName, opt => opt.MapFrom(src => 
                    src.CreatedByNavigation != null && src.CreatedByNavigation.UserProfiles.Any() 
                        ? $"{src.CreatedByNavigation.UserProfiles.First().FirstName} {src.CreatedByNavigation.UserProfiles.First().LastName}".Trim()
                        : "System"));

            // VolunteerScheduleRequestDTO → VolunteerSchedule
            CreateMap<VolunteerScheduleRequestDTO, VolunteerSchedule>()
                .ForMember(dest => dest.ScheduleId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.Volunteer, opt => opt.Ignore())
                .ForMember(dest => dest.Event, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedByNavigation, opt => opt.Ignore());
        }
    }
}