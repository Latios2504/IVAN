using WebAPI.Data.Entities;
using WebAPI.Models.CertificateTemplates;

namespace WebAPI.Repository.CertificateTemplates
{
    public interface ICertificateTemplateRepository
    {
        Task<bool> AddCertificateTemplate(CertificateTemplate certificateTemplate);
        //Task<bool> UpdateCertificateTemplate(CertificateTemplate certificateTemplate);
        Task<IEnumerable<CertificateTemplate>> ListCertificateTemplate(CertificateTemplateFilterModel filter);
        Task<CertificateTemplate> GetCertificateTemplateById(int id);
    }
}
