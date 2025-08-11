import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  VolunteerCoordinatorDto,
  CreateVolunteerCoordinatorDto,
  UpdateVolunteerCoordinatorDto,
  VolunteerCoordinatorFilterDto,
  VolunteerCoordinatorStatsDto,
  VolunteerCoordinatorHierarchyDto,
  ManagementLevelDto,
  SpecializationDto,
} from "../types/volunteer-coordinator";

class VolunteerCoordinatorService {
  async getOrganizationCoordinators(
    filters: VolunteerCoordinatorFilterDto,
    organizationId: number
  ): Promise<PagedResultDto<VolunteerCoordinatorDto>> {
    const response = await apiClient.post<{
      coordinators: VolunteerCoordinatorDto[];
      totalCount: number;
      page: number;
      size: number;
      totalPages: number;
    }>(
      `/VolunteerCoordinator/getCoordinatorsByOrganization/${organizationId}`,
      filters
    );

    const data = response.data;
    return {
      items: data.coordinators,
      totalCount: data.totalCount,
      pageNumber: data.page,
      pageSize: data.size,
      totalPages: data.totalPages,
      hasPreviousPage: data.page > 1,
      hasNextPage: data.page < data.totalPages,
    };
  }

  async getCoordinatorById(
    coordinatorId: number
  ): Promise<VolunteerCoordinatorDto> {
    const response = await apiClient.get<VolunteerCoordinatorDto>(
      `/VolunteerCoordinator/${coordinatorId}`
    );
    return response.data;
  }

  async createCoordinator(
    coordinatorData: CreateVolunteerCoordinatorDto,
    organizationId: number
  ): Promise<number> {
    const response = await apiClient.post<number>(
      `/VolunteerCoordinator/${organizationId}`,
      coordinatorData
    );
    return response.data;
  }

  async updateCoordinator(
    coordinatorId: number,
    coordinatorData: UpdateVolunteerCoordinatorDto
  ): Promise<VolunteerCoordinatorDto> {
    const response = await apiClient.put<VolunteerCoordinatorDto>(
      `/VolunteerCoordinator/${coordinatorId}`,
      coordinatorData
    );
    return response.data;
  }

  async deleteCoordinator(coordinatorId: number): Promise<void> {
    await apiClient.delete<void>(`/VolunteerCoordinator/${coordinatorId}`);
  }

  async getCoordinatorStats(
    coordinatorId: number
  ): Promise<VolunteerCoordinatorStatsDto> {
    const response = await apiClient.get<VolunteerCoordinatorStatsDto>(
      `/VolunteerCoordinator/${coordinatorId}/stats`
    );
    return response.data;
  }

  async getCoordinatorHierarchy(
    organizationId: number
  ): Promise<VolunteerCoordinatorHierarchyDto[]> {
    const response = await apiClient.get<VolunteerCoordinatorHierarchyDto[]>(
      `/VolunteerCoordinator/hierarchy/${organizationId}`
    );
    return response.data;
  }

  async getManagementLevels(): Promise<ManagementLevelDto[]> {
    const response = await apiClient.get<ManagementLevelDto[]>(
      "/VolunteerCoordinator/management-levels"
    );
    return response.data;
  }

  async getSpecializations(): Promise<SpecializationDto[]> {
    const response = await apiClient.get<SpecializationDto[]>(
      "/VolunteerCoordinator/specializations"
    );
    return response.data;
  }

  async assignCoordinatorToEvent(
    coordinatorId: number,
    eventId: number
  ): Promise<void> {
    await apiClient.post<void>(
      `/VolunteerCoordinator/${coordinatorId}/assign-event/${eventId}`
    );
  }

  async unassignCoordinatorFromEvent(
    coordinatorId: number,
    eventId: number
  ): Promise<void> {
    await apiClient.delete<void>(
      `/VolunteerCoordinator/${coordinatorId}/unassign-event/${eventId}`
    );
  }

  async activateCoordinator(coordinatorId: number): Promise<void> {
    await apiClient.patch<void>(
      `/VolunteerCoordinator/${coordinatorId}/activate`
    );
  }

  async deactivateCoordinator(coordinatorId: number): Promise<void> {
    await apiClient.patch<void>(
      `/VolunteerCoordinator/${coordinatorId}/deactivate`
    );
  }
}

export const volunteerCoordinatorService = new VolunteerCoordinatorService();
