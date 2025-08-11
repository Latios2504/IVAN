using ivan_api.DTOs.VolunteerCoordinator;
using ivan_api.Models;
using ivan_api.Repository.VolunteerCoordinatorRepo;
using ivan_api.Constants;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace ivan_api.Services.VolunteerCoordinatorServ;

public class VolunteerCoordinatorService : IVolunteerCoordinatorService
{
    private readonly IVolunteerCoordinatorRepository _coordinatorRepository;
    private readonly VolunteerManagementSystemContext _context;

    public VolunteerCoordinatorService(
        IVolunteerCoordinatorRepository coordinatorRepository,
        VolunteerManagementSystemContext context)
    {
        _coordinatorRepository = coordinatorRepository;
        _context = context;
    }

    public async Task<VolunteerCoordinatorListResponseDto> GetCoordinatorsByOrganizationAsync(int organizationId, VolunteerCoordinatorFilterDto filter)
    {
        return await _coordinatorRepository.GetCoordinatorsByOrganizationAsync(organizationId, filter);
    }

    public async Task<VolunteerCoordinatorDto?> GetCoordinatorByIdAsync(int coordinatorId)
    {
        var coordinator = await _coordinatorRepository.GetCoordinatorByIdAsync(coordinatorId);
        if (coordinator == null) return null;

        return MapToDto(coordinator);
    }

    public async Task<VolunteerCoordinatorDto?> GetCoordinatorByUserIdAsync(int userId)
    {
        var coordinator = await _coordinatorRepository.GetCoordinatorByUserIdAsync(userId);
        if (coordinator == null) return null;

        return MapToDto(coordinator);
    }

    public async Task<VolunteerCoordinatorDto> CreateCoordinatorAsync(int organizationId, CreateVolunteerCoordinatorDto createDto, int currentUserId)
    {
        // Check if organization exists
        var organization = await _context.Organizations.FindAsync(organizationId);
        if (organization == null)
            throw new ArgumentException("Organization not found");

        // Check if user already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == createDto.Email);
        User user;

        if (existingUser != null)
        {
            // User exists, check if already a coordinator for this organization
            var existingCoordinator = await _coordinatorRepository.IsUserCoordinatorForOrganizationAsync(existingUser.UserId, organizationId);
            if (existingCoordinator)
                throw new InvalidOperationException("User is already a coordinator for this organization");

            user = existingUser;
        }
        else
        {
            // Create new user
            var salt = GenerateSalt();
            var tempPassword = GenerateTemporaryPassword();
            var passwordHash = HashPassword(tempPassword, salt);

            user = new User
            {
                Email = createDto.Email,
                PasswordHash = passwordHash,
                Salt = salt,
                RoleId = AuthenticationConstants.RoleIds.VolunteerCoordinator,
                IsActive = true,
                IsEmailVerified = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create user profile
            var userProfile = new UserProfile
            {
                UserId = user.UserId,
                FirstName = createDto.FirstName,
                LastName = createDto.LastName,
                PhoneNumber = createDto.PhoneNumber,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.UserProfiles.Add(userProfile);
            await _context.SaveChangesAsync();

            // TODO: Send email with temporary password
        }

        // Validate employee ID uniqueness
        if (!string.IsNullOrEmpty(createDto.EmployeeId))
        {
            var isUnique = await _coordinatorRepository.IsEmployeeIdUniqueAsync(createDto.EmployeeId, organizationId);
            if (!isUnique)
                throw new InvalidOperationException("Employee ID already exists in this organization");
        }

        // Validate manager
        if (createDto.ManagerId.HasValue)
        {
            var managerExists = await _coordinatorRepository.IsUserCoordinatorForOrganizationAsync(createDto.ManagerId.Value, organizationId);
            if (!managerExists)
                throw new ArgumentException("Manager must be a coordinator in the same organization");
        }

        // Create coordinator
        var coordinator = new VolunteerCoordinator
        {
            UserId = user.UserId,
            OrganizationId = organizationId,
            EmployeeId = createDto.EmployeeId,
            Position = createDto.Position,
            Department = createDto.Department,
            Responsibilities = createDto.Responsibilities,
            HireDate = createDto.HireDate,
            Salary = createDto.Salary,
            ManagerId = createDto.ManagerId,
            IsActive = true,
            Notes = createDto.Notes,
            CreatedBy = currentUserId,
            RequestedBy = organizationId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdCoordinator = await _coordinatorRepository.CreateCoordinatorAsync(coordinator);
        
        // Reload with navigation properties
        var result = await _coordinatorRepository.GetCoordinatorByIdAsync(createdCoordinator.CoordinatorId);
        return MapToDto(result!);
    }

    public async Task<VolunteerCoordinatorDto> UpdateCoordinatorAsync(int coordinatorId, UpdateVolunteerCoordinatorDto updateDto, int currentUserId)
    {
        var coordinator = await _coordinatorRepository.GetCoordinatorByIdAsync(coordinatorId);
        if (coordinator == null)
            throw new ArgumentException("Coordinator not found");

        // Validate employee ID uniqueness
        if (!string.IsNullOrEmpty(updateDto.EmployeeId))
        {
            var isUnique = await _coordinatorRepository.IsEmployeeIdUniqueAsync(updateDto.EmployeeId, coordinator.OrganizationId, coordinatorId);
            if (!isUnique)
                throw new InvalidOperationException("Employee ID already exists in this organization");
        }

        // Validate manager
        if (updateDto.ManagerId.HasValue)
        {
            var managerExists = await _coordinatorRepository.IsUserCoordinatorForOrganizationAsync(updateDto.ManagerId.Value, coordinator.OrganizationId);
            if (!managerExists)
                throw new ArgumentException("Manager must be a coordinator in the same organization");
        }

        // Update fields
        coordinator.EmployeeId = updateDto.EmployeeId;
        coordinator.Position = updateDto.Position;
        coordinator.Department = updateDto.Department;
        coordinator.Responsibilities = updateDto.Responsibilities;
        coordinator.HireDate = updateDto.HireDate;
        coordinator.EndDate = updateDto.EndDate;
        coordinator.Salary = updateDto.Salary;
        coordinator.ManagerId = updateDto.ManagerId;
        coordinator.Notes = updateDto.Notes;

        if (updateDto.IsActive.HasValue)
        {
            coordinator.IsActive = updateDto.IsActive.Value;
            if (!updateDto.IsActive.Value && !coordinator.EndDate.HasValue)
            {
                coordinator.EndDate = DateOnly.FromDateTime(DateTime.UtcNow);
            }
        }

        var updatedCoordinator = await _coordinatorRepository.UpdateCoordinatorAsync(coordinator);
        return MapToDto(updatedCoordinator);
    }

    public async Task<bool> DeleteCoordinatorAsync(int coordinatorId, int currentUserId)
    {
        var coordinator = await _coordinatorRepository.GetCoordinatorByIdAsync(coordinatorId);
        if (coordinator == null) return false;

        // Check if coordinator has dependent records (events, schedules, tasks)
        var hasEvents = await _context.Events.AnyAsync(e => e.CreatedBy == coordinator.UserId);
        var hasSchedules = await _context.CoordinatorSchedules.AnyAsync(cs => cs.CoordinatorId == coordinator.UserId);
        var hasTasks = await _context.CoordinatorTasks.AnyAsync(ct => ct.CoordinatorId == coordinator.UserId);

        if (hasEvents || hasSchedules || hasTasks)
        {
            // Soft delete - deactivate instead of removing
            return await _coordinatorRepository.DeleteCoordinatorAsync(coordinatorId);
        }
        else
        {
            // Hard delete if no dependencies
            _context.VolunteerCoordinators.Remove(coordinator);
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public async Task<bool> IsUserCoordinatorForOrganizationAsync(int userId, int organizationId)
    {
        return await _coordinatorRepository.IsUserCoordinatorForOrganizationAsync(userId, organizationId);
    }

    public async Task<VolunteerCoordinatorStatsDto> GetCoordinatorStatsAsync(int organizationId)
    {
        return await _coordinatorRepository.GetCoordinatorStatsAsync(organizationId);
    }

    public async Task<List<VolunteerCoordinatorDto>> GetAvailableManagersAsync(int organizationId)
    {
        var managers = await _coordinatorRepository.GetAvailableManagersAsync(organizationId);
        return managers.Select(MapToDto).ToList();
    }

    private VolunteerCoordinatorDto MapToDto(VolunteerCoordinator coordinator)
    {
        return new VolunteerCoordinatorDto
        {
            CoordinatorId = coordinator.CoordinatorId,
            UserId = coordinator.UserId,
            OrganizationId = coordinator.OrganizationId,
            EmployeeId = coordinator.EmployeeId,
            Position = coordinator.Position,
            Department = coordinator.Department,
            Responsibilities = coordinator.Responsibilities,
            HireDate = coordinator.HireDate,
            EndDate = coordinator.EndDate,
            Salary = coordinator.Salary,
            ManagerId = coordinator.ManagerId,
            IsActive = coordinator.IsActive,
            Notes = coordinator.Notes,
            CreatedBy = coordinator.CreatedBy,
            RequestedBy = coordinator.RequestedBy,
            CreatedAt = coordinator.CreatedAt,
            UpdatedAt = coordinator.UpdatedAt,
            OrganizationName = coordinator.Organization?.OrganizationName,
            User = coordinator.User != null ? new UserInformationDto
            {
                UserId = coordinator.User.UserId,
                Email = coordinator.User.Email,
                FullName = coordinator.User.UserProfiles.FirstOrDefault()?.FullName,
                PhoneNumber = coordinator.User.UserProfiles.FirstOrDefault()?.PhoneNumber,
                Avatar = coordinator.User.UserProfiles.FirstOrDefault()?.Avatar
            } : null,
            Manager = coordinator.Manager != null ? new UserInformationDto
            {
                UserId = coordinator.Manager.UserId,
                Email = coordinator.Manager.Email,
                FullName = coordinator.Manager.UserProfiles.FirstOrDefault()?.FullName,
                PhoneNumber = coordinator.Manager.UserProfiles.FirstOrDefault()?.PhoneNumber,
                Avatar = coordinator.Manager.UserProfiles.FirstOrDefault()?.Avatar
            } : null,
            CreatedByUser = coordinator.CreatedByNavigation != null ? new UserInformationDto
            {
                UserId = coordinator.CreatedByNavigation.UserId,
                Email = coordinator.CreatedByNavigation.Email,
                FullName = coordinator.CreatedByNavigation.UserProfiles.FirstOrDefault()?.FullName,
                PhoneNumber = coordinator.CreatedByNavigation.UserProfiles.FirstOrDefault()?.PhoneNumber,
                Avatar = coordinator.CreatedByNavigation.UserProfiles.FirstOrDefault()?.Avatar
            } : null
        };
    }

    private string GenerateSalt()
    {
        byte[] saltBytes = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(saltBytes);
        }
        return Convert.ToBase64String(saltBytes);
    }

    private string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 12)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }

    private string HashPassword(string password, string salt)
    {
        using var sha256 = SHA256.Create();
        var saltedPassword = password + salt;
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
        return Convert.ToBase64String(hashedBytes);
    }
}
