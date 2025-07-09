using PdfSharp.Pdf;
using ivan_api.DTOs.Certificates;

namespace ivan_api.Services.Certificates
{
    public interface ICertificateService
    {
        Task<bool> AddCertificate(CertificateInputModel certificateInputModel);
        //Task<bool> UpdateCertificate(CertificateViewModel certificateViewModel);
        Task<IEnumerable<CertificateViewModel>> ListCertificate(CertificateFilterModel filter);
        Task<CertificateViewModel> GetCertificateById(int id);
        Task<PdfDocument> DownloadCertificateById(int id);
    }
}
