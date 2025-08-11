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
