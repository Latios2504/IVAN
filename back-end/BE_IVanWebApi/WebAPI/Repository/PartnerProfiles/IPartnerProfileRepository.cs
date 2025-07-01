using WebAPI.Data.Entities;
using WebAPI.Models.PartnerProfiles;

namespace WebAPI.Repository.PartnerProfiles
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
        Task<Partner> GetPartnerProfileById(int id);
    }
}
