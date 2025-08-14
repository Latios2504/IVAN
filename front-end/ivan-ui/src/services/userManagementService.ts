// User Management Service - Matching backend UserManagementController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  UserListDto,
  UserFiltersDto,
  UserDetailsDto,
  UserStatusUpdateDto,
  UserRoleDto,
} from "../types/userManagement";
import { DEFAULT_USER_FILTERS } from "../types/userManagement";

class UserManagementService {
  private readonly baseUrl = "/UserManagement";

  // === ADMIN ONLY ENDPOINTS ===

  // GET /api/UserManagement - Get paginated users list (Admin only)
  async getUsers(
    filters: Partial<UserFiltersDto> = {}
  ): Promise<PagedResultDto<UserListDto>> {
    // Merge with defaults
    const mergedFilters = { ...DEFAULT_USER_FILTERS, ...filters };

    const response = await apiClient.get<PagedResultDto<UserListDto>>(
      this.baseUrl,
      {
        search: mergedFilters.search,
        roleId: mergedFilters.roleId,
        isActive: mergedFilters.isActive,
        isEmailVerified: mergedFilters.isEmailVerified,
        page: mergedFilters.page,
        size: mergedFilters.size,
      }
    );

    return (
      response.data || {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    );
  }

  // GET /api/UserManagement/{userId} - Get detailed user information (Admin only)
  async getUserDetails(userId: number): Promise<UserDetailsDto> {
    if (userId <= 0) {
      throw new Error("Invalid user ID");
    }

    const response = await apiClient.get<UserDetailsDto>(
      `${this.baseUrl}/${userId}`
    );

    if (!response.data) {
      throw new Error("User not found");
    }

    return response.data;
  }

  // PUT /api/UserManagement/{userId}/status - Update user account status (Admin only)
  async updateUserStatus(userId: number, isActive: boolean): Promise<boolean> {
    if (userId <= 0) {
      throw new Error("Invalid user ID");
    }

    const statusUpdate: UserStatusUpdateDto = { isActive };

    const response = await apiClient.put<boolean>(
      `${this.baseUrl}/${userId}/status`,
      statusUpdate
    );

    return response.data || false;
  }

  // === LOOKUP ENDPOINTS ===

  // GET /api/UserManagement/roles - Get all user roles for dropdown/filter (Admin only)
  async getUserRoles(): Promise<UserRoleDto[]> {
    const response = await apiClient.get<UserRoleDto[]>(
      `${this.baseUrl}/roles`
    );
    return response.data || [];
  }

  // === UTILITY METHODS ===

  // Helper method to activate a user
  async activateUser(userId: number): Promise<boolean> {
    return this.updateUserStatus(userId, true);
  }

  // Helper method to deactivate a user
  async deactivateUser(userId: number): Promise<boolean> {
    return this.updateUserStatus(userId, false);
  }

  // Helper method to check if user exists by fetching details
  async userExists(userId: number): Promise<boolean> {
    try {
      await this.getUserDetails(userId);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Helper method to get users by role
  async getUsersByRole(
    roleId: number,
    page: number = 1,
    size: number = 10
  ): Promise<PagedResultDto<UserListDto>> {
    return this.getUsers({ roleId, page, size });
  }

  // Helper method to search users
  async searchUsers(
    searchTerm: string,
    page: number = 1,
    size: number = 10
  ): Promise<PagedResultDto<UserListDto>> {
    return this.getUsers({ search: searchTerm, page, size });
  }

  // Helper method to get active users only
  async getActiveUsers(
    page: number = 1,
    size: number = 10
  ): Promise<PagedResultDto<UserListDto>> {
    return this.getUsers({ isActive: true, page, size });
  }

  // Helper method to get inactive users only
  async getInactiveUsers(
    page: number = 1,
    size: number = 10
  ): Promise<PagedResultDto<UserListDto>> {
    return this.getUsers({ isActive: false, page, size });
  }

  // Helper method to get email verified users only
  async getEmailVerifiedUsers(
    page: number = 1,
    size: number = 10
  ): Promise<PagedResultDto<UserListDto>> {
    return this.getUsers({ isEmailVerified: true, page, size });
  }

  // Helper method to get email unverified users only
  async getEmailUnverifiedUsers(
    page: number = 1,
    size: number = 10
  ): Promise<PagedResultDto<UserListDto>> {
    return this.getUsers({ isEmailVerified: false, page, size });
  }
}

export const userManagementService = new UserManagementService();
export default userManagementService;
