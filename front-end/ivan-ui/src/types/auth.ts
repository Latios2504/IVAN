import type { VolunteerProfile, OrganizationProfile } from "./profile";

export const UserRole = {
  VOLUNTEER: "volunteer",
  ORGANIZATION: "organization",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  profile?: VolunteerProfile | OrganizationProfile;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;

  // Contact Info
  phone?: string;
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
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}
