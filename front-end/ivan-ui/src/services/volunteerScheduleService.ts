import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";

// Request DTOs matching backend
export interface VolunteerScheduleRequestDTO {
  volunteerId: number;
  eventId?: number;
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
}

export interface VolunteerScheduleFilterDTO {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  volunteerId?: number;
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

// Response DTOs matching backend
export interface VolunteerScheduleDTO {
  scheduleId: number;
  volunteerId: number;
  volunteerName: string;
  volunteerEmail: string;
  volunteerPhone?: string;
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

class VolunteerScheduleService {
  private readonly baseUrl = "/api/VolunteerSchedule";

  // Organization/Coordinator endpoints
  async getOrganizationVolunteerSchedules(
    filter: VolunteerScheduleFilterDTO
  ): Promise<PagedResultDto<VolunteerScheduleDTO>> {
    const response = await apiClient.get<PagedResultDto<VolunteerScheduleDTO>>(
      `${this.baseUrl}/organization`,
      filter as Record<string, string | number | boolean | undefined | null>
    );
    return response.data;
  }

  async getVolunteerScheduleById(
    scheduleId: number
  ): Promise<VolunteerScheduleDTO> {
    const response = await apiClient.get<VolunteerScheduleDTO>(
      `${this.baseUrl}/organization/${scheduleId}`
    );
    return response.data;
  }

  async createVolunteerSchedule(
    request: VolunteerScheduleRequestDTO
  ): Promise<VolunteerScheduleDTO> {
    const response = await apiClient.post<VolunteerScheduleDTO>(
      `${this.baseUrl}/organization`,
      request
    );
    return response.data;
  }

  async updateVolunteerSchedule(
    scheduleId: number,
    request: VolunteerScheduleRequestDTO
  ): Promise<VolunteerScheduleDTO> {
    const response = await apiClient.put<VolunteerScheduleDTO>(
      `${this.baseUrl}/organization/${scheduleId}`,
      request
    );
    return response.data;
  }

  async deleteVolunteerSchedule(scheduleId: number): Promise<void> {
    await apiClient.delete<void>(`${this.baseUrl}/organization/${scheduleId}`);
  }

  // Volunteer personal endpoints
  async getPersonalSchedules(
    filter: VolunteerScheduleFilterDTO
  ): Promise<PagedResultDto<VolunteerScheduleDTO>> {
    const response = await apiClient.get<PagedResultDto<VolunteerScheduleDTO>>(
      `${this.baseUrl}/personal`,
      filter as Record<string, string | number | boolean | undefined | null>
    );
    return response.data;
  }

  async getPersonalScheduleById(
    scheduleId: number
  ): Promise<VolunteerScheduleDTO> {
    const response = await apiClient.get<VolunteerScheduleDTO>(
      `${this.baseUrl}/personal/${scheduleId}`
    );
    return response.data;
  }
}

export const volunteerScheduleService = new VolunteerScheduleService();
