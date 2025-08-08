import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { userManagementService } from "@/services/userManagementService";
import type {
  UserAccountListDto,
  UserAccountDetailDto,
  UserAccountFilterDto,
  UserAccountUpdateDto,
  UserStatisticsDto,
} from "@/types/userManagement";
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
import { UserDetailsModal } from "@/components/admin/UserDetailsModal";
import { LoadingState } from "@/components/common/LoadingState";

// Define UserListItem type based on UserAccountListDto
type UserListItem = UserAccountListDto;

// Extended filter type to include additional UI filter properties
interface ExtendedFilterDto extends UserAccountFilterDto {
  role?: string;
  status?: string;
  dateRange?: string;
  searchTerm?: string;
}

// User selector utilities
const userSelectors = {
  filterUsersByRole: (users: UserAccountListDto[], role?: string) => {
    if (!role || role === "all") return users;
    return users.filter(
      (user) => user.roleName.toLowerCase() === role.toLowerCase()
    );
  },

  filterUsersByStatus: (users: UserAccountListDto[], status?: string) => {
    if (!status || status === "all") return users;
    if (status === "active") return users.filter((user) => user.isActive);
    if (status === "inactive") return users.filter((user) => !user.isActive);
    return users;
  },

  searchUsers: (users: UserAccountListDto[], searchTerm?: string) => {
    if (!searchTerm || searchTerm.trim() === "") return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(term) ||
        (user.fullName?.toLowerCase() || "").includes(term)
    );
  },
};

// Role utilities
const roleUtils = {
  getRoleDisplayName: (roleName: string) => {
    const roleMap: Record<string, string> = {
      volunteer: "Tình nguyện viên",
      organization: "Tổ chức",
      partner: "Đối tác",
      coordinator: "Điều phối viên",
      admin: "Quản trị viên",
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
    getAll: async (): Promise<UserAccountListDto[]> => {
      const defaultFilter: UserAccountFilterDto = {
        page: 1,
        size: 100,
        sortBy: "createdAt",
        sortDirection: "DESC",
      };
      const result = await userManagementService.getUsers(defaultFilter);
      return result.items;
    },
    getById: async (id: number | string): Promise<UserAccountDetailDto> => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      return await userManagementService.getUserDetail(numericId);
    },
    update: async (
      id: number | string,
      data: UserAccountUpdateDto
    ): Promise<UserAccountListDto> => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      const currentUserId = currentUser?.id || 0;
      await userManagementService.updateUserAccount(
        numericId,
        currentUserId,
        data
      );
      // Return a basic user object - you might need to fetch the updated user
      return {
        userId: numericId,
        email: data.userId?.toString() || "",
        roleName: "",
        isActive: data.isActive || false,
        isEmailVerified: data.isEmailVerified || false,
        statusDisplay: "",
        verificationDisplay: "",
      } as UserAccountListDto;
    },
  };

  const userStatsService = {
    getAll: async (): Promise<any[]> => {
      try {
        const result = await userManagementService.getUserStatistics();
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
            totalUsers: result.totalUsers,
            activeUsers: result.activeUsers,
            inactiveUsers: result.inactiveUsers,
            unverifiedUsers: result.unverifiedUsers,
          },
        ];
      } catch (error) {
        // Return mock data if the API endpoint doesn't exist yet
        const users_data = users.data || [];
        const totalUsers = users_data.length;
        const activeUsers = users_data.filter((u) => u.isActive).length;
        const inactiveUsers = totalUsers - activeUsers;
        const unverifiedUsers = users_data.filter(
          (u) => !u.isEmailVerified
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

  // Use the new useApi hooks
  const users = useApi(userDataService, {
    autoLoad: true,
  });

  const stats = useApi(userStatsService, {
    autoLoad: true,
  });

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
    createCoordinator: false,
  });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserAccountListDto | null>(
    null
  );

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([users.loadAll(), stats.loadAll()]);
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
      const currentUserId = currentUser?.id || 0;
      await userManagementService.toggleUserStatus(
        userId,
        currentUserId,
        newStatus
      );
      users.loadAll(); // Refresh users list
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
    setFilters({
      role: "all",
      status: "all",
      searchTerm: "",
      dateRange: "all",
    });
  };

  const closeAllModals = () => {
    setModals({
      userDetails: false,
      coordinatorDialog: false,
      createCoordinator: false,
    });
    setSelectedUserId(null);
    setSelectedUser(null);
  };

  // Apply filters to users data
  const filteredUsers = React.useMemo(() => {
    let filtered = users.data;
    filtered = userSelectors.filterUsersByRole(filtered, filters.role);
    filtered = userSelectors.filterUsersByStatus(filtered, filters.status);
    filtered = userSelectors.searchUsers(filtered, filters.searchTerm);
    return filtered;
  }, [users.data, filters]);

  // Table columns definition
  const columns: TableColumn<UserListItem>[] = [
    {
      key: "fullName",
      header: "Tên người dùng",
      render: (user) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {(user.fullName || user.email).charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">
              {user.fullName || "Chưa cập nhật"}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Vai trò",
      render: (user) => (
        <Badge variant="outline">
          {roleUtils.getRoleDisplayName(user.role)}
        </Badge>
      ),
    },
    {
      key: "isActive",
      header: "Trạng thái",
      render: (user) => (
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
      ),
    },
    {
      key: "lastActivity",
      header: "Hoạt động cuối",
      render: (user) => {
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
      render: (user) => (
        <div className="text-sm text-gray-600">
          {new Date(user.createdAt).toLocaleDateString("vi-VN")}
        </div>
      ),
    },
  ];

  // Table actions
  const actions: TableAction<UserListItem>[] = [
    {
      label: "Xem chi tiết",
      icon: <Eye className="w-4 h-4" />,
      onClick: handleViewUser,
      variant: "default",
    },
    {
      label: "Thay đổi trạng thái",
      icon: <Edit className="w-4 h-4" />,
      onClick: (user: UserListItem) =>
        handleToggleUserStatus(user.userId, !user.isActive),
      variant: "outline",
    },
  ];

  // Determine loading state
  const isLoading = users.loading && !users.data.length;

  // Combine errors
  const hasError = users.error || stats.error;
  const errorMessage = users.error || stats.error;

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
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Quản lý người dùng trong hệ thống</p>
        </div>
        <Button
          onClick={() =>
            setModals((prev) => ({ ...prev, createCoordinator: true }))
          }
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Tạo Coordinator
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats.data.length > 0 && stats.data[0] && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tổng người dùng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.data[0].totalUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Đang hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.data[0].activeUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Vô hiệu hóa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.data[0].inactiveUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Chưa xác thực</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.data[0].unverifiedUsers}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm theo tên hoặc email..."
                  value={filters.searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Vai trò</label>
              <Select value={filters.role} onValueChange={handleRoleFilter}>
                <SelectTrigger>
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
              <label className="text-sm font-medium mb-2 block">
                Trạng thái
              </label>
              <Select value={filters.status} onValueChange={handleStatusFilter}>
                <SelectTrigger>
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
                className="w-full"
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
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
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy người dùng
              </h3>
              <p className="text-gray-600 mb-4">
                Thử điều chỉnh bộ lọc để xem kết quả khác
              </p>
              <Button onClick={handleResetFilters}>Đặt lại bộ lọc</Button>
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
