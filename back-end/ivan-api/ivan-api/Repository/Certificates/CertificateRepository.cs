using Microsoft.EntityFrameworkCore;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using ivan_api.Models;
using ivan_api.DTOs.Certificates;
using ivan_api.Extensions;

namespace ivan_api.Repository.Certificates
{
    public class CertificateRepository : ICertificateRepository
    {
        private readonly VolunteerManagementSystemContext _context;

        public CertificateRepository(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<bool> AddCertificate(Certificate certificate)
        {
            await _context.Certificates.AddAsync(certificate);
            return await _context.SaveChangesAsync() > 0;
        }

        //public async Task<bool> UpdateCertificate(Certificate certificate)
        //{
        //    _context.ChangeTracker.Clear();//
        //    _context.Certificates.Attach(certificate);
        //    _context.Entry(certificate).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

        //    return await _context.SaveChangesAsync() > 0;
        //}

        public async Task<IEnumerable<Certificate>> ListCertificate(CertificateFilterModel filter)
        {
            var query = _context.Certificates
                .Include(x => x.Event)
                .Include(x => x.IssuedByNavigation)
                .Include(x => x.Template)
                .Include(x => x.Volunteer)
                .AsQueryable();

            //return query.ToList();
            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }

        public async Task<Certificate> GetCertificateById(int id)
        {
            return await _context.Certificates
                .Include(x => x.Event)
                .Include(x => x.IssuedByNavigation)
                .Include(x => x.Template)
                .Include(x => x.Volunteer)
                .SingleOrDefaultAsync(x => x.CertificateId == id);
        }

        public async Task<PdfDocument> DownloadCertificateById(int id)
        {
            //var cer = await _context.Certificates
            //    .Include(x => x.Event)
            //    .Include(x => x.IssuedByNavigation)
            //    .Include(x => x.Template)
            //    .Include(x => x.Volunteer)
            //    .SingleOrDefaultAsync(x => x.CertificateId == id);

            //PdfDocument document = new PdfDocument();
            //document.Info.Title = "Certificate";

            ////XFont font = new XFont("Times New Roman", 12);//
            //XFont font = new XFont("Arial", 12, XFontStyleEx.Regular);//
            //PDFHelper helper = new PDFHelper(document, XUnit.FromCentimeter(2.5), XUnit.FromCentimeter(29.7 - 2.5));
            //XUnit left = XUnit.FromCentimeter(1.5);

            //XUnit leftBuyer = XUnit.FromCentimeter(2.5);

            //XUnit top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("Certificate Id: " + cer.CertificateId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("VolunteerId: " + cer.VolunteerId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("EventId: " + cer.EventId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("TemplateId: " + cer.TemplateId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("CertificateNumber: " + cer.CertificateNumber, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("CertificateName: " + cer.CertificateName, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("Description: " + cer.Description, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("HoursCompleted: " + cer.HoursCompleted, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("PerformanceLevel: " + cer.PerformanceLevel, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("IssueDate: " + cer.IssueDate, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            //top = helper.GetLinePosition(font.Size, font.Size + 2);
            //helper.Gfx.DrawString("ExpiryDate: " + cer.ExpiryDate, font, XBrushes.Black, left, top, XStringFormat.TopLeft);

            //return document;

            var cer = await _context.Certificates
                .Include(x => x.Event)
                .Include(x => x.IssuedByNavigation)
                .Include(x => x.Template)
                .Include(x => x.Volunteer)
                .SingleOrDefaultAsync(x => x.CertificateId == id);

            PdfDocument document = new PdfDocument();
            document.Info.Title = "Certificate";

            var helper = new PDFHelper(document, XUnit.FromCentimeter(2), XUnit.FromCentimeter(27));

            var titleFont = new XFont("Arial", 16, XFontStyleEx.Bold);
            var labelFont = new XFont("Arial", 12, XFontStyleEx.Bold);
            var valueFont = new XFont("Arial", 12, XFontStyleEx.Regular);

            double labelOffset = XUnit.FromCentimeter(1.5);
            double valueOffset = XUnit.FromCentimeter(6);
            double lineSpacing = XUnit.FromMillimeter(10);

            // Draw Title
            var centerRect = new XRect(0, helper.GetLinePosition(lineSpacing), helper.Page.Width, 40);
            helper.Gfx.DrawString("Volunteer Certificate", titleFont, XBrushes.DarkBlue, centerRect, XStringFormats.TopCenter);

            // Draw label/value pairs
            void DrawField(string label, string value)
            {
                var y = helper.GetLinePosition(lineSpacing);
                helper.Gfx.DrawString(label, labelFont, XBrushes.Black, new XPoint(labelOffset, y));
                helper.Gfx.DrawString(value ?? "N/A", valueFont, XBrushes.Black, new XPoint(valueOffset, y));
            }

            DrawField("Certificate ID:", cer.CertificateId.ToString());
            DrawField("Volunteer ID:", cer.VolunteerId.ToString());
            DrawField("Event ID:", cer.EventId.ToString());
            DrawField("Template ID:", cer.TemplateId.ToString());
            DrawField("Certificate Number:", cer.CertificateNumber);
            DrawField("Certificate Name:", cer.CertificateName);
            DrawField("Description:", cer.Description != null ? cer.Description : "N/A");
            DrawField("Hours Completed:", cer.HoursCompleted != null ? cer.HoursCompleted.ToString() : "N/A");
            DrawField("Performance Level:", cer.PerformanceLevel);
            DrawField("Issue Date:", cer.IssueDate != null ? cer.IssueDate?.ToString("dd MMM yyyy") : "N/A");
            DrawField("Expiry Date:", cer.ExpiryDate != null ? cer.ExpiryDate?.ToString("dd MMM yyyy") : "N/A");

            return document;
        }
    }
}
