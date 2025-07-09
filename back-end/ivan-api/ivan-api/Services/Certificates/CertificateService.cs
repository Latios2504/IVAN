using AutoMapper;
using PdfSharp.Pdf;
using ivan_api.Models;
using ivan_api.DTOs.Certificates;
using ivan_api.Repository.Certificates;

namespace ivan_api.Services.Certificates
{
    public class CertificateService : ICertificateService
    {
        private readonly ICertificateRepository _repository;
        private readonly IMapper _mapper;

        public CertificateService(ICertificateRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<bool> AddCertificate(CertificateInputModel certificateInputModel)
        {
            var cer = _mapper.Map<Certificate>(certificateInputModel);
            cer.CreatedAt = DateTime.Now;

            return await _repository.AddCertificate(cer);
        }
        //public async Task<bool> UpdateCertificate(CertificateViewModel certificateViewModel)
        //{

        //}
        public async Task<IEnumerable<CertificateViewModel>> ListCertificate(CertificateFilterModel filter)
        {
            var cers = await _repository.ListCertificate(filter);
            return _mapper.Map<IEnumerable<CertificateViewModel>>(cers);
        }
        public async Task<CertificateViewModel> GetCertificateById(int id)
        {
            var cer = await _repository.GetCertificateById(id);
            if (cer == null)
            {
                throw new Exception("Certificate not found");
            }

            return _mapper.Map<CertificateViewModel>(cer);
        }

        public async Task<PdfDocument> DownloadCertificateById(int id)
        {
            return await _repository.DownloadCertificateById(id);
        }
    }
}
