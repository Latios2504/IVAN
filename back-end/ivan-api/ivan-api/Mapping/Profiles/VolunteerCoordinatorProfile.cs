using AutoMapper;
using ivan_api.DTOs.VolunteerCoordinator;
using ivan_api.Models;

namespace ivan_api.Mapping.Profiles;

public class VolunteerCoordinatorProfile : Profile
{
    public VolunteerCoordinatorProfile()
    {
        CreateMap<VolunteerCoordinator, VolunteerCoordinatorDto>()
            .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(src => src.Organization.OrganizationName))
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            .ForMember(dest => dest.Manager, opt => opt.MapFrom(src => src.Manager))
            .ForMember(dest => dest.CreatedByUser, opt => opt.MapFrom(src => src.CreatedByNavigation));

        CreateMap<User, UserInformationDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.UserProfiles.FirstOrDefault()!.FullName))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.UserProfiles.FirstOrDefault()!.PhoneNumber))
            .ForMember(dest => dest.Avatar, opt => opt.MapFrom(src => src.UserProfiles.FirstOrDefault()!.Avatar));

        CreateMap<CreateVolunteerCoordinatorDto, VolunteerCoordinator>()
            .ForMember(dest => dest.CoordinatorId, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

        CreateMap<UpdateVolunteerCoordinatorDto, VolunteerCoordinator>()
            .ForMember(dest => dest.CoordinatorId, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.OrganizationId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.RequestedBy, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
    }
}
