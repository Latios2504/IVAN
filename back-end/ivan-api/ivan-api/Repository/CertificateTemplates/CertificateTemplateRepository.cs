using Microsoft.EntityFrameworkCore;
using ivan_api.Models;
using ivan_api.DTOs.CertificateTemplates;
using ivan_api.DTOs.Common;
using AutoMapper.QueryableExtensions;
using ivan_api.DTOs.Certificates;
using AutoMapper;

namespace ivan_api.Repository.CertificateTemplates
{
    public class CertificateTemplateRepository : ICertificateTemplateRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMapper _mapper;

        public CertificateTemplateRepository(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int?> AddCertificateTemplate(CertificateTemplate certificateTemplate)
        {
            certificateTemplate.CreatedAt = DateTime.Now;
            await _context.CertificateTemplates.AddAsync(certificateTemplate);
            var success = await _context.SaveChangesAsync() > 0;
            
            if (success)
            {
                return certificateTemplate.TemplateId; // Return the generated ID
            }
            
            return null;
        }

        public async Task<bool> UpdateCertificateTemplate(CertificateTemplate certificateTemplate)
        {
            _context.ChangeTracker.Clear();//
            _context.CertificateTemplates.Attach(certificateTemplate);
            _context.Entry(certificateTemplate).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteCertificateTemplate(int CertificateTemplateId)
        {
            var template = await _context.CertificateTemplates.FindAsync(CertificateTemplateId);
            if(template == null)
                return false;

            _context.CertificateTemplates.Remove(template);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<PagedResultDto<CertificateTemplateViewModel>> ListCertificateTemplate(CertificateTemplateFilterModel filter)
        {
            var query = _context.CertificateTemplates
                .Include(x => x.CreatedByNavigation)
                .Include(x => x.Organization)
                .AsQueryable();

            // Apply organization filter if provided
            if (filter.OrganizationId.HasValue)
            {
                query = query.Where(x => x.OrganizationId == filter.OrganizationId.Value);
            }

            // Apply search term filter if provided
            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                query = query.Where(x => x.TemplateName.Contains(filter.SearchTerm) || 
                                        (x.Description != null && x.Description.Contains(filter.SearchTerm)));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ProjectTo<CertificateTemplateViewModel>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PagedResultDto<CertificateTemplateViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<PagedResultDto<CertificateTemplateViewModel>> GetCertificateTemplatesAsync(int PageNumber, int PageSize)
        {
            var query = _context.CertificateTemplates
                .Include(x => x.CreatedByNavigation)
                .Include(x => x.Organization)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ProjectTo<CertificateTemplateViewModel>(_mapper.ConfigurationProvider)//
                .ToListAsync();

            return new PagedResultDto<CertificateTemplateViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }
        public async Task<CertificateTemplate> GetCertificateTemplateById(int id)
        {
            var template = await _context.CertificateTemplates
                .Include(x => x.CreatedByNavigation)
                .Include(x => x.Organization)
                .SingleOrDefaultAsync(x => x.TemplateId == id);

            return template;
        }

        public async Task<int> GetLastId()
        {
            var query = _context.CertificateTemplates
                .Include(x => x.CreatedByNavigation)
                .Include(x => x.Organization)
                .AsQueryable();

            if (query == null) return -1;

            return query.ToList().Last().TemplateId;
        }
    }
}
