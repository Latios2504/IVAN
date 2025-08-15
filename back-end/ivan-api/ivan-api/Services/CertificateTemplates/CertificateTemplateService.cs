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

        public async Task<CertificateTemplateViewModel?> AddCertificateTemplate(CertificateTemplateInputModel certificateTemplateInputModel, int createdBy)
        {
            var tem = _mapper.Map<CertificateTemplate>(certificateTemplateInputModel);
            tem.CreatedAt = DateTime.Now;
            tem.UpdatedAt = DateTime.Now;
            tem.CreatedBy = createdBy;

            var createdTemplateId = await _repository.AddCertificateTemplate(tem);
            
            if (createdTemplateId == null)
            {
                return null;
            }
            
            // Get the newly created template by its ID
            var createdTemplate = await _repository.GetCertificateTemplateById(createdTemplateId.Value);
                
            if (createdTemplate == null)
            {
                return null;
            }
            
            return _mapper.Map<CertificateTemplateViewModel>(createdTemplate);
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

        public async Task<int> GetLastId() => await _repository.GetLastId();
    }
}
