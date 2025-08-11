using Microsoft.EntityFrameworkCore;
using ivan_api.Models;
using ivan_api.DTOs.PartnerProfiles;
using AutoMapper.QueryableExtensions;
using ivan_api.DTOs.Common;
using AutoMapper;

namespace ivan_api.Repository.PartnerProfiles
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

        private readonly VolunteerManagementSystemContext _context;
        private readonly IMapper _mapper;

        public PartnerProfileRepository(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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
            _context.Entry(partnerProfile).State = EntityState.Modified;

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

        public async Task<PagedResultDto<PartnerProfileViewModel>> GetPartnerProfilesAsync(int PageNumber, int PageSize)
        {
            var query = _context.Partners
                .Include(x => x.User)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.Industry)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ProjectTo<PartnerProfileViewModel>(_mapper.ConfigurationProvider)//
                .ToListAsync();

            return new PagedResultDto<PartnerProfileViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }

        public async Task<Partner> GetPartnerProfileById(int userId)
        {
            var par = await _context.Partners
                .Include(x => x.User)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.Industry)
                .SingleOrDefaultAsync(x => x.UserId == userId);
            return par;
        }

        public async Task<int> GetLastId()
        {
            var query = _context.Partners
                .Include(x => x.User)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.Industry)
                .AsQueryable();

            if (query == null) return -1;

            return query.ToList().Last().PartnerId;
        }
    }
}
