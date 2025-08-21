import React, { useEffect, useState } from "react";
import { userManagementService } from "../../services/userManagementService";
import type {
  UserListDto,
  UserDetailsDto,
  UserFiltersDto,
  UserStatusUpdateDto,
  UserRoleDto,
} from "../../types/userManagement";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertCircle,
  UserPlus,
  Users,
  Eye,
  Edit,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/common/DataTable";
import type { TableColumn, TableAction } from "@/components/common/DataTable";
import { UserDetailsModal } from "@/components/admin/user-details/UserDetailsModal";
import { LoadingState } from "@/components/common/LoadingState";

// Define UserListItem type based on UserListDto
type UserListItem = UserListDto;

// Extended filter type to include additional UI filter properties
interface ExtendedFilterDto extends Omit<UserFiltersDto, "page" | "size"> {
  role?: string;
  status?: string;
  dateRange?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: string;
  page: number;
  size: number;
}

// User selector utilities
const userSelectors = {
  filterUsersByRole: (users: UserListDto[], role?: string) => {
    if (!role || role === "all") return users;
    return users.filter(
      (user) => user.roleName?.toLowerCase() === role.toLowerCase()
    );
  },

  filterUsersByStatus: (users: UserListDto[], status?: string) => {
    if (!status || status === "all") return users;
    if (status === "active") return users.filter((user) => user.isActive);
    if (status === "inactive") return users.filter((user) => !user.isActive);
    return users;
  },

  searchUsers: (users: UserListDto[], searchTerm?: string) => {
    if (!searchTerm || searchTerm.trim() === "") return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(term) ||
        (user.displayName?.toLowerCase() || "").includes(term)
    );
  },
};

// Role utilities
const roleUtils = {
  getRoleDisplayName: (roleName: string) => {
    if (!roleName) return "Không xác định";
    const roleMap: Record<string, string> = {
      volunteer: "Tình nguyện viên",
      organization: "Tổ chức",
      partner: "Đối tác",
      coordinator: "Điều phối viên",
      volunteercoordinator: "Điều phối viên",
      admin: "Quản trị viên",
      administrator: "Quản trị viên",
      // Handle any variations in casing or naming
      "volunteer coordinator": "Điều phối viên",
    };
    return roleMap[roleName.toLowerCase()] || roleName;
  },

  getRolesForFilter: () => [
    { value: "all", label: "Tất cả vai trò" },
    { value: "volunteer", label: "Tình nguyện viên" },
    { value: "organization", label: "Tổ chức" },
    { value: "partner", label: "Đối tác" },
    { value: "coordinator", label: "Điều phối viên" },
    { value: "admin", label: "Quản trị viên" },
  ],
};

/**
 * User Management Page using useUserData hooks
 * This replaces the complex UserManagementContext with simple hooks
 */
export default function UserManagementPageNew() {
  const { user: currentUser } = useAuth();

  // Service adapters
  const userDataService = {
    getAll: async (): Promise<UserListDto[]> => {
      const defaultFilter: UserFiltersDto = {
        page: 1,
        size: 100,
      };
      const result = await userManagementService.getUsers(defaultFilter);
      return result.items;
    },
    getById: async (id: number | string): Promise<UserDetailsDto> => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      return await userManagementService.getUserDetails(numericId);
    },
    update: async (
      id: number | string,
      data: UserStatusUpdateDto
    ): Promise<UserListDto> => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      await userManagementService.updateUserStatus(numericId, data.isActive);
      // Return a basic user object - you might need to fetch the updated user
      return {
        userId: numericId,
        email: "",
        roleId: 0,
        roleName: "",
        isActive: data.isActive || false,
        isEmailVerified: false,
        lastLoginAt: null,
        createdAt: new Date().toISOString(),
      } as UserListDto;
    },
  };

  const userStatsService = {
    getAll: async (): Promise<any[]> => {
      try {
        // Since getUserStatistics doesn't exist yet, we'll calculate stats from users
        const usersResponse = await userManagementService.getUsers({});
        const usersData = usersResponse.items || [];

        const totalUsers = usersData.length;
        const activeUsers = usersData.filter(
          (u: UserListDto) => u.isActive
        ).length;
        const inactiveUsers = totalUsers - activeUsers;
        const unverifiedUsers = usersData.filter(
          (u: UserListDto) => !u.isEmailVerified
        ).length;

        // Transform the statistics result to include both UserStatisticsDto format
        // and the aggregate statistics for display
        return [
          {
            // UserStatisticsDto format properties
            totalLogins: 0,
            lastLoginDays: 0,
            accountAgeInDays: 0,
            isNewUser: false,
            activityScore: 0,
            // Additional aggregate properties for display
            totalUsers,
            activeUsers,
            inactiveUsers,
            unverifiedUsers,
          },
        ];
      } catch (error) {
        // Return mock data if the API endpoint doesn't exist yet
        const users_data = users || [];
        const totalUsers = users_data.length;
        const activeUsers = users_data.filter(
          (u: UserListDto) => u.isActive
        ).length;
        const inactiveUsers = totalUsers - activeUsers;
        const unverifiedUsers = users_data.filter(
          (u: UserListDto) => !u.isEmailVerified
        ).length;

        return [
          {
            totalLogins: 0,
            lastLoginDays: 0,
            accountAgeInDays: 0,
            isNewUser: false,
            activityScore: 0,
            totalUsers,
            activeUsers,
            inactiveUsers,
            unverifiedUsers,
          },
        ];
      }
    },
  };

  // Use the new state management
  const [users, setUsers] = useState<UserListDto[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [stats, setStats] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Local state for UI
  const [filters, setFilters] = useState<ExtendedFilterDto>({
    page: 1,
    size: 100,
    sortBy: "createdAt",
    sortDirection: "DESC",
    searchTerm: "",
    role: "all",
    status: "all",
    dateRange: "all",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const [modals, setModals] = useState({
    userDetails: false,
    coordinatorDialog: false,
  });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserListDto | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // Load users
    setUsersLoading(true);
    setUsersError(null);
    try {
      const usersResult = await userDataService.getAll();
      setUsers(usersResult);
    } catch (err) {
      setUsersError(
        err instanceof Error ? err.message : "Failed to load users"
      );
    } finally {
      setUsersLoading(false);
    }

    // Load stats
    setStatsLoading(true);
    setStatsError(null);
    try {
      const statsResult = await userStatsService.getAll();
      setStats(statsResult);
    } catch (err) {
      setStatsError(
        err instanceof Error ? err.message : "Failed to load stats"
      );
    } finally {
      setStatsLoading(false);
    }
  };

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

  const handleViewUser = async (user: UserListItem) => {
    if (!user || user.userId == null) {
      console.error("Invalid user data for view");
      return;
    }

    setSelectedUserId(user.userId);
    try {
      const userDetail = await userDataService.getById(user.userId);
      if (userDetail) {
        setSelectedUser(user);
        setModals((prev) => ({ ...prev, userDetails: true }));
      }
    } catch (error) {
      console.error("Failed to load user details:", error);
    }
  };

  const handleToggleUserStatus = async (userId: number, newStatus: boolean) => {
    try {
      await userManagementService.updateUserStatus(userId, newStatus);

      // Refresh users list
      setUsersLoading(true);
      setUsersError(null);
      try {
        const usersResult = await userDataService.getAll();
        setUsers(usersResult);
      } catch (err) {
        setUsersError(
          err instanceof Error ? err.message : "Failed to load users"
        );
      } finally {
        setUsersLoading(false);
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  };

  const handleRoleFilter = (role: string) => {
    setFilters((prev) => ({ ...prev, role }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleDateRangeFilter = (dateRange: string) => {
    setFilters((prev) => ({ ...prev, dateRange }));
  };

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      role: "all",
      status: "all",
      searchTerm: "",
      dateRange: "all",
    }));
  };

  const closeAllModals = () => {
    setModals({
      userDetails: false,
      coordinatorDialog: false,
    });
    setSelectedUserId(null);
    setSelectedUser(null);
  };

  // Apply filters to users data
  const filteredUsers = React.useMemo(() => {
    let filtered = users;
    filtered = userSelectors.filterUsersByRole(filtered, filters.role);
    filtered = userSelectors.filterUsersByStatus(filtered, filters.status);
    filtered = userSelectors.searchUsers(filtered, filters.searchTerm);
    return filtered;
  }, [users, filters]);

  // Table columns definition
  const columns: TableColumn<UserListItem>[] = [
    {
      key: "displayName",
      header: "Tên người dùng",
      render: (value, user) => {
        if (!user) {
          return (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">U</span>
              </div>
              <div>
                <div className="font-medium">Không xác định</div>
                <div className="text-sm text-gray-500">Không có email</div>
              </div>
            </div>
          );
        }
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {(user.displayName || user.email || "U")
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <div className="font-medium">
                {user.displayName || "Chưa cập nhật"}
              </div>
              <div className="text-sm text-gray-500">
                {user.email || "Không có email"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "roleName",
      header: "Vai trò",
      render: (value, user) => {
        if (!user) {
          return <Badge variant="outline">Không xác định</Badge>;
        }
        return (
          <Badge variant="outline">
            {roleUtils.getRoleDisplayName(user.roleName || "unknown")}
          </Badge>
        );
      },
    },
    {
      key: "isActive",
      header: "Trạng thái",
      render: (value, user) => {
        if (!user) {
          return <Badge variant="secondary">Không xác định</Badge>;
        }
        return (
          <div className="flex items-center space-x-2">
            <Badge variant={user.isActive ? "default" : "secondary"}>
              {user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
            </Badge>
            {!user.isEmailVerified && (
              <Badge variant="destructive" className="text-xs">
                Chưa xác thực email
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "lastActivity",
      header: "Hoạt động cuối",
      render: (value, user) => {
        if (!user) {
          return <div className="text-sm text-gray-600">Chưa có</div>;
        }
        const lastActivity = user.lastLoginAt || user.createdAt;
        return (
          <div className="text-sm text-gray-600">
            {lastActivity
              ? new Date(lastActivity).toLocaleDateString("vi-VN")
              : "Chưa có"}
          </div>
        );
      },
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      render: (value, user) => {
        if (!user || !user.createdAt) {
          return <div className="text-sm text-gray-600">Chưa có</div>;
        }
        return (
          <div className="text-sm text-gray-600">
            {new Date(user.createdAt).toLocaleDateString("vi-VN")}
          </div>
        );
      },
    },
  ];

  // Table actions - Show details for all users including admin
  const actions: TableAction<UserListItem>[] = [
    {
      label: "Xem chi tiết",
      icon: <Eye className="w-4 h-4" />,
      onClick: handleViewUser,
      variant: "default",
      // Show "View Details" for all users including admin
    },
    {
      label: "Thay đổi trạng thái",
      icon: <Edit className="w-4 h-4" />,
      onClick: (user: UserListItem) => {
        if (!user || user.userId == null) {
          console.error("Invalid user data for status toggle");
          return;
        }
        handleToggleUserStatus(user.userId, !user.isActive);
      },
      variant: "outline",
    },
  ];

  // Determine loading state
  const isLoading = usersLoading && !users.length;

  // Combine errors
  const hasError = usersError || statsError;
  const errorMessage = usersError || statsError;

  if (isLoading) {
    return <LoadingState loading={true} />;
  }

  if (hasError) {
    return (
      <div className="p-6">
        <div className="text-red-600">
          Error:{" "}
          {typeof errorMessage === "string" ? errorMessage : "Đã xảy ra lỗi"}
        </div>
        <Button onClick={loadInitialData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/40 dark:via-purple-950/40 dark:to-indigo-950/40 min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100/20 via-transparent to-indigo-100/20 dark:from-violet-900/10 dark:via-transparent dark:to-indigo-900/10" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6 bg-gradient-to-r from-white/80 via-violet-50/50 to-purple-50/50 dark:from-slate-900/80 dark:via-violet-950/50 dark:to-purple-950/50 backdrop-blur-sm border border-violet-200/50 dark:border-violet-700/50 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-violet-700 dark:text-violet-300">
            Quản lý người dùng trong hệ thống
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats.length > 0 && stats[0] && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-white/90 via-violet-50/30 to-purple-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-purple-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-violet-800 dark:text-violet-200 font-semibold">
                Tổng người dùng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                {(stats[0] as any).totalUsers}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white/90 via-violet-50/30 to-purple-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-purple-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-violet-800 dark:text-violet-200 font-semibold">
                Đang hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {(stats[0] as any).activeUsers}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white/90 via-violet-50/30 to-purple-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-purple-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-violet-800 dark:text-violet-200 font-semibold">
                Vô hiệu hóa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                {(stats[0] as any).inactiveUsers}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white/90 via-violet-50/30 to-purple-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-purple-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-violet-800 dark:text-violet-200 font-semibold">
                Chưa xác thực
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
                {(stats[0] as any).unverifiedUsers}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="relative z-10 bg-gradient-to-br from-white/90 via-violet-50/30 to-purple-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-purple-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
        <CardHeader>
          <CardTitle className="flex items-center text-violet-800 dark:text-violet-200 font-semibold">
            <Filter className="w-5 h-5 mr-2" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-violet-700 dark:text-violet-300">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400 w-4 h-4" />
                <Input
                  placeholder="Tìm theo tên hoặc email..."
                  value={filters.searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 border-violet-200 dark:border-violet-700 focus:border-violet-500 dark:focus:border-violet-400"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-violet-700 dark:text-violet-300">
                Vai trò
              </label>
              <Select value={filters.role} onValueChange={handleRoleFilter}>
                <SelectTrigger className="border-violet-200 dark:border-violet-700 focus:border-violet-500 dark:focus:border-violet-400">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roleUtils.getRolesForFilter().map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-violet-700 dark:text-violet-300">
                Trạng thái
              </label>
              <Select value={filters.status} onValueChange={handleStatusFilter}>
                <SelectTrigger className="border-violet-200 dark:border-violet-700 focus:border-violet-500 dark:focus:border-violet-400">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/50"
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="relative z-10 bg-gradient-to-br from-white/90 via-violet-50/30 to-purple-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-purple-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
        <CardHeader>
          <CardTitle className="flex items-center text-violet-800 dark:text-violet-200 font-semibold">
            <Users className="w-5 h-5 mr-2" />
            Danh sách người dùng ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <DataTable
              data={filteredUsers}
              columns={columns}
              actions={actions}
            />
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-violet-400 dark:text-violet-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-violet-900 dark:text-violet-100 mb-2">
                Không tìm thấy người dùng
              </h3>
              <p className="text-violet-600 dark:text-violet-400 mb-4">
                Thử điều chỉnh bộ lọc để xem kết quả khác
              </p>
              <Button
                onClick={handleResetFilters}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {modals.userDetails && selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          isOpen={modals.userDetails}
          onClose={closeAllModals}
          onUserUpdate={loadInitialData}
        />
      )}
    </div>
  );
}
