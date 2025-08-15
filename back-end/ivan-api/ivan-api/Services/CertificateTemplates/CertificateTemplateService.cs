using AutoMapper;
using ivan_api.DTOs.Certificates;
using ivan_api.DTOs.CertificateTemplates;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Repository.CertificateTemplates;

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

        public async Task<bool> UpdateCertificateTemplate(CertificateTemplateUpdateModel certificateTemplateUpdateModel)
        {
            try
            {
                var existingCertificateTemplate = await _repository.GetCertificateTemplateById(certificateTemplateUpdateModel.TemplateId);
                if (existingCertificateTemplate == null)
                {
                    throw new Exception("Certificate Template not found");
                }

                // Update only provided fields
                if (!string.IsNullOrEmpty(certificateTemplateUpdateModel.TemplateName))
                    existingCertificateTemplate.TemplateName = certificateTemplateUpdateModel.TemplateName;

                if (!string.IsNullOrEmpty(certificateTemplateUpdateModel.Description))
                    existingCertificateTemplate.Description = certificateTemplateUpdateModel.Description;

                if (!string.IsNullOrEmpty(certificateTemplateUpdateModel.TemplateType))
                    existingCertificateTemplate.TemplateType = certificateTemplateUpdateModel.TemplateType;

                if (!string.IsNullOrEmpty(certificateTemplateUpdateModel.TemplateDesign))
                    existingCertificateTemplate.TemplateDesign = certificateTemplateUpdateModel.TemplateDesign;

                if (!string.IsNullOrEmpty(certificateTemplateUpdateModel.RequiredFields))
                    existingCertificateTemplate.RequiredFields = certificateTemplateUpdateModel.RequiredFields;

                if (certificateTemplateUpdateModel.IsDefault.HasValue)
                    existingCertificateTemplate.IsDefault = certificateTemplateUpdateModel.IsDefault;

                if (certificateTemplateUpdateModel.IsActive.HasValue)
                    existingCertificateTemplate.IsActive = certificateTemplateUpdateModel.IsActive;

                return await _repository.UpdateCertificateTemplate(existingCertificateTemplate);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> DeleteCertificateTemplate(int certificateTemplateId)
        {
            try
            {
                return await _repository.DeleteCertificateTemplate(certificateTemplateId);
            }
            catch (Exception)
            {
                throw;
            }
        }

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
