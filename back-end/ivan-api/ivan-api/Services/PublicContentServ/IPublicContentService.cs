using ivan_api.DTOs;
using ivan_api.DTOs.Public;

namespace ivan_api.Services.PublicContentServ
{
    /// <summary>
    /// Service interface for public content operations (organizations, events, partners)
    /// </summary>
    public interface IPublicContentService
    {
        // Organizations
        Task<PagedResultDTO<PublicOrganizationDTO>> GetPublicOrganizationsAsync(PublicOrganizationFiltersDTO filters);
        Task<PublicOrganizationDTO?> GetPublicOrganizationAsync(int id);

        // Events
        Task<PagedResultDTO<PublicEventDTO>> GetPublicEventsAsync(PublicEventFiltersDTO filters);
        Task<PublicEventDTO?> GetPublicEventAsync(int id);

        // Partners
        Task<PagedResultDTO<PublicPartnerDTO>> GetPublicPartnersAsync(PublicPartnerFiltersDTO filters);
        Task<PublicPartnerDTO?> GetPublicPartnerAsync(int id);
    }

}
