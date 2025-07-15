using ivan_api.DTOs.OrganizationProfiles;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.OrganizationProfiles
{
    public interface IOrganizationProfileService
    {
        Task<bool> AddOrganizationProfile(OrganizationProfileInputModel organizationProfile);
        Task<bool> UpdateOrganizationProfile(OrganizationProfileViewModel organizationProfile);
        Task<IEnumerable<OrganizationProfileViewModel>> ListOrganizationProfile(OrganizationProfileFilterModel filter);
        Task<OrganizationProfileViewModel> GetOrganizationProfileById(int id);
        Task<PagedResultDto<OrganizationProfileViewModel>> GetList(int pageNumber, int pageSize);
    }
}
