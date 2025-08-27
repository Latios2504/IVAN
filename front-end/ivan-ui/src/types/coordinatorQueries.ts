// Coordinator Queries API Types - Matching backend CoordinatorQueriesController

export interface VolunteerBriefDto {
  volunteerId: number;
  fullName: string;
  email?: string;
  totalEvents: number;
  lastEventEndDate?: string;
}

export interface EventBriefDto {
  eventId: number;
  eventName: string;
  startDate: string;
  endDate: string;
  statusName: string;
  organizationId: number;
}

// Pagination parameters for coordinator queries
export interface CoordinatorQueryFilters {
  pageNumber?: number;
  pageSize?: number;
}
