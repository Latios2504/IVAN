using ivan_api.Models;
using ivan_api.DTOs.PartnerProfiles;
using ivan_api.DTOs.Common;

namespace ivan_api.Repository.PartnerProfiles
{
    public interface IPartnerProfileRepository
    {
        Task<bool> AddPartnerProfile(Partner partnerProfile);
        Task<bool> UpdatePartnerProfile(Partner partnerProfile);
        Task<Partner?> GetPartnerProfileById(int userId);
        Task<PagedResultDto<PartnerProfileViewModel>> GetPartnerProfilesAsync(int PageNumber, int PageSize);
        Task<PagedResultDto<PublicPartnerDTO>> GetPublicPartnersAsync(PublicPartnerFiltersDTO filters);
        Task<PublicPartnerDTO?> GetPublicPartnerAsync(int id);
        Task<int> GetLastId();
        
        // Partner industries lookup methods
        Task<IEnumerable<PartnerIndustry>> GetAllPartnerIndustriesAsync();
    }
}
