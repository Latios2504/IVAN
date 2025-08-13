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

            // Organization → PublicOrganizationDTO (for public API)
            CreateMap<Organization, PublicOrganizationDTO>()
                .ForMember(dest => dest.OrganizationId, opt => opt.MapFrom(src => src.OrganizationId))
                .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(src => src.OrganizationName))
                .ForMember(dest => dest.ShortName, opt => opt.MapFrom(src => src.ShortName))
                .ForMember(dest => dest.TypeName, opt => opt.MapFrom(src => src.Type.TypeName ?? string.Empty))
                .ForMember(dest => dest.EstablishedYear, opt => opt.MapFrom(src => src.EstablishedYear))
                .ForMember(dest => dest.Website, opt => opt.MapFrom(src => src.Website))
                .ForMember(dest => dest.FacebookPage, opt => opt.MapFrom(src => src.FacebookPage))
                .ForMember(dest => dest.LinkedInPage, opt => opt.MapFrom(src => src.LinkedInPage))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.ContactEmail))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.ContactPhone))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Mission, opt => opt.MapFrom(src => src.Mission))
                .ForMember(dest => dest.Vision, opt => opt.MapFrom(src => src.Vision))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.WardCommune, opt => opt.MapFrom(src => src.WardCommune))
                .ForMember(dest => dest.District, opt => opt.MapFrom(src => src.District))
                .ForMember(dest => dest.Province, opt => opt.MapFrom(src => src.Province))
                .ForMember(dest => dest.LogoUrl, opt => opt.MapFrom(src => src.LogoUrl))
                .ForMember(dest => dest.BannerUrl, opt => opt.MapFrom(src => src.BannerUrl))
                .ForMember(dest => dest.IsVerified, opt => opt.MapFrom(src => src.IsVerified ?? false))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating ?? 0))
                .ForMember(dest => dest.RatingCount, opt => opt.MapFrom(src => src.RatingCount ?? 0))
                .ForMember(dest => dest.TotalEvents, opt => opt.MapFrom(src => src.TotalEvents ?? 0))
                .ForMember(dest => dest.TotalVolunteers, opt => opt.MapFrom(src => src.TotalVolunteers ?? 0));
        }
    }
}