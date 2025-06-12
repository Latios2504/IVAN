using WebAPI.Data.Entities;
using WebAPI.Models.OrganizationProfiles;

namespace WebAPI.Repository.OrganizationProfiles
{
    public interface IOrganizationProfileRepository
    {
        //bool AddOrganizationProfile(OrganizationProfile organizationProfile);
        //bool UpdateOrganizationProfile(OrganizationProfile organizationProfile);
        //IEnumerable<OrganizationProfile> ListOrganizationProfile();
        //OrganizationProfile GetOrganizationProfile(int Id);

        Task<bool> AddOrganizationProfile(Organization organizationProfile);
        Task<bool> UpdateOrganizationProfile(Organization organizationProfile);
        Task<IEnumerable<Organization>> ListOrganizationProfile(OrganizationProfileFilterModel filter);
        Task<Organization> GetOrganizationProfileById(int id);
    }
}
