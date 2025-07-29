using ivan_api.Models;
using ivan_api.DTOs.OrganizationProfiles;
using ivan_api.DTOs.Common;

namespace ivan_api.Repository.OrganizationProfiles
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
        Task<Organization> GetOrganizationProfileById(int userId);
        Task<PagedResultDto<OrganizationProfileViewModel>> GetOrganizationProfilesAsync(int PageNumber, int PageSize);
        Task<int> GetLastId();
    }
}
