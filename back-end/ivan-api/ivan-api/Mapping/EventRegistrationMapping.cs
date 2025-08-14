using AutoMapper;
using ivan_api.DTOs.EventRegistration;
using ivan_api.Models;

namespace ivan_api.Mapping
{
    public class EventRegistrationMapping : Profile
    {
        public EventRegistrationMapping()
        {
            // RegistrationRequestDTO → EventRegistration
            CreateMap<RegistrationRequestDTO, EventRegistration>()
                .ForMember(dest => dest.RegistrationId, opt => opt.Ignore())
                .ForMember(dest => dest.EventId, opt => opt.Ignore())
                .ForMember(dest => dest.VolunteerId, opt => opt.Ignore())
                .ForMember(dest => dest.StatusId, opt => opt.Ignore())
                .ForMember(dest => dest.ApplicationDate, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            // EventRegistration → RegistrationDTO
            CreateMap<EventRegistration, RegistrationDTO>()
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status != null ? src.Status.StatusName : string.Empty))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => GetVolunteerFullName(src)));

            // EventRegistration → RegistrationStatusDTO
            CreateMap<EventRegistration, RegistrationStatusDTO>()
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status != null ? src.Status.StatusName : string.Empty))
                .ForMember(dest => dest.StatusColor, opt => opt.MapFrom(src => src.Status != null ? src.Status.Color : null));
        }

        private static string? GetVolunteerFullName(EventRegistration registration)
        {
            if (registration?.Volunteer?.User?.UserProfiles == null || !registration.Volunteer.User.UserProfiles.Any())
                return null;

            var profile = registration.Volunteer.User.UserProfiles.First();
            return $"{profile.FirstName} {profile.LastName}".Trim();
        }
    }
}
