using PdfSharp.Pdf;
using WebAPI.Models.Reports;

namespace WebAPI.Service.Reports
{
    public interface IReportService
    {
        Task<bool> AddEventReport(ReportInputModel certificateInputModel);
        Task<bool> AddOrganizationReport(ReportInputModel certificateInputModel);
        Task<IEnumerable<ReportViewModel>> ListEventReport(ReportFilterModel filter);
        Task<IEnumerable<ReportViewModel>> ListOrganizationReport(ReportFilterModel filter);
        Task<IEnumerable<ReportViewModel>> ListSystemReport(ReportFilterModel filter);
        Task<ReportViewModel> GetEventReportById(int id);
        Task<ReportViewModel> GetOrganizationReportById(int id);
        Task<ReportViewModel> GetSystemReportById(int id);
        Task<PdfDocument> DownloadEventReportById(int id);
        Task<PdfDocument> DownloadOrganizationReportById(int id);
        Task<PdfDocument> DownloadSystemReportById(int id);

    }
}
