// Backend-aligned Event DTOs for Organization Event Management

export interface EventDto {
  eventId: number;
  organizationId: number;
  organizationName: string;
  eventName: string;
  categoryId: number;
  categoryName: string;
  statusId: number;
  statusName: string;
  description: string;
  shortDescription?: string;
  startDate: string;
  endDate: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  location: string;
  detailedAddress?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  maxVolunteers: number;
  minVolunteers?: number;
  currentVolunteers?: number;
  requiredSkills?: string;
  ageRequirement?: string;
  genderRequirement?: string;
  requirements?: string;
  benefits?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  bannerImageUrl?: string;
  galleryImages?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  priority?: number;
  budget?: number;
  currency?: string;
  viewCount?: number;
  registrationCount?: number;
  rating?: number;
  ratingCount?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isActive?: boolean;
}

export interface CreateEventDto {
  organizationId?: number; // Auto-set by backend
  eventName: string;
  categoryId: number;
  statusId?: number;
  description: string;
  shortDescription?: string;
  startDate: string;
  endDate: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  location: string;
  detailedAddress?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  maxVolunteers: number;
  minVolunteers?: number;
  requiredSkills?: string;
  ageRequirement?: string;
  genderRequirement?: string;
  requirements?: string;
  benefits?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  bannerImageUrl?: string;
  galleryImages?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  priority?: number;
  budget?: number;
  currency?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  eventId: number;
}

export interface EventFilterDto {
  search?: string;
  categoryIds?: number[];
  statusIds?: number[];
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  province?: string;
  district?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  minVolunteers?: number;
  maxVolunteers?: number;
  page: number;
  size: number;
  sortBy: string;
  sortDirection: string;
}

export interface EventStatsDto {
  totalEvents: number;
  planningEvents: number;
  activeEvents: number;
  inProgressEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  totalVolunteers: number;
  totalRegistrations: number;
  averageRating: number;
  upcomingEventsThisMonth: number;
  registrationRate: number;
  eventsByCategory: Record<string, number>;
  eventsByMonth: Record<string, number>;
}

export interface EventCategoryDto {
  categoryId: number;
  categoryName: string;
  description?: string;
  isActive: boolean;
}

export interface EventStatusDto {
  statusId: number;
  statusName: string;
  description?: string;
  isActive: boolean;
}

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface UpdateEventStatusDto {
  statusId: number;
  reason?: string;
}

// Event Analytics & Transitions
export interface EventAnalyticsDto {
  eventId: number;
  timeframe: string;
  registrations: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    trend: number;
  };
  volunteers: {
    current: number;
    target: number;
    fulfillmentRate: number;
  };
  engagement: {
    viewCount: number;
    rating: number;
    reviews: number;
  };
  timeline: Array<{
    date: string;
    registrations: number;
    views: number;
  }>;
}

// Legacy interfaces (kept for backward compatibility during migration)
export interface Event extends EventDto {}

export interface EventLocation {
  address: string;
  city: string;
  province: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface EventRequirement {
  id: string;
  skill: string;
  level: SkillLevel;
  isRequired: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  volunteerId: string;
  volunteerName: string;
  registeredAt: string;
  status: RegistrationStatus;
  notes?: string;
}

export enum EventCategory {
  EDUCATION = "education",
  HEALTHCARE = "healthcare",
  ENVIRONMENT = "environment",
  COMMUNITY = "community",
  DISASTER_RELIEF = "disaster_relief",
  ELDERLY_CARE = "elderly_care",
  CHILDREN = "children",
  DISABILITY_SUPPORT = "disability_support",
}

export enum EventStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum RegistrationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  ATTENDED = "attended",
  NO_SHOW = "no_show",
}

export enum SkillLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

export interface EventFormData {
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location: EventLocation;
  requirements: EventRequirement[];
  maxVolunteers: number;
}
