using Microsoft.EntityFrameworkCore;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using System.Runtime.ConstrainedExecution;
using WebAPI.Data.Entities;
using WebAPI.Helpers;
using WebAPI.Models.Reports;

namespace WebAPI.Repository.Reports
{
    public class ReportRepository : IReportRepository
    {
        private readonly IVANSystemContext _context;

        public ReportRepository(IVANSystemContext context)
        {
            _context = context;
        }

        public async Task<bool> AddEventReport(Report report)
        {
            report.ReportType = "Event";
            await _context.Reports.AddAsync(report);
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<bool> AddOrganizationReport(Report report)
        {
            report.ReportType = "Organization";
            await _context.Reports.AddAsync(report);
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<IEnumerable<Report>> ListEventReport(ReportFilterModel filter)
        {
            var query = _context.Reports
                .Where(x => x.ReportType.Equals("Event"))
                .Include(x => x.CreatedByNavigation)
                .AsQueryable();

            //return query.ToList();
            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }
        public async Task<IEnumerable<Report>> ListOrganizationReport(ReportFilterModel filter)
        {
            var query = _context.Reports
                .Where(x => x.ReportType.Equals("Organization"))
                .Include(x => x.CreatedByNavigation)
                .AsQueryable();

            //return query.ToList();
            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }
        public async Task<IEnumerable<Report>> ListSystemReport(ReportFilterModel filter)
        {
            var query = _context.Reports
                .Where(x => x.ReportType.Equals("System"))
                .Include(x => x.CreatedByNavigation)
                .AsQueryable();

            //return query.ToList();
            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }
        public async Task<Report> GetEventReportById(int id)
        {
            return await _context.Reports
                .Include(x => x.CreatedByNavigation)
                .SingleOrDefaultAsync(x => x.ReportId == id && x.ReportType.Equals("Event"));
        }
        public async Task<Report> GetOrganizationReportById(int id)
        {
            return await _context.Reports
                .Include(x => x.CreatedByNavigation)
                .SingleOrDefaultAsync(x => x.ReportId == id && x.ReportType.Equals("Organization"));
        }
        public async Task<Report> GetSystemReportById(int id)
        {
            return await _context.Reports
                .Include(x => x.CreatedByNavigation)
                .SingleOrDefaultAsync(x => x.ReportId == id && x.ReportType.Equals("System"));
        }
        public async Task<PdfDocument> DownloadEventReportById(int id)
        {
            var report = await _context.Reports
                .Include(x => x.CreatedByNavigation)
                .SingleOrDefaultAsync(x => x.ReportId == id && x.ReportType.Equals("Event"));

            if(report == null)
            {
                return null;
            }

            PdfDocument document = new PdfDocument();
            document.Info.Title = "Event_Report";

            //XFont font = new XFont("Times New Roman", 12);//
            XFont font = new XFont("Arial", 12, XFontStyleEx.Regular);//
            PDFHelper helper = new PDFHelper(document, XUnit.FromCentimeter(2.5), XUnit.FromCentimeter(29.7 - 2.5));
            XUnit left = XUnit.FromCentimeter(1.5);

            XUnit leftBuyer = XUnit.FromCentimeter(2.5);

            XUnit top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("Report Id: " + report.ReportId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("ReportType: " + report.ReportType, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("Content: " + report.Content, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("GeneratedDate: " + report.GeneratedDate, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("CreatedBy: " + report.CreatedBy, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("CreatedAt: " + report.CreatedAt, font, XBrushes.Black, left, top, XStringFormat.TopLeft);

            return document;
        }
        public async Task<PdfDocument> DownloadOrganizationReportById(int id)
        {
            var report = await _context.Reports
                .Include(x => x.CreatedByNavigation)
                .SingleOrDefaultAsync(x => x.ReportId == id && x.ReportType.Equals("Organization"));

            if (report == null)
            {
                return null;
            }

            PdfDocument document = new PdfDocument();
            document.Info.Title = "Organization_Report";

            //XFont font = new XFont("Times New Roman", 12);//
            XFont font = new XFont("Arial", 12, XFontStyleEx.Regular);//
            PDFHelper helper = new PDFHelper(document, XUnit.FromCentimeter(2.5), XUnit.FromCentimeter(29.7 - 2.5));
            XUnit left = XUnit.FromCentimeter(1.5);

            XUnit leftBuyer = XUnit.FromCentimeter(2.5);

            XUnit top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("Report Id: " + report.ReportId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("ReportType: " + report.ReportType, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("Content: " + report.Content, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("GeneratedDate: " + report.GeneratedDate, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("CreatedBy: " + report.CreatedBy, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("CreatedAt: " + report.CreatedAt, font, XBrushes.Black, left, top, XStringFormat.TopLeft);

            return document;
        }
        public async Task<PdfDocument> DownloadSystemReportById(int id)
        {
            var report = await _context.Reports
                .Include(x => x.CreatedByNavigation)
                .SingleOrDefaultAsync(x => x.ReportId == id && x.ReportType.Equals("System"));

            if (report == null)
            {
                return null;
            }

            PdfDocument document = new PdfDocument();
            document.Info.Title = "System_Report";

            //XFont font = new XFont("Times New Roman", 12);//
            XFont font = new XFont("Arial", 12, XFontStyleEx.Regular);//
            PDFHelper helper = new PDFHelper(document, XUnit.FromCentimeter(2.5), XUnit.FromCentimeter(29.7 - 2.5));
            XUnit left = XUnit.FromCentimeter(1.5);

            XUnit leftBuyer = XUnit.FromCentimeter(2.5);

            XUnit top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("Report Id: " + report.ReportId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("ReportType: " + report.ReportType, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("Content: " + report.Content, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("GeneratedDate: " + report.GeneratedDate, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("CreatedBy: " + report.CreatedBy, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("CreatedAt: " + report.CreatedAt, font, XBrushes.Black, left, top, XStringFormat.TopLeft);

            return document;
        }
    }
}
