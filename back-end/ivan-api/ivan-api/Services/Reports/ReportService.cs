using AutoMapper;
using PdfSharp.Pdf;
using ivan_api.Models;
using ivan_api.DTOs.Reports;
using ivan_api.Repository.Reports;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.Reports
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _repository;
        private readonly IMapper _mapper;

        public ReportService(IReportRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<bool> AddEventReport(ReportInputModel reportInputModel)
        {
            var cer = _mapper.Map<Report>(reportInputModel);
            cer.CreatedAt = DateTime.Now;

            return await _repository.AddEventReport(cer);
        }
        public async Task<bool> AddOrganizationReport(ReportInputModel reportInputModel)
        {
            var report = _mapper.Map<Report>(reportInputModel);
            report.CreatedAt = DateTime.Now;

            return await _repository.AddOrganizationReport(report);
        }
        public async Task<IEnumerable<ReportViewModel>> ListEventReport(ReportFilterModel filter)
        {
            var reports = await _repository.ListEventReport(filter);
            return _mapper.Map<IEnumerable<ReportViewModel>>(reports);
        }
        public async Task<IEnumerable<ReportViewModel>> ListOrganizationReport(ReportFilterModel filter)
        {
            var reports = await _repository.ListOrganizationReport(filter);
            return _mapper.Map<IEnumerable<ReportViewModel>>(reports);
        }
        public async Task<IEnumerable<ReportViewModel>> ListSystemReport(ReportFilterModel filter)
        {
            var reports = await _repository.ListSystemReport(filter);
            return _mapper.Map<IEnumerable<ReportViewModel>>(reports);
        }
        public async Task<ReportViewModel> GetEventReportById(int id)
        {
            var report = await _repository.GetEventReportById(id);
            if (report == null)
            {
                throw new Exception("Event Report not found");
            }

            return _mapper.Map<ReportViewModel>(report);
        }
        public async Task<ReportViewModel> GetOrganizationReportById(int id)
        {
            var report = await _repository.GetOrganizationReportById(id);
            if (report == null)
            {
                throw new Exception("Organization Report not found");
            }

            return _mapper.Map<ReportViewModel>(report);
        }
        public async Task<ReportViewModel> GetSystemReportById(int id)
        {
            var report = await _repository.GetSystemReportById(id);
            if (report == null)
            {
                throw new Exception("System Report not found");
            }

            return _mapper.Map<ReportViewModel>(report);
        }
        public async Task<PdfDocument> DownloadEventReportById(int id)
        {
            return await _repository.DownloadEventReportById(id);
        }
        public async Task<PdfDocument> DownloadOrganizationReportById(int id)
        {
            return await _repository.DownloadOrganizationReportById(id);
        }
        public async Task<PdfDocument> DownloadSystemReportById(int id)
        {
            return await _repository.DownloadSystemReportById(id);
        }

        public async Task<PagedResultDto<ReportViewModel>> GetEventReportList(int pageNumber, int pageSize)
        {
            return await _repository.GetEventReportsAsync(pageNumber, pageSize);
        }

        public async Task<PagedResultDto<ReportViewModel>> GetOrganizationReportList(int pageNumber, int pageSize)
        {
            return await _repository.GetOrganizationReportsAsync(pageNumber, pageSize);
        }

        public async Task<PagedResultDto<ReportViewModel>> GetSystemReportList(int pageNumber, int pageSize)
        {
            return await _repository.GetSystemReportsAsync(pageNumber, pageSize);
        }

        public async Task<int> GetLastId() => await _repository.GetLastId();

        public async Task<int> GetLastIdEvent() => await _repository.GetLastIdEvent();

        public async Task<int> GetLastIdOrganization() => await _repository.GetLastIdOrganization();

        public async Task<int> GetLastIdSystem() => await _repository.GetLastIdSystem();
    }
}
