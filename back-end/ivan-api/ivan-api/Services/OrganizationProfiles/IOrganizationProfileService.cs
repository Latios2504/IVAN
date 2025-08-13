using ivan_api.DTOs.OrganizationProfiles;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.OrganizationProfiles
{
    public interface IOrganizationProfileService
    {
        Task<bool> AddOrganizationProfile(OrganizationProfileCreateDto organizationProfile);
        Task<bool> UpdateOrganizationProfile(OrganizationProfileUpdateDto organizationProfile, int orgId);
        Task<OrganizationProfileViewModel> GetOrganizationProfileById(int userId);
        Task<PagedResultDto<OrganizationProfileViewModel>> GetList(int pageNumber, int pageSize);
        Task<int> GetLastId();
        
        // Public content methods
        Task<PagedResultDto<PublicOrganizationDTO>> GetPublicOrganizationsAsync(PublicOrganizationFiltersDTO filters);
        Task<PublicOrganizationDTO?> GetPublicOrganizationAsync(int id);
        
        // Lookup methods
        Task<IEnumerable<OrganizationTypeDto>> GetAllOrganizationTypesAsync();
    }
}
