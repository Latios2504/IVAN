import { userManagementService } from "@/services/userManagementService";
import { useData } from "@/hooks/useData";
import type {
  UserAccountListDto,
  UserAccountDetailDto,
  UserAccountFilterDto,
  UserAccountUpdateDto,
  PagedResultDto,
  CoordinatorCreationRequest,
  UserStatisticsDto,
} from "@/types/userManagement";
import type { UserRole } from "@/types/auth";

// Transform interface for UI display (keeping the same as original)
export interface UserListItem {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt?: string;
  lastActivity: string;
  phone?: string;
  province?: string;
  age?: number;
  eventsParticipated?: number;
  eventsCreated?: number;
  totalCollaborations?: number;
}

// UI-friendly filters (keeping the same as original)
export interface UserFilters {
  role: string;
  status: string;
  searchTerm: string;
  dateRange: string;
}

// Role utilities (preserved from original context)
export const roleUtils = {
  getRolesForFilter: () => [
    { value: "all", label: "Tất cả vai trò" },
    { value: "volunteer", label: "Tình nguyện viên" },
    { value: "organization", label: "Tổ chức" },
    { value: "partner", label: "Đối tác" },
    { value: "coordinator", label: "Điều phối viên" },
    { value: "admin", label: "Quản trị viên" },
  ],
  getRoleDisplayName: (role: string) => {
    const roleDisplayMap: Record<string, string> = {
      volunteer: "Tình nguyện viên",
      organization: "Tổ chức",
      partner: "Đối tác",
      coordinator: "Điều phối viên",
      admin: "Quản trị viên",
    };
    return roleDisplayMap[role] || role;
  },
  mapRoleToId: (role: string) => {
    const roleMap: Record<string, number> = {
      volunteer: 1,
      organization: 2,
      partner: 3,
      coordinator: 4,
      admin: 5,
    };
    return roleMap[role];
  },
  mapApiRoleToFrontendRole: (apiRole: string) => {
    const roleMap: Record<string, string> = {
      Volunteer: "volunteer",
      Organization: "organization",
      Partner: "partner",
      "Volunteer Coordinator": "coordinator",
      Admin: "admin",
    };
    return roleMap[apiRole] || apiRole.toLowerCase();
  },
};

// Helper function to transform API users to UI format
export const transformApiUserToUserListItem = (
  apiUser: UserAccountListDto
): UserListItem => ({
  id: apiUser.userId,
  email: apiUser.email,
  fullName: apiUser.fullName || "Unknown",
  role: roleUtils.mapApiRoleToFrontendRole(apiUser.roleName) as UserRole,
  isActive: apiUser.isActive,
  isEmailVerified: apiUser.isEmailVerified,
  lastLoginAt: apiUser.lastLoginAt || null,
  createdAt: apiUser.createdAt || new Date().toISOString(),
  updatedAt: apiUser.updatedAt,
  lastActivity:
    apiUser.lastLoginAt || apiUser.createdAt || new Date().toISOString(),
  phone: apiUser.phoneNumber,
  province: apiUser.province,
  age: apiUser.age,
  eventsParticipated: 0,
  eventsCreated: 0,
  totalCollaborations: 0,
});

/**
 * Service adapter for User Management to work with useData hook
 * Adapts the existing userManagementService to the useData service interface
 */
export const userDataService = {
  /**
   * Get all users with pagination and filters - adapted for useData
   */
  getAll: async (filters?: UserAccountFilterDto): Promise<UserListItem[]> => {
    const defaultFilters: UserAccountFilterDto = {
      page: 1,
      size: 10,
      ...filters,
    };

    const result = await userManagementService.getUsers(defaultFilters);
    return result.items.map(transformApiUserToUserListItem);
  },

  /**
   * Get paginated users - for complex pagination scenarios
   */
  getAllPaginated: async (
    filters?: UserAccountFilterDto
  ): Promise<PagedResultDto<UserListItem>> => {
    const defaultFilters: UserAccountFilterDto = {
      page: 1,
      size: 10,
      ...filters,
    };

    const result = await userManagementService.getUsers(defaultFilters);
    return {
      ...result,
      items: result.items.map(transformApiUserToUserListItem),
    };
  },

  /**
   * Get single user by ID - adapted for useData
   */
  getById: async (userId: number | string): Promise<UserListItem> => {
    const numericId =
      typeof userId === "string" ? parseInt(userId, 10) : userId;
    // Use email filter to find specific user (workaround since no direct getById)
    // This is a simplified approach - in real scenario you'd need a dedicated endpoint
    const filters: UserAccountFilterDto = {
      page: 1,
      size: 50, // Get enough users to find the one we want
    };
    const result = await userManagementService.getUsers(filters);
    const user = result.items.find((u) => u.userId === numericId);
    if (!user) {
      throw new Error("User not found");
    }
    return transformApiUserToUserListItem(user);
  },

  /**
   * Create not supported for regular users (use createCoordinator instead)
   */
  create: async (): Promise<UserListItem> => {
    throw new Error(
      "User creation not supported - use createCoordinator instead"
    );
  },

  /**
   * Update user - adapted for useData
   */
  update: async (
    id: number | string,
    data: UserAccountUpdateDto
  ): Promise<UserListItem> => {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    // Use updateUserAccount method with admin user ID (simplified - would need proper admin context)
    const adminUserId = 1; // This should come from auth context
    await userManagementService.updateUserAccount(numericId, adminUserId, data);

    // Return updated user by finding it in the users list
    const filters: UserAccountFilterDto = {
      page: 1,
      size: 50,
    };
    const result = await userManagementService.getUsers(filters);
    const updatedUser = result.items.find((u) => u.userId === numericId);
    if (!updatedUser) {
      throw new Error("Updated user not found");
    }
    return transformApiUserToUserListItem(updatedUser);
  },

  /**
   * Delete not supported for users (use updateUserStatus instead)
   */
  delete: async (): Promise<void> => {
    throw new Error(
      "User deletion not supported - use updateUserStatus instead"
    );
  },

  /**
   * Update user status (activate/deactivate)
   */
  updateStatus: async (userId: number, isActive: boolean): Promise<void> => {
    const adminUserId = 1; // This should come from auth context
    await userManagementService.toggleUserStatus(userId, adminUserId, isActive);
  },

  /**
   * Create coordinator
   */
  createCoordinator: async (
    request: CoordinatorCreationRequest
  ): Promise<{ message: string; userId: number }> => {
    return await userManagementService.createCoordinator(request);
  },
};

// Custom stats interface matching the service return
export interface UserManagementStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  unverifiedUsers: number;
  usersByRole: Record<string, number>;
}

/**
 * Service for User Statistics - separate from CRUD operations
 */
export const userStatsService = {
  getStats: async (): Promise<UserManagementStats> => {
    return await userManagementService.getUserStatistics();
  },
};

/**
 * Hook for User data management using useData
 * This replaces the complex UserManagementContext with a simple hook
 *
 * Usage:
 * const users = useUserData();
 *
 * useEffect(() => {
 *   users.loadAll();
 * }, []);
 *
 * return (
 *   <div>
 *     {users.loading && <Spinner />}
 *     {users.data.map(user => ...)}
 *   </div>
 * );
 */
export function useUserData() {
  return useData<UserListItem, never, UserAccountUpdateDto>(userDataService, {
    successMessages: {
      update: "Cập nhật người dùng thành công",
    },
  });
}

/**
 * Hook for User Pagination (for complex pagination scenarios)
 *
 * Usage:
 * const { data: users, loadAll, loading } = useUserPagination();
 *
 * const handleLoadPage = (page: number) => {
 *   loadAll({ page, size: 10 });
 * };
 */
export function useUserPagination() {
  const { loadAll, ...rest } = useData<
    PagedResultDto<UserListItem>,
    never,
    never
  >({
    getAll: async (
      filters?: UserAccountFilterDto
    ): Promise<PagedResultDto<UserListItem>[]> => {
      const result = await userDataService.getAllPaginated(filters);
      return [result]; // Wrap in array since useData expects arrays
    },
    create: async () => {
      throw new Error("Not supported");
    },
    update: async () => {
      throw new Error("Not supported");
    },
    delete: async () => {
      throw new Error("Not supported");
    },
  });

  return {
    loadAll: () => loadAll(),
    loadWithFilters: (filters?: UserAccountFilterDto) => {
      // Custom function for loading with filters
      const serviceWithFilters = {
        getAll: async (): Promise<PagedResultDto<UserListItem>[]> => {
          const result = await userDataService.getAllPaginated(filters);
          return [result];
        },
        create: async () => {
          throw new Error("Not supported");
        },
        update: async () => {
          throw new Error("Not supported");
        },
        delete: async () => {
          throw new Error("Not supported");
        },
      };
      return serviceWithFilters.getAll();
    },
    ...rest,
  };
}

/**
 * Hook for User Statistics
 */
export function useUserStats() {
  return useData<UserManagementStats, never, never>({
    getAll: async (): Promise<UserManagementStats[]> => {
      const stats = await userStatsService.getStats();
      return [stats]; // Wrap in array since useData expects arrays
    },
    create: async () => {
      throw new Error("Not supported");
    },
    update: async () => {
      throw new Error("Not supported");
    },
    delete: async () => {
      throw new Error("Not supported");
    },
  });
}

/**
 * Hook for User Details (single user)
 */
export function useUserDetails() {
  return useData<UserAccountDetailDto, never, never>({
    getAll: async (): Promise<UserAccountDetailDto[]> => {
      throw new Error("Use loadUserById method instead");
    },
    create: async () => {
      throw new Error("Not supported");
    },
    update: async () => {
      throw new Error("Not supported");
    },
    delete: async () => {
      throw new Error("Not supported");
    },
  });
}

/**
 * Custom hook for user management operations (status updates, coordinator creation)
 */
export function useUserManagementOperations() {
  const updateUserStatus = async (userId: number, isActive: boolean) => {
    try {
      await userDataService.updateStatus(userId, isActive);
      return { success: true };
    } catch (error) {
      console.error("Failed to update user status:", error);
      return { success: false, error: error as Error };
    }
  };

  const createCoordinator = async (request: CoordinatorCreationRequest) => {
    try {
      await userDataService.createCoordinator(request);
      return { success: true };
    } catch (error) {
      console.error("Failed to create coordinator:", error);
      return { success: false, error: error as Error };
    }
  };

  const loadUserById = async (userId: number) => {
    try {
      const user = await userDataService.getById(userId);
      return { success: true, data: user };
    } catch (error) {
      console.error("Failed to load user:", error);
      return { success: false, error: error as Error };
    }
  };

  return {
    updateUserStatus,
    createCoordinator,
    loadUserById,
  };
}

/**
 * Helper selectors (similar to the original pattern)
 */
export const userSelectors = {
  hasUsers: (users: UserListItem[]) => users.length > 0,

  isFirstPage: (currentPage: number) => currentPage === 1,

  isLastPage: (currentPage: number, totalPages: number) =>
    currentPage >= totalPages,

  hasNextPage: (currentPage: number, totalPages: number) =>
    currentPage < totalPages,

  hasPrevPage: (currentPage: number) => currentPage > 1,

  getUserById: (users: UserListItem[], userId: number) =>
    users.find((u) => u.id === userId),

  filterUsersByRole: (users: UserListItem[], role: string) =>
    role === "all" ? users : users.filter((u) => u.role === role),

  filterUsersByStatus: (users: UserListItem[], status: string) => {
    if (status === "all") return users;
    if (status === "active") return users.filter((u) => u.isActive);
    if (status === "inactive") return users.filter((u) => !u.isActive);
    return users;
  },

  searchUsers: (users: UserListItem[], searchTerm: string) =>
    searchTerm
      ? users.filter(
          (u) =>
            u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : users,

  hasActiveFilters: (filters: UserFilters) =>
    filters.role !== "all" ||
    filters.status !== "all" ||
    filters.searchTerm !== "" ||
    filters.dateRange !== "all",
};
