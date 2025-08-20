// Coordinator Schedule Service - Matching backend CoordinatorScheduleController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  CoordinatorScheduleDto,
  CreateCoordinatorScheduleDto,
  UpdateCoordinatorScheduleDto,
  CoordinatorScheduleFilterDto,
  CoordinatorScheduleStatsDto,
  CoordinatorScheduleSummaryDto,
  BulkUpdateStatusDto,
  BulkDeleteDto,
  CheckConflictsDto,
} from "../types/coordinatorSchedule";
import { DEFAULT_COORDINATOR_SCHEDULE_FILTER } from "../types/coordinatorSchedule";

class CoordinatorScheduleService {
  private readonly baseUrl = "/CoordinatorSchedule";

  // Helper function to handle .NET JSON serialization format
  private extractDataFromNetResponse<T>(data: T | any): T {
    // If data has $values property (common with .NET JSON serialization), extract it
    if (data && typeof data === "object" && "$values" in data) {
      return data.$values as T;
    }
    return data;
  }

  // === COORDINATOR SCHEDULE MANAGEMENT ENDPOINTS ===
  // GET /api/CoordinatorSchedule/personal - Get personal schedules for volunteer coordinators
  async getPersonalSchedules(
    filter: Partial<CoordinatorScheduleFilterDto> = {}
  ): Promise<PagedResultDto<CoordinatorScheduleDto>> {
    const filterWithDefaults = { ...DEFAULT_COORDINATOR_SCHEDULE_FILTER, ...filter };
    const params = new URLSearchParams();
    
    Object.entries(filterWithDefaults).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}/personal?${queryString}` : `${this.baseUrl}/personal`;
    
    const response = await apiClient.get<PagedResultDto<CoordinatorScheduleDto>>(url);
    
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

    return {
      ...response.data,
      items: this.extractDataFromNetResponse(response.data.items || []),
    };
  }

  // GET /api/CoordinatorSchedule - List schedules for organizations
  async listSchedules(
    filter: Partial<CoordinatorScheduleFilterDto> = {}
  ): Promise<PagedResultDto<CoordinatorScheduleDto>> {
    const filterWithDefaults = { ...DEFAULT_COORDINATOR_SCHEDULE_FILTER, ...filter };
    const params = new URLSearchParams();
    
    Object.entries(filterWithDefaults).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const response = await apiClient.get<PagedResultDto<CoordinatorScheduleDto>>(url);
    
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

    return {
      ...response.data,
      items: this.extractDataFromNetResponse(response.data.items || []),
    };
  }

  // GET /api/CoordinatorSchedule/{id} - Get a specific schedule by ID
  async getSchedule(id: number): Promise<CoordinatorScheduleDto> {
    const response = await apiClient.get<CoordinatorScheduleDto>(`${this.baseUrl}/${id}`);
    return this.extractDataFromNetResponse(response.data);
  }

  // POST /api/CoordinatorSchedule - Create a new schedule
  async createSchedule(data: CreateCoordinatorScheduleDto): Promise<CoordinatorScheduleDto> {
    const response = await apiClient.post<CoordinatorScheduleDto>(this.baseUrl, data);
    return this.extractDataFromNetResponse(response.data);
  }

  // PUT /api/CoordinatorSchedule/{id} - Update an existing schedule
  async updateSchedule(
    id: number,
    data: UpdateCoordinatorScheduleDto
  ): Promise<CoordinatorScheduleDto> {
    const response = await apiClient.put<CoordinatorScheduleDto>(`${this.baseUrl}/${id}`, data);
    return this.extractDataFromNetResponse(response.data);
  }

  // DELETE /api/CoordinatorSchedule/{id} - Delete a schedule
  async deleteSchedule(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // GET /api/CoordinatorSchedule/stats - Get schedule statistics
  async getScheduleStats(): Promise<CoordinatorScheduleStatsDto> {
    const response = await apiClient.get<CoordinatorScheduleStatsDto>(`${this.baseUrl}/stats`);
    return this.extractDataFromNetResponse(response.data);
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
    
    if (coordinatorId) {
      params.append("coordinatorId", coordinatorId.toString());
    }

    const response = await apiClient.get<CoordinatorScheduleSummaryDto[]>(
      `${this.baseUrl}/calendar?${params.toString()}`
    );
    return this.extractDataFromNetResponse(response.data);
  }

  // PATCH /api/CoordinatorSchedule/{id}/status - Update schedule status
  async updateScheduleStatus(id: number, status: string): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/${id}/status`, { status });
  }

  // PATCH /api/CoordinatorSchedule/bulk/status - Bulk update schedule status
  async bulkUpdateStatus(request: BulkUpdateStatusDto): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/bulk/status`, request);
  }

  // DELETE /api/CoordinatorSchedule/bulk - Bulk delete schedules
  async bulkDelete(request: BulkDeleteDto): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/bulk`, request);
  }

  // POST /api/CoordinatorSchedule/conflicts - Check for schedule conflicts
  async checkConflicts(request: CheckConflictsDto): Promise<CoordinatorScheduleSummaryDto[]> {
    const response = await apiClient.post<CoordinatorScheduleSummaryDto[]>(
      `${this.baseUrl}/conflicts`,
      request
    );
    return this.extractDataFromNetResponse(response.data);
  }

  // === HELPER METHODS FOR COMMON OPERATIONS ===
  
  // Get schedules for a specific coordinator
  async getCoordinatorSchedules(
    coordinatorId: number,
    filter: Omit<Partial<CoordinatorScheduleFilterDto>, 'coordinatorId'> = {}
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
    filter: Omit<Partial<CoordinatorScheduleFilterDto>, 'eventId'> = {}
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
    filter: Omit<Partial<CoordinatorScheduleFilterDto>, 'startDate' | 'endDate'> = {}
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
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
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
    filter: Omit<Partial<CoordinatorScheduleFilterDto>, 'search'> = {}
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