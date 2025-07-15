using AutoMapper;
using ivan_api.Models;
using ivan_api.DTOs.CertificateTemplates;
using ivan_api.Repository.CertificateTemplates;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.CertificateTemplates
{
    public class CertificateTemplateService : ICertificateTemplateService
    {
        private readonly ICertificateTemplateRepository _repository;
        private readonly IMapper _mapper;

        public CertificateTemplateService(ICertificateTemplateRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<bool> AddCertificateTemplate(CertificateTemplateInputModel certificateTemplateInputModel)
        {
            var tem = _mapper.Map<CertificateTemplate>(certificateTemplateInputModel);
            tem.CreatedAt = DateTime.Now;
            tem.UpdatedAt = DateTime.Now;

            return await _repository.AddCertificateTemplate(tem);
        }
        //public async Task<bool> UpdateCertificateTemplate(CertificateTemplateViewModel certificateTemplateViewModel)
        //{

        //}
        public async Task<IEnumerable<CertificateTemplateViewModel>> ListCertificateTemplate(CertificateTemplateFilterModel filter)
        {
            var tems = await _repository.ListCertificateTemplate(filter);
            return _mapper.Map<IEnumerable<CertificateTemplateViewModel>>(tems);
        }
        public async Task<CertificateTemplateViewModel> GetCertificateTemplateById(int id)
        {
            var tem = await _repository.GetCertificateTemplateById(id);
            if (tem == null)
            {
                throw new Exception("Certificate Template not found");
            }

            return _mapper.Map<CertificateTemplateViewModel>(tem);
        }

        public async Task<PagedResultDto<CertificateTemplateViewModel>> GetList(int pageNumber, int pageSize)
        {
            return await _repository.GetCertificateTemplatesAsync(pageNumber, pageSize);
        }
    }
}
