import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User, UserRole } from "@/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserDetailsModal from "@/components/admin/UserDetailsModal";
import { CoordinatorCreationDialog } from "@/components/admin/CoordinatorCreationDialog";
import { LoadingGrid } from "@/components/ui/skeletons";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { FilterSection } from "@/components/public/FilterSection";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import {
  Users,
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
import { toast } from "sonner";
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

// Simple error handling service replacement
const ErrorHandlingService = {
  handleApiError: (error: any, context?: string) => {
    return {
      message:
        error?.response?.data?.message || error?.message || "Đã xảy ra lỗi",
      code: error?.response?.status || 500,
      context,
    };
  },
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

// Use centralized utilities for roles and statuses
const USER_ROLES = roleUtils.getRolesForFilter();
const USER_STATUSES = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
  { value: "unverified", label: "Chưa xác thực" },
];

/**
 * User Management Page Component
 * Manages user accounts with filtering, status updates, and role management
 */
export default function UserManagementPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isCoordinatorDialogOpen, setIsCoordinatorDialogOpen] = useState(false);
  const [isCreateCoordinatorOpen, setIsCreateCoordinatorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5; // Reduced to 5 to see pagination with 14 users

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

  useEffect(() => {
    loadUsers();
  }, [filters, currentPage]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filterDto: UserAccountFilterDto = {
        roleId:
          filters.role === "all"
            ? undefined
            : roleUtils.mapRoleToId(filters.role),
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
        pageNumber: currentPage,
        pageSize: pageSize,
      };

      const response = await userManagementService.getUsers(filterDto);

      // Transform API response to UserListItem format
      const transformedUsers: UserListItem[] = response.items.map(
        (apiUser: UserAccountListDto) => ({
          id: apiUser.userId,
          email: apiUser.email,
          fullName: apiUser.fullName,
          role: roleUtils.mapApiRoleToFrontendRole(
            apiUser.roleName
          ) as UserRole,
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
      setTotalPages(Math.ceil(response.totalCount / response.pageSize) || 1);
      setTotalItems(response.totalCount || 0);
    } catch (error) {
      const appError = ErrorHandlingService.handleApiError(
        error,
        "UserManagementPage.loadUsers"
      );
      setError(appError.message);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = (user: UserListItem) => {
    setSelectedUserId(user.id);
    setIsUserDetailsOpen(true);
  };

  const handleToggleUserStatus = async (userId: number, newStatus: boolean) => {
    if (!currentUser?.id) {
      toast.error("Không thể xác định người dùng hiện tại");
      return;
    }

    try {
      // Find the user to get their current role
      const userToUpdate = users.find((user) => user.id === userId);
      if (!userToUpdate) {
        return;
      }

      const currentRoleId = roleUtils.mapRoleToId(userToUpdate.role);

      await userManagementService.toggleUserStatus(
        userId,
        currentUser.id,
        newStatus,
        currentRoleId
      );

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isActive: newStatus } : user
        )
      );

      toast.success(
        newStatus ? "Đã kích hoạt tài khoản" : "Đã vô hiệu hóa tài khoản"
      );
    } catch (error) {
      const appError = ErrorHandlingService.handleApiError(
        error,
        "UserManagementPage.handleToggleUserStatus"
      );
      toast.error("Không thể thay đổi trạng thái tài khoản");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRetry = () => {
    setError(null);
    setCurrentPage(1);
    loadUsers();
  };

  const getUserStatusBadge = (user: UserListItem) => {
    if (!user.isActive) {
      return <StatusBadge variant="inactive">Không hoạt động</StatusBadge>;
    }
    if (!user.isEmailVerified) {
      return <StatusBadge variant="pending">Chưa xác thực</StatusBadge>;
    }
    return <StatusBadge variant="active">Hoạt động</StatusBadge>;
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
      <div className="container mx-auto px-4 py-8">
        <LoadingState loading={isLoading} count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay error={error} onRetry={handleRetry} variant="page" />
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
      <FilterSection
        searchValue={filters.searchTerm}
        onSearchChange={(value) => {
          setFilters((prev) => ({ ...prev, searchTerm: value }));
          setCurrentPage(1); // Reset to first page when searching
        }}
        searchPlaceholder="Tìm kiếm tên hoặc email..."
        filters={[
          {
            id: "role",
            label: "Vai trò",
            value: filters.role,
            options: USER_ROLES,
            onChange: (value) => {
              setFilters((prev) => ({ ...prev, role: value }));
              setCurrentPage(1); // Reset to first page when filtering
            },
            icon: <Shield className="h-4 w-4" />,
          },
          {
            id: "status",
            label: "Trạng thái",
            value: filters.status,
            options: USER_STATUSES,
            onChange: (value) => {
              setFilters((prev) => ({ ...prev, status: value }));
              setCurrentPage(1); // Reset to first page when filtering
            },
            icon: <AlertCircle className="h-4 w-4" />,
          },
        ]}
        resultCount={totalItems}
        className="mb-6"
      />

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({totalItems})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={users}
            columns={tableColumns}
            actions={tableActions}
            loading={isLoading}
            emptyMessage="Không tìm thấy người dùng nào"
            pagination={{
              currentPage,
              totalPages,
              pageSize,
              totalItems,
              onPageChange: handlePageChange,
            }}
            showPagination={true}
          />
        </CardContent>
      </Card>

      {/* Coordinator Creation Dialog */}
      <CoordinatorCreationDialog
        isOpen={isCreateCoordinatorOpen}
        onClose={() => setIsCreateCoordinatorOpen(false)}
        onSuccess={(newCoordinator: any) => {
          // In a real app, this would properly handle the new coordinator data
          toast.success("Tạo tài khoản Coordinator thành công");
          setIsCreateCoordinatorOpen(false);
          loadUsers(); // Reload the user list
        }}
      />

      <UserDetailsModal
        userId={selectedUserId}
        isOpen={isUserDetailsOpen}
        onClose={() => setIsUserDetailsOpen(false)}
        onUserUpdate={loadUsers}
      />
    </div>
  );
}
