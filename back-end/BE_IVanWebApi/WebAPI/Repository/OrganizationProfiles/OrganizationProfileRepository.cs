using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Data.Entities;
using WebAPI.Models.OrganizationProfiles;
using WebAPI.Service.OrganizationProfiles;

namespace WebAPI.Repository.OrganizationProfiles
{
    public class OrganizationProfileRepository : IOrganizationProfileRepository
    {
        //private readonly OrganizationProfileDAO _OrganizationProfileDAO;

        //public OrganizationProfileRepository(OrganizationProfileDAO organizationProfileDAO)
        //{
        //    _OrganizationProfileDAO = organizationProfileDAO;
        //}

        //public bool AddOrganizationProfile(OrganizationProfile organizationProfile) => _OrganizationProfileDAO.Add(organizationProfile);
        //public bool UpdateOrganizationProfile(OrganizationProfile organizationProfile) => _OrganizationProfileDAO.Update(organizationProfile);

        //public IEnumerable<OrganizationProfile> ListOrganizationProfile() => _OrganizationProfileDAO.List();

        //public OrganizationProfile GetOrganizationProfile(int Id) => _OrganizationProfileDAO.GetById(Id);

        private readonly IVANContext _context;

        public OrganizationProfileRepository(IVANContext context)
        {
            _context = context;
        }

        public async Task<bool> AddOrganizationProfile(OrganizationProfile organizationProfile)
        {
            await _context.OrganizationProfiles.AddAsync(organizationProfile);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateOrganizationProfile(OrganizationProfile organizationProfile)
        {
            _context.ChangeTracker.Clear();//
            _context.OrganizationProfiles.Attach(organizationProfile);
            _context.Entry(organizationProfile).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<OrganizationProfile>> ListOrganizationProfile(OrganizationProfileFilterModel filter)
        {
            var query = _context.OrganizationProfiles
                .Include(x => x.User)
                .Include(x => x.Events)
                .Include(x => x.PartnerCollaborations)
                .Include(x => x.SupportRequests)
                .AsQueryable();

            //return query.ToList();
            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }

        public async Task<OrganizationProfile> GetOrganizationProfileById(int id)
        {
            return await _context.OrganizationProfiles
                .Include(x => x.User)
                .Include(x => x.Events)
                .Include(x => x.PartnerCollaborations)
                .Include(x => x.SupportRequests)
                .SingleOrDefaultAsync(x => x.Id == id);
        }
    }
}
