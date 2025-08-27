using PdfSharp.Pdf;
using ivan_api.DTOs.Certificates;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.Certificates
{
    public interface ICertificateService
    {
        Task<bool> AddCertificate(CertificateInputModel certificateInputModel);
        Task<bool> UpdateCertificate(CertificateUpdateModel certificateUpdateModel);
        Task<bool> DeleteCertificate(int certificateId);
        Task<IEnumerable<CertificateViewModel>> ListCertificate(CertificateFilterModel filter);
        Task<CertificateViewModel> GetCertificateById(int id);
        Task<PdfDocument> DownloadCertificateById(int id);
        Task<PagedResultDto<CertificateViewModel>> GetList(int pageNumber, int pageSize);
        Task<PagedResultDto<CertificateViewModel>> GetCertificatesByOrganization(int organizationId, int pageNumber, int pageSize);
        Task<bool> ApproveCertificate(CertificateApprovalModel approvalModel);
        Task<bool> RejectCertificate(CertificateRejectionModel rejectionModel);
        Task<bool> BulkApproveCertificates(BulkCertificateActionModel bulkActionModel);
        Task<bool> BulkRevokeCertificates(BulkCertificateActionModel bulkActionModel);
        Task<int> GetLastId();

        Task<PagedResultDto<CertificateViewModel>> GetAllCertificates(int pageNumber, int pageSize);
        Task<PagedResultDto<CertificateViewModel>> GetCertificatesForVolunteer(int userId, int pageNumber, int pageSize);
        Task<PagedResultDto<CertificateViewModel>> GetCertificatesForMyOrganization(int userId, int pageNumber, int pageSize);
        Task<int?> ResolveMyOrganizationId(int userId);
    }
}
