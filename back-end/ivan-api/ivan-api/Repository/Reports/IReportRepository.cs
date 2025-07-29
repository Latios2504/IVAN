using PdfSharp.Pdf;
using ivan_api.Models;
using ivan_api.DTOs.Reports;
using ivan_api.DTOs.Common;

namespace ivan_api.Repository.Reports
{
    public interface IReportRepository
    {
        Task<bool> AddEventReport(Report report);
        Task<bool> AddOrganizationReport(Report report);
        Task<IEnumerable<Report>> ListEventReport(ReportFilterModel filter);
        Task<IEnumerable<Report>> ListOrganizationReport(ReportFilterModel filter);
        Task<IEnumerable<Report>> ListSystemReport(ReportFilterModel filter);
        Task<Report> GetEventReportById(int id);
        Task<Report> GetOrganizationReportById(int id);
        Task<Report> GetSystemReportById(int id);
        Task<PdfDocument> DownloadEventReportById(int id);
        Task<PdfDocument> DownloadOrganizationReportById(int id);
        Task<PdfDocument> DownloadSystemReportById(int id);
        Task<PagedResultDto<ReportViewModel>> GetEventReportsAsync(int PageNumber, int PageSize);
        Task<PagedResultDto<ReportViewModel>> GetOrganizationReportsAsync(int PageNumber, int PageSize);
        Task<PagedResultDto<ReportViewModel>> GetSystemReportsAsync(int PageNumber, int PageSize);
        Task<int> GetLastId();
        Task<int> GetLastIdEvent();
        Task<int> GetLastIdOrganization();
        Task<int> GetLastIdSystem();
    }
}
