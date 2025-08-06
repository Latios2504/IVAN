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
  private readonly baseUrl = "/VolunteerCoordinator";

  // Volunteer Coordinator CRUD Operations
  async getOrganizationCoordinators(
    filters: VolunteerCoordinatorFilterDto
  ): Promise<PagedResultDto<VolunteerCoordinatorDto>> {
    // For now, we'll use the getCoordinatorsByOrganization endpoint
    // We need to get the organization ID from the user context or pass it as a parameter
    const organizationId = 1; // TODO: Get this from user context

    const response = await apiClient.post<
      ApiResponse<{
        coordinators: VolunteerCoordinatorDto[];
        totalCount: number;
        page: number;
        size: number;
        totalPages: number;
      }>
    >(
      `${this.baseUrl}/getCoordinatorsByOrganization/${organizationId}`,
      filters
    );
    
    // The API response structure is: { success: true, message: '...', data: { coordinators: [...], ... } }
    // But based on the error, it seems the data is directly in response.data, not response.data.data
    let backendData = response.data.data;
    
    // If data is not nested, try the direct response data
    if (!backendData && response.data.coordinators) {
      backendData = response.data;
    }
    
    // Add null safety check
    if (!backendData || !backendData.coordinators) {
      console.error('Invalid API response structure:', response.data);
      console.error('Full response:', response);
      throw new Error('Invalid response format: coordinators data is missing');
    }
    
    return {
      items: backendData.coordinators,
      totalCount: backendData.totalCount,
      pageNumber: backendData.page,
      pageSize: backendData.size,
      totalPages: backendData.totalPages,
      hasPreviousPage: backendData.page > 1,
      hasNextPage: backendData.page < backendData.totalPages,
    };
  }

  async getCoordinatorById(
    coordinatorId: number
  ): Promise<VolunteerCoordinatorDto> {
    const response = await apiClient.get<ApiResponse<VolunteerCoordinatorDto>>(
      `${this.baseUrl}/${coordinatorId}`
    );
    return response.data.data!;
  }

  async createCoordinator(
    coordinatorData: CreateVolunteerCoordinatorDto
  ): Promise<number> {
    const organizationId = 1; // TODO: Get this from user context
    const response = await apiClient.post<ApiResponse<number>>(
      `${this.baseUrl}/${organizationId}`,
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
    const organizationId = 1; // TODO: Get this from user context
    const response = await apiClient.get<
      ApiResponse<VolunteerCoordinatorStatsDto>
    >(`${this.baseUrl}/stats/${organizationId}`);
    return response.data.data!;
  }

  // Hierarchy Management
  async getCoordinatorHierarchy(): Promise<VolunteerCoordinatorHierarchyDto[]> {
    const response = await apiClient.get<VolunteerCoordinatorHierarchyDto[]>(
      `${this.baseUrl}/hierarchy`
    );
    return response.data;
  }

  // Lookup Data (Mock implementations since backend doesn't have these endpoints)
  async getManagementLevels(): Promise<ManagementLevelDto[]> {
    // Mock data - replace with actual backend call when available
    return Promise.resolve([
      {
        levelId: 1,
        levelName: "Senior Coordinator",
        description: "Senior level management",
      },
      {
        levelId: 2,
        levelName: "Team Lead",
        description: "Team leadership role",
      },
      {
        levelId: 3,
        levelName: "Coordinator",
        description: "Standard coordinator role",
      },
    ]);
  }

  async getSpecializations(): Promise<SpecializationDto[]> {
    // Mock data - replace with actual backend call when available
    return Promise.resolve([
      {
        specializationId: 1,
        specializationName: "Event Management",
        description: "Event planning and execution",
      },
      {
        specializationId: 2,
        specializationName: "Volunteer Training",
        description: "Training and development",
      },
      {
        specializationId: 3,
        specializationName: "Community Outreach",
        description: "Community engagement",
      },
    ]);
  }

  // Utility Methods
  async getAvailableManagers(): Promise<VolunteerCoordinatorDto[]> {
    const organizationId = 1; // TODO: Get this from user context
    const response = await apiClient.get<
      ApiResponse<VolunteerCoordinatorDto[]>
    >(`${this.baseUrl}/managers/${organizationId}`);
    return response.data.data!;
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
