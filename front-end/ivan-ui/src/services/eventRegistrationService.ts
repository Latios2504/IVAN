import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  Registration,
  RegistrationFilters,
  ApproveRegistrationRequest,
  RejectRegistrationRequest,
  RegistrationAnalytics,
} from "../types/eventRegistration";

class EventRegistrationService {
  private readonly baseUrl = "/EventRegistrations";

  async getRegistrations(
    eventId: number,
    filters: RegistrationFilters
  ): Promise<PagedResultDto<Registration>> {
    const params = new URLSearchParams({
      eventId: eventId.toString(),
      page: filters.page.toString(),
      size: filters.size.toString(),
      ...(filters.status && { status: filters.status }),
      ...(filters.search && { search: filters.search }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
      ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
    });

    if (filters.dateRange) {
      params.append("startDate", filters.dateRange.startDate);
      params.append("endDate", filters.dateRange.endDate);
    }

    const response = await apiClient.get<PagedResultDto<Registration>>(
      `${this.baseUrl}?${params}`
    );
    return response.data;
  }

  async getRegistration(
    eventId: number,
    registrationId: number
  ): Promise<Registration> {
    const response = await apiClient.get<Registration>(
      `${this.baseUrl}/${registrationId}?eventId=${eventId}`
    );
    return response.data;
  }

  async approveRegistration(
    eventId: number,
    registrationId: number,
    request: ApproveRegistrationRequest
  ): Promise<Registration> {
    const response = await apiClient.patch<Registration>(
      `${this.baseUrl}/${registrationId}/approve?eventId=${eventId}`,
      request
    );
    return response.data;
  }

  async rejectRegistration(
    eventId: number,
    registrationId: number,
    request: RejectRegistrationRequest
  ): Promise<Registration> {
    const response = await apiClient.patch<Registration>(
      `${this.baseUrl}/${registrationId}/reject?eventId=${eventId}`,
      request
    );
    return response.data;
  }

  async bulkApproveRegistrations(
    eventId: number,
    registrationIds: number[],
    notes?: string
  ): Promise<Registration[]> {
    const promises = registrationIds.map((registrationId) =>
      this.approveRegistration(eventId, registrationId, { notes })
    );
    return Promise.all(promises);
  }

  async bulkRejectRegistrations(
    eventId: number,
    registrationIds: number[],
    reason: string
  ): Promise<Registration[]> {
    const promises = registrationIds.map((registrationId) =>
      this.rejectRegistration(eventId, registrationId, { reason })
    );
    return Promise.all(promises);
  }

  async getRegistrationAnalytics(
    eventId: number
  ): Promise<RegistrationAnalytics> {
    // Mock analytics for now - replace with actual API call when available
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalRegistrations: 145,
          pendingCount: 23,
          approvedCount: 98,
          rejectedCount: 24,
          statusDistribution: [
            {
              status: "Pending",
              count: 23,
              percentage: 15.9,
              color: "#f59e0b",
            },
            {
              status: "Approved",
              count: 98,
              percentage: 67.6,
              color: "#10b981",
            },
            {
              status: "Rejected",
              count: 24,
              percentage: 16.5,
              color: "#ef4444",
            },
          ],
          registrationTrends: [
            { date: "2024-01-01", count: 12 },
            { date: "2024-01-02", count: 18 },
            { date: "2024-01-03", count: 25 },
            { date: "2024-01-04", count: 31 },
            { date: "2024-01-05", count: 28 },
            { date: "2024-01-06", count: 22 },
            { date: "2024-01-07", count: 35 },
          ],
          topVolunteers: [
            {
              volunteerId: 1,
              volunteerName: "John Doe",
              registrationCount: 5,
              averageRating: 4.8,
            },
            {
              volunteerId: 2,
              volunteerName: "Jane Smith",
              registrationCount: 4,
              averageRating: 4.6,
            },
            {
              volunteerId: 3,
              volunteerName: "Mike Johnson",
              registrationCount: 3,
              averageRating: 4.9,
            },
          ],
        });
      }, 1000);
    });
  }
}

export const eventRegistrationService = new EventRegistrationService();
