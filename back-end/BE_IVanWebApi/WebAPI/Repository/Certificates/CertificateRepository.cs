using Microsoft.EntityFrameworkCore;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using WebAPI.Data.Entities;
using WebAPI.Models.Certificates;
using WebAPI.Helpers;

namespace WebAPI.Repository.Certificates
{
    public class CertificateRepository : ICertificateRepository
    {
        private readonly IVANSystemContext _context;

        public CertificateRepository(IVANSystemContext context)
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
            var cer = await _context.Certificates
                .Include(x => x.Event)
                .Include(x => x.IssuedByNavigation)
                .Include(x => x.Template)
                .Include(x => x.Volunteer)
                .SingleOrDefaultAsync(x => x.CertificateId == id);

            PdfDocument document = new PdfDocument();
            document.Info.Title = "Certificate";

            //XFont font = new XFont("Times New Roman", 12);//
            XFont font = new XFont("Arial", 12, XFontStyleEx.Regular);//
            PDFHelper helper = new PDFHelper(document, XUnit.FromCentimeter(2.5), XUnit.FromCentimeter(29.7 - 2.5));
            XUnit left = XUnit.FromCentimeter(1.5);

            XUnit leftBuyer = XUnit.FromCentimeter(2.5);

            XUnit top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("Certificate Id: " + cer.CertificateId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("VolunteerId: " + cer.VolunteerId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("EventId: " + cer.EventId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("TemplateId: " + cer.TemplateId, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("CertificateNumber: " + cer.CertificateNumber, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("CertificateName: " + cer.CertificateName, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("Description: " + cer.Description, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("HoursCompleted: " + cer.HoursCompleted, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("PerformanceLevel: " + cer.PerformanceLevel, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("IssueDate: " + cer.IssueDate, font, XBrushes.Black, left, top, XStringFormat.TopLeft);
            top = helper.GetLinePosition(font.Size, font.Size + 2);
            helper.Gfx.DrawString("ExpiryDate: " + cer.ExpiryDate, font, XBrushes.Black, left, top, XStringFormat.TopLeft);

            return document;
        }
    }
}
