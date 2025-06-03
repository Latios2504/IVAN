using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Data.Entities;
using WebAPI.Models.PartnerProfiles;

namespace WebAPI.Repository.PartnerProfiles
{
    public class PartnerProfileRepository : IPartnerProfileRepository
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

        public PartnerProfileRepository(IVANContext context)
        {
            _context = context;
        }

        public async Task<bool> AddPartnerProfile(PartnerProfile partnerProfile)
        {
            await _context.PartnerProfiles.AddAsync(partnerProfile);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdatePartnerProfile(PartnerProfile partnerProfile)
        {
            _context.ChangeTracker.Clear();//
            _context.PartnerProfiles.Attach(partnerProfile);
            _context.Entry(partnerProfile).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<PartnerProfile>> ListPartnerProfile(PartnerProfileFilterModel filter)
        {
            var query = _context.PartnerProfiles
                .Include(x => x.User)
                .AsQueryable();

            //return query.ToList();
            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }

        public async Task<PartnerProfile> GetPartnerProfileById(int id)
        {
            return await _context.PartnerProfiles
                .Include(x => x.User)
                .SingleOrDefaultAsync(x => x.Id == id);
        }
    }
}
