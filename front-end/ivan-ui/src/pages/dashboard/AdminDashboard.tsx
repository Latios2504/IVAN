import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
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
import { useState } from "react";
import ChatBot from "@/components/chatbot/ChatBot";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  const toggleChatBot = () => {
    setIsChatBotOpen(!isChatBotOpen);
  };

  // Chỉ admin mới được sử dụng chatbot
  const isAdmin = user?.role === "admin";

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
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng người dùng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+127 tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổ chức</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+8 tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đối tác</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+5 tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn chờ duyệt</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Cần xử lý</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>Quản lý người dùng</CardTitle>
            <CardDescription>Tài khoản, phân quyền và xác thực</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link to="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Quản lý tài khoản
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/admin/organizations">
                <Building2 className="mr-2 h-4 w-4" />
                Quản lý tổ chức
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/admin/partners">
                <Briefcase className="mr-2 h-4 w-4" />
                Quản lý đối tác
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* System Management */}
        <Card>
          <CardHeader>
            <CardTitle>Quản lý hệ thống</CardTitle>
            <CardDescription>Thông báo, báo cáo và nội dung</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link to="/admin/notifications">
                <Bell className="mr-2 h-4 w-4" />
                Quản lý thông báo
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/admin/ai-instructions">
                <Bot className="mr-2 h-4 w-4" />
                Quản lý AI Instructions
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/admin/reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                Báo cáo hệ thống
              </Link>
            </Button>            <Button className="w-full justify-start" asChild>
              <Link to="/admin/blog">
                <FileText className="mr-2 h-4 w-4" />
                Quản lý blog
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/support">
                <MessageCircle className="mr-2 h-4 w-4" />
                Quản lý hỗ trợ
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Support & Content */}
        <Card>
          <CardHeader>
            <CardTitle>Hỗ trợ & Nội dung</CardTitle>
            <CardDescription>Đơn hỗ trợ và quản lý nội dung</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link to="/admin/support">
                <MessageSquare className="mr-2 h-4 w-4" />
                Đơn hỗ trợ
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/admin/job-posts">
                <UserCheck className="mr-2 h-4 w-4" />
                Bài tuyển dụng
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/admin/partnerships">
                <Shield className="mr-2 h-4 w-4" />
                Hợp tác đối tác
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các sự kiện và thay đổi quan trọng trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Tổ chức mới đăng ký</h4>
                    <p className="text-sm text-gray-600">
                      Quỹ Tương Lai Xanh - 2 giờ trước
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Mới</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Coordinator được tạo</h4>
                    <p className="text-sm text-gray-600">
                      Nguyễn Thị Mai - Quỹ Tấm Lòng Việt
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Hoàn thành
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h4 className="font-medium">Đơn hỗ trợ mới</h4>
                    <p className="text-sm text-gray-600">
                      Yêu cầu reset password - 1 ngày trước
                    </p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Chờ xử lý
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/activities">Xem tất cả hoạt động</Link>
            </Button>
          </CardContent>
        </Card>

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
                <Badge className="bg-green-100 text-green-800">
                  Hoạt động tốt
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">API Server</span>
                <Badge className="bg-green-100 text-green-800">
                  Hoạt động tốt
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Email Service</span>
                <Badge className="bg-yellow-100 text-yellow-800">Chậm</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">File Storage</span>
                <Badge className="bg-green-100 text-green-800">
                  Hoạt động tốt
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/system">
                <Settings className="mr-2 h-4 w-4" />
                Cài đặt hệ thống
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>{" "}
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
