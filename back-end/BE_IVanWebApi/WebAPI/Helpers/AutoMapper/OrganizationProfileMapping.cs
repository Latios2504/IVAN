using AutoMapper;
using WebAPI.Data.Entities;
//using WebAPI.Data_old.Entities;
using WebAPI.Models.OrganizationProfiles;

namespace WebAPI.Helpers.AutoMapper
{
    public class OrganizationProfileMapping : Profile
    {
        public OrganizationProfileMapping()
        {
            //CreateMap<OrganizationProfile, OrganizationProfileViewModel>();
            //CreateMap<OrganizationProfileViewModel, OrganizationProfile>();

            //CreateMap<OrganizationProfileInputModel, OrganizationProfileViewModel>();
            //CreateMap<OrganizationProfileViewModel, OrganizationProfileInputModel>();

            //CreateMap<OrganizationProfile, OrganizationProfileInputModel>();
            //CreateMap<OrganizationProfileInputModel, OrganizationProfile>();

            CreateMap<Organization, OrganizationProfileViewModel>();
            CreateMap<OrganizationProfileViewModel, Organization>();

            CreateMap<OrganizationProfileInputModel, OrganizationProfileViewModel>();
            CreateMap<OrganizationProfileViewModel, OrganizationProfileInputModel>();

            CreateMap<Organization, OrganizationProfileInputModel>();
            CreateMap<OrganizationProfileInputModel, Organization>();
        }
    }
}
