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

export interface CoordinatorStats {
  managedEvents: number;
  managedVolunteers: number;
  completedTasks: number;
  upcomingEvents: number;
  scheduleConflicts: number;
}

export interface DashboardChart {
  id: string;
  title: string;
  type: "line" | "bar" | "pie" | "doughnut" | "area";
  data: ChartDataPoint[];
  config?: {
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
    tension?: number;
  };
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
  category?: string;
}

export interface RecentActivity {
  id: string;
  type: "event" | "volunteer" | "organization" | "approval" | "system";
  title: string;
  description: string;
  timestamp: string;
  userId?: number;
  userName?: string;
  status?: "success" | "warning" | "error" | "info";
}

export interface DashboardNotification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
  color: "primary" | "secondary" | "success" | "warning" | "error";
  permissions?: string[];
}
