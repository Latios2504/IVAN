using AutoMapper;
using ivan_api.Models;
using ivan_api.DTOs.OrganizationProfiles;

namespace ivan_api.Mapping
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

            CreateMap<Organization, OrganizationProfileUpdateModel>();
            CreateMap<OrganizationProfileUpdateModel, Organization>();

            CreateMap<OrganizationProfileViewModel, OrganizationProfileUpdateModel>();
            CreateMap<OrganizationProfileUpdateModel, OrganizationProfileViewModel>();

            CreateMap<OrganizationProfileInputModel, OrganizationProfileUpdateModel>();
            CreateMap<OrganizationProfileUpdateModel, OrganizationProfileInputModel>();
        }
    }
}
