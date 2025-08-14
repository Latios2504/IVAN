export const UserRole = {
  VOLUNTEER: "volunteer",
  ORGANIZATION: "organization",
  COORDINATOR: "coordinator",
  PARTNER: "partner",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const PUBLIC_REGISTRATION_ROLES = [
  UserRole.VOLUNTEER,
  UserRole.ORGANIZATION,
  UserRole.PARTNER,
] as const;

export type PublicRegistrationRole = (typeof PUBLIC_REGISTRATION_ROLES)[number];

// Backend DTOs matching API responses
export interface ApiUser {
  userId: number;
  email: string;
  roleName: string;
  roleId: number;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  // Profile-specific IDs from enhanced backend
  organizationId?: number | null;
  partnerId?: number | null;
  volunteerId?: number | null;
  coordinatorId?: number | null;
}

export interface LoginResponseDTO {
  token: string;
  expiresAt: string;
  user: ApiUser;
}

// Frontend User type
export interface User extends Omit<ApiUser, "userId" | "roleName"> {
  id: number;
  fullName?: string;
  role: UserRole;
  // Profile-specific IDs
  organizationId?: number | null;
  partnerId?: number | null;
  volunteerId?: number | null;
  coordinatorId?: number | null;
  // Additional frontend properties
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string | null;
}

// Request DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  email: string;
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: PublicRegistrationRole;
}

export interface CoordinatorCreationRequest {
  organizationId: number;
  coordinatorEmail: string;
  coordinatorFirstName: string;
  coordinatorLastName: string;
  coordinatorPhoneNumber?: string;
  justification: string;
  expectedResponsibilities: string[];
}

// Utility functions for working with profile IDs
export const getUserProfileId = (user: User): number | null => {
  switch (user.role) {
    case UserRole.ORGANIZATION:
      return user.organizationId || null;
    case UserRole.PARTNER:
      return user.partnerId || null;
    case UserRole.VOLUNTEER:
      return user.volunteerId || null;
    case UserRole.COORDINATOR:
      return user.coordinatorId || null;
    default:
      return null;
  }
};

export const hasProfileId = (user: User): boolean => {
  return getUserProfileId(user) !== null;
};

export const getProfileType = (user: User): string => {
  switch (user.role) {
    case UserRole.ORGANIZATION:
      return "organization";
    case UserRole.PARTNER:
      return "partner";
    case UserRole.VOLUNTEER:
      return "volunteer";
    case UserRole.COORDINATOR:
      return "coordinator";
    default:
      return "user";
  }
};
