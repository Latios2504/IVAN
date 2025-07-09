using Microsoft.EntityFrameworkCore;
using ivan_api.Models;
using ivan_api.DTOs.OrganizationProfiles;

namespace ivan_api.Repository.OrganizationProfiles
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

        private readonly VolunteerManagementSystemContext _context;

        public OrganizationProfileRepository(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<bool> AddOrganizationProfile(Organization organizationProfile)
        {
            await _context.Organizations.AddAsync(organizationProfile);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateOrganizationProfile(Organization organizationProfile)
        {
            _context.ChangeTracker.Clear();//
            _context.Organizations.Attach(organizationProfile);
            _context.Entry(organizationProfile).State = EntityState.Modified;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<Organization>> ListOrganizationProfile(OrganizationProfileFilterModel filter)
        {
            var query = _context.Organizations
                .Include(x => x.User)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.Type)
                .AsQueryable();

            //return query.ToList();
            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }

        public async Task<Organization> GetOrganizationProfileById(int id)
        {
            return await _context.Organizations
                .Include(x => x.User)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.Type)
                .SingleOrDefaultAsync(x => x.OrganizationId == id);
        }
    }
}
