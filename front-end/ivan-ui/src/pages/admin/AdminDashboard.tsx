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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 p-6 bg-muted/30 rounded-2xl border border-border shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Trang quản trị
          </h1>
          <p className="text-muted-foreground text-lg">
            Quản lý toàn bộ hệ thống tình nguyện và giám sát hoạt động
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30 border border-border shadow-lg">
            <TabsTrigger
              value="management"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
            >
              Quản lý
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
            >
              Phân tích
            </TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User Management */}
              <Card className="bg-muted/30 border border-border shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Quản lý người dùng
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
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
              <Card className="bg-muted/30 border border-border shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Quản lý hệ thống
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
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
