using AutoMapper;
using ivan_api.DTOs.PartnerCollaboration;
using ivan_api.Models;

namespace ivan_api.Mapping
{
    public class PartnerCollaborationProfile : Profile
    {
        public PartnerCollaborationProfile()
        {
            CreateMap<PartnerCollaboration, CollaborationViewList>()
                .ForMember(d => d.OrganizationName, o => o.MapFrom(s => s.Organization.OrganizationName))
                .ForMember(d => d.PartnerName, o => o.MapFrom(s => s.Partner.CompanyName))
                .ForMember(d => d.TypeName, o => o.MapFrom(s => s.Type.TypeName));

            CreateMap<PartnerCollaboration, CollaborationDetailDto>()
                .ForMember(d => d.OrganizationName, o => o.MapFrom(s => s.Organization.OrganizationName))
                .ForMember(d => d.PartnerName, o => o.MapFrom(s => s.Partner.CompanyName))
                .ForMember(d => d.TypeName, o => o.MapFrom(s => s.Type.TypeName));

            CreateMap<PartnerCollaborationCreateDto, PartnerCollaboration>();
        }
    }
}
