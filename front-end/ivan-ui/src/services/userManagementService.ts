import { apiClient } from "./apiClient";
import { ApiError } from "./errorHandler";
import type { ApiResponse } from "../types/common";
import type { User, UserRole } from "../types/auth";
import type { BaseProfile } from "../types/profile/profiles";

// Backend DTOs matching the API
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

export interface VolunteerProfileData {
  volunteerId: number;
  studentId?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  motivation?: string;
  experience?: string;
  availability?: string;
  volunteerHours: number;
  rating?: number;
  ratingCount: number;
  isVerified: boolean;
  verifiedAt?: string;
  totalHoursVolunteered: number;
  skills?: string;
  lastActiveDate?: string;
}

export interface OrganizationProfileData {
  organizationId: number;
  organizationName: string;
  shortName?: string;
  typeId: number;
  typeName?: string;
  taxCode?: string;
  businessLicense?: string;
  establishedYear?: number;
  website?: string;
  facebookPage?: string;
  linkedInPage?: string;
  description?: string;
  mission?: string;
  vision?: string;
  contactPersonName?: string;
  contactPersonTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isVerified: boolean;
  verifiedAt?: string;
  rating?: number;
  ratingCount: number;
  totalEvents: number;
  totalVolunteers: number;
}

export interface PartnerProfileData {
  partnerId: number;
  companyName: string;
  industryId: number;
  industryName?: string;
  taxCode?: string;
  businessLicense?: string;
  website?: string;
  description?: string;
  contactPersonName?: string;
  contactPersonTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  isVerified: boolean;
  verifiedAt?: string;
  rating?: number;
  ratingCount: number;
  totalCollaborations: number;
}

export interface CoordinatorProfileData {
  coordinatorId: number;
  organizationId: number;
  organizationName?: string;
  employeeId?: string;
  position?: string;
  department?: string;
  responsibilities?: string;
  hireDate?: string;
  endDate?: string;
  managerId?: number;
  managerName?: string;
  notes?: string;
}

export interface UserStatisticsDto {
  totalEventsJoined?: number;
  totalEventsCompleted?: number;
  totalCollaborations?: number;
  totalVolunteerHours?: number;
  averageRating?: number;
}

export interface UserAccountFilterDto {
  roleId?: number;
  isActive?: boolean;
  isEmailVerified?: boolean;
  searchTerm?: string;
  pageNumber: number;
  pageSize: number;
}

export interface UserAccountUpdateDto {
  roleId: number;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CoordinatorCreationRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  temporaryPassword?: string;
}

/**
 * User Management Service for Admin functionality
 * Integrates with backend UserAccountController
 */
class UserManagementService {
  private get api() {
    return apiClient;
  }

  /**
   * Get paginated list of users with filtering
   */
  async getUsers(
    filter: UserAccountFilterDto
  ): Promise<PagedResultDto<UserAccountListDto>> {
    try {
      const response = await this.api.post<PagedResultDto<UserAccountListDto>>(
        "/useraccount/getListUser",
        filter
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.message || "Failed to fetch users", 400);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  /**
   * Get detailed user information by ID or email
   */
  async getUserDetail(
    userId?: number,
    email?: string
  ): Promise<UserAccountDetailDto> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId.toString());
      if (email) params.append("email", email);

      const response = await this.api.post<UserAccountDetailDto>(
        `/useraccount/getUserInforDetail?${params.toString()}`,
        {} // Empty body since we're using query parameters
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.message || "User not found", 404);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching user detail:", error);
      throw error;
    }
  }

  /**
   * Update user account (Admin only)
   */
  async updateUserAccount(
    userId: number,
    adminUserId: number,
    updateData: UserAccountUpdateDto
  ): Promise<UserAccountDetailDto> {
    try {
      const response = await this.api.post<UserAccountDetailDto>(
        `/useraccount/updateUserAccount?userId=${userId}&adminUser=${adminUserId}`,
        updateData
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.message || "Failed to update user", 400);
      }

      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(
    userId: number,
    adminUserId: number,
    isActive: boolean,
    currentRoleId?: number
  ): Promise<UserAccountDetailDto> {
    return this.updateUserAccount(userId, adminUserId, {
      roleId: currentRoleId || 0, // Use current roleId if provided, otherwise 0 (will be ignored by backend)
      isActive: isActive,
    });
  }

  /**
   * Toggle user email verification status
   */
  async toggleEmailVerification(
    userId: number,
    adminUserId: number,
    isVerified: boolean,
    currentRoleId?: number
  ): Promise<UserAccountDetailDto> {
    return this.updateUserAccount(userId, adminUserId, {
      roleId: currentRoleId || 0, // Use current roleId if provided, otherwise 0 (will be ignored by backend)
      isEmailVerified: isVerified,
    });
  }

  /**
   * Change user role
   */
  async changeUserRole(
    userId: number,
    adminUserId: number,
    newRoleId: number
  ): Promise<UserAccountDetailDto> {
    return this.updateUserAccount(userId, adminUserId, {
      roleId: newRoleId,
    });
  }

  /**
   * Create coordinator account (Admin only)
   * Note: This would need a separate endpoint in the backend
   */
  async createCoordinator(
    coordinatorData: CoordinatorCreationRequest
  ): Promise<{ message: string; userId: number }> {
    try {
      // This endpoint doesn't exist yet in the backend, would need to be implemented
      const response = await this.api.post<{ message: string; userId: number }>(
        "/useraccount/createCoordinator",
        coordinatorData
      );

      if (!response.success || !response.data) {
        throw new ApiError(
          response.message || "Failed to create coordinator",
          400
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error creating coordinator:", error);
      throw error;
    }
  }

  /**
   * Get user statistics summary
   */
  async getUserStatistics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    unverifiedUsers: number;
    usersByRole: Record<string, number>;
  }> {
    try {
      // This would need a separate endpoint in the backend for statistics
      const response = await this.api.get<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        unverifiedUsers: number;
        usersByRole: Record<string, number>;
      }>("/useraccount/statistics");

      if (!response.success || !response.data) {
        throw new ApiError(
          response.message || "Failed to fetch statistics",
          400
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      throw error;
    }
  }

  /**
   * Convert backend UserAccountDetailDto to frontend User type
   */
  mapToFrontendUser(backendUser: UserAccountDetailDto): User {
    return {
      id: backendUser.userId,
      email: backendUser.email,
      fullName:
        backendUser.fullName ||
        `${backendUser.firstName || ""} ${backendUser.lastName || ""}`.trim(),
      role: this.mapRoleIdToRole(backendUser.roleId),
      isActive: backendUser.isActive,
      isEmailVerified: backendUser.isEmailVerified,
      lastLoginAt: backendUser.lastLoginAt,
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,
    };
  }

  /**
   * Map role ID to frontend role type
   */
  private mapRoleIdToRole(roleId: number): UserRole {
    switch (roleId) {
      case 1:
        return "volunteer";
      case 2:
        return "organization";
      case 3:
        return "partner";
      case 4:
        return "coordinator";
      case 5:
        return "admin";
      default:
        return "volunteer";
    }
  }

  /**
   * Map frontend role to role ID
   */
  private mapRoleToId(role: UserRole): number {
    switch (role) {
      case "volunteer":
        return 1;
      case "organization":
        return 2;
      case "partner":
        return 3;
      case "coordinator":
        return 4;
      case "admin":
        return 5;
      default:
        return 1;
    }
  }
}

export const userManagementService = new UserManagementService();
