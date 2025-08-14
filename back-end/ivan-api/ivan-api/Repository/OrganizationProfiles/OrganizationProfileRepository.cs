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

        public async Task<Organization?> GetOrganizationProfileById(int userId)
        {
            var org = await _context.Organizations
                .Include(x => x.User)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.Type)
                .SingleOrDefaultAsync(x => x.UserId == userId);
            return org;
        }

        public async Task<int> GetLastId()
        {
            var query = _context.Organizations
                .Include(x => x.User)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.Type)
                .AsQueryable();

            if (!await query.AnyAsync()) return -1;

            return (await query.ToListAsync()).Last().OrganizationId;
        }

        public async Task<PagedResultDto<PublicOrganizationDTO>> GetPublicOrganizationsAsync(PublicOrganizationFiltersDTO filters)
        {
            var query = _context.Organizations
                .Include(o => o.Type)
                .Where(o => o.IsActive == true); // Only active organizations

            // Apply filters
            if (!string.IsNullOrWhiteSpace(filters.Search))
            {
                var searchTerm = filters.Search.ToLower();
                query = query.Where(o => 
                    o.OrganizationName.ToLower().Contains(searchTerm) ||
                    (o.ShortName != null && o.ShortName.ToLower().Contains(searchTerm)) ||
                    (o.Description != null && o.Description.ToLower().Contains(searchTerm)));
            }

            if (filters.TypeId.HasValue)
            {
                query = query.Where(o => o.TypeId == filters.TypeId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filters.Province))
            {
                query = query.Where(o => o.Province == filters.Province);
            }

            if (filters.IsVerified.HasValue)
            {
                query = query.Where(o => o.IsVerified == filters.IsVerified.Value);
            }

            // Order by rating and verification status (verified first, then by rating)
            query = query.OrderByDescending(o => o.IsVerified)
                         .ThenByDescending(o => o.Rating)
                         .ThenByDescending(o => o.RatingCount);

            // Get total count
            var totalItems = await query.CountAsync();

            // Apply pagination
            var organizations = await query
                .Skip((filters.Page - 1) * filters.Size)
                .Take(filters.Size)
                .ProjectTo<PublicOrganizationDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PagedResultDto<PublicOrganizationDTO>
            {
                Items = organizations,
                PageNumber = filters.Page,
                PageSize = filters.Size,
                TotalCount = totalItems
            };
        }

        public async Task<PublicOrganizationDTO?> GetPublicOrganizationAsync(int id)
        {
            var organization = await _context.Organizations
                .Include(o => o.Type)
                .Where(o => o.OrganizationId == id && o.IsActive == true)
                .ProjectTo<PublicOrganizationDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            return organization;
        }

        public async Task<IEnumerable<OrganizationType>> GetAllOrganizationTypesAsync()
        {
            return await _context.OrganizationTypes
                .Where(ot => ot.IsActive == true)
                .OrderBy(ot => ot.TypeName)
                .ToListAsync();
        }
    }
}
