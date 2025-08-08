import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  CoordinatorSchedule,
  CreateCoordinatorScheduleData,
  UpdateCoordinatorScheduleData,
} from "../types/profile/coordinator-profile";

// Filter types for API requests
export interface CoordinatorScheduleFilterDto {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  coordinatorId?: number;
  eventId?: number;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  scheduleType?: string;
  priority?: string;
  status?: string;
  search?: string;
}

// Response types matching backend DTOs
export interface CoordinatorScheduleDto {
  scheduleId: number;
  coordinatorId: number;
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorPosition?: string;
  eventId?: number;
  eventName?: string;
  eventLocation?: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  scheduleType?: string;
  priority?: string;
  status?: string;
  isAllDay?: boolean;
  reminderMinutes?: number;
  notes?: string;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoordinatorScheduleStatsDto {
  totalSchedules: number;
  scheduledCount: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
  todaySchedules: number;
  thisWeekSchedules: number;
  thisMonthSchedules: number;
  upcomingSchedules: number;
  overdueSchedules: number;
  schedulesByType: Record<string, number>;
  schedulesByPriority: Record<string, number>;
  topCoordinators: Array<{
    coordinatorId: number;
    coordinatorName: string;
    scheduleCount: number;
    completedCount: number;
    completionRate: number;
  }>;
}

export interface CoordinatorScheduleSummaryDto {
  scheduleId: number;
  title: string;
  startDateTime: string;
  endDateTime: string;
  scheduleType?: string;
  priority?: string;
  status?: string;
  isAllDay?: boolean;
  coordinatorName?: string;
  eventName?: string;
}

export interface ConflictCheckData {
  coordinatorId: number;
  startDateTime: string;
  endDateTime: string;
  excludeScheduleId?: number;
}

class CoordinatorScheduleService {
  /**
   * Get paginated list of organization schedules
   */
  async getOrganizationSchedules(
    filters: CoordinatorScheduleFilterDto = {}
  ): Promise<PagedResultDto<CoordinatorScheduleDto>> {
    const queryParams = new URLSearchParams();

    // Add only defined parameters
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.size) queryParams.append("size", filters.size.toString());
    if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters.sortDirection)
      queryParams.append("sortDirection", filters.sortDirection);
    if (filters.coordinatorId)
      queryParams.append("coordinatorId", filters.coordinatorId.toString());
    if (filters.eventId)
      queryParams.append("eventId", filters.eventId.toString());
    if (filters.startDateFrom)
      queryParams.append("startDateFrom", filters.startDateFrom);
    if (filters.startDateTo)
      queryParams.append("startDateTo", filters.startDateTo);
    if (filters.endDateFrom)
      queryParams.append("endDateFrom", filters.endDateFrom);
    if (filters.endDateTo) queryParams.append("endDateTo", filters.endDateTo);
    if (filters.scheduleType)
      queryParams.append("scheduleType", filters.scheduleType);
    if (filters.priority) queryParams.append("priority", filters.priority);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.search) queryParams.append("search", filters.search);

    const endpoint = `/api/coordinator-schedules${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await apiClient.get<
      PagedResultDto<CoordinatorScheduleDto>
    >(endpoint);
    return response.data;
  }

  /**
   * Get schedule by ID
   */
  async getScheduleById(id: number): Promise<CoordinatorScheduleDto> {
    const response = await apiClient.get<CoordinatorScheduleDto>(
      `/api/coordinator-schedules/${id}`
    );
    return response.data;
  }

  /**
   * Create new schedule
   */
  async createSchedule(data: CreateCoordinatorScheduleData): Promise<number> {
    const response = await apiClient.post<number>(
      "/api/coordinator-schedules",
      data
    );
    return response.data;
  }

  /**
   * Update existing schedule
   */
  async updateSchedule(
    id: number,
    data: UpdateCoordinatorScheduleData
  ): Promise<boolean> {
    const response = await apiClient.put<boolean>(
      `/api/coordinator-schedules/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete schedule
   */
  async deleteSchedule(id: number): Promise<boolean> {
    const response = await apiClient.delete<boolean>(
      `/api/coordinator-schedules/${id}`
    );
    return response.data;
  }

  /**
   * Get personal schedules (for coordinators)
   */
  async getPersonalSchedules(
    filters: CoordinatorScheduleFilterDto = {}
  ): Promise<PagedResultDto<CoordinatorScheduleDto>> {
    const queryParams = new URLSearchParams();

    // Add only defined parameters
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.size) queryParams.append("size", filters.size.toString());
    if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters.sortDirection)
      queryParams.append("sortDirection", filters.sortDirection);
    if (filters.startDateFrom)
      queryParams.append("startDateFrom", filters.startDateFrom);
    if (filters.startDateTo)
      queryParams.append("startDateTo", filters.startDateTo);
    if (filters.endDateFrom)
      queryParams.append("endDateFrom", filters.endDateFrom);
    if (filters.endDateTo) queryParams.append("endDateTo", filters.endDateTo);
    if (filters.scheduleType)
      queryParams.append("scheduleType", filters.scheduleType);
    if (filters.priority) queryParams.append("priority", filters.priority);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.search) queryParams.append("search", filters.search);

    const endpoint = `/api/coordinator-schedules/personal${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await apiClient.get<
      PagedResultDto<CoordinatorScheduleDto>
    >(endpoint);
    return response.data;
  }

  /**
   * Get schedule statistics
   */
  async getScheduleStats(): Promise<CoordinatorScheduleStatsDto> {
    const response = await apiClient.get<CoordinatorScheduleStatsDto>(
      "/api/coordinator-schedules/stats"
    );
    return response.data;
  }

  /**
   * Get calendar view of schedules
   */
  async getCalendarView(
    startDate: Date,
    endDate: Date,
    coordinatorId?: number
  ): Promise<CoordinatorScheduleSummaryDto[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("startDate", startDate.toISOString());
    queryParams.append("endDate", endDate.toISOString());
    if (coordinatorId) {
      queryParams.append("coordinatorId", coordinatorId.toString());
    }

    const endpoint = `/api/coordinator-schedules/calendar?${queryParams.toString()}`;
    const response = await apiClient.get<CoordinatorScheduleSummaryDto[]>(
      endpoint
    );
    return response.data;
  }

  /**
   * Update schedule status
   */
  async updateScheduleStatus(id: number, status: string): Promise<boolean> {
    const response = await apiClient.patch<boolean>(
      `/api/coordinator-schedules/${id}/status`,
      { status }
    );
    return response.data;
  }

  /**
   * Check for schedule conflicts
   */
  async checkConflicts(
    data: ConflictCheckData
  ): Promise<CoordinatorScheduleDto[]> {
    const response = await apiClient.post<CoordinatorScheduleDto[]>(
      "/api/coordinator-schedules/check-conflicts",
      data
    );
    return response.data;
  }

  /**
   * Bulk update status
   */
  async bulkUpdateStatus(ids: number[], status: string): Promise<boolean> {
    const response = await apiClient.patch<boolean>(
      "/api/coordinator-schedules/bulk/status",
      { scheduleIds: ids, status }
    );
    return response.data;
  }

  /**
   * Bulk delete schedules
   */
  async bulkDelete(ids: number[]): Promise<boolean> {
    // Create a proper request using fetch since we need DELETE with body
    const token = localStorage.getItem("authToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch("/api/coordinator-schedules/bulk", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ scheduleIds: ids }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data !== undefined ? result.data : result.success || true;
  }
}

export const coordinatorScheduleService = new CoordinatorScheduleService();
