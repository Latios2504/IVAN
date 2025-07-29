import { apiClient } from "./apiClient";
import { ApiError } from "./errorHandler";
import type { ApiResponse } from "../types/common";
import type { User, UserRole } from "../types/auth";

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
  async getUsers(filter: UserAccountFilterDto): Promise<PagedResultDto<UserAccountListDto>> {
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
  async getUserDetail(userId?: number, email?: string): Promise<UserAccountDetailDto> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId.toString());
      if (email) params.append('email', email);

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
  async toggleUserStatus(userId: number, adminUserId: number, isActive: boolean, currentRoleId?: number): Promise<UserAccountDetailDto> {
    return this.updateUserAccount(userId, adminUserId, {
      roleId: currentRoleId || 0, // Use current roleId if provided, otherwise 0 (will be ignored by backend)
      isActive: isActive
    });
  }

  /**
   * Toggle user email verification status
   */
  async toggleEmailVerification(userId: number, adminUserId: number, isVerified: boolean, currentRoleId?: number): Promise<UserAccountDetailDto> {
    return this.updateUserAccount(userId, adminUserId, {
      roleId: currentRoleId || 0, // Use current roleId if provided, otherwise 0 (will be ignored by backend)
      isEmailVerified: isVerified
    });
  }

  /**
   * Change user role
   */
  async changeUserRole(userId: number, adminUserId: number, newRoleId: number): Promise<UserAccountDetailDto> {
    return this.updateUserAccount(userId, adminUserId, {
      roleId: newRoleId
    });
  }

  /**
   * Create coordinator account (Admin only)
   * Note: This would need a separate endpoint in the backend
   */
  async createCoordinator(coordinatorData: CoordinatorCreationRequest): Promise<{ message: string; userId: number }> {
    try {
      // This endpoint doesn't exist yet in the backend, would need to be implemented
      const response = await this.api.post<{ message: string; userId: number }>(
        "/useraccount/createCoordinator",
        coordinatorData
      );

      if (!response.success || !response.data) {
        throw new ApiError(response.message || "Failed to create coordinator", 400);
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
        throw new ApiError(response.message || "Failed to fetch statistics", 400);
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
      fullName: backendUser.fullName || `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim(),
      role: this.mapRoleIdToRole(backendUser.roleId),
      isActive: backendUser.isActive,
      isEmailVerified: backendUser.isEmailVerified,
      lastLoginAt: backendUser.lastLoginAt,
      createdAt: backendUser.createdAt,
      profile: {
        id: backendUser.profileId || 0,
        userId: backendUser.userId,
        firstName: backendUser.firstName,
        lastName: backendUser.lastName,
        fullName: backendUser.fullName,
        phoneNumber: backendUser.phoneNumber,
        dateOfBirth: backendUser.dateOfBirth,
        gender: backendUser.gender,
        avatar: backendUser.avatar,
        address: backendUser.address,
        wardCommune: backendUser.wardCommune,
        district: backendUser.district,
        province: backendUser.province,
        postalCode: backendUser.postalCode,
        emergencyContactName: backendUser.emergencyContactName,
        emergencyContactPhone: backendUser.emergencyContactPhone,
        bio: '', // Not available in backend DTO
        skills: [], // Would need separate call
        interests: [], // Would need separate call
        availability: [], // Would need separate call
        createdAt: backendUser.createdAt,
        updatedAt: backendUser.updatedAt
      }
    };
  }

  /**
   * Map role ID to frontend role type
   */
  private mapRoleIdToRole(roleId: number): UserRole {
    switch (roleId) {
      case 1: return "admin";
      case 2: return "organization";
      case 3: return "volunteer";
      case 4: return "partner";
      case 5: return "coordinator";
      default: return "volunteer";
    }
  }

  /**
   * Map frontend role to role ID
   */
  private mapRoleToId(role: UserRole): number {
    switch (role) {
      case "admin": return 1;
      case "organization": return 2;
      case "volunteer": return 3;
      case "partner": return 4;
      case "coordinator": return 5;
      default: return 3;
    }
  }
}

export const userManagementService = new UserManagementService();