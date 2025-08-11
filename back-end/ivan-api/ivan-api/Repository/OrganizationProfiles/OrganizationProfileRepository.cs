using Microsoft.EntityFrameworkCore;
using ivan_api.Models;
using ivan_api.DTOs.OrganizationProfiles;
using AutoMapper.QueryableExtensions;
using ivan_api.DTOs.Common;
using AutoMapper;

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
        private readonly IMapper _mapper;

        public OrganizationProfileRepository(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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

        public async Task<PagedResultDto<OrganizationProfileViewModel>> GetOrganizationProfilesAsync(int PageNumber, int PageSize)
        {
            var query = _context.Organizations
                .Include(x => x.User)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.Type)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ProjectTo<OrganizationProfileViewModel>(_mapper.ConfigurationProvider)//
                .ToListAsync();

            return new PagedResultDto<OrganizationProfileViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }

        public async Task<Organization> GetOrganizationProfileById(int userId)
        {
            return await _context.Organizations
                .Include(x => x.User)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.Type)
                .SingleOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<int> GetLastId()
        {
            var query = _context.Organizations
                .Include(x => x.User)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.Type)
                .AsQueryable();

            if (query == null) return -1;

            return query.ToList().Last().OrganizationId;
        }
    }
}
