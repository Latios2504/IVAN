import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats } from "@/hooks/useDashboardStats";
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
import { LoadingWithRetry } from "@/components/ui/skeletons";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActionButton } from "@/components/dashboard/ActionButton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  MessageSquare,
  BarChart3,
  Settings,
  FileText,
  Briefcase,
  Bell,
  Shield,
  MessageCircle,
  Bot,
} from "lucide-react";
import { Link } from "react-router-dom";
import ChatBot from "@/components/chatbot/ChatBot";
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

export default function AdminDashboard() {
  const { user } = useAuth();
  const {
    stats: adminStats,
    loading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<UserManagementData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");

  const toggleChatBot = () => {
    setIsChatBotOpen(!isChatBotOpen);
  };

  // Chỉ admin mới được sử dụng chatbot
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchAdminData = async () => {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        const mockStats: AdminStats = {
          totalUsers: 2847,
          totalVolunteers: 2134,
          totalOrganizations: 89,
          totalEvents: 156,
          activeEvents: 23,
          pendingApprovals: 12,
          monthlyGrowth: 8.5,
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
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === "all" || user.role === selectedRole;
      return matchesSearch && matchesRole;
    }) || [];

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Quản trị viên",
      volunteer: "Tình nguyện viên",
      organization: "Tổ chức",
      coordinator: "Điều phối viên",
      partner: "Đối tác",
    };
    return labels[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-purple-100 text-purple-800",
      volunteer: "bg-blue-100 text-blue-800",
      organization: "bg-green-100 text-green-800",
      coordinator: "bg-orange-100 text-orange-800",
      partner: "bg-pink-100 text-pink-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingWithRetry text="Đang tải bảng điều khiển..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-gray-600">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Quản trị viên
        </h1>
        <p className="text-gray-600">
          Quản lý toàn bộ hệ thống IVAN và giám sát hoạt động
        </p>
      </div>

      {/* Stats Overview */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="col-span-full text-center py-8">
            <p>Đang tải thống kê...</p>
          </div>
        </div>
      ) : statsError ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="col-span-full text-center py-8">
            <p className="text-red-500">Lỗi: {statsError}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Tổng người dùng"
            value={
              (adminStats as any)?.totalUsers || data?.stats.totalUsers || 0
            }
            icon={Users}
            trend={{
              value: `+${data?.stats.monthlyGrowth || 0}% so với tháng trước`,
            }}
          />
          <StatsCard
            title="Tình nguyện viên"
            value={
              (adminStats as any)?.totalVolunteers ||
              data?.stats.totalVolunteers ||
              0
            }
            icon={Users}
            description={`${Math.round(
              (((adminStats as any)?.totalVolunteers ||
                data?.stats.totalVolunteers ||
                0) /
                ((adminStats as any)?.totalUsers ||
                  data?.stats.totalUsers ||
                  1)) *
                100
            )}% tổng số người dùng`}
          />
          <StatsCard
            title="Tổ chức"
            value={
              (adminStats as any)?.totalOrganizations ||
              data?.stats.totalOrganizations ||
              0
            }
            icon={Building2}
            description={`${Math.round(
              (((adminStats as any)?.totalOrganizations ||
                data?.stats.totalOrganizations ||
                0) /
                ((adminStats as any)?.totalUsers ||
                  data?.stats.totalUsers ||
                  1)) *
                100
            )}% tổng số người dùng`}
          />
          <StatsCard
            title="Sự kiện đang diễn ra"
            value={
              (adminStats as any)?.activeEvents || data?.stats.activeEvents || 0
            }
            icon={Calendar}
            description={`/${
              (adminStats as any)?.totalEvents || data?.stats.totalEvents || 0
            } tổng số sự kiện`}
          />
        </div>
      )}

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Quản lý người dùng</TabsTrigger>
          <TabsTrigger value="management">Quản lý hệ thống</TabsTrigger>
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
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="volunteer">Tình nguyện viên</option>
                  <option value="organization">Tổ chức</option>
                  <option value="coordinator">Điều phối viên</option>
                  <option value="partner">Đối tác</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">
                        Người dùng
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Vai trò
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Trạng thái
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Ngày tạo
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
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

        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle>Quản lý người dùng</CardTitle>
                <CardDescription>
                  Tài khoản, phân quyền và xác thực
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ActionButton to="/admin/users" icon={Users}>
                  Quản lý tài khoản
                </ActionButton>
                <ActionButton to="/admin/organizations" icon={Building2}>
                  Quản lý tổ chức
                </ActionButton>
                <ActionButton to="/admin/partners" icon={Briefcase}>
                  Quản lý đối tác
                </ActionButton>
              </CardContent>
            </Card>

            {/* System Management */}
            <Card>
              <CardHeader>
                <CardTitle>Quản lý hệ thống</CardTitle>
                <CardDescription>
                  Thông báo, báo cáo và nội dung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ActionButton to="/admin/notifications" icon={Bell}>
                  Quản lý thông báo
                </ActionButton>
                <ActionButton to="/admin/ai-instructions" icon={Bot}>
                  Quản lý AI Instructions
                </ActionButton>
                <ActionButton to="/admin/reports" icon={BarChart3}>
                  Báo cáo hệ thống
                </ActionButton>
                <ActionButton to="/admin/blog" icon={FileText}>
                  Quản lý blog
                </ActionButton>
                <ActionButton to="/support" icon={MessageCircle}>
                  Quản lý hỗ trợ
                </ActionButton>
              </CardContent>
            </Card>

            {/* Support & Content */}
            <Card>
              <CardHeader>
                <CardTitle>Hỗ trợ & Nội dung</CardTitle>
                <CardDescription>
                  Đơn hỗ trợ và quản lý nội dung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ActionButton to="/admin/support" icon={MessageSquare}>
                  Đơn hỗ trợ
                </ActionButton>
                <ActionButton to="/admin/job-posts" icon={UserCheck}>
                  Bài tuyển dụng
                </ActionButton>
                <ActionButton to="/admin/partnerships" icon={Shield}>
                  Hợp tác đối tác
                </ActionButton>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái hệ thống</CardTitle>
              <CardDescription>
                Tình trạng hoạt động của các thành phần
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <StatusBadge variant="active">Hoạt động tốt</StatusBadge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Server</span>
                  <StatusBadge variant="active">Hoạt động tốt</StatusBadge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Service</span>
                  <StatusBadge variant="warning">Chậm</StatusBadge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">File Storage</span>
                  <StatusBadge variant="active">Hoạt động tốt</StatusBadge>
                </div>
              </div>
              <ActionButton
                to="/admin/system"
                icon={Settings}
                variant="outline"
              >
                Cài đặt hệ thống
              </ActionButton>
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

      {/* Floating ChatBot Button - Chỉ hiển thị cho Admin */}
      {isAdmin && !isChatBotOpen && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={toggleChatBot}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg border-2 border-white"
            size="lg"
            title="IVAN AI Assistant - Chỉ dành cho Admin"
          >
            <div className="relative">
              <Bot className="h-6 w-6 text-white" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          </Button>
        </div>
      )}
      {/* ChatBot Component - Chỉ cho Admin */}
      {isAdmin && <ChatBot isOpen={isChatBotOpen} onToggle={toggleChatBot} />}
    </div>
  );
}
