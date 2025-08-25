import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrganizationAnalyticsDashboard from "@/components/organization/OrganizationAnalyticsDashboard";
import { Calendar, Users, Award, BarChart3, Settings, UserPlus, HeartHandshake, MessageSquare, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrganizationDashboard() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-blue-950/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-violet-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-violet-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mb-2">
            Quản lý tổ chức
          </h1>
          <p className="text-blue-700/80 dark:text-blue-300/80 text-lg">
            Điều hành hoạt động tình nguyện và quản lý tình nguyện viên
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-indigo-50/80 dark:from-purple-950/30 dark:via-violet-950/30 dark:to-indigo-950/30 border border-purple-200/50 dark:border-purple-800/50 shadow-lg backdrop-blur-sm">
            <TabsTrigger value="management" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-lg">Management</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg">Analytics</TabsTrigger>
          </TabsList>

        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Event Management */}
            <Card className="bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-blue-200/50 dark:border-blue-800/50">
                <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Quản lý sự kiện
                </CardTitle>
                <CardDescription className="text-blue-700/80 dark:text-blue-300/80">
                  Tạo và quản lý các sự kiện tình nguyện
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/organization/events" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Quản lý sự kiện
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/organization/event-registrations" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Đăng ký sự kiện
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/organization/event-feedback" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Phản hồi sự kiện
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/organization/feedback" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Quản lý phản hồi
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Coordinator Management */}
            <Card className="bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border border-green-200/50 dark:border-green-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-green-200/50 dark:border-green-800/50">
                <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Quản lý Coordinators
                </CardTitle>
                <CardDescription className="text-green-700/80 dark:text-green-300/80">
                  Điều phối và quản lý coordinator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/organization/volunteer-coordinators" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Quản lý Coordinators
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/organization/coordinator-schedule" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Lịch trình Coordinators
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/organization/coordinator-tasks" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Nhiệm vụ Coordinators
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Certificate Management */}
            <Card className="bg-gradient-to-br from-orange-50/80 via-amber-50/80 to-yellow-50/80 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 border border-orange-200/50 dark:border-orange-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-orange-200/50 dark:border-orange-800/50">
                <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Quản lý chứng chỉ
                </CardTitle>
                <CardDescription className="text-orange-700/80 dark:text-orange-300/80">
                  Cấp và quản lý chứng chỉ tình nguyện
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/organization/certificates" className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Quản lý chứng chỉ
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/organization/certificate-templates" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Mẫu chứng chỉ
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Reports & Analytics */}
            <Card className="bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-rose-50/80 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 border border-purple-200/50 dark:border-purple-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-purple-200/50 dark:border-purple-800/50">
                <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Báo cáo & Thống kê
                </CardTitle>
                <CardDescription className="text-purple-700/80 dark:text-purple-300/80">
                  Xem báo cáo và thống kê hoạt động
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/organization/reports" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Xem báo cáo
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/volunteers" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Danh sách tình nguyện viên
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Partnership & Support */}
            <Card className="bg-gradient-to-br from-cyan-50/80 via-sky-50/80 to-blue-50/80 dark:from-cyan-950/30 dark:via-sky-950/30 dark:to-blue-950/30 border border-cyan-200/50 dark:border-cyan-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-cyan-200/50 dark:border-cyan-800/50">
                <CardTitle className="text-cyan-800 dark:text-cyan-200 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5" />
                  Hợp tác & Hỗ trợ
                </CardTitle>
                <CardDescription className="text-cyan-700/80 dark:text-cyan-300/80">
                  Quản lý đối tác và yêu cầu hỗ trợ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/organization/partners" className="flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4" />
                    Hợp tác đối tác
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/organization/coordinators" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Yêu cầu Coordinator
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <OrganizationAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
