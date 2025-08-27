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
import { StatsCard } from "@/components/common/StatsCard";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "sonner";

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
    getAll: async (
      filters: UserFiltersDto
    ): Promise<{
      items: UserListDto[];
      totalItems: number;
      totalPages: number;
    }> => {
      const result = await userManagementService.getUsers(filters);
      return {
        items: result.items,
        totalItems: result.totalCount || result.items.length,
        totalPages:
          result.totalPages ||
          Math.ceil((result.totalCount || result.items.length) / filters.size),
      };
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
        // Calculate stats from users data - get ALL users for accurate stats
        const usersResponse = await userManagementService.getUsers({
          size: 1000,
        }); // Large size to get all users
        const usersData = usersResponse.items || [];

        const totalUsers = usersData.length;
        const activeUsers = usersData.filter(
          (u: UserListDto) => u.isActive
        ).length;
        const inactiveUsers = totalUsers - activeUsers;
        const unverifiedUsers = usersData.filter(
          (u: UserListDto) => !u.isEmailVerified
        ).length;

        return [
          {
            totalUsers,
            activeUsers,
            inactiveUsers,
            unverifiedUsers,
          },
        ];
      } catch (error) {
        console.error("Failed to load user statistics:", error);
        throw error;
      }
    },
  };

  // Use the new state management
  const [users, setUsers] = useState<UserListDto[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [stats, setStats] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  // Local state for UI
  const [filters, setFilters] = useState<ExtendedFilterDto>({
    page: 1,
    size: 10, // Changed to 10 items per page
    sortBy: "createdAt",
    sortDirection: "DESC",
    searchTerm: "",
    role: "all",
    status: "all",
    dateRange: "all",
  });

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [modals, setModals] = useState({
    userDetails: false,
    coordinatorDialog: false,
  });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserListDto | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Load users when filters change (except for client-side filters)
  useEffect(() => {
    if (filters.page > 1 || filters.size !== 10) {
      loadUsers(filters);
    }
  }, [filters.page, filters.size]);

  const loadUsers = async (currentFilters = filters) => {
    setUsersLoading(true);
    try {
      const apiFilters: UserFiltersDto = {
        page: currentFilters.page,
        size: currentFilters.size,
        search: currentFilters.searchTerm,
      };

      const usersResult = await userDataService.getAll(apiFilters);
      setUsers(usersResult.items);
      setTotalItems(usersResult.totalItems);
      setTotalPages(usersResult.totalPages);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const statsResult = await userStatsService.getAll();
      setStats(statsResult);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setStatsLoading(false);
    }
  };

  const loadInitialData = async () => {
    await Promise.all([loadUsers(), loadStats()]);
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
    setSelectedUser(user);
    setModals((prev) => ({ ...prev, userDetails: true }));
  };

  const handleUserUpdate = () => {
    // Refresh both users and stats when a user is updated
    loadInitialData();
  };

  const handleToggleUserStatus = async (userId: number, newStatus: boolean) => {
    try {
      await userManagementService.updateUserStatus(userId, newStatus);
      // Refresh users list and stats
      await Promise.all([loadUsers(), loadStats()]);
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Không thể cập nhật trạng thái người dùng");
    }
  };

  const handleSearch = (searchTerm: string) => {
    const newFilters = { ...filters, searchTerm, page: 1 };
    setFilters(newFilters);
    loadUsers(newFilters);
  };

  const handleRoleFilter = (role: string) => {
    const newFilters = { ...filters, role, page: 1 };
    setFilters(newFilters);
    loadUsers(newFilters);
  };

  const handleStatusFilter = (status: string) => {
    const newFilters = { ...filters, status, page: 1 };
    setFilters(newFilters);
    loadUsers(newFilters);
  };

  const handleDateRangeFilter = (dateRange: string) => {
    const newFilters = { ...filters, dateRange, page: 1 };
    setFilters(newFilters);
    loadUsers(newFilters);
  };

  const handleResetFilters = () => {
    const newFilters = {
      ...filters,
      role: "all",
      status: "all",
      searchTerm: "",
      dateRange: "all",
      page: 1,
    };
    setFilters(newFilters);
    loadUsers(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    loadUsers(newFilters);
  };

  const closeAllModals = () => {
    setModals({
      userDetails: false,
      coordinatorDialog: false,
    });
    setSelectedUserId(null);
    setSelectedUser(null);
  };

  // Apply client-side filters for display (server-side filtering should be implemented in API)
  const filteredUsers = React.useMemo(() => {
    let filtered = users;
    // Apply client-side filters as fallback
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
      icon: <Eye />,
      onClick: handleViewUser,
      variant: "default",
      // Show "View Details" for all users including admin
    },
    {
      label: "Thay đổi trạng thái",
      icon: <Edit />,
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

  if (isLoading) {
    return <LoadingState loading={true} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/40 dark:via-purple-950/40 dark:to-indigo-950/40 min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100/20 via-transparent to-indigo-100/20 dark:from-violet-900/10 dark:via-transparent dark:to-indigo-900/10" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6 bg-gradient-to-r from-white/80 via-violet-50/50 to-purple-50/50 dark:from-slate-900/80 dark:via-violet-950/50 dark:to-purple-950/50 backdrop-blur-sm border border-violet-200/50 dark:border-violet-700/50 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Quản lý người dùng
          </h1>
          <p className="text-violet-700 dark:text-violet-300">
            Quản lý người dùng trong hệ thống
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats.length > 0 && stats[0] && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Tổng người dùng"
            value={(stats[0] as any).totalUsers}
            icon={Users}
          />
          <StatsCard
            title="Đang hoạt động"
            value={(stats[0] as any).activeUsers}
            icon={Users}
          />
          <StatsCard
            title="Vô hiệu hóa"
            value={(stats[0] as any).inactiveUsers}
            icon={Users}
          />
          <StatsCard
            title="Chưa xác thực"
            value={(stats[0] as any).unverifiedUsers}
            icon={Users}
          />
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
            Danh sách người dùng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <DataTable
              data={filteredUsers}
              columns={columns}
              actions={actions}
              loading={usersLoading}
              showPagination={true}
              pagination={{
                currentPage: filters.page,
                totalPages: totalPages,
                pageSize: filters.size,
                totalItems: totalItems,
                onPageChange: handlePageChange,
              }}
            />
          ) : (
            <EmptyState
              icon={Users}
              title="Không tìm thấy người dùng"
              description="Thử điều chỉnh bộ lọc để xem kết quả khác"
              show={true}
            />
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {modals.userDetails && selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          isOpen={modals.userDetails}
          onClose={closeAllModals}
          onUserUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
}
