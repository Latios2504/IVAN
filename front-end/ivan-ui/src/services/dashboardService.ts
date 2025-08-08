import { apiClient } from "./apiClient";
import type {
  SystemStats,
  OrganizationStats,
  VolunteerStats,
  AdminStats,
  PartnerStats,
  CoordinatorStats,
  DashboardChart,
  RecentActivity,
  DashboardNotification,
  QuickAction,
} from "../types/dashboard";
import type { UserAnalytics, EventAnalytics } from "../types/analytics";

class DashboardService {
  async getSystemStats(): Promise<SystemStats> {
    const response = await apiClient.get<SystemStats>(
      "/Dashboard/system-stats"
    );
    return response.data;
  }

  async getAdminStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminStats>("/Dashboard/admin-stats");
    return response.data;
  }

  async getOrganizationStats(
    organizationId?: number
  ): Promise<OrganizationStats> {
    const response = await apiClient.get<OrganizationStats>(
      "/Dashboard/organization-stats"
    );
    return response.data;
  }

  async getVolunteerStats(volunteerId?: number): Promise<VolunteerStats> {
    const response = await apiClient.get<VolunteerStats>(
      "/Dashboard/volunteer-stats"
    );
    return response.data;
  }

  async getPartnerStats(partnerId?: number): Promise<PartnerStats> {
    const response = await apiClient.get<PartnerStats>(
      "/Dashboard/partner-stats"
    );
    return response.data;
  }

  async getCoordinatorStats(coordinatorId: number): Promise<CoordinatorStats> {
    const response = await apiClient.get<CoordinatorStats>(
      `/Dashboard/coordinator/${coordinatorId}/stats`
    );
    return response.data;
  }

  async getDashboardCharts(
    role: string,
    userId?: number
  ): Promise<DashboardChart[]> {
    const params = userId ? { userId } : undefined;
    const response = await apiClient.get<DashboardChart[]>(
      `/Dashboard/${role}/charts`,
      params
    );
    return response.data;
  }

  async getRecentActivities(
    role: string,
    userId?: number,
    limit = 10
  ): Promise<RecentActivity[]> {
    const params: Record<string, number | undefined> = { limit };
    if (userId) params.userId = userId;
    const response = await apiClient.get<RecentActivity[]>(
      `/Dashboard/${role}/activities`,
      params
    );
    return response.data;
  }

  async getNotifications(
    userId: number,
    unreadOnly = false
  ): Promise<DashboardNotification[]> {
    const response = await apiClient.get<DashboardNotification[]>(
      `/Dashboard/notifications/${userId}`,
      {
        unreadOnly,
      }
    );
    return response.data;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await apiClient.patch<void>(
      `/Dashboard/notifications/${notificationId}/read`
    );
  }

  async getQuickActions(role: string): Promise<QuickAction[]> {
    const response = await apiClient.get<QuickAction[]>(
      `/Dashboard/${role}/quick-actions`
    );
    return response.data;
  }

  async getUserAnalytics(
    period: string = "Last30Days"
  ): Promise<UserAnalytics> {
    const response = await apiClient.get<UserAnalytics>(
      `/Dashboard/admin-analytics/users`,
      {
        period,
      }
    );
    return response.data;
  }

  async getEventAnalytics(
    period: string = "Last30Days"
  ): Promise<EventAnalytics> {
    const response = await apiClient.get<EventAnalytics>(
      `/Dashboard/admin-analytics/events`,
      {
        period,
      }
    );
    return response.data;
  }
}

export const dashboardService = new DashboardService();
