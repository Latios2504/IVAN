using ivan_api.Models;
using ivan_api.DTOs.PartnerProfiles;
using ivan_api.DTOs.Common;

namespace ivan_api.Repository.PartnerProfiles
{
    public interface IPartnerProfileRepository
    {
        //bool AddOrganizationProfile(OrganizationProfile organizationProfile);
        //bool UpdateOrganizationProfile(OrganizationProfile organizationProfile);
        //IEnumerable<OrganizationProfile> ListOrganizationProfile();
        //OrganizationProfile GetOrganizationProfile(int Id);

        Task<bool> AddPartnerProfile(Partner partnerProfile);
        Task<bool> UpdatePartnerProfile(Partner partnerProfile);
        Task<IEnumerable<Partner>> ListPartnerProfile(PartnerProfileFilterModel filter);
        Task<Partner> GetPartnerProfileById(int userId);
        Task<PagedResultDto<PartnerProfileViewModel>> GetPartnerProfilesAsync(int PageNumber, int PageSize);
        Task<int> GetLastId();
    }
}
