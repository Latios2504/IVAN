// Coordinator Schedule Service - Matching backend CoordinatorScheduleController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  CoordinatorScheduleDto,
  CreateCoordinatorScheduleDto,
  UpdateCoordinatorScheduleDto,
  CoordinatorScheduleFilterDto,
  UpdateScheduleStatusDto,
  CoordinatorScheduleStatsDto,
  BulkUpdateStatusDto,
  BulkDeleteDto,
  CoordinatorScheduleSummaryDto,
} from "../types/coordinatorSchedule";

class CoordinatorScheduleService {
  private readonly baseUrl = "/CoordinatorSchedule";

  // === PERSONAL SCHEDULE ENDPOINTS (for coordinators viewing their assigned schedules) ===
  // GET /api/CoordinatorSchedule/personal - Get personal schedules for volunteer coordinators (READ-ONLY)
  async getPersonalSchedules(
    filter: Partial<CoordinatorScheduleFilterDto> = {}
  ): Promise<PagedResultDto<CoordinatorScheduleDto>> {
    const params = new URLSearchParams();

    // Map frontend filter to backend query parameters
    if (filter.eventId !== undefined && filter.eventId !== null) {
      params.append("eventId", filter.eventId.toString());
    }
    if (filter.startDate) {
      params.append("startDate", filter.startDate);
    }
    if (filter.endDate) {
      params.append("endDate", filter.endDate);
    }
    if (filter.pageNumber !== undefined) {
      params.append("page", filter.pageNumber.toString());
    }
    if (filter.pageSize !== undefined) {
      params.append("size", filter.pageSize.toString());
    }

    const queryString = params.toString();
    const url = queryString
      ? `${this.baseUrl}/personal?${queryString}`
      : `${this.baseUrl}/personal`;

    const response = await apiClient.get(url);

    // Backend returns ApiResponseDTO with PascalCase (Success, Data, Message)
    if (response.success && response.data) {
      const pagedResult =
        response.data as PagedResultDto<CoordinatorScheduleDto>;
      return {
        ...pagedResult,
        items: apiClient.extractDataFromNetResponse(pagedResult.items || []),
      };
    }

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

  // === ORGANIZATION SCHEDULE ENDPOINTS (for organizations managing all coordinators) ===
  // GET /api/CoordinatorSchedule - List schedules for organizations
  async listSchedules(
    filter: Partial<CoordinatorScheduleFilterDto> = {}
  ): Promise<PagedResultDto<CoordinatorScheduleDto>> {
    const params = new URLSearchParams();

    // Map frontend filter to backend query parameters
    if (filter.coordinatorId !== undefined && filter.coordinatorId !== null) {
      params.append("coordinatorId", filter.coordinatorId.toString());
    }
    if (filter.eventId !== undefined && filter.eventId !== null) {
      params.append("eventId", filter.eventId.toString());
    }
    if (filter.pageNumber !== undefined) {
      params.append("page", filter.pageNumber.toString());
    }
    if (filter.pageSize !== undefined) {
      params.append("size", filter.pageSize.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    const response = await apiClient.get(url);

    // Backend returns ApiResponseDTO with PascalCase (Success, Data, Message)
    if (response.success && response.data) {
      const pagedResult =
        response.data as PagedResultDto<CoordinatorScheduleDto>;
      return {
        ...pagedResult,
        items: apiClient.extractDataFromNetResponse(pagedResult.items || []),
      };
    }

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

  // GET /api/CoordinatorSchedule/{id} - Get a specific schedule by ID
  async getSchedule(id: number): Promise<CoordinatorScheduleDto> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);

    // Backend returns ApiResponseDTO with PascalCase (Success, Data, Message)
    if (response.success && response.data) {
      return apiClient.extractDataFromNetResponse(response.data);
    }

    throw new Error("Failed to get schedule");
  }

  // POST /api/CoordinatorSchedule - Create a new schedule
  async createSchedule(data: CreateCoordinatorScheduleDto): Promise<number> {
    const response = await apiClient.post(this.baseUrl, data);

    // Backend returns ApiResponseDTO with PascalCase (Success, Data, Message)
    if (response.success && response.data !== undefined) {
      return response.data as number;
    }

    throw new Error("Failed to create schedule");
  }

  // PUT /api/CoordinatorSchedule/{id} - Update an existing schedule
  async updateSchedule(
    id: number,
    data: UpdateCoordinatorScheduleDto
  ): Promise<CoordinatorScheduleDto> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, data);

    // Backend returns ApiResponseDTO with PascalCase (Success, Data, Message)
    if (response.success && response.data) {
      return apiClient.extractDataFromNetResponse(response.data);
    }

    throw new Error("Failed to update schedule");
  }

  // Note: Single schedule deletion is not supported by backend
  // Use bulkDelete method instead with a single schedule ID

  // GET /api/CoordinatorSchedule/stats - Get schedule statistics
  async getScheduleStats(): Promise<CoordinatorScheduleStatsDto> {
    const response = await apiClient.get(`${this.baseUrl}/stats`);

    // Backend returns ApiResponseDTO with PascalCase (Success, Data, Message)
    if (response.success && response.data) {
      return response.data as CoordinatorScheduleStatsDto;
    }

    // Return default stats structure to match CoordinatorScheduleStatsDto
    return {
      totalSchedules: 0,
      scheduledCount: 0,
      inProgressCount: 0,
      completedCount: 0,
      cancelledCount: 0,
      todaySchedules: 0,
      thisWeekSchedules: 0,
      thisMonthSchedules: 0,
      upcomingSchedules: 0,
      overdueSchedules: 0,
      schedulesByType: {},
      schedulesByPriority: {},
      topCoordinators: [],
    };
  }

  // GET /api/CoordinatorSchedule/calendar - Get calendar view
  async getCalendarView(
    startDate: string,
    endDate: string,
    coordinatorId?: number
  ): Promise<CoordinatorScheduleSummaryDto[]> {
    const params = new URLSearchParams();

    params.append("startDate", startDate);
    params.append("endDate", endDate);
    if (coordinatorId !== undefined && coordinatorId !== null) {
      params.append("coordinatorId", coordinatorId.toString());
    }

    const queryString = params.toString();
    const url = `${this.baseUrl}/calendar?${queryString}`;

    const response = await apiClient.get(url);

    // Backend returns ApiResponseDTO with PascalCase (Success, Data, Message)
    if (response.success && response.data) {
      return apiClient.extractDataFromNetResponse(response.data);
    }

    return [];
  }

  // PATCH /api/CoordinatorSchedule/{scheduleId}/status - Update schedule status
  async updateScheduleStatus(
    scheduleId: number,
    data: UpdateScheduleStatusDto
  ): Promise<void> {
    const response = await apiClient.patch(
      `${this.baseUrl}/${scheduleId}/status`,
      data
    );

    if (!response.success) {
      throw new Error("Failed to update schedule status");
    }
  }

  // PATCH /api/CoordinatorSchedule/bulk/status - Bulk update status
  async bulkUpdateStatus(data: BulkUpdateStatusDto): Promise<void> {
    const response = await apiClient.patch(`${this.baseUrl}/bulk/status`, data);

    if (!response.success) {
      throw new Error("Failed to bulk update status");
    }
  }

  // DELETE /api/CoordinatorSchedule/bulk - Bulk delete schedules
  async bulkDelete(data: BulkDeleteDto): Promise<void> {
    const response = await apiClient.delete(`${this.baseUrl}/bulk`, { data });

    if (!response.success) {
      throw new Error("Failed to bulk delete schedules");
    }
  }

  // === HELPER METHODS FOR COMMON OPERATIONS ===

  // Get schedules for a specific coordinator
  async getCoordinatorSchedules(
    coordinatorId: number,
    filter: Omit<Partial<CoordinatorScheduleFilterDto>, "coordinatorId"> = {}
  ): Promise<PagedResultDto<CoordinatorScheduleDto>> {
    const fullFilter: Partial<CoordinatorScheduleFilterDto> = {
      ...filter,
      coordinatorId,
    };
    return this.listSchedules(fullFilter);
  }

  // Get schedules for a specific event
  async getEventSchedules(
    eventId: number,
    filter: Omit<Partial<CoordinatorScheduleFilterDto>, "eventId"> = {}
  ): Promise<PagedResultDto<CoordinatorScheduleDto>> {
    const fullFilter: Partial<CoordinatorScheduleFilterDto> = {
      ...filter,
      eventId,
    };
    return this.listSchedules(fullFilter);
  }

  // Get schedules within a date range
  async getSchedulesByDateRange(
    startDate: string,
    endDate: string,
    filter: Omit<
      Partial<CoordinatorScheduleFilterDto>,
      "startDate" | "endDate"
    > = {}
  ): Promise<PagedResultDto<CoordinatorScheduleDto>> {
    const fullFilter: Partial<CoordinatorScheduleFilterDto> = {
      ...filter,
      startDate,
      endDate,
    };
    return this.listSchedules(fullFilter);
  }

  // Get today's schedules
  async getTodaySchedules(
    coordinatorId?: number
  ): Promise<PagedResultDto<CoordinatorScheduleDto>> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    const filter: Partial<CoordinatorScheduleFilterDto> = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
      coordinatorId,
      sortBy: "StartDateTime",
      sortDirection: "asc",
    };

    return this.listSchedules(filter);
  }

  // Get upcoming schedules
  async getUpcomingSchedules(
    coordinatorId?: number,
    days: number = 7
  ): Promise<PagedResultDto<CoordinatorScheduleDto>> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const filter: Partial<CoordinatorScheduleFilterDto> = {
      startDate: now.toISOString(),
      endDate: futureDate.toISOString(),
      coordinatorId,
      sortBy: "StartDateTime",
      sortDirection: "asc",
    };

    return this.listSchedules(filter);
  }

  // Search schedules by text
  async searchSchedules(
    searchTerm: string,
    filter: Omit<Partial<CoordinatorScheduleFilterDto>, "search"> = {}
  ): Promise<PagedResultDto<CoordinatorScheduleDto>> {
    const fullFilter: Partial<CoordinatorScheduleFilterDto> = {
      ...filter,
      search: searchTerm,
    };
    return this.listSchedules(fullFilter);
  }
}

export const coordinatorScheduleService = new CoordinatorScheduleService();
export default coordinatorScheduleService;
