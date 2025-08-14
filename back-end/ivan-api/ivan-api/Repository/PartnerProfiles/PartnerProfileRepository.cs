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

        public async Task<Partner?> GetPartnerProfileById(int userId)
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

            if (!await query.AnyAsync()) return -1;

            return (await query.ToListAsync()).Last().PartnerId;
        }

        public async Task<PagedResultDto<PublicPartnerDTO>> GetPublicPartnersAsync(PublicPartnerFiltersDTO filters)
        {
            var query = _context.Partners
                .Include(p => p.Industry)
                .Where(p => p.IsActive == true); // Only active partners

            // Apply filters
            if (!string.IsNullOrWhiteSpace(filters.Search))
            {
                var searchTerm = filters.Search.ToLower();
                query = query.Where(p => 
                    p.CompanyName.ToLower().Contains(searchTerm) ||
                    (p.Description != null && p.Description.ToLower().Contains(searchTerm)));
            }

            if (filters.IndustryId.HasValue)
            {
                query = query.Where(p => p.IndustryId == filters.IndustryId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filters.Province))
            {
                query = query.Where(p => p.Province == filters.Province);
            }

            if (filters.IsVerified.HasValue)
            {
                query = query.Where(p => p.IsVerified == filters.IsVerified.Value);
            }

            // Order by verification status (verified first), then by rating and collaboration count
            query = query.OrderByDescending(p => p.IsVerified)
                         .ThenByDescending(p => p.Rating)
                         .ThenByDescending(p => p.TotalCollaborations);

            // Get total count
            var totalItems = await query.CountAsync();

            // Apply pagination
            var partners = await query
                .Skip((filters.Page - 1) * filters.Size)
                .Take(filters.Size)
                .ProjectTo<PublicPartnerDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PagedResultDto<PublicPartnerDTO>
            {
                Items = partners,
                PageNumber = filters.Page,
                PageSize = filters.Size,
                TotalCount = totalItems
            };
        }

        public async Task<PublicPartnerDTO?> GetPublicPartnerAsync(int id)
        {
            var partner = await _context.Partners
                .Include(p => p.Industry)
                .Where(p => p.PartnerId == id && p.IsActive == true)
                .ProjectTo<PublicPartnerDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            return partner;
        }

        public async Task<IEnumerable<PartnerIndustry>> GetAllPartnerIndustriesAsync()
        {
            return await _context.PartnerIndustries
                .Where(pi => pi.IsActive == true)
                .OrderBy(pi => pi.IndustryName)
                .ToListAsync();
        }
    }
}
