using ivan_api.Models;
using ivan_api.DTOs.CertificateTemplates;

namespace ivan_api.Repository.CertificateTemplates
{
    public interface ICertificateTemplateRepository
    {
        Task<bool> AddCertificateTemplate(CertificateTemplate certificateTemplate);
        //Task<bool> UpdateCertificateTemplate(CertificateTemplate certificateTemplate);
        Task<IEnumerable<CertificateTemplate>> ListCertificateTemplate(CertificateTemplateFilterModel filter);
        Task<CertificateTemplate> GetCertificateTemplateById(int id);
    }
}
