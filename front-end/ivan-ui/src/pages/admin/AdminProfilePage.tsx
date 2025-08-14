import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Settings,
  BarChart3,
  FileText,
  Users,
  Lock,
  Edit,
  Camera,
} from "lucide-react";

// Mock admin profile data
const mockAdminProfile = {
  adminId: 1,
  userId: 1,
  fullName: "Nguyễn Văn Admin",
  email: "admin@ivan.com",
  phone: "0123456789",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  dateOfBirth: "1990-01-01",
  profilePicture: null,
  isActive: true,
  permissions: ["USER_MANAGEMENT", "SYSTEM_CONFIG", "REPORTS", "AUDIT_LOGS"],
  lastLogin: "2024-08-14T10:30:00Z",
  createdAt: "2023-01-01T00:00:00Z",
};

export default function AdminProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile] = useState(mockAdminProfile);
  const [activeTab, setActiveTab] = useState("info");

  // Determine if viewing current user's profile or someone else's
  const targetUserId = id ? parseInt(id, 10) : user?.id;
  const isCurrentUser = !id || user?.id === targetUserId;

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-red-600" />
                  )}
                </div>
                {isCurrentUser && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.fullName}
                  </h1>
                  <Badge variant="destructive" className="bg-red-600">
                    <Shield className="w-3 h-3 mr-1" />
                    Quản trị viên
                  </Badge>
                  {profile.isActive && (
                    <Badge variant="default" className="bg-green-600">
                      Đang hoạt động
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600">
                  Quản trị viên hệ thống IVAN - Quản lý tổng thể và vận hành
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {profile.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Tham gia từ {new Date(profile.createdAt).getFullYear()}
                  </div>
                </div>
              </div>

              {isCurrentUser && (
                <Button className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa hồ sơ
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="system">Hệ thống</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
            <TabsTrigger value="logs">Nhật ký</TabsTrigger>
            <TabsTrigger value="permissions">Quyền hạn</TabsTrigger>
            {isCurrentUser && (
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>
                    Thông tin cơ bản của quản trị viên
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Họ và tên</p>
                      <p className="text-gray-600">{profile.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Ngày sinh</p>
                      <p className="text-gray-600">
                        {new Date(profile.dateOfBirth).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Địa chỉ</p>
                      <p className="text-gray-600">{profile.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin liên hệ</CardTitle>
                  <CardDescription>
                    Thông tin liên lạc và đăng nhập
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-gray-600">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Số điện thoại</p>
                      <p className="text-gray-600">{profile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Đăng nhập lần cuối</p>
                      <p className="text-gray-600">
                        {new Date(profile.lastLogin).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Quyền hạn hệ thống</CardTitle>
                  <CardDescription>
                    Các quyền và chức năng được phép truy cập
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.permissions.map((permission) => (
                      <Badge key={permission} variant="outline">
                        <Lock className="w-3 h-3 mr-1" />
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quản lý hệ thống
                </CardTitle>
                <CardDescription>
                  Các chức năng quản lý và cấu hình hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tính năng đang được phát triển...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Phân tích hệ thống
                </CardTitle>
                <CardDescription>
                  Thống kê và báo cáo hoạt động hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tính năng đang được phát triển...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Nhật ký hoạt động
                </CardTitle>
                <CardDescription>
                  Theo dõi các hoạt động và thay đổi trong hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tính năng đang được phát triển...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Quản lý quyền hạn
                </CardTitle>
                <CardDescription>
                  Cấu hình quyền truy cập cho người dùng và vai trò
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tính năng đang được phát triển...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {isCurrentUser && (
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Cài đặt tài khoản
                  </CardTitle>
                  <CardDescription>
                    Cấu hình cá nhân và bảo mật tài khoản
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Tính năng đang được phát triển...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
