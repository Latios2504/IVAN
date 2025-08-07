import { apiClient, ApiError } from "./apiClient";
import type { ApiResponse } from "../types/common";
import type { User, UserRole } from "../types/auth";
import type { BaseProfile } from "../types/profile/profiles";
import type {
  UserAccountListDto,
  UserAccountDetailDto,
  VolunteerProfileData,
  OrganizationProfileData,
  PartnerProfileData,
  CoordinatorProfileData,
  UserStatisticsDto,
  UserAccountFilterDto,
  UserAccountUpdateDto,
  PagedResultDto,
  CoordinatorCreationRequest,
} from "../types/userManagement";

/**
 * User Management Service for Admin functionality
 * Integrates with backend UserAccountController
 */
class UserManagementService {
  /**
   * Get paginated list of users with filtering
   */
  async getUsers(
    filter: UserAccountFilterDto
  ): Promise<PagedResultDto<UserAccountListDto>> {
    const response = await apiClient.post<PagedResultDto<UserAccountListDto>>(
      "/useraccount/getListUser",
      filter
    );
    return response.data;
  }

  /**
   * Get detailed user information by ID or email
   */
  async getUserDetail(
    userId?: number,
    email?: string
  ): Promise<UserAccountDetailDto> {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId.toString());
    if (email) params.append("email", email);

    const response = await apiClient.post<UserAccountDetailDto>(
      `/useraccount/getUserInforDetail?${params.toString()}`,
      {} // Empty body since we're using query parameters
    );
    return response.data;
  }

  /**
   * Update user account (Admin only)
   */
  async updateUserAccount(
    userId: number,
    adminUserId: number,
    updateData: UserAccountUpdateDto
  ): Promise<UserAccountDetailDto> {
    const response = await apiClient.post<UserAccountDetailDto>(
      `/useraccount/updateUserAccount?userId=${userId}&adminUser=${adminUserId}`,
      updateData
    );
    return response.data;
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
      userId,
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
      userId,
      isEmailVerified: isVerified,
    });
  }

  /**
   * Create coordinator account (Admin only)
   * Note: This would need a separate endpoint in the backend
   */
  async createCoordinator(
    coordinatorData: CoordinatorCreationRequest
  ): Promise<{ message: string; userId: number }> {
    // This endpoint doesn't exist yet in the backend, would need to be implemented
    const response = await apiClient.post<{ message: string; userId: number }>(
      "/useraccount/createCoordinator",
      coordinatorData
    );
    return response.data;
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
    // This would need a separate endpoint in the backend for statistics
    const response = await apiClient.get<{
      totalUsers: number;
      activeUsers: number;
      inactiveUsers: number;
      unverifiedUsers: number;
      usersByRole: Record<string, number>;
    }>("/useraccount/statistics");
    return response.data;
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
