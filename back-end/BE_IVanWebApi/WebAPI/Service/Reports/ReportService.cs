using AutoMapper;
using PdfSharp.Pdf;
using WebAPI.Data.Entities;
using WebAPI.Models.Certificates;
using WebAPI.Models.Reports;
using WebAPI.Repository.Reports;

namespace WebAPI.Service.Reports
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
    }
}
