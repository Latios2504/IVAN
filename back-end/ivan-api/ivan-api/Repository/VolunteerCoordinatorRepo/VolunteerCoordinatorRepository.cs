using ivan_api.DTOs.VolunteerCoordinator;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Repository.VolunteerCoordinatorRepo;

public class VolunteerCoordinatorRepository : IVolunteerCoordinatorRepository
{
    private readonly VolunteerManagementSystemContext _context;

    public VolunteerCoordinatorRepository(VolunteerManagementSystemContext context)
    {
        _context = context;
    }

    public async Task<PagedResultDto<VolunteerCoordinatorDto>> GetCoordinatorsByOrganizationAsync(int organizationId, VolunteerCoordinatorFilterDto filter)
    {
        var query = _context.VolunteerCoordinators
            .Include(vc => vc.User)
                .ThenInclude(u => u.UserProfiles)
            .Include(vc => vc.Manager)
                .ThenInclude(m => m.UserProfiles)
            .Include(vc => vc.CreatedByNavigation)
                .ThenInclude(cb => cb.UserProfiles)
            .Include(vc => vc.Organization)
            .Where(vc => vc.OrganizationId == organizationId);

        // Apply filters
        if (!string.IsNullOrEmpty(filter.Search))
        {
            query = query.Where(vc => 
                vc.User.Email.Contains(filter.Search) ||
                vc.User.UserProfiles.Any(up => 
                    up.FirstName.Contains(filter.Search) || 
                    up.LastName.Contains(filter.Search) ||
                    up.FullName.Contains(filter.Search)) ||
                (vc.EmployeeId != null && vc.EmployeeId.Contains(filter.Search)) ||
                (vc.Position != null && vc.Position.Contains(filter.Search)) ||
                (vc.Department != null && vc.Department.Contains(filter.Search)));
        }

        if (!string.IsNullOrEmpty(filter.Department))
        {
            query = query.Where(vc => vc.Department == filter.Department);
        }

        if (!string.IsNullOrEmpty(filter.Position))
        {
            query = query.Where(vc => vc.Position == filter.Position);
        }

        if (filter.IsActive.HasValue)
        {
            query = query.Where(vc => vc.IsActive == filter.IsActive.Value);
        }

        if (filter.ManagerId.HasValue)
        {
            query = query.Where(vc => vc.ManagerId == filter.ManagerId.Value);
        }

        // Apply sorting
        query = filter.SortBy.ToLower() switch
        {
            "fullname" => filter.SortOrder.ToLower() == "asc" 
                ? query.OrderBy(vc => vc.User.UserProfiles.FirstOrDefault().FullName)
                : query.OrderByDescending(vc => vc.User.UserProfiles.FirstOrDefault().FullName),
            "email" => filter.SortOrder.ToLower() == "asc" 
                ? query.OrderBy(vc => vc.User.Email)
                : query.OrderByDescending(vc => vc.User.Email),
            "position" => filter.SortOrder.ToLower() == "asc" 
                ? query.OrderBy(vc => vc.Position)
                : query.OrderByDescending(vc => vc.Position),
            "department" => filter.SortOrder.ToLower() == "asc" 
                ? query.OrderBy(vc => vc.Department)
                : query.OrderByDescending(vc => vc.Department),
            "hiredate" => filter.SortOrder.ToLower() == "asc" 
                ? query.OrderBy(vc => vc.HireDate)
                : query.OrderByDescending(vc => vc.HireDate),
            "isactive" => filter.SortOrder.ToLower() == "asc" 
                ? query.OrderBy(vc => vc.IsActive)
                : query.OrderByDescending(vc => vc.IsActive),
            _ => filter.SortOrder.ToLower() == "asc" 
                ? query.OrderBy(vc => vc.CreatedAt)
                : query.OrderByDescending(vc => vc.CreatedAt)
        };

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / filter.Size);

        var coordinators = await query
            .Skip((filter.Page - 1) * filter.Size)
            .Take(filter.Size)
            .Select(vc => new VolunteerCoordinatorDto
            {
                CoordinatorId = vc.CoordinatorId,
                UserId = vc.UserId,
                OrganizationId = vc.OrganizationId,
                EmployeeId = vc.EmployeeId,
                Position = vc.Position,
                Department = vc.Department,
                Responsibilities = vc.Responsibilities,
                HireDate = vc.HireDate,
                EndDate = vc.EndDate,
                Salary = vc.Salary,
                ManagerId = vc.ManagerId,
                IsActive = vc.IsActive,
                Notes = vc.Notes,
                CreatedBy = vc.CreatedBy,
                RequestedBy = vc.RequestedBy,
                CreatedAt = vc.CreatedAt,
                UpdatedAt = vc.UpdatedAt,
                OrganizationName = vc.Organization.OrganizationName,
                User = new UserInformationDto
                {
                    UserId = vc.User.UserId,
                    Email = vc.User.Email,
                    FullName = vc.User.UserProfiles.FirstOrDefault().FullName,
                    PhoneNumber = vc.User.UserProfiles.FirstOrDefault().PhoneNumber,
                    Avatar = vc.User.UserProfiles.FirstOrDefault().Avatar
                },
                Manager = vc.Manager != null ? new UserInformationDto
                {
                    UserId = vc.Manager.UserId,
                    Email = vc.Manager.Email,
                    FullName = vc.Manager.UserProfiles.FirstOrDefault().FullName,
                    PhoneNumber = vc.Manager.UserProfiles.FirstOrDefault().PhoneNumber,
                    Avatar = vc.Manager.UserProfiles.FirstOrDefault().Avatar
                } : null,
                CreatedByUser = new UserInformationDto
                {
                    UserId = vc.CreatedByNavigation.UserId,
                    Email = vc.CreatedByNavigation.Email,
                    FullName = vc.CreatedByNavigation.UserProfiles.FirstOrDefault().FullName,
                    PhoneNumber = vc.CreatedByNavigation.UserProfiles.FirstOrDefault().PhoneNumber,
                    Avatar = vc.CreatedByNavigation.UserProfiles.FirstOrDefault().Avatar
                }
            })
            .ToListAsync();

        return new PagedResultDto<VolunteerCoordinatorDto>
        {
            Items = coordinators,
            TotalCount = totalCount,
            PageNumber = filter.Page,
            PageSize = filter.Size
        };
    }

    public async Task<VolunteerCoordinator?> GetCoordinatorByIdAsync(int coordinatorId)
    {
        return await _context.VolunteerCoordinators
            .Include(vc => vc.User)
                .ThenInclude(u => u.UserProfiles)
            .Include(vc => vc.Manager)
                .ThenInclude(m => m.UserProfiles)
            .Include(vc => vc.CreatedByNavigation)
                .ThenInclude(cb => cb.UserProfiles)
            .Include(vc => vc.Organization)
            .FirstOrDefaultAsync(vc => vc.CoordinatorId == coordinatorId);
    }

    public async Task<VolunteerCoordinator?> GetCoordinatorByUserIdAsync(int userId)
    {
        return await _context.VolunteerCoordinators
            .Include(vc => vc.User)
                .ThenInclude(u => u.UserProfiles)
            .Include(vc => vc.Manager)
                .ThenInclude(m => m.UserProfiles)
            .Include(vc => vc.CreatedByNavigation)
                .ThenInclude(cb => cb.UserProfiles)
            .Include(vc => vc.Organization)
            .FirstOrDefaultAsync(vc => vc.UserId == userId && vc.IsActive == true);
    }

    public async Task<VolunteerCoordinator> CreateCoordinatorAsync(VolunteerCoordinator coordinator)
    {
        _context.VolunteerCoordinators.Add(coordinator);
        await _context.SaveChangesAsync();
        return coordinator;
    }

    public async Task<VolunteerCoordinator> UpdateCoordinatorAsync(VolunteerCoordinator coordinator)
    {
        coordinator.UpdatedAt = DateTime.UtcNow;
        _context.VolunteerCoordinators.Update(coordinator);
        await _context.SaveChangesAsync();
        return coordinator;
    }

    public async Task<bool> DeleteCoordinatorAsync(int coordinatorId)
    {
        var coordinator = await _context.VolunteerCoordinators.FindAsync(coordinatorId);
        if (coordinator == null) return false;

        coordinator.IsActive = false;
        coordinator.EndDate = DateOnly.FromDateTime(DateTime.UtcNow);
        coordinator.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsUserCoordinatorForOrganizationAsync(int userId, int organizationId)
    {
        return await _context.VolunteerCoordinators
            .AnyAsync(vc => vc.UserId == userId && vc.OrganizationId == organizationId && vc.IsActive == true);
    }

    public async Task<VolunteerCoordinatorStatsDto> GetCoordinatorStatsAsync(int organizationId)
    {
        var coordinators = await _context.VolunteerCoordinators
            .Where(vc => vc.OrganizationId == organizationId)
            .ToListAsync();

        var stats = new VolunteerCoordinatorStatsDto
        {
            TotalCoordinators = coordinators.Count,
            ActiveCoordinators = coordinators.Count(vc => vc.IsActive == true),
            InactiveCoordinators = coordinators.Count(vc => vc.IsActive == false),
            DepartmentStats = coordinators
                .Where(vc => !string.IsNullOrEmpty(vc.Department))
                .GroupBy(vc => vc.Department)
                .Select(g => new DepartmentStatsDto
                {
                    Department = g.Key!,
                    Count = g.Count()
                })
                .OrderByDescending(ds => ds.Count)
                .ToList(),
            AvailablePositions = coordinators
                .Where(vc => !string.IsNullOrEmpty(vc.Position))
                .Select(vc => vc.Position!)
                .Distinct()
                .OrderBy(p => p)
                .ToList(),
            AvailableDepartments = coordinators
                .Where(vc => !string.IsNullOrEmpty(vc.Department))
                .Select(vc => vc.Department!)
                .Distinct()
                .OrderBy(d => d)
                .ToList()
        };

        return stats;
    }

    public async Task<List<VolunteerCoordinator>> GetAvailableManagersAsync(int organizationId)
    {
        return await _context.VolunteerCoordinators
            .Include(vc => vc.User)
                .ThenInclude(u => u.UserProfiles)
            .Where(vc => vc.OrganizationId == organizationId && vc.IsActive == true)
            .OrderBy(vc => vc.User.UserProfiles.FirstOrDefault().FullName)
            .ToListAsync();
    }

    public async Task<bool> ExistsAsync(int coordinatorId)
    {
        return await _context.VolunteerCoordinators
            .AnyAsync(vc => vc.CoordinatorId == coordinatorId);
    }

    public async Task<bool> IsEmployeeIdUniqueAsync(string employeeId, int organizationId, int? excludeCoordinatorId = null)
    {
        if (string.IsNullOrEmpty(employeeId)) return true;

        var query = _context.VolunteerCoordinators
            .Where(vc => vc.EmployeeId == employeeId && vc.OrganizationId == organizationId);

        if (excludeCoordinatorId.HasValue)
        {
            query = query.Where(vc => vc.CoordinatorId != excludeCoordinatorId.Value);
        }

        return !await query.AnyAsync();
    }
}
