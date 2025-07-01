using WebAPI.Data.Entities;
using WebAPI.Models.OrganizationProfiles;

namespace WebAPI.Service.OrganizationProfiles
{
    public interface IOrganizationProfileService
    {
        Task<bool> AddOrganizationProfile(OrganizationProfileInputModel organizationProfile);
        Task<bool> UpdateOrganizationProfile(OrganizationProfileViewModel organizationProfile);
        Task<IEnumerable<OrganizationProfileViewModel>> ListOrganizationProfile(OrganizationProfileFilterModel filter);
        Task<OrganizationProfileViewModel> GetOrganizationProfileById(int id);
    }
}
