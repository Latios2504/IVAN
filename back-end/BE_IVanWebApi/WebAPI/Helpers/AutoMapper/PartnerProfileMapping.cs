using AutoMapper;
using WebAPI.Data.Entities;
using WebAPI.Models.PartnerProfiles;

namespace WebAPI.Helpers.AutoMapper
{
    public class PartnerProfileMapping : Profile
    {
        public PartnerProfileMapping()
        {
            CreateMap<PartnerProfile, PartnerProfileViewModel>();
            CreateMap<PartnerProfileViewModel, PartnerProfile>();

            CreateMap<PartnerProfileInputModel, PartnerProfileViewModel>();
            CreateMap<PartnerProfileViewModel, PartnerProfileInputModel>();

            CreateMap<PartnerProfile, PartnerProfileInputModel>();
            CreateMap<PartnerProfileInputModel, PartnerProfile>();
        }
    }
}
