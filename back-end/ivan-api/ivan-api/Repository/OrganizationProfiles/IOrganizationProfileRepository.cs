using ivan_api.Models;
using ivan_api.DTOs.OrganizationProfiles;
using ivan_api.DTOs.Common;

namespace ivan_api.Repository.OrganizationProfiles
{
    public interface IOrganizationProfileRepository
    {
        Task<bool> AddOrganizationProfile(Organization organizationProfile);
        Task<bool> UpdateOrganizationProfile(Organization organizationProfile);
        Task<Organization?> GetOrganizationProfileById(int userId);
        Task<PagedResultDto<OrganizationProfileViewModel>> GetOrganizationProfilesAsync(int PageNumber, int PageSize);
        Task<PagedResultDto<PublicOrganizationDTO>> GetPublicOrganizationsAsync(PublicOrganizationFiltersDTO filters);
        Task<PublicOrganizationDTO?> GetPublicOrganizationAsync(int id);
        Task<int> GetLastId();
        Task<Organization?> GetOrganizationByOrgIdAsync(int id);
        // Organization types lookup methods
        Task<IEnumerable<OrganizationType>> GetAllOrganizationTypesAsync();
    }
}
