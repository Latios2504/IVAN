using ivan_api.DTOs.PartnerProfiles;

namespace ivan_api.Services.PartnerProfiles
{
    public interface IPartnerProfileService
    {
        Task<bool> AddPartnerProfile(PartnerProfileInputModel partnerProfileInputModel);
        Task<bool> UpdatePartnerProfile(PartnerProfileViewModel partnerProfileViewModel);
        Task<IEnumerable<PartnerProfileViewModel>> ListPartnerProfile(PartnerProfileFilterModel filter);
        Task<PartnerProfileViewModel> GetPartnerProfileById(int id);
    }
}
