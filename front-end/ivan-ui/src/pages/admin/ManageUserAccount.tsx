import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User, UserRole } from "@/types/auth";
import type { UserProfile } from "@/types/profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserDetailsModal } from "@/components/admin/UserDetailsModal";
import { CoordinatorCreationDialog } from "@/components/admin/CoordinatorCreationDialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Shield,
  ShieldCheck,
  AlertCircle,
  Clock,
  MoreHorizontal,
  Eye,
  Edit,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { DataTable } from "@/components/common/DataTable";
import type { TableColumn, TableAction } from "@/components/common/DataTable";
import { userManagementService } from "@/services/userManagementService";
import type {
  UserAccountListDto,
  UserAccountFilterDto,
} from "@/services/userManagementService";

// Simple role and status utilities inline
const roleUtils = {
  getRolesForFilter: () => [
    { value: "all", label: "Tất cả vai trò" },
    { value: "volunteer", label: "Tình nguyện viên" },
    { value: "organization", label: "Tổ chức" },
    { value: "partner", label: "Đối tác" },
    { value: "coordinator", label: "Điều phối viên" },
    { value: "admin", label: "Quản trị viên" },
  ],
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
      "Volunteer": "volunteer",
      "Organization": "organization", 
      "Partner": "partner",
      "Coordinator": "coordinator",
      "Admin": "admin",
    };
    return roleMap[apiRole] || apiRole.toLowerCase();
  },
};

const userStatusUtils = {
  getStatusOptions: () => [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "active", label: "Hoạt động" },
    { value: "inactive", label: "Không hoạt động" },
    { value: "unverified", label: "Chưa xác thực" },
  ],
};

// Simple logger replacement
const logger = {
  debug: (message: string, data?: any, context?: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[${context || "DEBUG"}] ${message}`, data);
    }
  },
  error: (message: string, error?: any, context?: string) => {
    console.error(`[${context || "ERROR"}] ${message}`, error);
  },
};

// Simple error handling wrapper
const withErrorHandling = async <T,>(
  operation: () => Promise<T>,
  context: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    logger.error(`Error in ${context}`, error, context);
    throw error;
  }
};

// Simple data consistency check (no-op in production)
const runDataConsistencyCheck = (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log("Data consistency check:", args);
  }
};

/**
 * User Management Page for Admin
 * Implements FE-20: Manage User Account and Volunteer Coordinator Creation
 */

interface UserListItem extends User {
  lastActivity: string;
  eventsParticipated?: number;
  eventsCreated?: number;
  totalCollaborations?: number;
  phone?: string;
  province?: string;
  age?: number;
  updatedAt?: string;
}

interface UserFilters {
  role: string;
  status: string;
  searchTerm: string;
  dateRange: string;
}

// Sample user data - will be replaced with API calls
const mockUsers: UserListItem[] = [
  {
    id: 1,
    email: "volunteer1@example.com",
    fullName: "Nguyễn Văn An",
    role: "volunteer",
    isActive: true,
    isEmailVerified: true,
    lastLoginAt: "2024-06-20T08:30:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    lastActivity: "2024-06-20T08:30:00Z",
    eventsParticipated: 15,
    profile: undefined,
  },
  {
    id: 2,
    email: "org1@example.com",
    fullName: "Tổ chức ABC",
    role: "organization",
    isActive: true,
    isEmailVerified: true,
    lastLoginAt: "2024-06-19T14:20:00Z",
    createdAt: "2024-02-10T09:30:00Z",
    lastActivity: "2024-06-19T14:20:00Z",
    eventsCreated: 8,
    profile: undefined,
  },
  {
    id: 3,
    email: "partner1@example.com",
    fullName: "Công ty XYZ",
    role: "partner",
    isActive: false,
    isEmailVerified: true,
    lastLoginAt: "2024-06-10T11:15:00Z",
    createdAt: "2024-03-05T16:45:00Z",
    lastActivity: "2024-06-10T11:15:00Z",
    totalCollaborations: 3,
    profile: undefined,
  },
];

// Use centralized utilities for roles and statuses
const USER_ROLES = roleUtils.getRolesForFilter();
const USER_STATUSES = userStatusUtils.getStatusOptions();

/**
 * User Management Page Component
 * Manages user accounts with filtering, status updates, and role management
 */
export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const { showNotification } = useToast();

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isCreateCoordinatorOpen, setIsCreateCoordinatorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<UserFilters>({
    role: "all",
    status: "all",
    searchTerm: "",
    dateRange: "all",
  });

  // Check if current user is admin
  if (currentUser?.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-600">
            Bạn không có quyền truy cập vào trang quản lý người dùng.
          </p>
        </div>
      </div>
    );
  }

  // Helper functions using centralized utilities
  const getRoleId = roleUtils.mapRoleToId;
  const mapRoleToId = roleUtils.mapRoleToId;
  const mapApiRoleToFrontendRole = roleUtils.mapApiRoleToFrontendRole;

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    setIsLoading(true);

    try {
      const filterDto: UserAccountFilterDto = {
        roleId: filters.role === "all" ? undefined : getRoleId(filters.role),
        isActive:
          filters.status === "all"
            ? undefined
            : filters.status === "active"
            ? true
            : filters.status === "inactive"
            ? false
            : undefined,
        isEmailVerified: filters.status === "unverified" ? false : undefined,
        searchTerm: filters.searchTerm || undefined,
        pageNumber: 1,
        pageSize: 100,
      };

      logger.debug(
        "Loading users with filters",
        filterDto,
        "UserManagementPage"
      );

      const response = await withErrorHandling(
        () => userManagementService.getUsers(filterDto),
        "UserManagementPage.loadUsers"
      );

      logger.debug(
        "Users loaded successfully",
        { count: response.items.length },
        "UserManagementPage"
      );

      // Transform API response to UserListItem format
      const transformedUsers: UserListItem[] = response.items.map(
        (apiUser: UserAccountListDto) => ({
          id: apiUser.userId,
          email: apiUser.email,
          fullName: apiUser.fullName,
          role: roleUtils.mapApiRoleToFrontendRole(apiUser.roleName),
          isActive: apiUser.isActive,
          isEmailVerified: apiUser.isEmailVerified,
          lastLoginAt: apiUser.lastLoginAt,
          createdAt: apiUser.createdAt || new Date().toISOString(),
          updatedAt: apiUser.updatedAt,
          lastActivity:
            apiUser.lastLoginAt ||
            apiUser.createdAt ||
            new Date().toISOString(),
          phone: apiUser.phoneNumber,
          province: apiUser.province,
          age: apiUser.age,
          eventsParticipated: 0, // These would need separate API calls
          eventsCreated: 0,
          totalCollaborations: 0,
          profile: undefined,
        })
      );

      setUsers(transformedUsers);

      // Run data consistency check in development
      if (process.env.NODE_ENV === "development") {
        runDataConsistencyCheck(
          "UserManagementPage.loadUsers",
          response.items,
          transformedUsers,
          filterDto,
          transformedUsers // Will be filtered later in filteredUsers
        );
      }
    } catch (error) {
      const appError = ErrorHandlingService.handleApiError(
        error,
        "UserManagementPage.loadUsers"
      );
      logger.error("Error loading users", appError, "UserManagementPage");
      showNotification("Không thể tải danh sách người dùng", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = (user: UserListItem) => {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    setIsUserDetailsOpen(true);
  };

  const handleToggleUserStatus = async (userId: number, newStatus: boolean) => {
    if (!currentUser?.id) {
      logger.warn(
        "No current user found for status toggle",
        { userId, newStatus },
        "UserManagementPage"
      );
      showNotification("Không thể xác định người dùng hiện tại", "error");
      return;
    }

    try {
      // Find the user to get their current role
      const userToUpdate = users.find((user) => user.id === userId);
      if (!userToUpdate) {
        logger.warn(
          "User not found for status toggle",
          { userId },
          "UserManagementPage"
        );
        return;
      }

      const currentRoleId = roleUtils.mapRoleToId(userToUpdate.role);

      logger.debug(
        "Toggling user status",
        {
          userId,
          newStatus,
          currentRole: userToUpdate.role,
          currentRoleId,
        },
        "UserManagementPage"
      );

      await withErrorHandling(
        () =>
          userManagementService.toggleUserStatus(
            userId,
            currentUser.id,
            newStatus,
            currentRoleId
          ),
        "UserManagementPage.handleToggleUserStatus"
      );

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isActive: newStatus } : user
        )
      );

      showNotification(
        newStatus ? "Đã kích hoạt tài khoản" : "Đã vô hiệu hóa tài khoản"
      );

      logger.info(
        "User status updated successfully",
        { userId, newStatus },
        "UserManagementPage"
      );
    } catch (error) {
      const appError = ErrorHandlingService.handleApiError(
        error,
        "UserManagementPage.handleToggleUserStatus"
      );
      logger.error(
        "Failed to toggle user status",
        appError,
        "UserManagementPage"
      );
      showNotification("Không thể thay đổi trạng thái tài khoản", "error");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = filters.role === "all" || user.role === filters.role;
    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "active" && user.isActive) ||
      (filters.status === "inactive" && !user.isActive) ||
      (filters.status === "unverified" && !user.isEmailVerified);
    const matchesSearch =
      user.fullName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      false ||
      user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  });

  const getUserStatusBadge = (user: UserListItem) => {
    const variant = userStatusUtils.getStatusBadgeVariant(
      user.isActive,
      user.isEmailVerified
    );
    const text = userStatusUtils.getStatusText(
      user.isActive,
      user.isEmailVerified
    );
    return <Badge variant={variant}>{text}</Badge>;
  };

  const getRoleDisplayName = (role: string) => {
    return roleUtils.getRoleDisplayName(role);
  };

  const getRoleIcon = (role: string) => {
    const roleIconMap = {
      admin: <ShieldCheck className="h-5 w-5 text-red-500" />,
      coordinator: <UserPlus className="h-5 w-5 text-purple-500" />,
      volunteer: <Users className="h-5 w-5 text-green-500" />,
      organization: <Shield className="h-5 w-5 text-orange-500" />,
      partner: <Users className="h-5 w-5 text-yellow-500" />,
    };

    return (
      roleIconMap[role as keyof typeof roleIconMap] || (
        <Users className="h-5 w-5 text-gray-500" />
      )
    );
  };

  // Table configuration
  const tableColumns: TableColumn<UserListItem>[] = [
    {
      key: "fullName",
      header: "Người dùng",
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {getRoleIcon(user.role)}
          </div>
          <div>
            <div className="font-medium">{user.fullName || user.email}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Vai trò",
      render: (role) => getRoleDisplayName(role),
    },
    {
      key: "isActive",
      header: "Trạng thái",
      render: (_, user) => getUserStatusBadge(user),
    },
    {
      key: "lastActivity",
      header: "Hoạt động cuối",
      render: (lastActivity) =>
        new Date(lastActivity).toLocaleDateString("vi-VN"),
    },
    {
      key: "eventsParticipated",
      header: "Sự kiện tham gia",
      render: (count) => count || 0,
    },
  ];

  const tableActions: TableAction<UserListItem>[] = [
    {
      label: "Chi tiết",
      icon: <Eye className="h-4 w-4" />,
      onClick: handleViewUser,
      variant: "outline",
      size: "sm",
    },
    {
      label: "Kích hoạt/Vô hiệu",
      onClick: (user) => handleToggleUserStatus(user.id, !user.isActive),
      variant: "outline",
      size: "sm",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Đang tải danh sách người dùng..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8" />
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý tất cả tài khoản người dùng trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => setIsCreateCoordinatorOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Tạo tài khoản Coordinator
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Bị vô hiệu hóa</p>
                <p className="text-2xl font-bold">
                  {users.filter((u) => !u.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Chưa xác thực</p>
                <p className="text-2xl font-bold">
                  {users.filter((u) => !u.isEmailVerified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm tên hoặc email..."
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchTerm: e.target.value,
                  }))
                }
                className="pl-10"
              />
            </div>
            <Select
              value={filters.role}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {USER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  role: "all",
                  status: "all",
                  searchTerm: "",
                  dateRange: "all",
                })
              }
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredUsers}
            columns={tableColumns}
            actions={tableActions}
            loading={isLoading}
            emptyMessage="Không tìm thấy người dùng nào"
          />
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          isOpen={isUserDetailsOpen}
          onClose={() => {
            setIsUserDetailsOpen(false);
            setSelectedUserId(null);
            setSelectedUser(null);
          }}
          onUserUpdate={() => {
            loadUsers(); // Reload the user list
          }}
        />
      )}

      {/* Coordinator Creation Dialog */}
      <CoordinatorCreationDialog
        isOpen={isCreateCoordinatorOpen}
        onClose={() => setIsCreateCoordinatorOpen(false)}
        onSuccess={(newCoordinator: any) => {
          // In a real app, this would properly handle the new coordinator data
          showNotification("Tạo tài khoản Coordinator thành công");
          setIsCreateCoordinatorOpen(false);
          loadUsers(); // Reload the user list
        }}
      />
    </div>
  );
}
