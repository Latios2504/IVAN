import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/dashboard/ActionButton";
import AdminAnalyticsDashboard from "@/components/admin/AdminAnalyticsDashboard";
import {
  Users,
  UserCheck,
  BarChart3,
  FileText,
  Bell,
  Shield,
  MessageCircle,
  Bot,
  Award,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
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

      {/* Analytics Dashboard Section */}
      <div className="mb-8">
        <AdminAnalyticsDashboard />
      </div>

      {/* Management Section */}
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Quản lý hệ thống
          </h2>
          <p className="text-gray-600">
            Các công cụ quản lý và điều hành hệ thống IVAN
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <ActionButton to="/admin/moderation" icon={CheckCircle}>
                Kiểm duyệt sự kiện
              </ActionButton>
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
              <ActionButton to="/admin/reports" icon={BarChart3}>
                Báo cáo hệ thống
              </ActionButton>
              <ActionButton to="/admin/blog" icon={FileText}>
                Quản lý blog
              </ActionButton>
            </CardContent>
          </Card>
        </div>
      </div>

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
