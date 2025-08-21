import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VolunteerAnalyticsDashboard } from "@/components/volunteer/VolunteerAnalyticsDashboard";
import {
  Calendar,
  Users,
  Award,
  BarChart3,
  Settings,
  UserPlus,
  HeartHandshake,
  MessageSquare,
  Clock,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function VolunteerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-blue-950/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-violet-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-violet-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mb-2">
            Bảng điều khiển Tình nguyện viên
          </h1>
          <p className="text-blue-700/80 dark:text-blue-300/80 text-lg">
            Theo dõi hoạt động tình nguyện và thành tích của bạn
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Event & Registration Management */}
              <Card className="bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-blue-200/50 dark:border-blue-800/50">
                  <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Sự kiện & Đăng ký
                  </CardTitle>
                  <CardDescription className="text-blue-700/80 dark:text-blue-300/80">
                    Quản lý đăng ký sự kiện và lịch trình
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/volunteer/my-registrations"
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Đăng ký của tôi
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/volunteer/schedule"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Lịch trình của tôi
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link to="/events" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Khám phá sự kiện
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Tasks & Activities */}
              <Card className="bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border border-green-200/50 dark:border-green-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-green-200/50 dark:border-green-800/50">
                  <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Nhiệm vụ & Hoạt động
                  </CardTitle>
                  <CardDescription className="text-green-700/80 dark:text-green-300/80">
                    Theo dõi nhiệm vụ và hoạt động tình nguyện
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/volunteer/my-tasks"
                      className="flex items-center gap-2"
                    >
                      <Target className="w-4 h-4" />
                      Nhiệm vụ của tôi
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/volunteer/schedule"
                      className="flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Lịch làm việc
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Certificates & Achievements */}
              <Card className="bg-gradient-to-br from-orange-50/80 via-amber-50/80 to-yellow-50/80 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 border border-orange-200/50 dark:border-orange-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-orange-200/50 dark:border-orange-800/50">
                  <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Chứng chỉ & Thành tích
                  </CardTitle>
                  <CardDescription className="text-orange-700/80 dark:text-orange-300/80">
                    Xem chứng chỉ và thành tích đạt được
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/volunteer/certificates"
                      className="flex items-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      Chứng chỉ của tôi
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Community & Connection */}
              <Card className="bg-gradient-to-br from-cyan-50/80 via-sky-50/80 to-blue-50/80 dark:from-cyan-950/30 dark:via-sky-950/30 dark:to-blue-950/30 border border-cyan-200/50 dark:border-cyan-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-cyan-200/50 dark:border-cyan-800/50">
                  <CardTitle className="text-cyan-800 dark:text-cyan-200 flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5" />
                    Cộng đồng & Kết nối
                  </CardTitle>
                  <CardDescription className="text-cyan-700/80 dark:text-cyan-300/80">
                    Kết nối với cộng đồng tình nguyện viên
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link to="/volunteers" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Cộng đồng tình nguyện viên
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/organizations"
                      className="flex items-center gap-2"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      Tổ chức tình nguyện
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <VolunteerAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
