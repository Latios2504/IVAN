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
  organizationId?: number;
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
