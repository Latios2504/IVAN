using PdfSharp.Pdf;
using ivan_api.DTOs.Reports;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.Reports
{
    public interface IReportService
    {
        Task<bool> AddEventReport(ReportInputModel certificateInputModel, int eventId);
        Task<bool> AddOrganizationReport(ReportInputModel certificateInputModel, int orgId);
        Task<IEnumerable<ReportViewModel>> ListEventReport(ReportFilterModel filter);
        Task<IEnumerable<ReportViewModel>> ListOrganizationReport(ReportFilterModel filter);
        Task<IEnumerable<ReportViewModel>> ListSystemReport(ReportFilterModel filter);
        Task<ReportViewModel> GetEventReportById(int id);
        Task<ReportViewModel> GetOrganizationReportById(int id);
        Task<ReportViewModel> GetSystemReportById(int id);
        Task<PdfDocument> DownloadEventReportById(int id);
        Task<PdfDocument> DownloadOrganizationReportById(int id);
        Task<PdfDocument> DownloadSystemReportById(int id);
        Task<PagedResultDto<ReportViewModel>> GetEventReportList(int pageNumber, int pageSize);
        Task<PagedResultDto<ReportViewModel>> GetOrganizationReportList(int pageNumber, int pageSize);
        Task<PagedResultDto<ReportViewModel>> GetSystemReportList(int pageNumber, int pageSize);
        Task<int> GetLastId();
        Task<int> GetLastIdEvent();
        Task<int> GetLastIdOrganization();
        Task<int> GetLastIdSystem();
        Task<ReportViewModel> GetReportById(int id);
        Task<PdfDocument> DownloadReportById(int id);
    }
}
