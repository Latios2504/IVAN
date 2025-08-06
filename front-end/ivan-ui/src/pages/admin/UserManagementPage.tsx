import React, { useEffect, useState } from "react";
import {
  useUserData,
  useUserStats,
  useUserManagementOperations,
  roleUtils,
  userSelectors,
  type UserListItem,
  type UserFilters,
} from "@/hooks/useUserData";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertCircle,
  UserPlus,
  Users,
  Eye,
  Edit,
  MoreHorizontal,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "@/components/common/LoadingState";
import { Pagination } from "@/components/common/Pagination";

/**
 * User Management Page using useUserData hooks
 * This replaces the complex UserManagementContext with simple hooks
 */
export default function UserManagementPageNew() {
  const { user: currentUser } = useAuth();

  // Use the new useData hooks
  const users = useUserData();
  const stats = useUserStats();
  const { updateUserStatus, createCoordinator, loadUserById } =
    useUserManagementOperations();

  // Local state for UI
  const [filters, setFilters] = useState<UserFilters>({
    role: "all",
    status: "all",
    searchTerm: "",
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
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);

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
    setSelectedUserId(user.id);
    const result = await loadUserById(user.id);
    if (result.success) {
      setSelectedUser(user);
      setModals((prev) => ({ ...prev, userDetails: true }));
    }
  };

  const handleToggleUserStatus = async (userId: number, newStatus: boolean) => {
    const result = await updateUserStatus(userId, newStatus);
    if (result.success) {
      users.loadAll(); // Refresh users list
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
        handleToggleUserStatus(user.id, !user.isActive),
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
