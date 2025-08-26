import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoordinatorAnalyticsDashboard } from "@/components/coordinator/CoordinatorAnalyticsDashboard";
import {
  Calendar,
  Users,
  Award,
  HeartHandshake,
  MessageSquare,
  ClipboardList,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CoordinatorDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-blue-950/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-violet-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-violet-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mb-2">
            Trang quản trị
          </h1>
          <p className="text-blue-700/80 dark:text-blue-300/80 text-lg">
            Quản lý lịch trình và điều phối tình nguyện viên
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="management">Quản lý</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Schedule & Event Management */}
              <Card className="bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-blue-200/50 dark:border-blue-800/50">
                  <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Quản lý lịch trình & Sự kiện
                  </CardTitle>
                  <CardDescription className="text-blue-700/80 dark:text-blue-300/80">
                    Điều phối lịch trình và quản lý sự kiện
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/coordinator/schedule"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Quản lý lịch trình tình nguyện viên
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Task Management */}
              <Card className="bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border border-green-200/50 dark:border-green-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-green-200/50 dark:border-green-800/50">
                  <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    Quản lý nhiệm vụ
                  </CardTitle>
                  <CardDescription className="text-green-700/80 dark:text-green-300/80">
                    Theo dõi và quản lý các nhiệm vụ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/coordinator/my-tasks"
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Nhiệm vụ của tôi
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Certificates & Recognition */}
              <Card className="bg-gradient-to-br from-orange-50/80 via-amber-50/80 to-yellow-50/80 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 border border-orange-200/50 dark:border-orange-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-orange-200/50 dark:border-orange-800/50">
                  <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Chứng chỉ & Thành tích
                  </CardTitle>
                  <CardDescription className="text-orange-700/80 dark:text-orange-300/80">
                    Xem chứng chỉ và theo dõi thành tích
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/organization/certificates"
                      className="flex items-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      Xem chứng chỉ sự kiện
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/organization/event-feedback"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Phản hồi sự kiện
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Reports Management */}
              <Card className="bg-gradient-to-br from-violet-50/80 via-purple-50/80 to-pink-50/80 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border border-violet-200/50 dark:border-violet-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-violet-200/50 dark:border-violet-800/50">
                  <CardTitle className="text-violet-800 dark:text-violet-200 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Quản lý báo cáo
                  </CardTitle>
                  <CardDescription className="text-violet-700/80 dark:text-violet-300/80">
                    Tạo và quản lý báo cáo sự kiện
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/coordinator/reports/create"
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Tạo báo cáo sự kiện
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Community & Support */}
              <Card className="bg-gradient-to-br from-cyan-50/80 via-sky-50/80 to-blue-50/80 dark:from-cyan-950/30 dark:via-sky-950/30 dark:to-blue-950/30 border border-cyan-200/50 dark:border-cyan-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-cyan-200/50 dark:border-cyan-800/50">
                  <CardTitle className="text-cyan-800 dark:text-cyan-200 flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5" />
                    Cộng đồng & Kết nối
                  </CardTitle>
                  <CardDescription className="text-cyan-700/80 dark:text-cyan-300/80">
                    Kết nối với cộng đồng tình nguyện
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
            <CoordinatorAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
