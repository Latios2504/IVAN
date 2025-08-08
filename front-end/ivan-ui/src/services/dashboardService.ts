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

class DashboardService {
  async getSystemStats(): Promise<SystemStats> {
    const response = await apiClient.get<SystemStats>(
      "/dashboard/system/stats"
    );
    return response.data;
  }

  async getAdminStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminStats>("/dashboard/admin/stats");
    return response.data;
  }

  async getOrganizationStats(
    organizationId: number
  ): Promise<OrganizationStats> {
    const response = await apiClient.get<OrganizationStats>(
      `/dashboard/organization/${organizationId}/stats`
    );
    return response.data;
  }

  async getVolunteerStats(volunteerId: number): Promise<VolunteerStats> {
    const response = await apiClient.get<VolunteerStats>(
      `/dashboard/volunteer/${volunteerId}/stats`
    );
    return response.data;
  }

  async getPartnerStats(partnerId: number): Promise<PartnerStats> {
    const response = await apiClient.get<PartnerStats>(
      `/dashboard/partner/${partnerId}/stats`
    );
    return response.data;
  }

  async getCoordinatorStats(coordinatorId: number): Promise<CoordinatorStats> {
    const response = await apiClient.get<CoordinatorStats>(
      `/dashboard/coordinator/${coordinatorId}/stats`
    );
    return response.data;
  }

  async getDashboardCharts(
    role: string,
    userId?: number
  ): Promise<DashboardChart[]> {
    const params = userId ? { userId } : undefined;
    const response = await apiClient.get<DashboardChart[]>(
      `/dashboard/${role}/charts`,
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
      `/dashboard/${role}/activities`,
      params
    );
    return response.data;
  }

  async getNotifications(
    userId: number,
    unreadOnly = false
  ): Promise<DashboardNotification[]> {
    const response = await apiClient.get<DashboardNotification[]>(
      `/dashboard/notifications/${userId}`,
      {
        unreadOnly,
      }
    );
    return response.data;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await apiClient.patch<void>(
      `/dashboard/notifications/${notificationId}/read`
    );
  }

  async getQuickActions(role: string): Promise<QuickAction[]> {
    const response = await apiClient.get<QuickAction[]>(
      `/dashboard/${role}/quick-actions`
    );
    return response.data;
  }
}

export const dashboardService = new DashboardService();
