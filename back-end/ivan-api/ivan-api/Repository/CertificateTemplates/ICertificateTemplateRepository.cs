using ivan_api.Models;
using ivan_api.DTOs.CertificateTemplates;
using ivan_api.DTOs.Common;

namespace ivan_api.Repository.CertificateTemplates
{
    public interface ICertificateTemplateRepository
    {
        Task<int?> AddCertificateTemplate(CertificateTemplate certificateTemplate);
        Task<bool> UpdateCertificateTemplate(CertificateTemplate certificateTemplate);
        Task<bool> DeleteCertificateTemplate(int certificateTemplateId);
        Task<IEnumerable<CertificateTemplate>> ListCertificateTemplate(CertificateTemplateFilterModel filter);
        Task<CertificateTemplate> GetCertificateTemplateById(int id);
        Task<PagedResultDto<CertificateTemplateViewModel>> GetCertificateTemplatesAsync(int PageNumber, int PageSize);
        Task<int> GetLastId();
    }
}
