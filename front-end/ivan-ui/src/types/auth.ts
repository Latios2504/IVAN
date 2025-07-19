import type {
  UserProfile,
  VolunteerProfile,
  OrganizationProfile,
  CoordinatorProfile,
  PartnerProfile,
} from "./profile";

export const UserRole = {
  VOLUNTEER: "volunteer",
  ORGANIZATION: "organization",
  COORDINATOR: "coordinator",
  PARTNER: "partner",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Roles that can self-register (Guest users can only register as these roles)
export const PUBLIC_REGISTRATION_ROLES = [
  UserRole.VOLUNTEER,
  UserRole.ORGANIZATION,
  UserRole.PARTNER,
] as const;

export type PublicRegistrationRole = (typeof PUBLIC_REGISTRATION_ROLES)[number];

// API User type matching backend DTO
export interface ApiUser {
  userId: number;
  email: string;
  roleName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  profile?: UserProfile;
}

// Frontend User type with computed properties
export interface User extends Omit<ApiUser, "userId" | "roleName"> {
  id: number; // Mapped from userId for frontend consistency
  fullName?: string; // Computed from profile data - can be null
  role: UserRole; // Typed enum instead of string
  profile?:
    | VolunteerProfile
    | OrganizationProfile
    | CoordinatorProfile
    | PartnerProfile;
  organizationId?: number; // For coordinators - liên kết với organization
  updatedAt?: string; // Optional field
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Request types matching backend DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

// Legacy interface name for backward compatibility
export type LoginCredentials = LoginRequest;

// Backend register request matching DTO
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

// Response types matching backend
export interface LoginResponse {
  user: ApiUser;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

// Legacy interface with extended fields (for forms)
export interface RegisterData extends RegisterRequest {
  role: PublicRegistrationRole; // Only allow public registration roles

  // Contact Info
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";

  // Address
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  // Role-specific fields
  // For volunteers
  skills?: string[];
  interests?: string[];
  availability?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // For organizations
  organizationName?: string;
  organizationType?:
    | "NGO"
    | "Non-profit"
    | "Government"
    | "Educational"
    | "Religious"
    | "Corporate"
    | "Other";
  organizationDescription?: string;
  website?: string;
  contactPersonName?: string;
  contactPersonTitle?: string;
  focusAreas?: string[];
  // For partners
  companyName?: string;
  industry?: string;
  companyDescription?: string;
  partnerType?:
    | "Corporate"
    | "Foundation"
    | "Government"
    | "International"
    | "Other";
  partnershipInterests?: string[];
  expectedPartnership?: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

// Interface for coordinator account creation request (Organization -> Admin)
export interface CoordinatorCreationRequest {
  organizationId: number; // Match database INT
  coordinatorEmail: string;
  coordinatorFirstName: string;
  coordinatorLastName: string;
  coordinatorPhoneNumber?: string;
  justification: string; // Why this coordinator is needed
  expectedResponsibilities: string[];
}
