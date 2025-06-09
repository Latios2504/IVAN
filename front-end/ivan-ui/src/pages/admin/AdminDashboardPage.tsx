import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import type { User, UserRole } from "@/types/auth";

interface AdminStats {
  totalUsers: number;
  totalVolunteers: number;
  totalOrganizations: number;
  totalEvents: number;
  activeEvents: number;
  pendingApprovals: number;
  monthlyGrowth: number;
}

interface UserManagementData {
  users: User[];
  stats: AdminStats;
}

const AdminDashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<UserManagementData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");

  useEffect(() => {
    const fetchAdminData = async () => {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        const mockStats: AdminStats = {
          totalUsers: 1250,
          totalVolunteers: 890,
          totalOrganizations: 125,
          totalEvents: 78,
          activeEvents: 23,
          pendingApprovals: 15,
          monthlyGrowth: 12.5,
        };

        const mockUsers: User[] = [
          {
            id: 1,
            email: "volunteer1@example.com",
            fullName: "Nguyễn Văn An",
            role: "volunteer",
            isActive: true,
            isEmailVerified: true,
            createdAt: "2024-01-15T08:00:00Z",
            updatedAt: "2024-01-20T10:30:00Z",
            profile: {
              profileId: 1,
              firstName: "An",
              lastName: "Nguyễn Văn",
              fullName: "Nguyễn Văn An",
              phoneNumber: "0123456789",
              dateOfBirth: "1990-05-15",
              bio: "Tình nguyện viên nhiệt tình",
              skills: ["Giảng dạy", "Hỗ trợ IT"],
              totalVolunteerHours: 120,
              volunteerRank: "Silver",
              joinedDate: "2024-01-15T08:00:00Z",
              willingToTravel: true,
              hasTransportation: false,
              isProfileComplete: true,
              location: {
                addressLine1: "123 Đường ABC",
                ward: "Phường 1",
                district: "Quận 1",
                city: "Hồ Chí Minh",
                province: "Hồ Chí Minh",
                postalCode: "70000",
              },
              emergencyContactName: "Nguyễn Thị B",
              emergencyContactPhone: "0987654321",
              emergencyContactRelationship: "Mẹ",
            },
          },
          {
            id: 2,
            email: "org1@example.com",
            fullName: "Quỹ Từ Thiện Tâm Hướng Thiện",
            role: "organization",
            isActive: true,
            isEmailVerified: true,
            createdAt: "2024-01-10T09:00:00Z",
            updatedAt: "2024-01-25T14:15:00Z",
            profile: undefined,
          },
          {
            id: 3,
            email: "coordinator1@example.com",
            fullName: "Trần Thị Lan",
            role: "coordinator",
            isActive: false,
            isEmailVerified: false,
            createdAt: "2024-02-01T11:00:00Z",
            updatedAt: "2024-02-10T16:45:00Z",
            profile: undefined,
          },
        ];

        setData({
          users: mockUsers,
          stats: mockStats,
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId: number) => {
    if (!data) return;

    // Mock API call
    const updatedUsers = data.users.map((user) =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );

    setData({ ...data, users: updatedUsers });
  };

  const filteredUsers =
    data?.users.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === "all" || user.role === selectedRole;
      return matchesSearch && matchesRole;
    }) || [];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "coordinator":
        return "bg-blue-100 text-blue-800";
      case "organization":
        return "bg-green-100 text-green-800";
      case "volunteer":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "coordinator":
        return "Điều phối viên";
      case "organization":
        return "Tổ chức";
      case "volunteer":
        return "Tình nguyện viên";
      default:
        return role;
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản trị hệ thống</h1>
        <p className="text-gray-600 mt-2">
          Quản lý người dùng và giám sát hoạt động của hệ thống
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng người dùng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{data.stats.monthlyGrowth}% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tình nguyện viên
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.totalVolunteers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (data.stats.totalVolunteers / data.stats.totalUsers) * 100
              )}
              % tổng số người dùng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổ chức</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.totalOrganizations.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (data.stats.totalOrganizations / data.stats.totalUsers) * 100
              )}
              % tổng số người dùng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sự kiện đang diễn ra
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.activeEvents}</div>
            <p className="text-xs text-muted-foreground">
              /{data.stats.totalEvents} tổng số sự kiện
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Quản lý người dùng</TabsTrigger>
          <TabsTrigger value="approvals">
            Duyệt đăng ký ({data.stats.pendingApprovals})
          </TabsTrigger>
          <TabsTrigger value="analytics">Thống kê</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách người dùng</CardTitle>
              <CardDescription>
                Quản lý và kiểm soát tài khoản người dùng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value as UserRole | "all")
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="volunteer">Tình nguyện viên</option>
                  <option value="organization">Tổ chức</option>
                  <option value="coordinator">Điều phối viên</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Người dùng</th>
                      <th className="text-left py-3 px-4">Vai trò</th>
                      <th className="text-left py-3 px-4">Trạng thái</th>
                      <th className="text-left py-3 px-4">Ngày tham gia</th>
                      <th className="text-left py-3 px-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {getRoleLabel(user.role)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            {user.isActive ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-green-700">
                                  Hoạt động
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                                <span className="text-red-700">Tạm khóa</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant={user.isActive ? "destructive" : "default"}
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id)}
                          >
                            {user.isActive ? "Tạm khóa" : "Kích hoạt"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Đăng ký chờ duyệt</CardTitle>
              <CardDescription>
                Xem xét và phê duyệt các đăng ký mới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <p>
                  Hiện tại có {data.stats.pendingApprovals} đăng ký chờ duyệt
                </p>
                <p className="text-sm mt-2">
                  Tính năng này sẽ được triển khai trong phiên bản tiếp theo
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê và báo cáo</CardTitle>
              <CardDescription>
                Phân tích hoạt động và hiệu suất hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p>Báo cáo chi tiết và biểu đồ thống kê</p>
                <p className="text-sm mt-2">
                  Tính năng này sẽ được triển khai trong phiên bản tiếp theo
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;
