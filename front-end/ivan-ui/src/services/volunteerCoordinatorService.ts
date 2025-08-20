// Volunteer Coordinator Service - Matching backend VolunteerCoordinatorController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  VolunteerCoordinatorDto,
  CreateVolunteerCoordinatorDto,
  UpdateVolunteerCoordinatorDto,
  VolunteerCoordinatorFilterDto,
  VolunteerCoordinatorStatsDto,
  ManagementLevelDto,
  SpecializationDto,
} from "../types/volunteerCoordinator";
import { DEFAULT_COORDINATOR_FILTER } from "../types/volunteerCoordinator";

class VolunteerCoordinatorService {
  private readonly baseUrl = "/VolunteerCoordinator";

  // Helper function to handle .NET JSON serialization format
  private extractDataFromNetResponse<T>(data: T | any): T {
    // If data has $values property (common with .NET JSON serialization), extract it
    if (data && typeof data === "object" && "$values" in data) {
      return data.$values as T;
    }
    return data;
  }

  // === COORDINATOR MANAGEMENT ENDPOINTS ===

  // POST /api/VolunteerCoordinator/getCoordinatorsByOrganization/{organizationId} - Get Coordinators by Organization (with filtering)
  async getCoordinatorsByOrganization(
    organizationId: number,
    filter: Partial<VolunteerCoordinatorFilterDto> = {}
  ): Promise<PagedResultDto<VolunteerCoordinatorDto>> {
    const filterWithDefaults = { ...DEFAULT_COORDINATOR_FILTER, ...filter };

    const response = await apiClient.post<PagedResultDto<VolunteerCoordinatorDto>>(
      `${this.baseUrl}/getCoordinatorsByOrganization/${organizationId}`,
      filterWithDefaults
    );

    if (!response.data) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    // Handle .NET JSON serialization format
    const extractedData = this.extractDataFromNetResponse(response.data);

    // If items array is wrapped in $values, extract it
    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<VolunteerCoordinatorDto>;
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<VolunteerCoordinatorDto>;
  }

  // GET /api/VolunteerCoordinator/{coordinatorId} - Get Coordinator by ID
  async getCoordinatorById(
    coordinatorId: number
  ): Promise<VolunteerCoordinatorDto> {
    const response = await apiClient.get<VolunteerCoordinatorDto>(
      `${this.baseUrl}/${coordinatorId}`
    );
    if (!response.data) {
      throw new Error("Coordinator not found");
    }
    return response.data;
  }

  // GET /api/VolunteerCoordinator/byUser/{userId} - Get Coordinator by User ID
  async getCoordinatorByUserId(
    userId: number
  ): Promise<VolunteerCoordinatorDto> {
    const response = await apiClient.get<VolunteerCoordinatorDto>(
      `${this.baseUrl}/byUser/${userId}`
    );
    if (!response.data) {
      throw new Error("Coordinator not found");
    }
    return response.data;
  }

  // POST /api/VolunteerCoordinator/{organizationId} - Create Coordinator
  async createCoordinator(
    organizationId: number,
    createDto: CreateVolunteerCoordinatorDto
  ): Promise<VolunteerCoordinatorDto> {
    const response = await apiClient.post<VolunteerCoordinatorDto>(
      `${this.baseUrl}/${organizationId}`,
      createDto
    );
    if (!response.data) {
      throw new Error("Failed to create coordinator");
    }
    return response.data;
  }

  // PUT /api/VolunteerCoordinator/{coordinatorId} - Update Coordinator
  async updateCoordinator(
    coordinatorId: number,
    updateDto: UpdateVolunteerCoordinatorDto
  ): Promise<VolunteerCoordinatorDto> {
    const response = await apiClient.put<VolunteerCoordinatorDto>(
      `${this.baseUrl}/${coordinatorId}`,
      updateDto
    );
    if (!response.data) {
      throw new Error("Failed to update coordinator");
    }
    return response.data;
  }

  // DELETE /api/VolunteerCoordinator/{coordinatorId} - Delete/Deactivate Coordinator
  async deleteCoordinator(coordinatorId: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${coordinatorId}`);
  }

  // === STATISTICS AND REPORTING ENDPOINTS ===

  // GET /api/VolunteerCoordinator/stats/{organizationId} - Get Coordinator Statistics
  async getCoordinatorStats(
    organizationId: number
  ): Promise<VolunteerCoordinatorStatsDto> {
    const response = await apiClient.get<VolunteerCoordinatorStatsDto>(
      `${this.baseUrl}/stats/${organizationId}`
    );
    if (!response.data) {
      return {
        totalCoordinators: 0,
        activeCoordinators: 0,
        inactiveCoordinators: 0,
        departmentStats: [],
        availablePositions: [],
        availableDepartments: [],
      };
    }

    // Handle .NET JSON serialization format for arrays
    const stats = response.data;
    if (stats.departmentStats && Array.isArray(stats.departmentStats)) {
      stats.departmentStats = this.extractDataFromNetResponse(
        stats.departmentStats
      );
    }
    if (stats.availablePositions && Array.isArray(stats.availablePositions)) {
      stats.availablePositions = this.extractDataFromNetResponse(
        stats.availablePositions
      );
    }
    if (
      stats.availableDepartments &&
      Array.isArray(stats.availableDepartments)
    ) {
      stats.availableDepartments = this.extractDataFromNetResponse(
        stats.availableDepartments
      );
    }

    return stats;
  }

  // GET /api/VolunteerCoordinator/managers/{organizationId} - Get Available Managers
  async getAvailableManagers(
    organizationId: number
  ): Promise<VolunteerCoordinatorDto[]> {
    const response = await apiClient.get<VolunteerCoordinatorDto[]>(
      `${this.baseUrl}/managers/${organizationId}`
    );

    if (!response.success || !response.data) {
      console.warn("Failed to load managers or received empty data:", response);
      return [];
    }

    // Handle .NET JSON serialization format
    const extractedData = this.extractDataFromNetResponse(response.data);

    // Ensure the data is an array
    if (!Array.isArray(extractedData)) {
      console.warn(
        "Expected managers data to be an array, received:",
        typeof extractedData,
        extractedData
      );
      return [];
    }

    return extractedData;
  }

  // GET /api/VolunteerCoordinator/check/{userId}/{organizationId} - Check if User is Coordinator for Organization
  async isUserCoordinatorForOrganization(
    userId: number,
    organizationId: number
  ): Promise<boolean> {
    const response = await apiClient.get<boolean>(
      `${this.baseUrl}/check/${userId}/${organizationId}`
    );
    return response.data || false;
  }

  // === UTILITY METHODS ===

  // Get management levels (mock data since backend doesn't have this endpoint)
  async getManagementLevels(): Promise<ManagementLevelDto[]> {
    // Since the backend doesn't have management levels endpoint,
    // we'll return mock data or derive from positions
    return [
      { id: 1, name: "Senior", description: "Senior level coordinator" },
      { id: 2, name: "Mid-level", description: "Mid-level coordinator" },
      { id: 3, name: "Junior", description: "Junior level coordinator" },
    ];
  }

  // Get specializations (mock data since backend doesn't have this endpoint)
  async getSpecializations(): Promise<SpecializationDto[]> {
    // Since the backend doesn't have specializations endpoint,
    // we'll return mock data or derive from departments
    return [
      {
        id: 1,
        name: "Event Management",
        description: "Event coordination and management",
      },
      {
        id: 2,
        name: "Volunteer Training",
        description: "Training and development",
      },
      {
        id: 3,
        name: "Community Outreach",
        description: "Community engagement",
      },
      {
        id: 4,
        name: "Project Management",
        description: "Project coordination",
      },
    ];
  }

  // Add alias method for compatibility with the main page
  async getOrganizationCoordinators(
    filter: Partial<VolunteerCoordinatorFilterDto>,
    organizationId: number
  ): Promise<PagedResultDto<VolunteerCoordinatorDto>> {
    return this.getCoordinatorsByOrganization(organizationId, filter);
  }

  // Note: getCurrentUserCoordinator method removed - no corresponding backend endpoint

  // Helper method to validate coordinator data before creation/update
  validateCoordinatorData(
    data: CreateVolunteerCoordinatorDto | UpdateVolunteerCoordinatorDto
  ): string[] {
    const errors: string[] = [];

    if ("email" in data) {
      // Validation for CreateVolunteerCoordinatorDto
      const createData = data as CreateVolunteerCoordinatorDto;
      if (!createData.email?.trim()) {
        errors.push("Email is required");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createData.email)) {
        errors.push("Email format is invalid");
      }
      if (!createData.firstName?.trim()) {
        errors.push("First name is required");
      }
      if (!createData.lastName?.trim()) {
        errors.push("Last name is required");
      }
    }

    // Common validations for both create and update
    if (data.employeeId && data.employeeId.length > 50) {
      errors.push("Employee ID must be 50 characters or less");
    }
    if (data.position && data.position.length > 100) {
      errors.push("Position must be 100 characters or less");
    }
    if (data.department && data.department.length > 100) {
      errors.push("Department must be 100 characters or less");
    }
    if (data.responsibilities && data.responsibilities.length > 1000) {
      errors.push("Responsibilities must be 1000 characters or less");
    }
    if (data.notes && data.notes.length > 1000) {
      errors.push("Notes must be 1000 characters or less");
    }

    return errors;
  }
}

export const volunteerCoordinatorService = new VolunteerCoordinatorService();
export default volunteerCoordinatorService;
