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

class VolunteerCoordinatorService  {
  private readonly baseUrl = "/VolunteerCoordinator";

  /**
   * Get organization ID from current user context
   * This should be passed from the component that has access to the auth context
   */
  private getOrganizationIdFromContext(): number {
    // Since services shouldn't directly access React contexts,
    // we'll expect the organization ID to be passed as a parameter
    // For now, return a default value that should be overridden
    throw new Error(
      "Organization ID must be provided as parameter. Services should not access React context directly."
    );
  }

  // Volunteer Coordinator CRUD Operations
  async getOrganizationCoordinators(
    filters: VolunteerCoordinatorFilterDto,
    organizationId?: number
  ): Promise<PagedResultDto<VolunteerCoordinatorDto>> {
    // Organization ID should be passed from the context that has access to auth
    if (!organizationId) {
      throw new Error(
        "Organization ID is required. Please ensure user is authenticated with organization context."
      );
    }

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

    // The API response structure handling
    const backendData = response.data.data;

    // Add null safety check
    if (!backendData || !backendData.coordinators) {
      console.error("Invalid API response structure:", response.data);
      console.error("Full response:", response);
      throw new Error("Invalid response format: coordinators data is missing");
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
    coordinatorData: CreateVolunteerCoordinatorDto,
    organizationId?: number
  ): Promise<number> {
    if (!organizationId) {
      throw new Error("Organization ID is required for creating coordinator.");
    }
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
  async getCoordinatorStats(
    organizationId?: number
  ): Promise<VolunteerCoordinatorStatsDto> {
    if (!organizationId) {
      throw new Error(
        "Organization ID is required for getting coordinator stats."
      );
    }
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
    try {
      const response = await apiClient.get<ManagementLevelDto[]>(
        `${this.baseUrl}/management-levels`
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching management levels:", error);
      // Return empty array instead of mock data
      return [];
    }
  }

  async getSpecializations(): Promise<SpecializationDto[]> {
    try {
      const response = await apiClient.get<SpecializationDto[]>(
        `${this.baseUrl}/specializations`
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching specializations:", error);
      // Return empty array instead of mock data
      return [];
    }
  }

  // Utility Methods
  async getAvailableManagers(
    organizationId?: number
  ): Promise<VolunteerCoordinatorDto[]> {
    if (!organizationId) {
      throw new Error(
        "Organization ID is required for getting available managers."
      );
    }
    const response = await apiClient.get<ApiResponse<VolunteerCoordinatorDto[]>>(
      `${this.baseUrl}/managers/${organizationId}`
    );
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
