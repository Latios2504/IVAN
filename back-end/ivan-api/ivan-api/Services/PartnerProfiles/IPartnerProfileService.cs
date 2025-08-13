using ivan_api.DTOs.PartnerProfiles;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.PartnerProfiles
{
    public interface IPartnerProfileService
    {
        Task<bool> AddPartnerProfile(PartnerProfileCreateDto partnerProfileInputModel);
        Task<bool> UpdatePartnerProfile(PartnerProfileUpdateDto partnerProfileUpdateModel, int parId);
        Task<PartnerProfileViewModel> GetPartnerProfileById(int userId);
        Task<PagedResultDto<PartnerProfileViewModel>> GetList(int pageNumber, int pageSize);
        Task<int> GetLastId();
        
        // Public content methods
        Task<PagedResultDto<PublicPartnerDTO>> GetPublicPartnersAsync(PublicPartnerFiltersDTO filters);
        Task<PublicPartnerDTO?> GetPublicPartnerAsync(int id);
        
        // Lookup methods
        Task<IEnumerable<PartnerIndustryDto>> GetAllPartnerIndustriesAsync();
    }
}
