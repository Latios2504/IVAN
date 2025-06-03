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
        
        Task<bool> AddPartnerProfile(PartnerProfile partnerProfile);
        Task<bool> UpdatePartnerProfile(PartnerProfile partnerProfile);
        Task<IEnumerable<PartnerProfile>> ListPartnerProfile(PartnerProfileFilterModel filter);
        Task<PartnerProfile> GetPartnerProfileById(int id);
    }
}
