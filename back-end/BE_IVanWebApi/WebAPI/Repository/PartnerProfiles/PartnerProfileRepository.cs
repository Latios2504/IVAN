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

        private readonly IVANSystemContext _context;

        public PartnerProfileRepository(IVANSystemContext context)
        {
            _context = context;
        }

        public async Task<bool> AddPartnerProfile(Partner partnerProfile)
        {
            await _context.Partners.AddAsync(partnerProfile);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdatePartnerProfile(Partner partnerProfile)
        {
            _context.ChangeTracker.Clear();//
            _context.Partners.Attach(partnerProfile);
            _context.Entry(partnerProfile).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<Partner>> ListPartnerProfile(PartnerProfileFilterModel filter)
        {
            var query = _context.Partners
                .Include(x => x.User)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.Industry)
                .AsQueryable();

            //return query.ToList();
            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }

        public async Task<Partner> GetPartnerProfileById(int id)
        {
            return await _context.Partners
                .Include(x => x.User)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.Industry)
                .SingleOrDefaultAsync(x => x.PartnerId == id);
        }
    }
}
