using ivan_api.DTOs.CertificateTemplates;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.CertificateTemplates
{
    public interface ICertificateTemplateService
    {
        Task<CertificateTemplateViewModel?> AddCertificateTemplate(CertificateTemplateInputModel certificateTemplateInputModel, int createdBy);
        Task<bool> UpdateCertificateTemplate(CertificateTemplateUpdateModel certificateTemplateUpdateModel);
        Task<bool> DeleteCertificateTemplate(int certificateTemplateId);
        Task<IEnumerable<CertificateTemplateViewModel>> ListCertificateTemplate(CertificateTemplateFilterModel filter);
        Task<CertificateTemplateViewModel> GetCertificateTemplateById(int id);
        Task<PagedResultDto<CertificateTemplateViewModel>> GetList(int pageNumber, int pageSize);
        Task<int> GetLastId();
    }
}
