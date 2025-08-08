import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  Registration,
  SimpleRegistration,
  RegistrationFilters,
  ApproveRegistrationRequest,
  RejectRegistrationRequest,
  RegistrationAnalytics,
} from "../types/eventRegistration";

class EventRegistrationService {
  private readonly baseUrl = "/EventRegistrations";

  // Helper function to convert SimpleRegistration to Registration with default values
  private mapToRegistration(simple: SimpleRegistration): Registration {
    return {
      ...simple,
      fullName: simple.fullName || "Unknown",
      volunteer: {
        fullName: simple.fullName || "Unknown",
        email: "email@example.com", // Default - we don't have this from backend
        phoneNumber: undefined,
        profileImage: undefined,
        skills: [],
        experience: "",
        rating: undefined,
        totalEventsJoined: 0,
        totalHoursVolunteered: 0,
      },
    };
  }

  async getRegistrations(
    eventId: number,
    filters: RegistrationFilters
  ): Promise<PagedResultDto<Registration>> {
    const params = new URLSearchParams({
      eventId: eventId.toString(),
      page: filters.page.toString(),
      size: filters.size.toString(),
      ...(filters.status && { status: filters.status }),
    });

    // Note: Backend doesn't support search, sortBy, sortOrder, or dateRange yet
    // These will be handled client-side for now

    const response = await apiClient.get<PagedResultDto<SimpleRegistration>>(
      `${this.baseUrl}?${params}`
    );

    // Convert SimpleRegistration to Registration
    let filteredItems = response.data.items.map((item) =>
      this.mapToRegistration(item)
    );

    // Apply client-side filtering and sorting since backend doesn't support it yet

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredItems = filteredItems.filter(
        (registration) =>
          registration.fullName?.toLowerCase().includes(searchLower) ||
          registration.volunteer?.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filter
    if (filters.dateRange?.startDate || filters.dateRange?.endDate) {
      filteredItems = filteredItems.filter((registration) => {
        const appDate = new Date(registration.applicationDate);
        const startDate = filters.dateRange?.startDate
          ? new Date(filters.dateRange.startDate)
          : null;
        const endDate = filters.dateRange?.endDate
          ? new Date(filters.dateRange.endDate)
          : null;

        if (startDate && appDate < startDate) return false;
        if (endDate && appDate > endDate) return false;
        return true;
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredItems.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (filters.sortBy) {
          case "applicationDate":
            aValue = new Date(a.applicationDate);
            bValue = new Date(b.applicationDate);
            break;
          case "volunteerName":
            aValue = a.fullName || "";
            bValue = b.fullName || "";
            break;
          case "status":
            aValue = a.statusName || "";
            bValue = b.statusName || "";
            break;
          default:
            aValue = new Date(a.applicationDate);
            bValue = new Date(b.applicationDate);
        }

        if (aValue < bValue) return filters.sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return filters.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return {
      ...response.data,
      items: filteredItems,
      totalCount: filteredItems.length, // Update count after filtering
    };
  }

  async getRegistration(
    eventId: number,
    registrationId: number
  ): Promise<Registration> {
    const response = await apiClient.get<SimpleRegistration>(
      `${this.baseUrl}/${registrationId}?eventId=${eventId}`
    );
    return this.mapToRegistration(response.data);
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
