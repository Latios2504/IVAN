using ivan_api.DTOs.VolunteerCoordinator;

namespace ivan_api.Services.VolunteerCoordinatorServ;

public interface IVolunteerCoordinatorService
{
    Task<VolunteerCoordinatorListResponseDto> GetCoordinatorsByOrganizationAsync(int organizationId, VolunteerCoordinatorFilterDto filter);
    Task<VolunteerCoordinatorDto?> GetCoordinatorByIdAsync(int coordinatorId);
    Task<VolunteerCoordinatorDto?> GetCoordinatorByUserIdAsync(int userId);
    Task<VolunteerCoordinatorDto> CreateCoordinatorAsync(int organizationId, CreateVolunteerCoordinatorDto createDto, int currentUserId);
    Task<VolunteerCoordinatorDto> UpdateCoordinatorAsync(int coordinatorId, UpdateVolunteerCoordinatorDto updateDto, int currentUserId);
    Task<bool> DeleteCoordinatorAsync(int coordinatorId, int currentUserId);
    Task<bool> IsUserCoordinatorForOrganizationAsync(int userId, int organizationId);
    Task<VolunteerCoordinatorStatsDto> GetCoordinatorStatsAsync(int organizationId);
    Task<List<VolunteerCoordinatorDto>> GetAvailableManagersAsync(int organizationId);
}
