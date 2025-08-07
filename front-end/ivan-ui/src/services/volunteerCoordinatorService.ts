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

  /**
   * Validates that organization ID is provided
   */
  private validateOrganizationId(organizationId?: number): void {
    if (!organizationId) {
      throw new Error(
        "Organization ID is required. Please ensure user is authenticated with organization context."
      );
    }
  }

  /**
   * Handles API response with ApiResponse wrapper
   */
  private handleApiResponse<T>(response: { data: { data: T } }): T {
    return response.data.data;
  }

  /**
   * Handles API response without ApiResponse wrapper
   */
  private handleDirectResponse<T>(response: { data: T }): T {
    return response.data;
  }

  /**
   * Generic error handler for optional endpoints
   */
  private async handleOptionalEndpoint<T>(
    apiCall: () => Promise<{ data: T }>,
    fallbackValue: T,
    errorContext: string
  ): Promise<T> {
    try {
      const response = await apiCall();
      return this.handleDirectResponse(response);
    } catch (error) {
      console.error(`Error fetching ${errorContext}:`, error);
      return fallbackValue;
    }
  }

  /**
   * Helper for PATCH operations that don't return data
   */
  private async handlePatchOperation(
    endpoint: string,
    data?: unknown
  ): Promise<void> {
    await apiClient.patch<ApiResponse<void>>(endpoint, data);
  }

  /**
   * Helper for DELETE operations
   */
  private async handleDeleteOperation(endpoint: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(endpoint);
  }

  /**
   * Helper for PUT operations
   */
  private async handlePutOperation(
    endpoint: string,
    data: unknown
  ): Promise<void> {
    await apiClient.put<ApiResponse<void>>(endpoint, data);
  }

  // ===== VOLUNTEER COORDINATOR CRUD OPERATIONS =====
  async getOrganizationCoordinators(
    filters: VolunteerCoordinatorFilterDto,
    organizationId?: number
  ): Promise<PagedResultDto<VolunteerCoordinatorDto>> {
    // Organization ID should be passed from the context that has access to auth
    this.validateOrganizationId(organizationId);

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
    const backendData = this.handleApiResponse(response);

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
    return this.handleApiResponse(response);
  }

  async createCoordinator(
    coordinatorData: CreateVolunteerCoordinatorDto,
    organizationId?: number
  ): Promise<number> {
    this.validateOrganizationId(organizationId);
    const response = await apiClient.post<ApiResponse<number>>(
      `${this.baseUrl}/${organizationId}`,
      coordinatorData
    );
    return this.handleApiResponse(response);
  }

  async updateCoordinator(
    coordinatorId: number,
    coordinatorData: UpdateVolunteerCoordinatorDto
  ): Promise<void> {
    return this.handlePutOperation(
      `${this.baseUrl}/${coordinatorId}`,
      coordinatorData
    );
  }

  async deleteCoordinator(coordinatorId: number): Promise<void> {
    return this.handleDeleteOperation(`${this.baseUrl}/${coordinatorId}`);
  }

  // ===== STATS & ANALYTICS =====

  async getCoordinatorStats(
    organizationId?: number
  ): Promise<VolunteerCoordinatorStatsDto> {
    this.validateOrganizationId(organizationId);
    const response = await apiClient.get<
      ApiResponse<VolunteerCoordinatorStatsDto>
    >(`${this.baseUrl}/stats/${organizationId}`);
    return this.handleApiResponse(response);
  }

  // ===== HIERARCHY MANAGEMENT =====

  async getCoordinatorHierarchy(): Promise<VolunteerCoordinatorHierarchyDto[]> {
    const response = await apiClient.get<VolunteerCoordinatorHierarchyDto[]>(
      `${this.baseUrl}/hierarchy`
    );
    return this.handleDirectResponse(response);
  }

  // ===== LOOKUP DATA =====

  async getManagementLevels(): Promise<ManagementLevelDto[]> {
    return this.handleOptionalEndpoint(
      () =>
        apiClient.get<ManagementLevelDto[]>(
          `${this.baseUrl}/management-levels`
        ),
      [],
      "management levels"
    );
  }

  async getSpecializations(): Promise<SpecializationDto[]> {
    return this.handleOptionalEndpoint(
      () =>
        apiClient.get<SpecializationDto[]>(`${this.baseUrl}/specializations`),
      [],
      "specializations"
    );
  }

  // ===== UTILITY METHODS =====

  async getAvailableManagers(
    organizationId?: number
  ): Promise<VolunteerCoordinatorDto[]> {
    this.validateOrganizationId(organizationId);
    const response = await apiClient.get<
      ApiResponse<VolunteerCoordinatorDto[]>
    >(`${this.baseUrl}/managers/${organizationId}`);
    return this.handleApiResponse(response);
  }

  async getCoordinatorsByLevel(
    level: string
  ): Promise<VolunteerCoordinatorDto[]> {
    const response = await apiClient.get<VolunteerCoordinatorDto[]>(
      `${this.baseUrl}/by-level/${level}`
    );
    return this.handleDirectResponse(response);
  }

  async getActiveCoordinators(): Promise<VolunteerCoordinatorDto[]> {
    const response = await apiClient.get<VolunteerCoordinatorDto[]>(
      `${this.baseUrl}/active`
    );
    return this.handleDirectResponse(response);
  }

  // ===== COORDINATOR MANAGEMENT OPERATIONS =====

  async toggleCoordinatorStatus(coordinatorId: number): Promise<void> {
    return this.handlePatchOperation(
      `${this.baseUrl}/${coordinatorId}/toggle-status`
    );
  }

  async assignManager(coordinatorId: number, managerId: number): Promise<void> {
    return this.handlePatchOperation(
      `${this.baseUrl}/${coordinatorId}/assign-manager`,
      { managerId }
    );
  }

  async removeManager(coordinatorId: number): Promise<void> {
    return this.handlePatchOperation(
      `${this.baseUrl}/${coordinatorId}/remove-manager`
    );
  }
}

export const volunteerCoordinatorService = new VolunteerCoordinatorService();
