using Microsoft.EntityFrameworkCore;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using System.Runtime.ConstrainedExecution;
using ivan_api.Models;
using ivan_api.DTOs.Reports;
using ivan_api.Extensions;
using AutoMapper.QueryableExtensions;
using ivan_api.DTOs.Common;
using AutoMapper;

namespace ivan_api.Repository.Reports
{
    public class ReportRepository : IReportRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMapper _mapper;

        public ReportRepository(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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

        public async Task<PagedResultDto<ReportViewModel>> GetEventReportsAsync(int PageNumber, int PageSize)
        {
            var query = _context.Reports
                .Where(x => x.ReportType.Equals("Event"))
                .Include(x => x.CreatedByNavigation)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ProjectTo<ReportViewModel>(_mapper.ConfigurationProvider)//
                .ToListAsync();

            return new PagedResultDto<ReportViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }

        public async Task<PagedResultDto<ReportViewModel>> GetOrganizationReportsAsync(int PageNumber, int PageSize)
        {
            var query = _context.Reports
                .Where(x => x.ReportType.Equals("Organization"))
                .Include(x => x.CreatedByNavigation)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ProjectTo<ReportViewModel>(_mapper.ConfigurationProvider)//
                .ToListAsync();

            return new PagedResultDto<ReportViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }

        public async Task<PagedResultDto<ReportViewModel>> GetSystemReportsAsync(int PageNumber, int PageSize)
        {
            var query = _context.Reports
                .Where(x => x.ReportType.Equals("System"))
                .Include(x => x.CreatedByNavigation)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ProjectTo<ReportViewModel>(_mapper.ConfigurationProvider)//
                .ToListAsync();

            return new PagedResultDto<ReportViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
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
            //var report = await _context.Reports
            //    .Include(x => x.CreatedByNavigation)
            //    .SingleOrDefaultAsync(x => x.ReportId == id && x.ReportType.Equals("Event"));

            //if (report == null)
            //{
            //    return null;
            //}

            //PdfDocument document = new PdfDocument();
            //document.Info.Title = "Event_Report";

            ////XFont font = new XFont("Times New Roman", 12);//
            //XFont font = new XFont("Arial", 12, XFontStyleEx.Regular);//
            //PDFHelper helper = new PDFHelper(document, XUnit.FromCentimeter(2.5), XUnit.FromCentimeter(29.7 - 2.5));
            //XUnit left = XUnit.FromCentimeter(1.5);

            //XUnit leftBuyer = XUnit.FromCentimeter(2.5);

            //XUnit top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("Report Id: " + report.ReportId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("ReportType: " + report.ReportType, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("Content: " + report.Content, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("GeneratedDate: " + report.GeneratedDate, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("CreatedBy: " + report.CreatedBy, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("CreatedAt: " + report.CreatedAt, font, XBrushes.Black, left, top, XStringFormat.TopLeft);

            //return document;

            var report = await _context.Reports
                .Include(x => x.CreatedByNavigation)
                .SingleOrDefaultAsync(x => x.ReportId == id && x.ReportType == "Event");

            if (report == null) return null;

            PdfDocument document = new PdfDocument();
            document.Info.Title = "Event_Report";

            PDFHelper helper = new PDFHelper(document, XUnit.FromCentimeter(2), XUnit.FromCentimeter(27));

            var titleFont = new XFont("Arial", 16, XFontStyleEx.Bold);
            var labelFont = new XFont("Arial", 12, XFontStyleEx.Bold);
            var valueFont = new XFont("Arial", 12, XFontStyleEx.Regular);

            double labelX = XUnit.FromCentimeter(1.5);
            double valueX = XUnit.FromCentimeter(5.5);
            double spacing = XUnit.FromMillimeter(10);

            helper.Gfx.DrawString("Event Report", titleFont, XBrushes.DarkBlue,
                new XRect(0, helper.GetLinePosition(spacing), helper.Page.Width, 30), XStringFormats.TopCenter);

            void DrawRow(string label, string value)
            {
                var y = helper.GetLinePosition(spacing);
                helper.Gfx.DrawString(label, labelFont, XBrushes.Black, new XPoint(labelX, y));
                helper.Gfx.DrawString(value ?? "N/A", valueFont, XBrushes.Black, new XPoint(valueX, y));
            }

            DrawRow("Report ID:", report.ReportId.ToString());
            DrawRow("Report Type:", report.ReportType);
            DrawRow("Content:", report.Content);
            DrawRow("Generated Date:", report.GeneratedDate != null ? report.GeneratedDate.ToString() : "N/A");
            DrawRow("Created By:", report.CreatedBy != null ? report.CreatedBy.ToString() : "N/A");
            DrawRow("Created At:", report.CreatedAt != null ? report.CreatedAt.ToString() : "N/A");

            return document;
        }
        public async Task<PdfDocument> DownloadOrganizationReportById(int id)
        {
            //var report = await _context.Reports
            //    .Include(x => x.CreatedByNavigation)
            //    .SingleOrDefaultAsync(x => x.ReportId == id && x.ReportType.Equals("Organization"));

            //if (report == null)
            //{
            //    return null;
            //}

            //PdfDocument document = new PdfDocument();
            //document.Info.Title = "Organization_Report";

            ////XFont font = new XFont("Times New Roman", 12);//
            //XFont font = new XFont("Arial", 12, XFontStyleEx.Regular);//
            //PDFHelper helper = new PDFHelper(document, XUnit.FromCentimeter(2.5), XUnit.FromCentimeter(29.7 - 2.5));
            //XUnit left = XUnit.FromCentimeter(1.5);

            //XUnit leftBuyer = XUnit.FromCentimeter(2.5);

            //XUnit top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("Report Id: " + report.ReportId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("ReportType: " + report.ReportType, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("Content: " + report.Content, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("GeneratedDate: " + report.GeneratedDate, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("CreatedBy: " + report.CreatedBy, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("CreatedAt: " + report.CreatedAt, font, XBrushes.Black, left, top, XStringFormat.TopLeft);

            //return document;

            var report = await _context.Reports
                .Include(x => x.CreatedByNavigation)
                .SingleOrDefaultAsync(x => x.ReportId == id && x.ReportType == "Organization");

            if (report == null) return null;

            PdfDocument document = new PdfDocument();
            document.Info.Title = "Organization_Report";

            PDFHelper helper = new PDFHelper(document, XUnit.FromCentimeter(2), XUnit.FromCentimeter(27));

            var titleFont = new XFont("Arial", 16, XFontStyleEx.Bold);
            var labelFont = new XFont("Arial", 12, XFontStyleEx.Bold);
            var valueFont = new XFont("Arial", 12, XFontStyleEx.Regular);

            double labelX = XUnit.FromCentimeter(1.5);
            double valueX = XUnit.FromCentimeter(5.5);
            double spacing = XUnit.FromMillimeter(10);

            helper.Gfx.DrawString("Organization Report", titleFont, XBrushes.DarkBlue,
                new XRect(0, helper.GetLinePosition(spacing), helper.Page.Width, 30), XStringFormats.TopCenter);

            void DrawRow(string label, string value)
            {
                var y = helper.GetLinePosition(spacing);
                helper.Gfx.DrawString(label, labelFont, XBrushes.Black, new XPoint(labelX, y));
                helper.Gfx.DrawString(value ?? "N/A", valueFont, XBrushes.Black, new XPoint(valueX, y));
            }

            DrawRow("Report ID:", report.ReportId.ToString());
            DrawRow("Report Type:", report.ReportType);
            DrawRow("Content:", report.Content);
            DrawRow("Generated Date:", report.GeneratedDate != null ? report.GeneratedDate.ToString() : "N/A");
            DrawRow("Created By:", report.CreatedBy != null ? report.CreatedBy.ToString() : "N/A");
            DrawRow("Created At:", report.CreatedAt != null ? report.CreatedAt.ToString() : "N/A");

            return document;
        }
        public async Task<PdfDocument> DownloadSystemReportById(int id)
        {
            //var report = await _context.Reports
            //    .Include(x => x.CreatedByNavigation)
            //    .SingleOrDefaultAsync(x => x.ReportId == id && x.ReportType.Equals("System"));

            //if (report == null)
            //{
            //    return null;
            //}

            //PdfDocument document = new PdfDocument();
            //document.Info.Title = "System_Report";

            ////XFont font = new XFont("Times New Roman", 12);//
            //XFont font = new XFont("Arial", 12, XFontStyleEx.Regular);//
            //PDFHelper helper = new PDFHelper(document, XUnit.FromCentimeter(2.5), XUnit.FromCentimeter(29.7 - 2.5));
            //XUnit left = XUnit.FromCentimeter(1.5);

            //XUnit leftBuyer = XUnit.FromCentimeter(2.5);

            //XUnit top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("Report Id: " + report.ReportId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("ReportType: " + report.ReportType, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("Content: " + report.Content, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("GeneratedDate: " + report.GeneratedDate, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("CreatedBy: " + report.CreatedBy, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("CreatedAt: " + report.CreatedAt, font, XBrushes.Black, left, top, XStringFormat.TopLeft);

            //return document;

            var report = await _context.Reports
        .Include(x => x.CreatedByNavigation)
        .SingleOrDefaultAsync(x => x.ReportId == id && x.ReportType == "System");

            if (report == null) return null;

            PdfDocument document = new PdfDocument();
            document.Info.Title = "System_Report";

            PDFHelper helper = new PDFHelper(document, XUnit.FromCentimeter(2), XUnit.FromCentimeter(27));

            var titleFont = new XFont("Arial", 16, XFontStyleEx.Bold);
            var labelFont = new XFont("Arial", 12, XFontStyleEx.Bold);
            var valueFont = new XFont("Arial", 12, XFontStyleEx.Regular);

            double labelX = XUnit.FromCentimeter(1.5);
            double valueX = XUnit.FromCentimeter(5.5);
            double spacing = XUnit.FromMillimeter(10);

            helper.Gfx.DrawString("System Report", titleFont, XBrushes.DarkBlue,
                new XRect(0, helper.GetLinePosition(spacing), helper.Page.Width, 30), XStringFormats.TopCenter);

            void DrawRow(string label, string value)
            {
                var y = helper.GetLinePosition(spacing);
                helper.Gfx.DrawString(label, labelFont, XBrushes.Black, new XPoint(labelX, y));
                helper.Gfx.DrawString(value ?? "N/A", valueFont, XBrushes.Black, new XPoint(valueX, y));
            }

            DrawRow("Report ID:", report.ReportId.ToString());
            DrawRow("Report Type:", report.ReportType);
            DrawRow("Content:", report.Content);
            DrawRow("Generated Date:", report.GeneratedDate != null ? report.GeneratedDate.ToString() : "N/A");
            DrawRow("Created By:", report.CreatedBy != null ? report.CreatedBy.ToString() : "N/A");
            DrawRow("Created At:", report.CreatedAt != null ? report.CreatedAt.ToString() : "N/A");

            return document;
        }
    }
}
