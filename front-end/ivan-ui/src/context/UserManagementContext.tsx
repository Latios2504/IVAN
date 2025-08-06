import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  UserAccountListDto,
  UserAccountDetailDto,
  UserAccountFilterDto,
  UserAccountUpdateDto,
  PagedResultDto,
  CoordinatorCreationRequest,
  UserStatisticsDto,
} from "../types/userManagement";
import type { UserRole } from "../types/auth";
import { userManagementService } from "../services/userManagementService";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

// Transform interface for UI display
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

// UI-friendly filters
export interface UserFilters {
  role: string;
  status: string;
  searchTerm: string;
  dateRange: string;
}

interface UserManagementState {
  // Data
  users: UserListItem[];
  currentUser: UserAccountDetailDto | null;
  statistics: UserStatisticsDto | null;

  // Pagination & Filtering
  filters: UserFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };

  // UI State
  loading: boolean;
  error: string | null;

  // Modal States
  modals: {
    userDetails: boolean;
    coordinatorDialog: boolean;
    createCoordinator: boolean;
  };

  // Selection
  selectedUserId: number | null;
}

interface UserManagementContextType extends UserManagementState {
  // User Management
  loadUsers: () => Promise<void>;
  loadUserById: (userId: number) => Promise<void>;
  updateUserStatus: (userId: number, isActive: boolean) => Promise<void>;
  updateUser: (userId: number, updates: UserAccountUpdateDto) => Promise<void>;
  createCoordinator: (request: CoordinatorCreationRequest) => Promise<void>;

  // Statistics
  loadStatistics: () => Promise<void>;

  // Filters & Pagination
  setFilters: (filters: Partial<UserFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;

  // Modal Management
  openUserDetails: (userId: number) => void;
  openCoordinatorDialog: (userId: number) => void;
  openCreateCoordinator: () => void;
  closeAllModals: () => void;

  // Selection
  setSelectedUser: (userId: number | null) => void;

  // Utility
  clearError: () => void;
}

type UserManagementAction =
  | { type: "LOAD_START" }
  | {
      type: "LOAD_SUCCESS";
      payload: { users: PagedResultDto<UserAccountListDto> };
    }
  | { type: "LOAD_FAILURE"; payload: string }
  | { type: "SET_CURRENT_USER"; payload: UserAccountDetailDto | null }
  | { type: "SET_STATISTICS"; payload: UserStatisticsDto }
  | { type: "SET_FILTERS"; payload: Partial<UserFilters> }
  | { type: "RESET_FILTERS" }
  | { type: "SET_PAGE"; payload: number }
  | {
      type: "UPDATE_USER";
      payload: { userId: number; updates: Partial<UserListItem> };
    }
  | { type: "REMOVE_USER"; payload: number }
  | { type: "OPEN_MODAL"; payload: keyof UserManagementState["modals"] }
  | { type: "CLOSE_ALL_MODALS" }
  | { type: "SET_SELECTED_USER"; payload: number | null }
  | { type: "CLEAR_ERROR" };

const defaultFilters: UserFilters = {
  role: "all",
  status: "all",
  searchTerm: "",
  dateRange: "all",
};

const initialState: UserManagementState = {
  users: [],
  currentUser: null,
  statistics: null,
  filters: defaultFilters,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 5,
  },
  loading: false,
  error: null,
  modals: {
    userDetails: false,
    coordinatorDialog: false,
    createCoordinator: false,
  },
  selectedUserId: null,
};

// Role utilities for data transformation
const roleUtils = {
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

const userManagementReducer = (
  state: UserManagementState,
  action: UserManagementAction
): UserManagementState => {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "LOAD_SUCCESS":
      const { users: apiUsers } = action.payload;

      // Transform API users to UI format
      const transformedUsers: UserListItem[] = apiUsers.items.map(
        (apiUser: UserAccountListDto) => ({
          id: apiUser.userId,
          email: apiUser.email,
          fullName: apiUser.fullName || "Unknown",
          role: roleUtils.mapApiRoleToFrontendRole(
            apiUser.roleName
          ) as UserRole,
          isActive: apiUser.isActive,
          isEmailVerified: apiUser.isEmailVerified,
          lastLoginAt: apiUser.lastLoginAt || null,
          createdAt: apiUser.createdAt || new Date().toISOString(),
          updatedAt: apiUser.updatedAt,
          lastActivity:
            apiUser.lastLoginAt ||
            apiUser.createdAt ||
            new Date().toISOString(),
          phone: apiUser.phoneNumber,
          province: apiUser.province,
          age: apiUser.age,
          eventsParticipated: 0,
          eventsCreated: 0,
          totalCollaborations: 0,
        })
      );

      return {
        ...state,
        loading: false,
        users: transformedUsers,
        pagination: {
          ...state.pagination,
          totalPages: apiUsers.totalPages || 1,
          totalCount: apiUsers.totalItems || 0,
        },
        error: null,
      };

    case "LOAD_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "SET_CURRENT_USER":
      return {
        ...state,
        currentUser: action.payload,
      };

    case "SET_STATISTICS":
      return {
        ...state,
        statistics: action.payload,
      };

    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, currentPage: 1 }, // Reset to first page
      };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: defaultFilters,
        pagination: { ...state.pagination, currentPage: 1 },
      };

    case "SET_PAGE":
      return {
        ...state,
        pagination: { ...state.pagination, currentPage: action.payload },
      };

    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.userId
            ? { ...user, ...action.payload.updates }
            : user
        ),
        currentUser:
          state.currentUser?.userId === action.payload.userId
            ? {
                ...state.currentUser,
                // Only update compatible fields for currentUser
                ...(action.payload.updates.isActive !== undefined && {
                  isActive: action.payload.updates.isActive,
                }),
                ...(action.payload.updates.fullName && {
                  fullName: action.payload.updates.fullName,
                }),
                ...(action.payload.updates.email && {
                  email: action.payload.updates.email,
                }),
                ...(action.payload.updates.phone && {
                  phoneNumber: action.payload.updates.phone,
                }),
                ...(action.payload.updates.province && {
                  province: action.payload.updates.province,
                }),
              }
            : state.currentUser,
      };

    case "REMOVE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        currentUser:
          state.currentUser?.userId === action.payload
            ? null
            : state.currentUser,
        pagination: {
          ...state.pagination,
          totalCount: Math.max(0, state.pagination.totalCount - 1),
        },
      };

    case "OPEN_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: true,
        },
      };

    case "CLOSE_ALL_MODALS":
      return {
        ...state,
        modals: {
          userDetails: false,
          coordinatorDialog: false,
          createCoordinator: false,
        },
      };

    case "SET_SELECTED_USER":
      return {
        ...state,
        selectedUserId: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

const UserManagementContext = createContext<
  UserManagementContextType | undefined
>(undefined);

interface UserManagementProviderProps {
  children: ReactNode;
}

export const UserManagementProvider: React.FC<UserManagementProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userManagementReducer, initialState);
  const { isAuthenticated, user: authUser } = useAuth();

  // User Management Operations
  const loadUsers = async () => {
    try {
      dispatch({ type: "LOAD_START" });

      const filterDto: UserAccountFilterDto = {
        fullName: state.filters.searchTerm || undefined,
        isActive:
          state.filters.status === "all"
            ? undefined
            : state.filters.status === "active"
            ? true
            : state.filters.status === "inactive"
            ? false
            : undefined,
        isEmailVerified:
          state.filters.status === "unverified" ? false : undefined,
        page: state.pagination.currentPage,
        size: state.pagination.pageSize,
      };

      const users = await userManagementService.getUsers(filterDto);
      dispatch({ type: "LOAD_SUCCESS", payload: { users } });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load users";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      toast.error("Không thể tải danh sách người dùng");
    }
  };

  const loadUserById = async (userId: number) => {
    try {
      const user = await userManagementService.getUserDetail(userId);
      dispatch({ type: "SET_CURRENT_USER", payload: user });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load user details";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      toast.error("Không thể tải thông tin người dùng");
    }
  };

  const updateUserStatus = async (userId: number, isActive: boolean) => {
    try {
      // Using the actual service method with required admin user ID
      if (!authUser?.id) {
        throw new Error("Admin user not found");
      }

      await userManagementService.toggleUserStatus(
        userId,
        authUser.id,
        isActive
      );
      dispatch({
        type: "UPDATE_USER",
        payload: { userId, updates: { isActive } },
      });
      toast.success(
        isActive ? "Đã kích hoạt người dùng" : "Đã vô hiệu hóa người dùng"
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user status";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      toast.error("Không thể cập nhật trạng thái người dùng");
    }
  };

  const updateUser = async (userId: number, updates: UserAccountUpdateDto) => {
    try {
      if (!authUser?.id) {
        throw new Error("Admin user not found");
      }

      await userManagementService.updateUserAccount(
        userId,
        authUser.id,
        updates
      );
      dispatch({
        type: "UPDATE_USER",
        payload: { userId, updates },
      });
      toast.success("Đã cập nhật thông tin người dùng");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      toast.error("Không thể cập nhật thông tin người dùng");
    }
  };

  const createCoordinator = async (request: CoordinatorCreationRequest) => {
    try {
      await userManagementService.createCoordinator(request);
      toast.success("Đã tạo điều phối viên thành công");
      // Reload users to show the new coordinator
      await loadUsers();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create coordinator";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      toast.error("Không thể tạo điều phối viên");
      throw error; // Re-throw to handle in component
    }
  };

  const loadStatistics = async () => {
    try {
      // For now, calculate basic statistics from loaded users
      // This would be replaced with actual API call when available
      const statistics: UserStatisticsDto = {
        totalLogins: 0,
        lastLoginDays: 0,
        accountAgeInDays: 0,
        isNewUser: false,
        activityScore: 0,
      };
      dispatch({ type: "SET_STATISTICS", payload: statistics });
    } catch (error) {
      console.error("Failed to load statistics:", error);
      // Don't show error toast for statistics as it's not critical
    }
  };

  // Filters & Pagination
  const setFilters = (filters: Partial<UserFilters>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const setPage = (page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
  };

  // Modal Management
  const openUserDetails = (userId: number) => {
    dispatch({ type: "SET_SELECTED_USER", payload: userId });
    dispatch({ type: "OPEN_MODAL", payload: "userDetails" });
  };

  const openCoordinatorDialog = (userId: number) => {
    dispatch({ type: "SET_SELECTED_USER", payload: userId });
    dispatch({ type: "OPEN_MODAL", payload: "coordinatorDialog" });
  };

  const openCreateCoordinator = () => {
    dispatch({ type: "OPEN_MODAL", payload: "createCoordinator" });
  };

  const closeAllModals = () => {
    dispatch({ type: "CLOSE_ALL_MODALS" });
    dispatch({ type: "SET_SELECTED_USER", payload: null });
  };

  const setSelectedUser = (userId: number | null) => {
    dispatch({ type: "SET_SELECTED_USER", payload: userId });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Auto-load users when filters or pagination change
  useEffect(() => {
    if (isAuthenticated && authUser?.role === "admin") {
      loadUsers();
    }
  }, [
    isAuthenticated,
    authUser?.role,
    state.filters.role,
    state.filters.status,
    state.filters.searchTerm,
    state.filters.dateRange,
    state.pagination.currentPage,
  ]);

  const contextValue: UserManagementContextType = {
    ...state,
    loadUsers,
    loadUserById,
    updateUserStatus,
    updateUser,
    createCoordinator,
    loadStatistics,
    setFilters,
    resetFilters,
    setPage,
    openUserDetails,
    openCoordinatorDialog,
    openCreateCoordinator,
    closeAllModals,
    setSelectedUser,
    clearError,
  };

  return (
    <UserManagementContext.Provider value={contextValue}>
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = (): UserManagementContextType => {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error(
      "useUserManagement must be used within a UserManagementProvider"
    );
  }
  return context;
};

// Helper selectors
export const userManagementSelectors = {
  hasUsers: (users: UserListItem[]) => users.length > 0,
  isFirstPage: (pagination: UserManagementState["pagination"]) =>
    pagination.currentPage === 1,
  isLastPage: (pagination: UserManagementState["pagination"]) =>
    pagination.currentPage >= pagination.totalPages,
  hasNextPage: (pagination: UserManagementState["pagination"]) =>
    pagination.currentPage < pagination.totalPages,
  hasPrevPage: (pagination: UserManagementState["pagination"]) =>
    pagination.currentPage > 1,

  getUserById: (users: UserListItem[], userId: number) =>
    users.find((u) => u.id === userId),

  getUsersByRole: (users: UserListItem[], role: UserRole) =>
    users.filter((u) => u.role === role),

  getActiveUsers: (users: UserListItem[]) => users.filter((u) => u.isActive),

  getInactiveUsers: (users: UserListItem[]) => users.filter((u) => !u.isActive),
};

// Export role utilities for use in components
export { roleUtils };
