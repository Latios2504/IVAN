import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LoadingWithRetry } from "@/components/ui/skeletons";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActionButton } from "@/components/dashboard/ActionButton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import AdminAnalyticsDashboard from "@/components/admin/AdminAnalyticsDashboard";
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  MessageSquare,
  UserCheck,
  BarChart3,
  Settings,
  FileText,
  Bell,
  Shield,
  MessageCircle,
  Bot,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import ChatBot from "@/components/chatbot/ChatBot";

interface AdminStats {
  totalUsers: number;
  totalVolunteers: number;
  totalOrganizations: number;
  totalEvents: number;
  activeEvents: number;
  pendingApprovals: number;
  monthlyGrowth: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();

  // Mock admin stats
  const adminStats = {
    totalUsers: 1250,
    totalOrganizations: 89,
    totalEvents: 342,
    totalVolunteers: 950,
    pendingRequests: 12,
  };
  const statsLoading = false;
  const statsError = null;

  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  const toggleChatBot = () => {
    setIsChatBotOpen(!isChatBotOpen);
  };

  // Chỉ admin mới được sử dụng chatbot
  const isAdmin = user?.role === "admin";

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingWithRetry text="Đang tải bảng điều khiển..." />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-gray-600">{statsError}</p>
        </div>
      </div>
    );
  }

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

      {/* Stats Overview */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="col-span-full text-center py-8">
            <p>Đang tải thống kê...</p>
          </div>
        </div>
      ) : statsError ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="col-span-full text-center py-8">
            <p className="text-red-500">Lỗi: {statsError}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Tổng người dùng"
            value={(adminStats as any)?.totalUsers || 0}
            icon={Users}
            trend={{
              value: `+${
                (adminStats as any)?.monthlyGrowth || 0
              }% so với tháng trước`,
            }}
          />
          <StatsCard
            title="Tình nguyện viên"
            value={(adminStats as any)?.totalVolunteers || 0}
            icon={Users}
            description={`${Math.round(
              (((adminStats as any)?.totalVolunteers || 0) /
                ((adminStats as any)?.totalUsers || 1)) *
                100
            )}% tổng số người dùng`}
          />
          <StatsCard
            title="Tổ chức"
            value={(adminStats as any)?.totalOrganizations || 0}
            icon={Building2}
            description={`${Math.round(
              (((adminStats as any)?.totalOrganizations || 0) /
                ((adminStats as any)?.totalUsers || 1)) *
                100
            )}% tổng số người dùng`}
          />
          <StatsCard
            title="Sự kiện đang diễn ra"
            value={(adminStats as any)?.activeEvents || 0}
            icon={Calendar}
            description={`/${
              (adminStats as any)?.totalEvents || 0
            } tổng số sự kiện`}
          />
        </div>
      )}

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList>
          <TabsTrigger value="management">Quản lý hệ thống</TabsTrigger>
          <TabsTrigger value="analytics">Thống kê</TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle>Quản lý người dùng</CardTitle>
                <CardDescription>
                  Tài khoản, phân quyền và xác thực
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ActionButton to="/admin/users" icon={Users}>
                  Quản lý tài khoản
                </ActionButton>
              </CardContent>
            </Card>

            {/* System Management */}
            <Card>
              <CardHeader>
                <CardTitle>Quản lý hệ thống</CardTitle>
                <CardDescription>
                  Thông báo, báo cáo và nội dung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ActionButton to="/admin/notifications" icon={Bell}>
                  Quản lý thông báo
                </ActionButton>
                <ActionButton to="/admin/support-requests" icon={MessageCircle}>
                  Quản lý yêu cầu hỗ trợ
                </ActionButton>
                <ActionButton to="/admin/ai-instructions" icon={Bot}>
                  Quản lý AI Instructions
                </ActionButton>
                <ActionButton to="/admin/certificate-templates" icon={Award}>
                  Quản lý mẫu chứng chỉ hệ thống
                </ActionButton>
                <ActionButton to="/admin/reports" icon={BarChart3}>
                  Báo cáo hệ thống
                </ActionButton>
                <ActionButton to="/admin/blog" icon={FileText}>
                  Quản lý blog
                </ActionButton>
              </CardContent>
            </Card>

            {/* Content Management */}
            <Card>
              <CardHeader>
                <CardTitle>Quản lý nội dung</CardTitle>
                <CardDescription>
                  Bài tuyển dụng và hợp tác đối tác
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ActionButton to="/admin/job-posts" icon={UserCheck}>
                  Bài tuyển dụng
                </ActionButton>
                <ActionButton to="/admin/partnerships" icon={Shield}>
                  Hợp tác đối tác
                </ActionButton>
              </CardContent>
            </Card>
          </div>

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
                  <StatusBadge variant="active">Hoạt động tốt</StatusBadge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Server</span>
                  <StatusBadge variant="active">Hoạt động tốt</StatusBadge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Service</span>
                  <StatusBadge variant="warning">Chậm</StatusBadge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">File Storage</span>
                  <StatusBadge variant="active">Hoạt động tốt</StatusBadge>
                </div>
              </div>
              <ActionButton
                to="/admin/system"
                icon={Settings}
                variant="outline"
              >
                Cài đặt hệ thống
              </ActionButton>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AdminAnalyticsDashboard />
        </TabsContent>
      </Tabs>

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
