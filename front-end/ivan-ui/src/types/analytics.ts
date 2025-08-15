// Analytics API Types - Matching backend AnalyticsController

// Enums for Time Periods
export enum TimePeriod {
  Last7Days,
  Last30Days,
  Last3Months,
  Last6Months,
  LastYear,
  Custom
}

// Admin Dashboard Analytics
export interface AdminDashboardDto {
  totalUsers: number;
  totalVolunteers: number;
  totalOrganizations: number;
  totalPartners: number;
  totalCoordinators: number;
  totalEvents: number;
  totalRegistrations: number;
  pendingVerifications: number;
  roleDistribution: RoleDistributionDto[];
  monthlyGrowth: MonthlyStatsDto[];
}

// Organization Dashboard Analytics
export interface OrganizationDashboardDto {
  myTotalEvents: number;
  myActiveEvents: number;
  myCompletedEvents: number;
  totalVolunteersReached: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  averageEventRating: number;
  totalVolunteerHours: number;
  eventsByCategory: EventCategoryStatsDto[];
  recentEvents: RecentEventDto[];
}

// Partner Dashboard Analytics
export interface PartnerDashboardDto {
  totalCollaborations: number;
  activeCollaborations: number;
  sponsoredEvents: number;
  totalSponsorshipAmount: number;
  averagePartnerRating: number;
  collaborationsByType: CollaborationTypeDto[];
  industryComparison: IndustryStatsDto[];
}

// Coordinator Dashboard Analytics
export interface CoordinatorDashboardDto {
  eventsManaged: number;
  volunteersManaged: number;
  tasksAssigned: number;
  tasksCompleted: number;
  taskCompletionRate: number;
  upcomingEvents: number;
  pendingApprovals: number;
  tasksByStatus: TaskStatusDto[];
  topVolunteers: VolunteerPerformanceDto[];
}

// Volunteer Dashboard Analytics
export interface VolunteerDashboardDto {
  eventsParticipated: number;
  eventsCompleted: number;
  totalVolunteerHours: number;
  skillsAcquired: number;
  upcomingEvents: number;
  eventsByCategory: EventCategoryStatsDto[];
  skillProgress: SkillProgressDto[];
  recentAchievements: RecentAchievementDto[];
}

// Supporting DTOs
export interface RoleDistributionDto {
  roleName: string;
  userCount: number;
  percentage: number;
}

export interface MonthlyStatsDto {
  month: string;
  users: number;
  events: number;
  registrations: number;
}

export interface EventCategoryStatsDto {
  categoryName: string;
  eventCount: number;
  volunteerCount: number;
}

export interface RecentEventDto {
  eventId: number;
  eventName: string;
  startDate: string;
  status: string;
  registeredVolunteers: number;
}

export interface CollaborationTypeDto {
  type: string;
  count: number;
  amount: number;
}

export interface IndustryStatsDto {
  industryName: string;
  partnerCount: number;
  collaborationCount: number;
}

export interface TaskStatusDto {
  status: string;
  count: number;
  color: string;
}

export interface VolunteerPerformanceDto {
  volunteerId: number;
  volunteerName: string;
  tasksCompleted: number;
  rating: number;
  hoursWorked: number;
}

export interface SkillProgressDto {
  skillName: string;
  proficiencyLevel: string;
  eventsUsed: number;
  yearsOfExperience: number;
}

export interface RecentAchievementDto {
  title: string;
  description: string;
  achievedDate: string;
  type: string;
}

// Additional DTOs for Analytics Service
export interface CoordinatorTaskDto {
  taskName: string;
  status: string;
  dueDate?: string;
  priority: string;
}

export interface VolunteerEventDto {
  eventName: string;
  startDate: string;
  location: string;
  organizationName: string;
}

export interface PartnerActivityDto {
  activityType: string;
  description: string;
  date: string;
  status: string;
}