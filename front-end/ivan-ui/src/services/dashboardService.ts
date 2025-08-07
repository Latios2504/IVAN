import { apiClient } from "./apiClient";

// Dashboard Statistics Types
export interface SystemStats {
  totalVolunteers: number;
  totalOrganizations: number;
  totalEvents: number;
  totalHours: number;
  totalPartnerships: number;
}

export interface OrganizationStats {
  totalVolunteers: number;
  activeEvents: number;
  totalCoordinators: number;
  certificatesIssued: number;
  newVolunteersThisMonth: number;
  hoursThisMonth: number;
  averageRating: number;
}

export interface VolunteerStats {
  eventsJoined: number;
  eventsCompleted: number;
  hoursVolunteered: number;
  certificatesEarned: number;
  currentRating: number;
  upcomingEvents: number;
}

export interface AdminStats {
  totalUsers: number;
  totalOrganizations: number;
  totalVolunteers: number;
  totalCoordinators: number;
  totalEvents: number;
  pendingApprovals: number;
  systemIssues: number;
  recentUsers: number;
  systemHealth: string;
}

class DashboardService {
  private readonly baseUrl = "/dashboard";

  /**
   * Get system-wide statistics for homepage
   * Simplified with consistent error handling via ApiClient
   */
  async getSystemStats(): Promise<SystemStats> {
    const response = await apiClient.get<SystemStats>(
      `${this.baseUrl}/system-stats`
    );
    return response.data || this.getFallbackSystemStats();
  }

  /**
   * Get organization-specific dashboard stats
   * Simplified with consistent error handling via ApiClient
   */
  async getOrganizationStats(): Promise<OrganizationStats> {
    const response = await apiClient.get<OrganizationStats>(
      `${this.baseUrl}/organization-stats`
    );
    return response.data || this.getFallbackOrganizationStats();
  }

  /**
   * Get volunteer-specific dashboard stats
   * Simplified with consistent error handling via ApiClient
   */
  async getVolunteerStats(): Promise<VolunteerStats> {
    const response = await apiClient.get<VolunteerStats>(
      `${this.baseUrl}/volunteer-stats`
    );
    return response.data || this.getFallbackVolunteerStats();
  }

  /**
   * Get admin dashboard stats
   * Simplified with consistent error handling via ApiClient
   */
  async getAdminStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminStats>(
      `${this.baseUrl}/admin-stats`
    );
    return response.data || this.getFallbackAdminStats();
  }

  /**
   * Get recent activities for dashboard
   * Simplified with consistent error handling via ApiClient
   */
  async getRecentActivities(): Promise<any[]> {
    const response = await apiClient.get<any[]>(
      `${this.baseUrl}/recent-activities`
    );
    return response.data || [];
  }

  // Fallback methods provide default data when API calls fail
  private getFallbackSystemStats(): SystemStats {
    return {
      totalVolunteers: 0,
      totalOrganizations: 0,
      totalEvents: 0,
      totalHours: 0,
      totalPartnerships: 0,
    };
  }

  private getFallbackOrganizationStats(): OrganizationStats {
    return {
      totalVolunteers: 0,
      activeEvents: 0,
      totalCoordinators: 0,
      certificatesIssued: 0,
      newVolunteersThisMonth: 0,
      hoursThisMonth: 0,
      averageRating: 0,
    };
  }

  private getFallbackVolunteerStats(): VolunteerStats {
    return {
      eventsJoined: 0,
      eventsCompleted: 0,
      hoursVolunteered: 0,
      certificatesEarned: 0,
      currentRating: 0,
      upcomingEvents: 0,
    };
  }

  private getFallbackAdminStats(): AdminStats {
    return {
      totalUsers: 0,
      totalOrganizations: 0,
      totalVolunteers: 0,
      totalCoordinators: 0,
      totalEvents: 0,
      pendingApprovals: 0,
      systemIssues: 0,
      recentUsers: 0,
      systemHealth: "Unknown",
    };
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
