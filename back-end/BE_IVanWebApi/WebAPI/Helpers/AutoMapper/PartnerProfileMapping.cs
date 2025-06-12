using AutoMapper;
using WebAPI.Data.Entities;
using WebAPI.Models.PartnerProfiles;

namespace WebAPI.Helpers.AutoMapper
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
