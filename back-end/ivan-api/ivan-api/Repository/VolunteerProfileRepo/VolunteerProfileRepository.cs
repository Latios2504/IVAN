using ivan_api.Models;
using Microsoft.EntityFrameworkCore;
using ivan_api.DTOs.VolunteerProfile;
using AutoMapper.QueryableExtensions;
using ivan_api.DTOs.Common;
using AutoMapper;

namespace ivan_api.Repository.VolunteerProfileRepo
{
    public class VolunteerProfileRepository : IVolunteerProfileRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMapper _mapper;

        public VolunteerProfileRepository(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> AddVolunteerProfile(VolunteerProfile volunteerProfile)
        {
            await _context.VolunteerProfiles.AddAsync(volunteerProfile);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateVolunteerProfile(VolunteerProfile volunteerProfile){
            // Đừng Clear() ở đây
            _context.VolunteerProfiles.Update(volunteerProfile); // track cả graph nếu navigation được set

            // Nếu chắc chắn có UserProfile đã chỉnh sửa:
            var userProfile = volunteerProfile.User?.UserProfiles?.FirstOrDefault();
            if (userProfile != null)
            {
                _context.Entry(userProfile).State = EntityState.Modified;
            }

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<PagedResultDto<VolunteerProfileViewModel>> GetVolunteerProfilesAsync(int PageNumber, int PageSize)
        {
            var query = _context.VolunteerProfiles
                .Include(x => x.User)
                    .ThenInclude(u => u.UserProfiles)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.VolunteerSkills)
                    .ThenInclude(vs => vs.Skill)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ProjectTo<VolunteerProfileViewModel>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PagedResultDto<VolunteerProfileViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }

        public async Task<VolunteerProfile?> GetVolunteerProfileById(int userId)
        {
            var volunteer = await _context.VolunteerProfiles
                .Include(x => x.User)
                    .ThenInclude(u => u.UserProfiles)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.VolunteerSkills)
                    .ThenInclude(vs => vs.Skill)
                .SingleOrDefaultAsync(x => x.UserId == userId);
            return volunteer;
        }

        public async Task<VolunteerProfile?> GetVolunteerProfileByVolunteerId(int volunteerId)
        {
            var volunteer = await _context.VolunteerProfiles
                .Include(x => x.User)
                    .ThenInclude(u => u.UserProfiles)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.VolunteerSkills)
                    .ThenInclude(vs => vs.Skill)
                .SingleOrDefaultAsync(x => x.VolunteerId == volunteerId);
            return volunteer;
        }

        public async Task<int> GetLastId()
        {
            var query = _context.VolunteerProfiles
                .Include(x => x.User)
                    .ThenInclude(u => u.UserProfiles)
                .Include(x => x.VerifiedByNavigation)
                .Include(x => x.VolunteerSkills)
                    .ThenInclude(vs => vs.Skill)
                .AsQueryable();

            if (!await query.AnyAsync()) return -1;

            return (await query.ToListAsync()).Last().VolunteerId;
        }

        public async Task<PagedResultDto<PublicVolunteerDTO>> GetPublicVolunteersAsync(PublicVolunteerFiltersDTO filters)
        {
            var query = _context.VolunteerProfiles
                .Include(v => v.User)
                    .ThenInclude(u => u.UserProfiles)
                .Include(v => v.VolunteerSkills)
                    .ThenInclude(vs => vs.Skill)
                .Where(v => v.User.IsActive == true); // Only active users

            // Apply filters
            if (!string.IsNullOrWhiteSpace(filters.Search))
            {
                var searchTerm = filters.Search.ToLower();
                query = query.Where(v => 
                    v.User.UserProfiles.Any(up => up.FullName.ToLower().Contains(searchTerm)) ||
                    (v.Motivation != null && v.Motivation.ToLower().Contains(searchTerm)) ||
                    (v.University != null && v.University.ToLower().Contains(searchTerm)) ||
                    (v.Major != null && v.Major.ToLower().Contains(searchTerm)));
            }

            if (filters.SkillId.HasValue)
            {
                query = query.Where(v => v.VolunteerSkills.Any(vs => vs.SkillId == filters.SkillId.Value));
            }

            if (!string.IsNullOrWhiteSpace(filters.University))
            {
                query = query.Where(v => v.University == filters.University);
            }

            if (!string.IsNullOrWhiteSpace(filters.Province))
            {
                query = query.Where(v => v.User.UserProfiles.Any(up => up.Province == filters.Province));
            }

            if (filters.IsVerified.HasValue)
            {
                query = query.Where(v => v.IsVerified == filters.IsVerified.Value);
            }

            // Order by verification status (verified first), then by rating and volunteer hours
            query = query.OrderByDescending(v => v.IsVerified)
                         .ThenByDescending(v => v.Rating)
                         .ThenByDescending(v => v.VolunteerHours);

            // Get total count
            var totalItems = await query.CountAsync();

            // Apply pagination
            var volunteers = await query
                .Skip((filters.Page - 1) * filters.Size)
                .Take(filters.Size)
                .ProjectTo<PublicVolunteerDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PagedResultDto<PublicVolunteerDTO>
            {
                Items = volunteers,
                PageNumber = filters.Page,
                PageSize = filters.Size,
                TotalCount = totalItems
            };
        }

        public async Task<PublicVolunteerDTO?> GetPublicVolunteerAsync(int id)
        {
            var volunteer = await _context.VolunteerProfiles
                .Include(v => v.User)
                    .ThenInclude(u => u.UserProfiles)
                .Include(v => v.VolunteerSkills)
                    .ThenInclude(vs => vs.Skill)
                .Where(v => v.VolunteerId == id && v.User.IsActive == true)
                .ProjectTo<PublicVolunteerDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            return volunteer;
        }

        public async Task<IEnumerable<Skill>> GetAllSkillsAsync()
        {
            return await _context.Skills
                .Where(s => s.IsActive == true)
                .OrderBy(s => s.SkillName)
                .ToListAsync();
        }
    }
}
