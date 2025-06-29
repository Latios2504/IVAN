import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Bell, Key, AlertTriangle } from "lucide-react";
import { PersonalInfoForm } from "@/components/settings/PersonalInfoForm";
import { PasswordChangeForm } from "@/components/settings/PasswordChangeForm";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AccountSecuritySettings } from "@/components/settings/AccountSecuritySettings";
import { AccountDeactivateDialog } from "@/components/settings/AccountDeactivateDialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

/**
 * Account Settings Page - Manage user account information and preferences
 * Implements FE-01: Authentication and FE-20: Manage User Account
 */
export default function AccountSettingsPage() {
  const { user, isLoading } = useAuth();
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Đang tải thông tin tài khoản..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không thể tải thông tin tài khoản.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <User className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Quản lý tài khoản</h1>
        </div>
        <p className="text-gray-600">
          Quản lý thông tin cá nhân, bảo mật và cài đặt tài khoản của bạn
        </p>
      </div>

      {/* Account Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Trạng thái tài khoản
            <Badge variant={user.isActive ? "default" : "destructive"}>
              {user.isActive ? "Hoạt động" : "Bị vô hiệu hóa"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                Email: {user.isEmailVerified ? "Đã xác thực" : "Chưa xác thực"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Vai trò: {getRoleDisplayName(user.role)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Bảo mật
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Tài khoản
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Cập nhật thông tin cá nhân và thông tin liên hệ của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>
                  Đảm bảo tài khoản của bạn an toàn bằng cách sử dụng mật khẩu mạnh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordChangeForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cài đặt bảo mật</CardTitle>
                <CardDescription>
                  Quản lý các cài đặt bảo mật và xác thực tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AccountSecuritySettings user={user} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>
                Chọn loại thông báo bạn muốn nhận và cách thức nhận thông báo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý tài khoản</CardTitle>
              <CardDescription>
                Các tùy chọn nâng cao cho tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Xuất dữ liệu</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Tải xuống bản sao dữ liệu tài khoản của bạn
                </p>
                <Button variant="outline">
                  Xuất dữ liệu tài khoản
                </Button>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2 text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Vùng nguy hiểm
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Vô hiệu hóa tài khoản sẽ hạn chế quyền truy cập của bạn vào hệ thống
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeactivateDialogOpen(true)}
                >
                  Vô hiệu hóa tài khoản
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Account Deactivation Dialog */}
      <AccountDeactivateDialog
        isOpen={isDeactivateDialogOpen}
        onClose={() => setIsDeactivateDialogOpen(false)}
        user={user}
      />
    </div>
  );
}

// Helper function to get role display name
function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    volunteer: "Tình nguyện viên",
    organization: "Tổ chức",
    coordinator: "Điều phối viên",
    partner: "Đối tác",
    admin: "Quản trị viên",
  };
  return roleNames[role] || role;
}
