import { apiClient } from "./apiClient";
import type { User, UserRole } from "../types/auth";
import type { PagedResultDto } from "../types/common";
import type {
  UserAccountListDto,
  UserAccountDetailDto,
  UserAccountFilterDto,
  UserAccountUpdateDto,
} from "../types/userManagement";

class UserManagementService {
  async getUsers(
    filter: UserAccountFilterDto
  ): Promise<PagedResultDto<UserAccountListDto>> {
    const response = await apiClient.post<PagedResultDto<UserAccountListDto>>(
      "/useraccount/getListUser",
      filter
    );
    return response.data;
  }

  async getUserDetail(
    userId?: number,
    email?: string
  ): Promise<UserAccountDetailDto> {
    const response = await apiClient.post<UserAccountDetailDto>(
      "/useraccount/getUserInforDetail",
      null,
      {
        params: { userId, email },
      }
    );
    return response.data;
  }

  async updateUserAccount(
    userId: number,
    adminUserId: number,
    updateData: UserAccountUpdateDto
  ): Promise<UserAccountDetailDto> {
    const response = await apiClient.post<UserAccountDetailDto>(
      "/useraccount/updateUserAccount",
      updateData,
      {
        params: { userId, adminUser: adminUserId },
      }
    );
    return response.data;
  }

  async toggleUserStatus(
    userId: number,
    adminUserId: number,
    isActive: boolean
  ): Promise<UserAccountDetailDto> {
    return this.updateUserAccount(userId, adminUserId, {
      userId,
      isActive: isActive,
    });
  }

  async toggleEmailVerification(
    userId: number,
    adminUserId: number,
    isVerified: boolean
  ): Promise<UserAccountDetailDto> {
    return this.updateUserAccount(userId, adminUserId, {
      userId,
      isEmailVerified: isVerified,
    });
  }

  async getUserStatistics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    unverifiedUsers: number;
    usersByRole: Record<string, number>;
  }> {
    const response = await apiClient.get<{
      totalUsers: number;
      activeUsers: number;
      inactiveUsers: number;
      unverifiedUsers: number;
      usersByRole: Record<string, number>;
    }>("/useraccount/statistics");
    return response.data;
  }

  mapToFrontendUser(backendUser: UserAccountDetailDto): User {
    return {
      id: backendUser.userId,
      email: backendUser.email,
      fullName:
        backendUser.fullName ||
        `${backendUser.firstName || ""} ${backendUser.lastName || ""}`.trim(),
      role: this.mapRoleIdToRole(backendUser.roleId),
      roleId: backendUser.roleId,
      isActive: backendUser.isActive,
      isEmailVerified: backendUser.isEmailVerified,
      lastLoginAt: backendUser.lastLoginAt,
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,
    };
  }

  private mapRoleIdToRole(roleId: number): UserRole {
    const roleMap: Record<number, UserRole> = {
      1: "volunteer",
      2: "organization",
      3: "partner",
      4: "coordinator",
      5: "admin",
    };
    return roleMap[roleId] || "volunteer";
  }
}

export const userManagementService = new UserManagementService();
export type { UserAccountDetailDto } from "../types/userManagement";
