using WebAPI.Models.CertificateTemplates;

namespace WebAPI.Service.CertificateTemplates
{
    public interface ICertificateTemplateService
    {
        Task<bool> AddCertificateTemplate(CertificateTemplateInputModel certificateTemplateInputModel);
        //Task<bool> UpdateCertificateTemplate(CertificateTemplateViewModel certificateTemplateViewModel);
        Task<IEnumerable<CertificateTemplateViewModel>> ListCertificateTemplate(CertificateTemplateFilterModel filter);
        Task<CertificateTemplateViewModel> GetCertificateTemplateById(int id);
    }
}
