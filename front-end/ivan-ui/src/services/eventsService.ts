// Events Service - Matching backend EventsController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  EventDto,
  EventFilterDto,
  CreateEventDto,
  UpdateEventDto,
  EventCategoryDto,
  EventStatusDto,
  CreateEventFromSupportRequestDto,
  UpdateEventStatusDto,
} from "../types/events";

class EventsService {
  private readonly baseUrl = "/Events";

  // GET /api/Events - Get Events List (Public, filtered based on role)
  async getEvents(filters: EventFilterDto): Promise<PagedResultDto<EventDto>> {
    // Let apiClient handle parameter building - no manual URLSearchParams needed
    const response = await apiClient.get<PagedResultDto<EventDto>>(
      this.baseUrl,
      filters // Pass filters directly as params
    );

    // Backend guarantees ApiResponse<T> format, so response.data is reliable
    return response.data!;
  }

  // GET /api/Events/{id} - Get Event Details (Public)
  async getEvent(eventId: number): Promise<EventDto> {
    const response = await apiClient.get<EventDto>(
      `${this.baseUrl}/${eventId}`
    );
    if (!response.data) {
      throw new Error("Event not found");
    }
    return response.data;
  }



  // POST /api/Events - Create Event (Organization role only)
  async createEvent(event: CreateEventDto): Promise<{ eventId: number }> {
    const response = await apiClient.post<{ eventId: number }>(
      this.baseUrl,
      event
    );
    if (!response.data) {
      throw new Error("Failed to create event");
    }
    return response.data;
  }

  // POST /api/Events/from-support-request - Create Event from Support Request (Organization role only)
  async createEventFromSupportRequest(
    eventData: CreateEventFromSupportRequestDto
  ): Promise<{ eventId: number }> {
    const response = await apiClient.post<{ eventId: number }>(
      `${this.baseUrl}/from-support-request`,
      eventData
    );
    if (!response.data) {
      throw new Error("Failed to create event from support request");
    }
    return response.data;
  }

  // PUT /api/Events/{id} - Update Event (Organization role only, own events)
  async updateEvent(eventId: number, event: UpdateEventDto): Promise<void> {
    await apiClient.put(`${this.baseUrl}/${eventId}`, event);
  }

  // DELETE /api/Events/{id} - Delete Event (Organization role only, own events)
  async deleteEvent(eventId: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${eventId}`);
  }

  // GET /api/Events/categories - Get Event Categories (Public)
  async getEventCategories(): Promise<EventCategoryDto[]> {
    const response = await apiClient.get<EventCategoryDto[]>(
      `${this.baseUrl}/categories`
    );
    return response.data || [];
  }

  // GET /api/Events/statuses - Get Event Statuses (Organization role only)
  async getEventStatuses(): Promise<EventStatusDto[]> {
    const response = await apiClient.get<EventStatusDto[]>(
      `${this.baseUrl}/statuses`
    );
    return response.data || [];
  }

  // PUT /api/Events/{eventId}/status - Update Event Status (Organization role only)
  async updateEventStatus(eventId: number, statusData: UpdateEventStatusDto): Promise<void> {
    await apiClient.put(`${this.baseUrl}/${eventId}/status`, statusData);
  }

  // Utility Methods
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

export const eventsService = new EventsService();
export default eventsService;
