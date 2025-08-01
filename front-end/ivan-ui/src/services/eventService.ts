import { apiClient } from "./apiClient";
import type {
  EventDto,
  CreateEventDto,
  UpdateEventDto,
  EventFilterDto,
  EventStatsDto,
  EventCategoryDto,
  EventStatusDto,
  PagedResultDto,
  UpdateEventStatusDto,
  EventAnalyticsDto,
} from "../types/event";
import type { ApiResponse } from "../types/common";

class EventService {
  private readonly baseUrl = "/api/events";

  // Event CRUD Operations
  async getOrganizationEvents(
    filters: EventFilterDto
  ): Promise<PagedResultDto<EventDto>> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.categoryIds?.length) {
      filters.categoryIds.forEach((id) =>
        params.append("categoryIds", id.toString())
      );
    }
    if (filters.statusIds?.length) {
      filters.statusIds.forEach((id) =>
        params.append("statusIds", id.toString())
      );
    }
    if (filters.startDateFrom)
      params.append("startDateFrom", filters.startDateFrom);
    if (filters.startDateTo) params.append("startDateTo", filters.startDateTo);
    if (filters.endDateFrom) params.append("endDateFrom", filters.endDateFrom);
    if (filters.endDateTo) params.append("endDateTo", filters.endDateTo);
    if (filters.province) params.append("province", filters.province);
    if (filters.district) params.append("district", filters.district);
    if (filters.isFeatured !== undefined)
      params.append("isFeatured", filters.isFeatured.toString());
    if (filters.isUrgent !== undefined)
      params.append("isUrgent", filters.isUrgent.toString());
    if (filters.minVolunteers)
      params.append("minVolunteers", filters.minVolunteers.toString());
    if (filters.maxVolunteers)
      params.append("maxVolunteers", filters.maxVolunteers.toString());

    params.append("page", filters.page.toString());
    params.append("size", filters.size.toString());
    params.append("sortBy", filters.sortBy);
    params.append("sortDirection", filters.sortDirection);

    const response = await apiClient.get<PagedResultDto<EventDto>>(
      `${this.baseUrl}/organization?${params.toString()}`
    );
    return response.data;
  }

  async getOrganizationEvent(eventId: number): Promise<EventDto> {
    const response = await apiClient.get<EventDto>(
      `${this.baseUrl}/organization/${eventId}`
    );
    return response.data;
  }

  async getOrganizationStats(): Promise<EventStatsDto> {
    const response = await apiClient.get<EventStatsDto>(
      `${this.baseUrl}/organization/stats`
    );
    return response.data;
  }

  async createEvent(event: CreateEventDto): Promise<number> {
    const response = await apiClient.post<number>(this.baseUrl, event);
    return response.data;
  }

  async updateEvent(eventId: number, event: UpdateEventDto): Promise<void> {
    await apiClient.put(`${this.baseUrl}/${eventId}`, event);
  }

  async updateEventStatus(
    eventId: number,
    statusUpdate: UpdateEventStatusDto
  ): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/${eventId}/status`, statusUpdate);
  }

  async deleteEvent(eventId: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${eventId}`);
  }

  // Lookup Data
  async getEventCategories(): Promise<EventCategoryDto[]> {
    const response = await apiClient.get<EventCategoryDto[]>(
      `${this.baseUrl}/categories`
    );
    return response.data;
  }

  async getEventStatuses(): Promise<EventStatusDto[]> {
    const response = await apiClient.get<EventStatusDto[]>(
      `${this.baseUrl}/statuses`
    );
    return response.data;
  }

  // Analytics & Transitions
  async getEventAnalytics(
    eventId: number,
    timeframe: string = "month"
  ): Promise<Record<string, any>> {
    const response = await apiClient.get<Record<string, any>>(
      `${this.baseUrl}/${eventId}/analytics?timeframe=${timeframe}`
    );
    return response.data;
  }

  async getAvailableStatusTransitions(eventId: number): Promise<number[]> {
    const response = await apiClient.get<number[]>(
      `${this.baseUrl}/${eventId}/status-transitions`
    );
    return response.data;
  }

  // Validation Helpers
  async canUpdateEvent(eventId: number): Promise<boolean> {
    try {
      const event = await this.getOrganizationEvent(eventId);
      // Can't update completed or cancelled events
      return !["completed", "cancelled"].includes(
        event.statusName.toLowerCase()
      );
    } catch {
      return false;
    }
  }

  async canDeleteEvent(eventId: number): Promise<boolean> {
    try {
      const event = await this.getOrganizationEvent(eventId);
      // Can only delete events in planning status or future events
      return (
        event.statusName.toLowerCase() === "planning" ||
        new Date(event.startDate) > new Date()
      );
    } catch {
      return false;
    }
  }

  // Utility Methods
  formatEventForDisplay(event: EventDto): EventDto {
    return {
      ...event,
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString(),
      registrationStartDate: event.registrationStartDate
        ? new Date(event.registrationStartDate).toISOString()
        : undefined,
      registrationEndDate: event.registrationEndDate
        ? new Date(event.registrationEndDate).toISOString()
        : undefined,
    };
  }

  validateEventDates(
    startDate: string,
    endDate: string,
    registrationEndDate?: string
  ): string[] {
    const errors: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const regEnd = registrationEndDate ? new Date(registrationEndDate) : null;

    if (start >= end) {
      errors.push("End date must be after start date");
    }

    if (regEnd && regEnd > start) {
      errors.push("Registration end date must be before event start date");
    }

    if (start < new Date()) {
      errors.push("Event start date cannot be in the past");
    }

    return errors;
  }
}

export const eventService = new EventService();
export default eventService;
