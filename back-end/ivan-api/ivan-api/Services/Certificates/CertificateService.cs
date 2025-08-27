using AutoMapper;
using PdfSharp.Pdf;
using ivan_api.Models;
using ivan_api.DTOs.Certificates;
using ivan_api.Repository.Certificates;
using ivan_api.DTOs.Common;

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
            cer.IssueDate = DateTime.Now;
            cer.Status = "Draft"; // Default status

            return await _repository.AddCertificate(cer);
        }

        public async Task<bool> UpdateCertificate(CertificateUpdateModel certificateUpdateModel)
        {
            try
            {
                var existingCertificate = await _repository.GetCertificateById(certificateUpdateModel.CertificateId);
                if (existingCertificate == null)
                {
                    throw new Exception("Certificate not found");
                }

                // Update only provided fields
                if (!string.IsNullOrEmpty(certificateUpdateModel.CertificateName))
                    existingCertificate.CertificateName = certificateUpdateModel.CertificateName;
                
                if (!string.IsNullOrEmpty(certificateUpdateModel.Description))
                    existingCertificate.Description = certificateUpdateModel.Description;
                
                if (!string.IsNullOrEmpty(certificateUpdateModel.PerformanceLevel))
                    existingCertificate.PerformanceLevel = certificateUpdateModel.PerformanceLevel;
                
                if (certificateUpdateModel.ExpiryDate.HasValue)
                    existingCertificate.ExpiryDate = certificateUpdateModel.ExpiryDate;
                
                if (!string.IsNullOrEmpty(certificateUpdateModel.Status))
                    existingCertificate.Status = certificateUpdateModel.Status;
                
                if (certificateUpdateModel.HoursCompleted.HasValue)
                    existingCertificate.HoursCompleted = certificateUpdateModel.HoursCompleted;

                return await _repository.UpdateCertificate(existingCertificate);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> DeleteCertificate(int certificateId)
        {
            try
            {
                return await _repository.DeleteCertificate(certificateId);
            }
            catch (Exception)
            {
                throw;
            }
        }

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

        public async Task<PagedResultDto<CertificateViewModel>> GetList(int pageNumber, int pageSize)
        {
            return await _repository.GetCertificatesAsync(pageNumber, pageSize);
        }

        public async Task<PagedResultDto<CertificateViewModel>> GetCertificatesByOrganization(int organizationId, int pageNumber, int pageSize)
        {
            return await _repository.GetCertificatesByOrganizationAsync(organizationId, pageNumber, pageSize);
        }

        public async Task<bool> ApproveCertificate(CertificateApprovalModel approvalModel)
        {
            try
            {
                return await _repository.ApproveCertificate(
                    approvalModel.CertificateId, 
                    approvalModel.ApprovalNotes, 
                    approvalModel.ApprovedBy);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> RejectCertificate(CertificateRejectionModel rejectionModel)
        {
            try
            {
                return await _repository.RejectCertificate(
                    rejectionModel.CertificateId, 
                    rejectionModel.RejectionReason, 
                    rejectionModel.RejectedBy);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> BulkApproveCertificates(BulkCertificateActionModel bulkActionModel)
        {
            try
            {
                return await _repository.BulkUpdateCertificateStatus(
                    bulkActionModel.CertificateIds, 
                    "Approved", 
                    bulkActionModel.Reason, 
                    bulkActionModel.ApprovedBy);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> BulkRevokeCertificates(BulkCertificateActionModel bulkActionModel)
        {
            try
            {
                return await _repository.BulkUpdateCertificateStatus(
                    bulkActionModel.CertificateIds, 
                    "Revoked", 
                    bulkActionModel.Reason, 
                    bulkActionModel.ApprovedBy);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<int> GetLastId() => await _repository.GetLastId();

        public Task<PagedResultDto<CertificateViewModel>> GetAllCertificates(int page, int size)
    => _repository.GetCertificatesAsync(page, size);

        public Task<PagedResultDto<CertificateViewModel>> GetCertificatesForVolunteer(int userId, int page, int size)
            => _repository.GetCertificatesForVolunteerAsync(userId, page, size);

        public Task<PagedResultDto<CertificateViewModel>> GetCertificatesForMyOrganization(int userId, int page, int size)
            => _repository.GetCertificatesForMyOrganizationAsync(userId, page, size);

        public Task<int?> ResolveMyOrganizationId(int userId)
            => _repository.ResolveOrganizationIdByUserAsync(userId);
    }
}
