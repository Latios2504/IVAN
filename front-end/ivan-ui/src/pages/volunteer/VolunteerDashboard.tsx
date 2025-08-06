import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  TrendingUp,
  Heart,
  Star,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Filter,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import type { VolunteerStats } from "@/services/dashboardService";

interface VolunteerActivity {
  id: string;
  title: string;
  organization: string;
  date: string;
  duration: number;
  location: string;
  status: "completed" | "upcoming" | "cancelled";
  points: number;
  description: string;
}

export default function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats, loading, error } = useDashboardStats();
  const volunteerStats = stats as VolunteerStats;

  const activities: VolunteerActivity[] = [
    {
      id: "1",
      title: "Hỗ trợ người già tại viện dưỡng lão",
      organization: "Hội Chữ thập đỏ Việt Nam",
      date: "2024-01-20",
      duration: 4,
      location: "Hà Nội",
      status: "completed",
      points: 80,
      description: "Chăm sóc và trò chuyện với người cao tuổi",
    },
    {
      id: "2",
      title: "Dạy học cho trẻ em vùng cao",
      organization: "Quỹ Bảo vệ Trẻ em Việt Nam",
      date: "2024-02-15",
      duration: 8,
      location: "Lào Cai",
      status: "upcoming",
      points: 120,
      description: "Giảng dạy tiếng Anh và toán học cơ bản",
    },
    {
      id: "3",
      title: "Dọn dẹp môi trường bãi biển",
      organization: "Tổ chức Môi trường Xanh",
      date: "2024-01-10",
      duration: 6,
      location: "Đà Nẵng",
      status: "completed",
      points: 100,
      description: "Thu gom rác thải và làm sạch bãi biển",
    },
  ];

  const getStatusBadge = (status: VolunteerActivity["status"]) => {
    const statusConfig = {
      completed: {
        label: "Hoàn thành",
        variant: "default" as const,
        icon: CheckCircle,
      },
      upcoming: {
        label: "Sắp tới",
        variant: "secondary" as const,
        icon: Clock,
      },
      cancelled: {
        label: "Đã hủy",
        variant: "destructive" as const,
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getRankColor = (rank: string) => {
    if (rank.includes("Vàng")) return "text-yellow-600";
    if (rank.includes("Bạc")) return "text-gray-600";
    if (rank.includes("Đồng")) return "text-orange-600";
    return "text-blue-600";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Bảng điều khiển Tình nguyện viên
          </h1>
          <p className="text-muted-foreground">
            Theo dõi hoạt động tình nguyện và thành tích của bạn
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Đăng ký hoạt động mới
        </Button>
      </div>

      {/* Stats Cards */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          Không thể tải thông tin thống kê: {error?.message || error?.toString() || 'Đã xảy ra lỗi'}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giờ tình nguyện
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : volunteerStats?.hoursVolunteered || 0}
            </div>
            <p className="text-xs text-muted-foreground">giờ đã đóng góp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hoạt động tham gia
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : volunteerStats?.eventsJoined || 0}
            </div>
            <p className="text-xs text-muted-foreground">sự kiện đã tham gia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chứng chỉ đạt được
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : volunteerStats?.certificatesEarned || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              chứng chỉ hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-yellow-600">
              {loading ? "..." : `${volunteerStats?.currentRating || 0}/5`}
            </div>
            <p className="text-xs text-muted-foreground">
              điểm đánh giá trung bình
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="activities">Hoạt động</TabsTrigger>
          <TabsTrigger value="achievements">Thành tích</TabsTrigger>
          <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.slice(0, 3).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.organization} •{" "}
                        {new Date(activity.date).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    {getStatusBadge(activity.status)}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thống kê tháng này</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Giờ tình nguyện</span>
                    <span className="font-medium">12 giờ</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hoạt động mới</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Điểm kiếm được</span>
                    <span className="font-medium">200 điểm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Xếp hạng</span>
                    <span className="font-medium">#15 trong khu vực</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hoạt động sắp tới</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities
                  .filter((activity) => activity.status === "upcoming")
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{activity.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {activity.organization}
                          </p>
                        </div>
                        {getStatusBadge(activity.status)}
                      </div>

                      <p className="text-sm">{activity.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {new Date(activity.date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{activity.duration} giờ</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{activity.location}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">
                            {activity.points} điểm
                          </span>
                        </div>
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lịch sử hoạt động</h2>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activity.organization}
                        </p>
                      </div>
                      {getStatusBadge(activity.status)}
                    </div>

                    <p className="text-sm">{activity.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {new Date(activity.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{activity.duration} giờ</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{activity.points} điểm</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thành tích và huy hiệu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Award className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
                  <h3 className="font-semibold">Tình nguyện viên Bạc</h3>
                  <p className="text-sm text-muted-foreground">
                    Đạt được 1000+ điểm
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Heart className="w-12 h-12 mx-auto mb-2 text-red-500" />
                  <h3 className="font-semibold">Người giúp đỡ</h3>
                  <p className="text-sm text-muted-foreground">
                    Tham gia 20+ hoạt động
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg opacity-50">
                  <Star className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <h3 className="font-semibold">Tình nguyện viên Vàng</h3>
                  <p className="text-sm text-muted-foreground">
                    Cần 1500+ điểm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tính năng quản lý hồ sơ đang được phát triển...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
