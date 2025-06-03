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

        Task<bool> AddOrganizationProfile(OrganizationProfile organizationProfile);
        Task<bool> UpdateOrganizationProfile(OrganizationProfile organizationProfile);
        Task<IEnumerable<OrganizationProfile>> ListOrganizationProfile(OrganizationProfileFilterModel filter);
        Task<OrganizationProfile> GetOrganizationProfileById(int id);
    }
}
