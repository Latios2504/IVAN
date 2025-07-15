using ivan_api.DTOs.CertificateTemplates;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.CertificateTemplates
{
    public interface ICertificateTemplateService
    {
        Task<bool> AddCertificateTemplate(CertificateTemplateInputModel certificateTemplateInputModel);
        //Task<bool> UpdateCertificateTemplate(CertificateTemplateViewModel certificateTemplateViewModel);
        Task<IEnumerable<CertificateTemplateViewModel>> ListCertificateTemplate(CertificateTemplateFilterModel filter);
        Task<CertificateTemplateViewModel> GetCertificateTemplateById(int id);
        Task<PagedResultDto<CertificateTemplateViewModel>> GetList(int pageNumber, int pageSize);
    }
}
