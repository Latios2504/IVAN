using PdfSharp.Pdf;
using ivan_api.Models;
using ivan_api.DTOs.Certificates;

namespace ivan_api.Repository.Certificates
{
    public interface ICertificateRepository
    {
        Task<bool> AddCertificate(Certificate certificate);
        //Task<bool> UpdateCertificate(Certificate certificate);
        Task<IEnumerable<Certificate>> ListCertificate(CertificateFilterModel filter);
        Task<Certificate> GetCertificateById(int id);
        Task<PdfDocument> DownloadCertificateById(int id);
    }
}
