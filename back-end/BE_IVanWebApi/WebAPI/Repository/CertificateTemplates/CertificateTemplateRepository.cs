using Microsoft.EntityFrameworkCore;
using WebAPI.Data.Entities;
using WebAPI.Models.CertificateTemplates;

namespace WebAPI.Repository.CertificateTemplates
{
    public class CertificateTemplateRepository : ICertificateTemplateRepository
    {
        private readonly IVANSystemContext _context;

        public CertificateTemplateRepository(IVANSystemContext context)
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
