using PdfSharp.Pdf;
using WebAPI.Models.Certificates;

namespace WebAPI.Service.Certificates
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
