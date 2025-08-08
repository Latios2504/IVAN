// User Management DTOs and Types

import type {
  OrganizationProfile,
  PartnerProfile,
  CoordinatorProfile,
  VolunteerProfile,
} from "./profile/profiles";

// Re-export profile types for compatibility
export type OrganizationProfileData = OrganizationProfile;
export type PartnerProfileData = PartnerProfile;
export type CoordinatorProfileData = CoordinatorProfile;
export type VolunteerProfileData = VolunteerProfile;

export interface UserAccountListDto {
  userId: number;
  email: string;
  fullName?: string; // Can be null from API
  roleName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  phoneNumber?: string;
  province?: string;
  age?: number;
  statusDisplay: string;
  verificationDisplay: string;
}

export interface UserAccountDetailDto {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
  roleDescription?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  profileId?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  fullAddress?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  age?: number;
  statusDisplay: string;
  verificationDisplay: string;
  statistics: UserStatisticsDto;
  // Role-specific profile data
  volunteerProfile?: VolunteerProfileData;
  organizationProfile?: OrganizationProfileData;
  partnerProfile?: PartnerProfileData;
  coordinatorProfile?: CoordinatorProfileData;
}

export interface UserStatisticsDto {
  totalLogins: number;
  lastLoginDays: number;
  accountAgeInDays: number;
  isNewUser: boolean;
  activityScore: number;
}

export interface UserAccountFilterDto {
  email?: string;
  fullName?: string;
  roleName?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  province?: string;
  minAge?: number;
  maxAge?: number;
  createdFrom?: string;
  createdTo?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  sortBy?: "email" | "fullName" | "createdAt" | "lastLoginAt";
  sortDirection?: "ASC" | "DESC";
  page?: number;
  size?: number;
}

export interface UserAccountUpdateDto {
  userId: number;
  isActive?: boolean;
  isEmailVerified?: boolean;
  // Profile updates can be added here
}
