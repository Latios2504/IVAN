import React from "react";
import {
  UserManagementProvider,
  useUserManagement,
  roleUtils,
} from "@/context/UserManagementContext";
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
import type { UserListItem } from "@/context/UserManagementContext";

/**
 * User Management Page Content (using UserManagementContext)
 * Clean implementation following the established context pattern
 */
const UserManagementPageContent: React.FC = () => {
  const { user: currentUser } = useAuth();
  const {
    users,
    loading,
    error,
    filters,
    pagination,
    modals,
    selectedUserId,
    statistics,
    setFilters,
    resetFilters,
    setPage,
    openUserDetails,
    openCreateCoordinator,
    closeAllModals,
    updateUserStatus,
    loadStatistics,
  } = useUserManagement();

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

  const handleViewUser = (user: UserListItem) => {
    openUserDetails(user.id);
  };

  const handleToggleUserStatus = async (userId: number, newStatus: boolean) => {
    await updateUserStatus(userId, newStatus);
  };

  const handleSearch = (searchTerm: string) => {
    setFilters({ searchTerm });
  };

  const handleRoleFilter = (role: string) => {
    setFilters({ role });
  };

  const handleStatusFilter = (status: string) => {
    setFilters({ status });
  };

  const handleDateRangeFilter = (dateRange: string) => {
    setFilters({ dateRange });
  };

  const handleResetFilters = () => {
    resetFilters();
  };

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
        const date = new Date(user.lastActivity);
        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString("vi-VN")}</div>
            <div className="text-gray-500">
              {date.toLocaleTimeString("vi-VN")}
            </div>
          </div>
        );
      },
    },
    {
      key: "province",
      header: "Tỉnh/Thành phố",
      render: (user) => user.province || "Chưa cập nhật",
    },
  ];

  // Table actions definition - using simpler approach that matches interface
  const actions: TableAction<UserListItem>[] = [
    {
      label: "Xem chi tiết",
      icon: <Eye className="w-4 h-4" />,
      onClick: handleViewUser,
    },
    {
      label: "Chỉnh sửa",
      icon: <Edit className="w-4 h-4" />,
      onClick: (user) => {
        // For now, just open details modal
        handleViewUser(user);
      },
    },
  ];

  const selectedUser = selectedUserId
    ? users.find((u) => u.id === selectedUserId)
    : null;

  if (loading && users.length === 0) {
    return <LoadingState loading={true} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý người dùng
          </h1>
          <p className="text-muted-foreground">
            Quản lý tài khoản người dùng, vai trò và quyền truy cập
          </p>
        </div>
        <Button
          onClick={openCreateCoordinator}
          className="flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tạo điều phối viên</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng người dùng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vô hiệu hóa</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => !u.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chưa xác thực</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => !u.isEmailVerified).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>
            Lọc người dùng theo vai trò, trạng thái, và thông tin khác
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên hoặc email..."
                  value={filters.searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Vai trò</label>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select value={filters.status} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
                  <SelectItem value="unverified">
                    Chưa xác thực email
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Thời gian tạo</label>
              <Select
                value={filters.dateRange}
                onValueChange={handleDateRangeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khoảng thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thời gian</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="year">Năm này</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleResetFilters}>
              <Filter className="w-4 h-4 mr-2" />
              Đặt lại bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>
            Hiển thị {users.length} trong tổng số {pagination.totalCount} người
            dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <>
              <DataTable
                data={users}
                columns={columns}
                actions={actions}
                loading={loading}
                emptyMessage="Không tìm thấy người dùng nào"
              />

              {pagination.totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    pagination={{
                      page: pagination.currentPage,
                      size: pagination.pageSize,
                      totalPages: pagination.totalPages,
                      totalItems: pagination.totalCount,
                      hasNextPage:
                        pagination.currentPage < pagination.totalPages,
                      hasPreviousPage: pagination.currentPage > 1,
                    }}
                    onPageChange={setPage}
                    itemName="người dùng"
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <UserDetailsModal
        userId={selectedUserId}
        isOpen={modals.userDetails}
        onClose={closeAllModals}
      />

      {/* Create Coordinator Modal - TODO: Implement this component */}
      {modals.createCoordinator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-4">Tạo điều phối viên</h3>
            <p className="text-gray-600 mb-4">
              Chức năng này sẽ được triển khai trong phiên bản tiếp theo.
            </p>
            <Button onClick={closeAllModals}>Đóng</Button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * User Management Page with Provider
 * This replaces the old ManageUserAccount.tsx with clean context-based implementation
 */
const UserManagementPage: React.FC = () => {
  return (
    <UserManagementProvider>
      <UserManagementPageContent />
    </UserManagementProvider>
  );
};

export default UserManagementPage;
