using ivan_api.DTOs.VolunteerCoordinator;
using ivan_api.Models;

namespace ivan_api.Repository.VolunteerCoordinatorRepo;

public interface IVolunteerCoordinatorRepository
{
    Task<VolunteerCoordinatorListResponseDto> GetCoordinatorsByOrganizationAsync(int organizationId, VolunteerCoordinatorFilterDto filter);
    Task<VolunteerCoordinator?> GetCoordinatorByIdAsync(int coordinatorId);
    Task<VolunteerCoordinator?> GetCoordinatorByUserIdAsync(int userId);
    Task<VolunteerCoordinator> CreateCoordinatorAsync(VolunteerCoordinator coordinator);
    Task<VolunteerCoordinator> UpdateCoordinatorAsync(VolunteerCoordinator coordinator);
    Task<bool> DeleteCoordinatorAsync(int coordinatorId);
    Task<bool> IsUserCoordinatorForOrganizationAsync(int userId, int organizationId);
    Task<VolunteerCoordinatorStatsDto> GetCoordinatorStatsAsync(int organizationId);
    Task<List<VolunteerCoordinator>> GetAvailableManagersAsync(int organizationId);
    Task<bool> ExistsAsync(int coordinatorId);
    Task<bool> IsEmployeeIdUniqueAsync(string employeeId, int organizationId, int? excludeCoordinatorId = null);
}
