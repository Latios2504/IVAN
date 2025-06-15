// Type exports for IVAN project
// Note: Some types may have naming conflicts between modules
// Import specific types from their respective modules when needed

// Core system types
export * from "./auth";
export * from "./common";
export * from "./api";
export * from "./profile";
export * from "./coordinator";

// Primary event types
export * from "./event";

// Organization types (with renamed conflicting exports)
export type {
  EventStatus as OrgEventStatus,
  VolunteerApplicationStatus,
  EventVolunteerInfo,
  Event as OrgEvent,
  EventFormData as OrgEventFormData,
} from "./organization";

// Extended organization functionality
export * from "./organization-extended";

// Note: Partner and Notification types have conflicts with organization-extended
// Import them directly from their modules when needed:
// import type { Partner } from '@/types/partner';
// import type { Notification } from '@/types/notification';
