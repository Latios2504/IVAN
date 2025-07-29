using ivan_api.DTOs;
using ivan_api.DTOs.Public;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.PublicContentServ
{
    /// <summary>
    /// Service interface for public content operations (organizations, events, partners, volunteers)
    /// </summary>
    public interface IPublicContentService
    {
        // Organizations
        Task<PagedResultDto<PublicOrganizationDTO>> GetPublicOrganizationsAsync(PublicOrganizationFiltersDTO filters);
        Task<PublicOrganizationDTO?> GetPublicOrganizationAsync(int id);

        // Events
        Task<PagedResultDto<PublicEventDTO>> GetPublicEventsAsync(PublicEventFiltersDTO filters);
        Task<PublicEventDTO?> GetPublicEventAsync(int id);

        // Partners
        Task<PagedResultDto<PublicPartnerDTO>> GetPublicPartnersAsync(PublicPartnerFiltersDTO filters);
        Task<PublicPartnerDTO?> GetPublicPartnerAsync(int id);

        // Volunteers
        Task<PagedResultDto<PublicVolunteerDTO>> GetPublicVolunteersAsync(PublicVolunteerFiltersDTO filters);
        Task<PublicVolunteerDTO?> GetPublicVolunteerAsync(int id);
    }

}
