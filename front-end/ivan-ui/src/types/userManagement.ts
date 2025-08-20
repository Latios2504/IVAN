// User Management Types

export interface UserListDto {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  // Basic display info only - no detailed profile for user list
  displayName?: string; // Simple display name for the list
  // Role-specific identifier for quick reference only
  roleSpecificInfo?: string; // e.g., "Student ID: 123", "Organization: ABC", "Company: XYZ"
}

export interface UserFiltersDto {
  search?: string;
  roleId?: number;
  isActive?: boolean;
  isEmailVerified?: boolean;
  page: number;
  size: number;
}

export interface UserRoleDto {
  roleId: number;
  roleName: string;
  description?: string;
  isActive: boolean;
}

export interface UserStatusUpdateDto {
  isActive: boolean;
}

// For detailed user information (returned from GetUserDetails endpoint)
export interface UserDetailsDto {
  // Basic user info (for admin/coordinator)
  userId?: number;
  email?: string;
  roleId?: number;
  roleName?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;

  // Profile information (from UserProfile)
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // Role-specific fields (dynamic based on role)
  // Volunteer fields
  volunteerId?: number;
  studentId?: string;
  university?: string;
  skills?: string;
  availability?: string;
  motivation?: string;

  // Organization fields
  organizationId?: number;
  organizationName?: string;
  organizationType?: string;
  description?: string;
  website?: string;
  establishedYear?: number;

  // Partner fields
  partnerId?: number;
  companyName?: string;
  industry?: string;
  companySize?: string;
  contactPersonName?: string;
  contactPersonPosition?: string;

  // Any other dynamic properties
  [key: string]: any;
}

// Default filter values
export const DEFAULT_USER_FILTERS: UserFiltersDto = {
  page: 1,
  size: 10,
} as const;
