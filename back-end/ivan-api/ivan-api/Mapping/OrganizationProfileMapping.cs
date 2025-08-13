using AutoMapper;
using ivan_api.DTOs.OrganizationProfiles;
using ivan_api.Models;

namespace ivan_api.Mapping
{
    public class OrganizationProfileMapping : Profile
    {
        public OrganizationProfileMapping()
        {
            // OrganizationProfileCreateDto → Organization
            CreateMap<OrganizationProfileCreateDto, Organization>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Set in service
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore()) // Set in service
                .ForMember(dest => dest.OrganizationId, opt => opt.Ignore()); // Auto-generated

            // OrganizationProfileUpdateDto → Organization (for partial updates)
            CreateMap<OrganizationProfileUpdateDto, Organization>()
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore()) // Set in service
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Don't update
                .ForMember(dest => dest.OrganizationId, opt => opt.Ignore()) // Don't update
                .ForMember(dest => dest.UserId, opt => opt.Ignore()) // Don't update
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Organization → OrganizationProfileViewModel
            CreateMap<Organization, OrganizationProfileViewModel>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt ?? DateTime.MinValue))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt ?? DateTime.MinValue))
                .ForMember(dest => dest.IsVerified, opt => opt.MapFrom(src => src.IsVerified ?? false))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? true))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating ?? 0))
                .ForMember(dest => dest.RatingCount, opt => opt.MapFrom(src => src.RatingCount ?? 0))
                .ForMember(dest => dest.TotalEvents, opt => opt.MapFrom(src => src.TotalEvents ?? 0))
                .ForMember(dest => dest.TotalVolunteers, opt => opt.MapFrom(src => src.TotalVolunteers ?? 0));

            // OrganizationType → OrganizationTypeDto
            CreateMap<OrganizationType, OrganizationTypeDto>();
        }
    }
}