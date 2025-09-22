// Volunteer Schedule Service - Matching backend VolunteerScheduleController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  VolunteerScheduleDto,
  VolunteerScheduleRequestDto,
  VolunteerScheduleFilterDto,
  UpdateVolunteerScheduleStatusDto,
} from "../types/volunteerSchedule";
import { DEFAULT_SCHEDULE_FILTER } from "../types/volunteerSchedule";

class VolunteerScheduleService {
  private readonly baseUrl = "/VolunteerSchedule";

  // === COORDINATOR ENDPOINTS ===

  // GET /api/VolunteerSchedule/coordinator - Get paginated list of volunteer schedules for coordinator
  async getCoordinatorVolunteerSchedules(
    filter: Partial<VolunteerScheduleFilterDto> = {}
  ): Promise<PagedResultDto<VolunteerScheduleDto>> {
    const filterWithDefaults = { ...DEFAULT_SCHEDULE_FILTER, ...filter };

    const response = await apiClient.get<PagedResultDto<VolunteerScheduleDto>>(
      `${this.baseUrl}/coordinator`,
      filterWithDefaults
    );

    console.log("=== DEBUG getCoordinatorVolunteerSchedules ===");
    console.log("Raw API response:", response);
    console.log("Response data:", response.data);
    console.log("============================================");

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
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

    // If items array is wrapped in $values, extract it
    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<VolunteerScheduleDto>;
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<VolunteerScheduleDto>;
  }

  // GET /api/VolunteerSchedule/coordinator/{scheduleId} - Get volunteer schedule by ID (Coordinator role)
  async getVolunteerScheduleById(
    scheduleId: number
  ): Promise<VolunteerScheduleDto> {
    const response = await apiClient.get<VolunteerScheduleDto>(
      `${this.baseUrl}/coordinator/${scheduleId}`
    );
    if (!response.data) {
      throw new Error("Schedule not found");
    }
    return response.data;
  }

  // POST /api/VolunteerSchedule/coordinator - Create new volunteer schedule (Coordinator role)
  async createVolunteerSchedule(
    request: VolunteerScheduleRequestDto
  ): Promise<VolunteerScheduleDto> {
    const response = await apiClient.post<VolunteerScheduleDto>(
      `${this.baseUrl}/coordinator`,
      request
    );
    if (!response.data) {
      throw new Error("Failed to create volunteer schedule");
    }
    return response.data;
  }

  // PUT /api/VolunteerSchedule/coordinator/{scheduleId} - Update volunteer schedule (Coordinator role)
  async updateVolunteerSchedule(
    scheduleId: number,
    request: VolunteerScheduleRequestDto
  ): Promise<VolunteerScheduleDto> {
    const response = await apiClient.put<VolunteerScheduleDto>(
      `${this.baseUrl}/coordinator/${scheduleId}`,
      request
    );
    if (!response.data) {
      throw new Error("Failed to update volunteer schedule");
    }
    return response.data;
  }

  // PATCH /api/VolunteerSchedule/coordinator/{scheduleId}/status - Update volunteer schedule status (Coordinator role)
  async updateVolunteerScheduleStatus(
    scheduleId: number,
    data: UpdateVolunteerScheduleStatusDto
  ): Promise<void> {
    const response = await apiClient.patch(
      `${this.baseUrl}/coordinator/${scheduleId}/status`,
      data
    );

    if (!response.success) {
      throw new Error("Failed to update volunteer schedule status");
    }
  }

  // DELETE /api/VolunteerSchedule/coordinator/{scheduleId} - Delete volunteer schedule (Coordinator role)
  async deleteVolunteerSchedule(scheduleId: number): Promise<boolean> {
    const response = await apiClient.delete<boolean>(
      `${this.baseUrl}/coordinator/${scheduleId}`
    );
    return response.data || false;
  }

  // === VOLUNTEER PERSONAL SCHEDULE ENDPOINTS ===

  // GET /api/VolunteerSchedule/personal - Get personal schedules for volunteer
  async getPersonalSchedules(
    filter: Partial<VolunteerScheduleFilterDto> = {}
  ): Promise<PagedResultDto<VolunteerScheduleDto>> {
    const filterWithDefaults = { ...DEFAULT_SCHEDULE_FILTER, ...filter };

    const response = await apiClient.get<PagedResultDto<VolunteerScheduleDto>>(
      `${this.baseUrl}/personal`,
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
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

    // If items array is wrapped in $values, extract it
    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<VolunteerScheduleDto>;
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<VolunteerScheduleDto>;
  }

  // GET /api/VolunteerSchedule/personal/{scheduleId} - Get personal schedule by ID for volunteer
  async getPersonalScheduleById(
    scheduleId: number
  ): Promise<VolunteerScheduleDto> {
    const response = await apiClient.get<VolunteerScheduleDto>(
      `${this.baseUrl}/personal/${scheduleId}`
    );
    if (!response.data) {
      throw new Error("Schedule not found");
    }
    return response.data;
  }

  // === UTILITY METHODS ===

  // Helper method to validate schedule data before creation/update
  validateScheduleData(data: VolunteerScheduleRequestDto): string[] {
    const errors: string[] = [];

    if (!data.volunteerId) {
      errors.push("Volunteer ID is required");
    }
    if (!data.title?.trim()) {
      errors.push("Title is required");
    }
    if (!data.startDateTime) {
      errors.push("Start date and time is required");
    }
    if (!data.endDateTime) {
      errors.push("End date and time is required");
    }
    if (data.startDateTime && data.endDateTime) {
      const startDate = new Date(data.startDateTime);
      const endDate = new Date(data.endDateTime);
      if (startDate >= endDate) {
        errors.push("End date must be after start date");
      }
    }
    if (data.title && data.title.length > 200) {
      errors.push("Title must be 200 characters or less");
    }
    if (data.description && data.description.length > 1000) {
      errors.push("Description must be 1000 characters or less");
    }
    if (data.location && data.location.length > 200) {
      errors.push("Location must be 200 characters or less");
    }
    if (data.notes && data.notes.length > 1000) {
      errors.push("Notes must be 1000 characters or less");
    }
    if (
      data.reminderMinutes &&
      (data.reminderMinutes < 0 || data.reminderMinutes > 10080)
    ) {
      errors.push("Reminder minutes must be between 0 and 10080 (1 week)");
    }

    return errors;
  }

  // Helper method to format date for display
  formatScheduleDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  // Helper method to get schedule duration in hours
  getScheduleDuration(startDateTime: string, endDateTime: string): number {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  // Helper method to check if schedule is upcoming
  isUpcoming(startDateTime: string): boolean {
    const start = new Date(startDateTime);
    const now = new Date();
    return start > now;
  }

  // Helper method to check if schedule is overdue
  isOverdue(endDateTime: string, status: string): boolean {
    const end = new Date(endDateTime);
    const now = new Date();
    return end < now && status !== "Completed" && status !== "Cancelled";
  }

  // Helper method to get status color for UI
  getStatusColor(status: string): string {
    switch (status) {
      case "Scheduled":
        return "blue";
      case "InProgress":
        return "yellow";
      case "Completed":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  }

  // Helper method to get priority color for UI
  getPriorityColor(priority: string): string {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "yellow";
      case "Low":
        return "green";
      default:
        return "gray";
    }
  }
}

export const volunteerScheduleService = new VolunteerScheduleService();
export default volunteerScheduleService;
