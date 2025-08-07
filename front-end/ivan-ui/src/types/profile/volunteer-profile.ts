// Volunteer Profile Types for IVAN System
// Re-exports from unified profiles.ts to maintain compatibility

import type {
  VolunteerProfile,
  UpdateVolunteerProfileData,
  VolunteerSkill,
} from "./profiles";

// Re-export main interfaces with alternate names for compatibility
export type VolunteerProfileData = VolunteerProfile;
export type CreateVolunteerProfileData = UpdateVolunteerProfileData;

// Volunteer profile filters for search/listing
export interface VolunteerProfileFilters {
  university?: string;
  major?: string;
  yearOfStudy?: number;
  province?: string;
  isVerified?: boolean;
  isActive?: boolean;
  skillIds?: number[];
  availabilityType?: string;
  ratingFrom?: number;
  ratingTo?: number;
  volunteerHoursFrom?: number;
  volunteerHoursTo?: number;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: "name" | "rating" | "volunteerHours" | "university" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Volunteer statistics
export interface VolunteerStats {
  totalVolunteers: number;
  verifiedVolunteers: number;
  activeVolunteers: number;
  averageVolunteerHours: number;
  averageRating: number;
  topUniversities: UniversityStats[];
  topSkills: SkillStats[];
  volunteersByProvince: ProvinceStats[];
}

export interface UniversityStats {
  university: string;
  volunteerCount: number;
  averageHours: number;
  averageRating: number;
}

export interface SkillStats {
  skillId: number;
  skillName: string;
  volunteerCount: number;
  averageProficiency: string;
}

export interface ProvinceStats {
  province: string;
  volunteerCount: number;
  averageHours: number;
}

// Skill-related types
export interface Skill {
  skillId: number;
  skillName: string;
  category: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateVolunteerSkillData {
  volunteerId: number;
  skillId: number;
  proficiencyLevel: "Cơ bản" | "Khá" | "Tốt" | "Xuất sắc";
  yearsOfExperience: number;
  description?: string;
}

export interface UpdateVolunteerSkillData {
  volunteerId: number;
  skillId: number;
  proficiencyLevel?: "Cơ bản" | "Khá" | "Tốt" | "Xuất sắc";
  yearsOfExperience?: number;
  description?: string;
}

// Volunteer activity tracking
export interface VolunteerActivity {
  activityId: number;
  volunteerId: number;
  eventId?: number;
  eventName?: string;
  activityType:
    | "event_registration"
    | "event_completion"
    | "skill_update"
    | "profile_update"
    | "certification";
  description: string;
  hoursContributed?: number;
  activityDate: string;
  status: "completed" | "in_progress" | "cancelled";
}

// Volunteer verification types
export interface VolunteerVerificationData {
  volunteerId: number;
  verificationStatus: "pending" | "verified" | "rejected";
  verificationDocuments: VerificationDocument[];
  verificationNotes?: string;
  verifiedBy?: number;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface VerificationDocument {
  documentId: number;
  documentType:
    | "student_id"
    | "university_certificate"
    | "identity_card"
    | "other";
  documentName: string;
  documentUrl: string;
  uploadedAt: string;
  verificationStatus: "pending" | "approved" | "rejected";
  notes?: string;
}

// Volunteer preferences
export interface VolunteerPreferences {
  volunteerId: number;
  preferredCategories: number[]; // Event category IDs
  preferredLocations: string[]; // Province/city names
  availableDays: string[]; // Days of week
  availableTimeSlots: string[]; // Time ranges
  transportationMethod:
    | "public_transport"
    | "private_vehicle"
    | "walking"
    | "bicycle";
  maxTravelDistance: number; // in kilometers
  skillInterests: number[]; // Skill IDs they want to develop
  languagePreferences: string[];
  notificationPreferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    eventReminders: boolean;
    weeklyDigest: boolean;
  };
}

// Export re-exports for convenience
export type {
  VolunteerProfile,
  VolunteerSkill,
  UpdateVolunteerProfileData,
} from "@/types/profile/profiles";
