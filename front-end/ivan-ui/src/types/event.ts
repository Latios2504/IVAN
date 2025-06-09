export interface Event {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  organizationName: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location: EventLocation;
  requirements: EventRequirement[];
  maxVolunteers: number;
  registeredVolunteers: number;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

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
