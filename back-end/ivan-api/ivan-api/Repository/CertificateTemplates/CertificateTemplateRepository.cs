using Microsoft.EntityFrameworkCore;
using ivan_api.Models;
using ivan_api.DTOs.CertificateTemplates;

namespace ivan_api.Repository.CertificateTemplates
{
    public class CertificateTemplateRepository : ICertificateTemplateRepository
    {
        private readonly VolunteerManagementSystemContext _context;

        public CertificateTemplateRepository(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<bool> AddCertificateTemplate(CertificateTemplate certificateTemplate)
        {
            await _context.CertificateTemplates.AddAsync(certificateTemplate);
            return await _context.SaveChangesAsync() > 0;
        }
        //public async Task<bool> UpdateCertificateTemplate(CertificateTemplate certificateTemplate)
        //{
        //    _context.ChangeTracker.Clear();//
        //    _context.CertificateTemplates.Attach(certificateTemplate);
        //    _context.Entry(certificateTemplate).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

        //    return await _context.SaveChangesAsync() > 0;
        //}
        public async Task<IEnumerable<CertificateTemplate>> ListCertificateTemplate(CertificateTemplateFilterModel filter)
        {
            var query = _context.CertificateTemplates
                .Include(x => x.CreatedByNavigation)
                .Include(x => x.Organization)
                .AsQueryable();

            //return query.ToList();
            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }
        public async Task<CertificateTemplate> GetCertificateTemplateById(int id)
        {
            return await _context.CertificateTemplates
                .Include(x => x.CreatedByNavigation)
                .Include(x => x.Organization)
                .SingleOrDefaultAsync(x => x.TemplateId == id);
        }
    }
}
