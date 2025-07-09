using AutoMapper;
using ivan_api.Models;
using ivan_api.DTOs.PartnerProfiles;

namespace ivan_api.Mapping
{
    public class PartnerProfileMapping : Profile
    {
        public PartnerProfileMapping()
        {
            CreateMap<Partner, PartnerProfileViewModel>();
            CreateMap<PartnerProfileViewModel, Partner>();

            CreateMap<PartnerProfileInputModel, PartnerProfileViewModel>();
            CreateMap<PartnerProfileViewModel, PartnerProfileInputModel>();

            CreateMap<Partner, PartnerProfileInputModel>();
            CreateMap<PartnerProfileInputModel, Partner>();
        }
    }
}
