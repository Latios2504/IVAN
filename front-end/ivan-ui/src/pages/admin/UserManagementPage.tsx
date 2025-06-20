import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User, UserRole } from "@/types/auth";
import type { UserProfile } from "@/types/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  MoreHorizontal
} from "lucide-react";
// Simple notification function for demo
const showNotification = (message: string, type: "success" | "error" = "success") => {
  console.log(`${type.toUpperCase()}: ${message}`);
  // In a real app, this would be replaced with a proper toast system
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
    eventsParticipated: 15,    profile: undefined,
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
    eventsCreated: 8,    profile: undefined,
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
    totalCollaborations: 3,    profile: undefined,
  },
];

const USER_ROLES = [
  { value: "all", label: "Tất cả vai trò" },
  { value: "volunteer", label: "Tình nguyện viên" },
  { value: "organization", label: "Tổ chức" },
  { value: "coordinator", label: "Điều phối viên" },
  { value: "partner", label: "Đối tác" },
  { value: "admin", label: "Quản trị viên" },
];

const USER_STATUSES = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Bị vô hiệu hóa" },
  { value: "unverified", label: "Chưa xác thực email" },
];

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isCoordinatorDialogOpen, setIsCoordinatorDialogOpen] = useState(false);

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
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await userService.getAllUsers();
      // setUsers(response.data);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
    } catch (error) {
      showNotification("Không thể tải danh sách người dùng", "error");
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = (user: UserListItem) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };
  const handleUserUpdate = (updatedUser: User) => {
    // Convert User back to UserListItem for internal state management
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? {
        ...user,
        ...updatedUser,
        lastActivity: user.lastActivity, // Preserve UserListItem-specific fields
        eventsParticipated: user.eventsParticipated,
        eventsCreated: user.eventsCreated,
        totalCollaborations: user.totalCollaborations,
      } : user
    ));
    showNotification("Cập nhật thông tin người dùng thành công");
  };

  const handleToggleUserStatus = async (userId: number, newStatus: boolean) => {
    try {
      // TODO: API call to toggle user status
      // await userService.updateUserStatus(userId, newStatus);
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive: newStatus } : user
      ));
        showNotification(
        newStatus ? "Đã kích hoạt tài khoản" : "Đã vô hiệu hóa tài khoản"
      );
    } catch (error) {
      showNotification("Không thể thay đổi trạng thái tài khoản", "error");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filters.role === "all" || user.role === filters.role;
    const matchesStatus = 
      filters.status === "all" ||
      (filters.status === "active" && user.isActive) ||
      (filters.status === "inactive" && !user.isActive) ||
      (filters.status === "unverified" && !user.isEmailVerified);
    const matchesSearch = 
      user.fullName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesRole && matchesStatus && matchesSearch;
  });

  const getUserStatusBadge = (user: UserListItem) => {
    if (!user.isActive) {
      return <Badge variant="destructive">Bị vô hiệu hóa</Badge>;
    }
    if (!user.isEmailVerified) {
      return <Badge variant="secondary">Chưa xác thực</Badge>;
    }
    return <Badge variant="default">Hoạt động</Badge>;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-4 w-4" />;
      case "coordinator":
        return <Shield className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      volunteer: "Tình nguyện viên",
      organization: "Tổ chức",
      coordinator: "Điều phối viên",
      partner: "Đối tác",
      admin: "Quản trị viên",
    };
    return roleMap[role] || role;
  };

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
          onClick={() => setIsCoordinatorDialogOpen(true)}
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
                  {users.filter(u => u.isActive).length}
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
                  {users.filter(u => !u.isActive).length}
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
                  {users.filter(u => !u.isEmailVerified).length}
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
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.role}
              onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {USER_STATUSES.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setFilters({
                role: "all",
                status: "all",
                searchTerm: "",
                dateRange: "all",
              })}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách người dùng ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.fullName}</span>
                      {getUserStatusBadge(user)}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{getRoleDisplayName(user.role)}</span>
                      <span>•</span>
                      <span>
                        Hoạt động cuối: {new Date(user.lastActivity).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewUser(user)}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    variant={user.isActive ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggleUserStatus(user.id, !user.isActive)}
                  >
                    {user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không tìm thấy người dùng nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={isUserDetailsOpen}
          onClose={() => {
            setIsUserDetailsOpen(false);
            setSelectedUser(null);
          }}
          onUserUpdate={handleUserUpdate}
        />
      )}

      {/* Coordinator Creation Dialog */}
      <CoordinatorCreationDialog
        isOpen={isCoordinatorDialogOpen}
        onClose={() => setIsCoordinatorDialogOpen(false)}        onSuccess={(newCoordinator: any) => {
          // In a real app, this would properly handle the new coordinator data
          showNotification("Tạo tài khoản Coordinator thành công");
        }}
      />
    </div>
  );
}
