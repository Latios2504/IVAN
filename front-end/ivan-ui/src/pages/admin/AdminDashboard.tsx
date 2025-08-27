import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminAnalyticsDashboard from "@/components/admin/AdminAnalyticsDashboard";
import { Users, Shield, MessageCircle, Bot, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-cyan-950/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
            Trang quản trị
          </h1>
          <p className="text-emerald-700/80 dark:text-emerald-300/80 text-lg">
            Quản lý toàn bộ hệ thống tình nguyện và giám sát hoạt động
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg backdrop-blur-sm">
            <TabsTrigger
              value="management"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Quản lý
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Phân tích
            </TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User Management */}
              <Card className="bg-gradient-to-br from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-emerald-200/50 dark:border-emerald-800/50">
                  <CardTitle className="text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Quản lý người dùng
                  </CardTitle>
                  <CardDescription className="text-emerald-700/80 dark:text-emerald-300/80">
                    Tài khoản, phân quyền và xác thực
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link to="/admin/users" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Quản lý tài khoản
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* System Management */}
              <Card className="bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-blue-200/50 dark:border-blue-800/50">
                  <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Quản lý hệ thống
                  </CardTitle>
                  <CardDescription className="text-blue-700/80 dark:text-blue-300/80">
                    Kiểm duyệt, thông báo và hỗ trợ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/admin/moderation"
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Kiểm duyệt các thành phần
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/admin/support-requests"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Yêu cầu hỗ trợ
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Link
                      to="/admin/ai-instructions"
                      className="flex items-center gap-2"
                    >
                      <Bot className="w-4 h-4" />
                      Hướng dẫn AI
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AdminAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
