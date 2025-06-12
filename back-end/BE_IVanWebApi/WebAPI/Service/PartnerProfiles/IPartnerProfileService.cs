using WebAPI.Data.Entities;
using WebAPI.Models.PartnerProfiles;

namespace WebAPI.Service.PartnerProfiles
{
    public interface IPartnerProfileService
    {
        Task<bool> AddPartnerProfile(PartnerProfileInputModel partnerProfileInputModel);
        Task<bool> UpdatePartnerProfile(PartnerProfileViewModel partnerProfileViewModel);
        Task<IEnumerable<PartnerProfileViewModel>> ListPartnerProfile(PartnerProfileFilterModel filter);
        Task<PartnerProfileViewModel> GetPartnerProfileById(int id);
    }
}
