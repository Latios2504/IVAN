using Microsoft.EntityFrameworkCore;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using ivan_api.Models;
using ivan_api.DTOs.Certificates;
using ivan_api.Extensions;
using AutoMapper.QueryableExtensions;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.PartnerCollaboration;
using AutoMapper;

namespace ivan_api.Repository.Certificates
{
    public class CertificateRepository : ICertificateRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMapper _mapper;

        public CertificateRepository(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> AddCertificate(Certificate certificate)
        {
            certificate.CreatedAt = DateTime.Now;
            await _context.Certificates.AddAsync(certificate);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateCertificate(Certificate certificate)
        {
            _context.ChangeTracker.Clear();
            _context.Certificates.Attach(certificate);
            _context.Entry(certificate).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteCertificate(int certificateId)
        {
            var certificate = await _context.Certificates.FindAsync(certificateId);
            if (certificate == null)
                return false;

            _context.Certificates.Remove(certificate);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<PagedResultDto<CertificateViewModel>> GetCertificatesByOrganizationAsync(int organizationId, int PageNumber, int PageSize)
        {
            var org = _context.Organizations.Find(organizationId);

            var query = _context.Certificates
                .Include(x => x.Event)
                .Include(x => x.IssuedByNavigation)
                .Include(x => x.Template)
                .Include(x => x.Volunteer)
                //.Where(c => c.IssuedByNavigation != null && c.IssuedByNavigation.RoleId == organizationId)////////
                .Where(c => c.IssuedByNavigation != null && c.IssuedByNavigation.RoleId == 2/*organization role id*/ && org != null && c.IssuedBy == org.UserId)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ProjectTo<CertificateViewModel>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PagedResultDto<CertificateViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }

        public async Task<bool> ApproveCertificate(int certificateId, string? approvalNotes, int? approvedBy)
        {
            var certificate = await _context.Certificates.FindAsync(certificateId);
            if (certificate == null)
                return false;

            certificate.Status = "Approved";
            if (approvedBy.HasValue)
                certificate.IssuedBy = approvedBy.Value;
            certificate.IssueDate = DateTime.Now;
            if (!string.IsNullOrEmpty(approvalNotes))
                certificate.Description = approvalNotes;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RejectCertificate(int certificateId, string rejectionReason, int? rejectedBy)
        {
            var certificate = await _context.Certificates.FindAsync(certificateId);
            if (certificate == null)
                return false;

            certificate.Status = "Rejected";
            if (rejectedBy.HasValue)
                certificate.IssuedBy = rejectedBy.Value;
            certificate.Description = rejectionReason; // Using Description field to store rejection reason

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> BulkUpdateCertificateStatus(List<int> certificateIds, string status, string? reason, int? updatedBy)
        {
            var certificates = await _context.Certificates
                .Where(c => certificateIds.Contains(c.CertificateId))
                .ToListAsync();

            if (!certificates.Any())
                return false;

            foreach (var certificate in certificates)
            {
                certificate.Status = status;
                if (updatedBy.HasValue)
                    certificate.IssuedBy = updatedBy.Value;
                if (status == "Approved")
                {
                    certificate.IssueDate = DateTime.Now;
                }
                if (!string.IsNullOrEmpty(reason))
                    certificate.Description = reason;
            }

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<Certificate>> ListCertificate(CertificateFilterModel filter)
        {
            var query = _context.Certificates
                .Include(x => x.Event)
                .Include(x => x.IssuedByNavigation)
                .Include(x => x.Template)
                .Include(x => x.Volunteer)
                .AsQueryable();

            if(filter.OrganizationId != null)
            {
                var org = _context.Organizations.Find(filter.OrganizationId);

                query = query
                    .Where(c => c.IssuedByNavigation != null && c.IssuedByNavigation.RoleId == 2/*organization role id*/ && org != null && c.IssuedBy == org.UserId);
            }
            if (!string.IsNullOrWhiteSpace(filter.Status))
            {
                query = query
                    .Where(x => x.Status.ToLower().Contains(filter.Status.ToLower()));
            }
            if (filter.VolunteerId != null)
            {
                query = query
                    .Where(x => x.VolunteerId == filter.VolunteerId);
            }
            if (filter.EventId != null)
            {
                query = query
                    .Where(x => x.EventId == filter.EventId);
            }
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                var term = filter.SearchTerm.ToLower();
                query = query.Where(x =>
                    x.CertificateNumber.ToLower().Contains(term) ||
                    x.CertificateName.ToLower().Contains(term) ||
                    (x.Description != null && x.Description.ToLower().Contains(term)) ||
                    (x.PerformanceLevel != null && x.PerformanceLevel.ToLower().Contains(term)) ||
                    (x.Status != null && x.Status.ToLower().Contains(term)) ||
                    (x.Event.EventName != null && x.Event.EventName.ToLower().Contains(term))
                );
            }
            if (filter.IssuedDateFrom != null)
            {
                query = query.Where(x => x.IssueDate >= filter.IssuedDateFrom);
            }
            if (filter.IssuedDateTo != null)
            {
                query = query.Where(x => x.IssueDate <= filter.IssuedDateTo);
            }


            //return query.ToList();
            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }

        public async Task<PagedResultDto<CertificateViewModel>> GetCertificatesAsync(int PageNumber, int PageSize)
        {
            var query = _context.Certificates
                .Include(x => x.Event)
                .Include(x => x.IssuedByNavigation)
                .Include(x => x.Template)
                .Include(x => x.Volunteer)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ProjectTo<CertificateViewModel>(_mapper.ConfigurationProvider)//
                .ToListAsync();

            return new PagedResultDto<CertificateViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }

        public async Task<Certificate> GetCertificateById(int id)
        {
            var certificate = await _context.Certificates
                .Include(x => x.Event)
                .Include(x => x.IssuedByNavigation)
                .Include(x => x.Template)
                .Include(x => x.Volunteer)
                .SingleOrDefaultAsync(x => x.CertificateId == id);
            
            return certificate!; // Using null-forgiving operator since interface expects non-null
        }

        public async Task<PdfDocument> DownloadCertificateById(int id)
        {
            var cer = await _context.Certificates
                .Include(x => x.Event)
                .Include(x => x.IssuedByNavigation)
                .Include(x => x.Template)
                .Include(x => x.Volunteer)
                .SingleOrDefaultAsync(x => x.CertificateId == id);

            if (cer == null)
            {
                throw new ArgumentException($"Certificate with ID {id} not found.");
            }

            PdfDocument document = new PdfDocument();
            document.Info.Title = "Certificate";

            var helper = new PDFHelper(document, XUnit.FromCentimeter(2), XUnit.FromCentimeter(27));

            var titleFont = new XFont("Arial", 16, XFontStyleEx.Bold);
            var labelFont = new XFont("Arial", 12, XFontStyleEx.Bold);
            var valueFont = new XFont("Arial", 12, XFontStyleEx.Regular);

            double labelOffset = XUnit.FromCentimeter(1.5).Point;
            double valueOffset = XUnit.FromCentimeter(6).Point;
            double lineSpacing = XUnit.FromMillimeter(10).Point;

            // Draw Title
            var centerRect = new XRect(0, helper.GetLinePosition(XUnit.FromPoint(lineSpacing)).Point, helper.Page.Width.Point, XUnit.FromPoint(40).Point);
            helper.Gfx.DrawString("Volunteer Certificate", titleFont, XBrushes.DarkBlue, centerRect, XStringFormats.TopCenter);

            // Draw label/value pairs
            void DrawField(string label, string value)
            {
                var y = helper.GetLinePosition(XUnit.FromPoint(lineSpacing));
                helper.Gfx.DrawString(label, labelFont, XBrushes.Black, new XPoint(labelOffset, y.Point));
                helper.Gfx.DrawString(value ?? "N/A", valueFont, XBrushes.Black, new XPoint(valueOffset, y.Point));
            }

            DrawField("Certificate ID:", cer.CertificateId.ToString());
            DrawField("Volunteer ID:", cer.VolunteerId.ToString());
            DrawField("Event ID:", cer.EventId.ToString());
            DrawField("Template ID:", cer.TemplateId.ToString());
            DrawField("Certificate Number:", cer.CertificateNumber ?? "N/A");
            DrawField("Certificate Name:", cer.CertificateName ?? "N/A");
            DrawField("Description:", cer.Description ?? "N/A");
            DrawField("Hours Completed:", cer.HoursCompleted?.ToString() ?? "N/A");
            DrawField("Performance Level:", cer.PerformanceLevel ?? "N/A");
            DrawField("Issue Date:", cer.IssueDate?.ToString("dd MMM yyyy") ?? "N/A");
            DrawField("Expiry Date:", cer.ExpiryDate?.ToString("dd MMM yyyy") ?? "N/A");

            var update = await GetCertificateById(id);

            if(update.DownloadCount == 0 || update.DownloadCount == null)
            {
                update.DownloadCount = 0;
            }
            else
            {
                update.DownloadCount += 1;
            }

            update.LastDownloadDate = DateTime.Now;

            await UpdateCertificate(update);//add dl count and new date

            return document;
        }

        public async Task<int> GetLastId()
        {
            var lastCertificate = await _context.Certificates
                .OrderByDescending(c => c.CertificateId)
                .FirstOrDefaultAsync();

            return lastCertificate?.CertificateId ?? -1;
        }
    }
}
