using AutoMapper;
using WebAPI.Data.Entities;
using WebAPI.Models.OrganizationProfiles;

namespace WebAPI.Helpers.AutoMapper
{
    public class OrganizationProfileMapping : Profile
    {
        public OrganizationProfileMapping()
        {
            CreateMap<OrganizationProfile, OrganizationProfileViewModel>();
            CreateMap<OrganizationProfileViewModel, OrganizationProfile>();

            CreateMap<OrganizationProfileInputModel, OrganizationProfileViewModel>();
            CreateMap<OrganizationProfileViewModel, OrganizationProfileInputModel>();

            CreateMap<OrganizationProfile, OrganizationProfileInputModel>();
            CreateMap<OrganizationProfileInputModel, OrganizationProfile>();
        }
    }
}
