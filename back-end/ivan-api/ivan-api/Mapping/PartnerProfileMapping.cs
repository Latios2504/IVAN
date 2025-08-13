using AutoMapper;
using ivan_api.DTOs.PartnerProfiles;
using ivan_api.Models;

namespace ivan_api.Mapping
{
    public class PartnerProfileMapping : Profile
    {
        public PartnerProfileMapping()
        {
            // PartnerProfileCreateDto → Partner
            CreateMap<PartnerProfileCreateDto, Partner>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Set in service
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore()) // Set in service
                .ForMember(dest => dest.PartnerId, opt => opt.Ignore()) // Auto-generated
                .ForMember(dest => dest.IsVerified, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.RatingCount, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.TotalCollaborations, opt => opt.MapFrom(src => 0));

            // PartnerProfileUpdateDto → Partner (for partial updates)
            CreateMap<PartnerProfileUpdateDto, Partner>()
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore()) // Set in service
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Don't update
                .ForMember(dest => dest.PartnerId, opt => opt.Ignore()) // Don't update
                .ForMember(dest => dest.UserId, opt => opt.Ignore()) // Don't update
                .ForMember(dest => dest.IsVerified, opt => opt.Ignore()) // Don't update from DTO
                .ForMember(dest => dest.VerifiedAt, opt => opt.Ignore()) // Don't update from DTO
                .ForMember(dest => dest.VerifiedBy, opt => opt.Ignore()) // Don't update from DTO
                .ForMember(dest => dest.Rating, opt => opt.Ignore()) // Don't update from DTO
                .ForMember(dest => dest.RatingCount, opt => opt.Ignore()) // Don't update from DTO
                .ForMember(dest => dest.TotalCollaborations, opt => opt.Ignore()) // Don't update from DTO
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Partner → PartnerProfileViewModel
            CreateMap<Partner, PartnerProfileViewModel>()
                .ForMember(dest => dest.IsVerified, opt => opt.MapFrom(src => src.IsVerified ?? false))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating ?? 0))
                .ForMember(dest => dest.RatingCount, opt => opt.MapFrom(src => src.RatingCount ?? 0))
                .ForMember(dest => dest.TotalCollaborations, opt => opt.MapFrom(src => src.TotalCollaborations ?? 0))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? true))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt ?? DateTime.MinValue))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt ?? DateTime.MinValue));

            // PartnerIndustry → PartnerIndustryDto
            CreateMap<PartnerIndustry, PartnerIndustryDto>();
        }
    }
}
