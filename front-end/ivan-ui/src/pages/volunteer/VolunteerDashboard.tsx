import { useState } from "react";
import { Link } from "react-router-dom";
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
  ClipboardList,
} from "lucide-react";
import { VolunteerAnalyticsDashboard } from "@/components/volunteer/VolunteerAnalyticsDashboard";

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

  // Mock states
  const loading = false;
  const error = null;

  // Mock volunteer stats
  const volunteerStats = {
    hoursVolunteered: 156,
    eventsJoined: 23,
    totalPoints: 1850,
    certificatesEarned: 5,
    currentRating: 4.8,
  };

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
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 p-6 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Bảng điều khiển Tình nguyện viên
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Theo dõi hoạt động tình nguyện và thành tích của bạn
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
          Không thể tải thông tin thống kê: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Tổng giờ tình nguyện
            </CardTitle>
            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {loading ? "..." : volunteerStats?.hoursVolunteered || 0}
            </div>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">giờ đã đóng góp</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200/50 dark:border-rose-800/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-300">
              Hoạt động tham gia
            </CardTitle>
            <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              {loading ? "..." : volunteerStats?.eventsJoined || 0}
            </div>
            <p className="text-xs text-rose-600/70 dark:text-rose-400/70">sự kiện đã tham gia</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Chứng chỉ đạt được
            </CardTitle>
            <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {loading ? "..." : volunteerStats?.certificatesEarned || 0}
            </div>
            <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
              chứng chỉ hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200/50 dark:border-violet-800/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-700 dark:text-violet-300">Đánh giá</CardTitle>
            <Award className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {loading ? "..." : `${volunteerStats?.currentRating || 0}/5`}
            </div>
            <p className="text-xs text-violet-600/70 dark:text-violet-400/70">
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
        <TabsList className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 border border-slate-200 dark:border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50 transition-all duration-300">Tổng quan</TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-950/50 dark:hover:to-teal-950/50 transition-all duration-300">Hoạt động</TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-950/50 dark:hover:to-orange-950/50 transition-all duration-300">Thành tích</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/50 dark:hover:to-purple-950/50 transition-all duration-300">Phân tích</TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 dark:hover:from-rose-950/50 dark:hover:to-pink-950/50 transition-all duration-300">Hồ sơ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-300">Hoạt động gần đây</CardTitle>
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

            <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-emerald-700 dark:text-emerald-300">Thống kê tháng này</CardTitle>
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

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200/50 dark:border-violet-800/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-violet-700 dark:text-violet-300">Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link
                  to="/volunteer/certificates"
                  className="flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  Xem chứng chỉ của tôi
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-300">
                <Link
                  to="/volunteer/schedule"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Xem lịch trình của tôi
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all duration-300">
                <Link
                  to="/volunteer/my-tasks"
                  className="flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" />
                  Nhiệm vụ của tôi
                </Link>
              </Button>
              <Button variant="outline" className="w-full bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/50 dark:hover:to-purple-900/50 transition-all duration-300">
                <Eye className="w-4 h-4 mr-2" />
                Tìm kiếm hoạt động mới
              </Button>
              <Button variant="outline" className="w-full bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:from-rose-100 hover:to-pink-100 dark:hover:from-rose-900/50 dark:hover:to-pink-900/50 transition-all duration-300">
                <Filter className="w-4 h-4 mr-2" />
                Lọc hoạt động phù hợp
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200/50 dark:border-cyan-800/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-cyan-700 dark:text-cyan-300">Hoạt động sắp tới</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities
                  .filter((activity) => activity.status === "upcoming")
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="border border-cyan-200/50 dark:border-cyan-800/50 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-lg p-4 space-y-3 hover:shadow-md transition-all duration-300"
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
                        <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
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
          <div className="flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
            <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">Lịch sử hoạt động</h2>
            <Button variant="outline" className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:from-emerald-200 hover:to-teal-200 dark:hover:from-emerald-800/50 dark:hover:to-teal-800/50 transition-all duration-300">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>

          <Card className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950/30 dark:to-gray-950/30 border-slate-200/50 dark:border-slate-800/50">
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="border border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-900/50 dark:to-slate-950/50 rounded-lg p-4 space-y-3 hover:shadow-md transition-all duration-300"
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
          <Card className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-amber-700 dark:text-amber-300">Thành tích và huy hiệu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-lg hover:shadow-md transition-all duration-300">
                  <Award className="w-12 h-12 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="font-semibold text-yellow-700 dark:text-yellow-300">Tình nguyện viên Bạc</h3>
                  <p className="text-sm text-yellow-600/70 dark:text-yellow-400/70">
                    Đạt được 1000+ điểm
                  </p>
                </div>
                <div className="text-center p-4 border border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/30 dark:to-rose-950/30 rounded-lg hover:shadow-md transition-all duration-300">
                  <Heart className="w-12 h-12 mx-auto mb-2 text-red-600 dark:text-red-400" />
                  <h3 className="font-semibold text-red-700 dark:text-red-300">Người giúp đỡ</h3>
                  <p className="text-sm text-red-600/70 dark:text-red-400/70">
                    Tham gia 20+ hoạt động
                  </p>
                </div>
                <div className="text-center p-4 border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950/30 dark:to-slate-950/30 rounded-lg opacity-60 hover:opacity-80 transition-all duration-300">
                  <Star className="w-12 h-12 mx-auto mb-2 text-gray-500 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-600 dark:text-gray-400">Tình nguyện viên Vàng</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Cần 1500+ điểm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <VolunteerAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card className="bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200/50 dark:border-rose-800/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-rose-700 dark:text-rose-300">Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-rose-600/70 dark:text-rose-400/70">
                Tính năng quản lý hồ sơ đang được phát triển...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
