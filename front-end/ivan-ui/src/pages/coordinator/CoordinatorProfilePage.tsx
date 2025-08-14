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
  Briefcase,
  Settings,
  ClipboardList,
  BarChart3,
  Users,
  Clock,
  Edit,
  Camera,
  Award,
  Target,
} from "lucide-react";

// Mock coordinator profile data
const mockCoordinatorProfile = {
  coordinatorId: 1,
  userId: 1,
  fullName: "Nguyễn Thị Điều Phối",
  email: "coordinator@ivan.com",
  phone: "0987654321",
  address: "456 Đường XYZ, Quận 3, TP.HCM",
  dateOfBirth: "1985-05-15",
  profilePicture: null,
  isActive: true,
  organizationId: 1,
  organizationName: "Tổ chức Từ thiện ABC",
  position: "Điều phối viên trưởng",
  experienceYears: 5,
  specializations: ["Quản lý sự kiện", "Điều phối tình nguyện viên", "Đào tạo"],
  totalEventsManaged: 25,
  totalVolunteersManaged: 150,
  rating: 4.8,
  joinedAt: "2020-03-01T00:00:00Z",
  lastActiveAt: "2024-08-14T08:00:00Z",
};

export default function CoordinatorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile] = useState(mockCoordinatorProfile);
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
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-purple-600" />
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
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700"
                  >
                    <Briefcase className="w-3 h-3 mr-1" />
                    Điều phối viên
                  </Badge>
                  {profile.isActive && (
                    <Badge variant="default" className="bg-green-600">
                      Đang hoạt động
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600">
                  {profile.position} tại {profile.organizationName}
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
                    Kinh nghiệm {profile.experienceYears} năm
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {profile.rating}/5.0 ⭐
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
            <TabsTrigger value="tasks">Nhiệm vụ</TabsTrigger>
            <TabsTrigger value="schedule">Lịch trình</TabsTrigger>
            <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
            <TabsTrigger value="team">Nhóm</TabsTrigger>
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
                    Thông tin cơ bản của điều phối viên
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
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Chức vụ</p>
                      <p className="text-gray-600">{profile.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin liên hệ</CardTitle>
                  <CardDescription>
                    Thông tin liên lạc và tổ chức
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
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Tổ chức</p>
                      <p className="text-gray-600">
                        {profile.organizationName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Hoạt động lần cuối</p>
                      <p className="text-gray-600">
                        {new Date(profile.lastActiveAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê hoạt động</CardTitle>
                  <CardDescription>
                    Số liệu về hiệu suất làm việc
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Sự kiện đã quản lý
                    </span>
                    <Badge variant="outline">
                      {profile.totalEventsManaged}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Tình nguyện viên quản lý
                    </span>
                    <Badge variant="outline">
                      {profile.totalVolunteersManaged}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Kinh nghiệm</span>
                    <Badge variant="outline">
                      {profile.experienceYears} năm
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Đánh giá</span>
                    <Badge variant="outline">{profile.rating}/5.0 ⭐</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Specializations */}
              <Card>
                <CardHeader>
                  <CardTitle>Chuyên môn</CardTitle>
                  <CardDescription>
                    Lĩnh vực chuyên môn và kỹ năng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary">
                        <Target className="w-3 h-3 mr-1" />
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Quản lý nhiệm vụ
                </CardTitle>
                <CardDescription>
                  Danh sách và trạng thái các nhiệm vụ được giao
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tính năng đang được phát triển...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Lịch trình làm việc
                </CardTitle>
                <CardDescription>
                  Quản lý lịch trình và ca làm việc
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tính năng đang được phát triển...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Báo cáo hiệu suất
                </CardTitle>
                <CardDescription>
                  Phân tích và đánh giá hiệu suất làm việc
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tính năng đang được phát triển...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Quản lý nhóm
                </CardTitle>
                <CardDescription>
                  Thông tin về nhóm tình nguyện viên được quản lý
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
                    Cấu hình cá nhân và thông báo
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
