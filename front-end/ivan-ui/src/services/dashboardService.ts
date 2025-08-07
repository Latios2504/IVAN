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

export interface PartnerStats {
  totalCollaborations: number;
  activeProjects: number;
  totalInvestment: number;
  partneredOrganizations: number;
}

// Additional types for analytics dashboard
export interface UserAnalytics {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    verifiedUsers: number;
    userRetentionRate: number;
    averageSessionDuration: number;
    mostActiveRole: number;
    mostActiveRoleName: string;
  };
  userGrowth: {
    date: string;
    newUsers: number;
    totalUsers: number;
    activeUsers: number;
  }[];
  roleDistribution: {
    roleName: string;
    userCount: number;
    percentage: number;
  }[];
  geographicDistribution: {
    province: string;
    userCount: number;
    percentage: number;
  }[];
}

export interface EventAnalytics {
  eventStats: {
    totalEvents: number;
    activeEvents: number;
    completedEvents: number;
    cancelledEvents: number;
    averageRegistrationsPerEvent: number;
    eventCompletionRate: number;
    totalRegistrations: number;
    approvedRegistrations: number;
    registrationApprovalRate: number;
  };
  eventTrends: {
    date: string;
    eventsCreated: number;
    eventsCompleted: number;
    registrations: number;
  }[];
  categoryStats: {
    categoryName: string;
    eventCount: number;
    totalRegistrations: number;
    averageRating: number;
    percentage: number;
  }[];
  registrationStats: {
    totalRegistrations: number;
    approvedRegistrations: number;
    pendingRegistrations: number;
    rejectedRegistrations: number;
    approvalRate: number;
    averageProcessingTime: number;
    attendanceRate: number;
  };
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
   * Get partner dashboard stats
   * Simplified with consistent error handling via ApiClient
   */
  async getPartnerStats(): Promise<PartnerStats> {
    const response = await apiClient.get<PartnerStats>(
      `${this.baseUrl}/partner-stats`
    );
    return response.data || this.getFallbackPartnerStats();
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

  /**
   * Get user analytics for admin dashboard
   */
  async getUserAnalytics(): Promise<UserAnalytics> {
    const response = await apiClient.get<UserAnalytics>(
      `${this.baseUrl}/user-analytics`
    );
    return response.data || this.getFallbackUserAnalytics();
  }

  /**
   * Get event analytics for admin dashboard
   */
  async getEventAnalytics(): Promise<EventAnalytics> {
    const response = await apiClient.get<EventAnalytics>(
      `${this.baseUrl}/event-analytics`
    );
    return response.data || this.getFallbackEventAnalytics();
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

  private getFallbackPartnerStats(): PartnerStats {
    return {
      totalCollaborations: 0,
      activeProjects: 0,
      totalInvestment: 0,
      partneredOrganizations: 0,
    };
  }

  private getFallbackUserAnalytics(): UserAnalytics {
    return {
      userStats: {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        verifiedUsers: 0,
        userRetentionRate: 0,
        averageSessionDuration: 0,
        mostActiveRole: 1,
        mostActiveRoleName: "volunteer",
      },
      userGrowth: [],
      roleDistribution: [],
      geographicDistribution: [],
    };
  }

  private getFallbackEventAnalytics(): EventAnalytics {
    return {
      eventStats: {
        totalEvents: 0,
        activeEvents: 0,
        completedEvents: 0,
        cancelledEvents: 0,
        averageRegistrationsPerEvent: 0,
        eventCompletionRate: 0,
        totalRegistrations: 0,
        approvedRegistrations: 0,
        registrationApprovalRate: 0,
      },
      eventTrends: [],
      categoryStats: [],
      registrationStats: {
        totalRegistrations: 0,
        approvedRegistrations: 0,
        pendingRegistrations: 0,
        rejectedRegistrations: 0,
        approvalRate: 0,
        averageProcessingTime: 0,
        attendanceRate: 0,
      },
    };
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
