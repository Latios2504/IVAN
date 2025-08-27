using PdfSharp.Pdf;
using ivan_api.Models;
using ivan_api.DTOs.Certificates;
using ivan_api.DTOs.Common;

namespace ivan_api.Repository.Certificates
{
    public interface ICertificateRepository
    {

        Task<bool> AddCertificate(Certificate certificate, int createdByUserId);
        Task<bool> ApproveCertificate(int certificateId, string? approvalNotes, int? approvedBy);
        Task<bool> UpdateCertificate(Certificate certificate);
        Task<bool> DeleteCertificate(int certificateId);
        Task<IEnumerable<Certificate>> ListCertificate(CertificateFilterModel filter);
        Task<Certificate> GetCertificateById(int id);
        Task<PdfDocument> DownloadCertificateById(int id);
        Task<PagedResultDto<CertificateViewModel>> GetCertificatesAsync(int PageNumber, int PageSize);
        Task<PagedResultDto<CertificateViewModel>> GetCertificatesByOrganizationAsync(int organizationId, int PageNumber, int PageSize);
        Task<bool> RejectCertificate(int certificateId, string rejectionReason, int? rejectedBy);
        Task<bool> BulkUpdateCertificateStatus(List<int> certificateIds, string status, string? reason, int? updatedBy);
        Task<int> GetLastId();

        Task<PagedResultDto<CertificateViewModel>> GetCertificatesForVolunteerAsync(int userId, int page, int size);
        Task<PagedResultDto<CertificateViewModel>> GetCertificatesForMyOrganizationAsync(int userId, int page, int size);
        Task<int?> ResolveOrganizationIdByUserAsync(int userId);

    }
}
