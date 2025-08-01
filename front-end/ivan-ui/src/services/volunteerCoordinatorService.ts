import { apiClient } from "./apiClient";
import type {
  VolunteerCoordinatorDto,
  CreateVolunteerCoordinatorDto,
  UpdateVolunteerCoordinatorDto,
  VolunteerCoordinatorFilterDto,
  VolunteerCoordinatorStatsDto,
  VolunteerCoordinatorHierarchyDto,
  ManagementLevelDto,
  SpecializationDto,
  PagedResultDto,
} from "../types/volunteer-coordinator";
import type { ApiResponse } from "../types/common";

class VolunteerCoordinatorService {
  private readonly baseUrl = "/api/volunteer-coordinators";

  // Volunteer Coordinator CRUD Operations
  async getOrganizationCoordinators(
    filters: VolunteerCoordinatorFilterDto
  ): Promise<PagedResultDto<VolunteerCoordinatorDto>> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.managementLevels?.length) {
      filters.managementLevels.forEach((level) =>
        params.append("managementLevels", level)
      );
    }
    if (filters.isActive !== undefined)
      params.append("isActive", filters.isActive.toString());
    if (filters.specializations?.length) {
      filters.specializations.forEach((spec) =>
        params.append("specializations", spec)
      );
    }
    if (filters.minVolunteersManaged)
      params.append(
        "minVolunteersManaged",
        filters.minVolunteersManaged.toString()
      );
    if (filters.maxVolunteersManaged)
      params.append(
        "maxVolunteersManaged",
        filters.maxVolunteersManaged.toString()
      );
    if (filters.dateJoinedFrom)
      params.append("dateJoinedFrom", filters.dateJoinedFrom);
    if (filters.dateJoinedTo)
      params.append("dateJoinedTo", filters.dateJoinedTo);
    if (filters.managerCoordinatorId)
      params.append(
        "managerCoordinatorId",
        filters.managerCoordinatorId.toString()
      );
    if (filters.hasManagerOnly !== undefined)
      params.append("hasManagerOnly", filters.hasManagerOnly.toString());

    // Pagination and sorting
    params.append("page", (filters.page || 1).toString());
    params.append("size", (filters.size || 20).toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortDirection)
      params.append("sortDirection", filters.sortDirection);

    const response = await apiClient.get<
      PagedResultDto<VolunteerCoordinatorDto>
    >(`${this.baseUrl}?${params}`);
    return response.data;
  }

  async getCoordinatorById(
    coordinatorId: number
  ): Promise<VolunteerCoordinatorDto> {
    const response = await apiClient.get<VolunteerCoordinatorDto>(
      `${this.baseUrl}/${coordinatorId}`
    );
    return response.data;
  }

  async createCoordinator(
    coordinatorData: CreateVolunteerCoordinatorDto
  ): Promise<number> {
    const response = await apiClient.post<ApiResponse<number>>(
      this.baseUrl,
      coordinatorData
    );
    return response.data.data!;
  }

  async updateCoordinator(
    coordinatorId: number,
    coordinatorData: UpdateVolunteerCoordinatorDto
  ): Promise<void> {
    await apiClient.put<ApiResponse<void>>(
      `${this.baseUrl}/${coordinatorId}`,
      coordinatorData
    );
  }

  async deleteCoordinator(coordinatorId: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(
      `${this.baseUrl}/${coordinatorId}`
    );
  }

  // Stats & Analytics
  async getCoordinatorStats(): Promise<VolunteerCoordinatorStatsDto> {
    const response = await apiClient.get<VolunteerCoordinatorStatsDto>(
      `${this.baseUrl}/stats`
    );
    return response.data;
  }

  // Hierarchy Management
  async getCoordinatorHierarchy(): Promise<VolunteerCoordinatorHierarchyDto[]> {
    const response = await apiClient.get<VolunteerCoordinatorHierarchyDto[]>(
      `${this.baseUrl}/hierarchy`
    );
    return response.data;
  }

  // Lookup Data
  async getManagementLevels(): Promise<ManagementLevelDto[]> {
    const response = await apiClient.get<ManagementLevelDto[]>(
      `${this.baseUrl}/management-levels`
    );
    return response.data;
  }

  async getSpecializations(): Promise<SpecializationDto[]> {
    const response = await apiClient.get<SpecializationDto[]>(
      `${this.baseUrl}/specializations`
    );
    return response.data;
  }

  // Utility Methods
  async getAvailableManagers(): Promise<VolunteerCoordinatorDto[]> {
    const response = await apiClient.get<VolunteerCoordinatorDto[]>(
      `${this.baseUrl}/available-managers`
    );
    return response.data;
  }

  async getCoordinatorsByLevel(
    level: string
  ): Promise<VolunteerCoordinatorDto[]> {
    const response = await apiClient.get<VolunteerCoordinatorDto[]>(
      `${this.baseUrl}/by-level/${level}`
    );
    return response.data;
  }

  async getActiveCoordinators(): Promise<VolunteerCoordinatorDto[]> {
    const response = await apiClient.get<VolunteerCoordinatorDto[]>(
      `${this.baseUrl}/active`
    );
    return response.data;
  }

  async toggleCoordinatorStatus(coordinatorId: number): Promise<void> {
    await apiClient.patch<ApiResponse<void>>(
      `${this.baseUrl}/${coordinatorId}/toggle-status`
    );
  }

  async assignManager(coordinatorId: number, managerId: number): Promise<void> {
    await apiClient.patch<ApiResponse<void>>(
      `${this.baseUrl}/${coordinatorId}/assign-manager`,
      { managerId }
    );
  }

  async removeManager(coordinatorId: number): Promise<void> {
    await apiClient.patch<ApiResponse<void>>(
      `${this.baseUrl}/${coordinatorId}/remove-manager`
    );
  }
}

export const volunteerCoordinatorService = new VolunteerCoordinatorService();
