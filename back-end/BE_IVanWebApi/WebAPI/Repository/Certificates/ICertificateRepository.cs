using PdfSharp.Pdf;
using WebAPI.Data.Entities;
using WebAPI.Models.Certificates;

namespace WebAPI.Repository.Certificates
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
