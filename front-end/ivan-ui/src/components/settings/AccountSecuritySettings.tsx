import { useState } from "react";
import type { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Smartphone, 
  Key, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { toast } from "sonner";

interface AccountSecuritySettingsProps {
  user: User;
}

// Sample security data - will be replaced with API calls
interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  loginDevices: LoginDevice[];
  securityScore: number;
  recentActivity: SecurityActivity[];
}

interface LoginDevice {
  id: string;
  deviceName: string;
  location: string;
  lastUsed: string;
  isCurrentDevice: boolean;
  browser: string;
  os: string;
}

interface SecurityActivity {
  id: string;
  action: string;
  timestamp: string;
  location: string;
  success: boolean;
}

const mockSecurityData: SecuritySettings = {
  twoFactorEnabled: false,
  lastPasswordChange: "2024-05-15T10:30:00Z",
  securityScore: 75,
  loginDevices: [
    {
      id: "1",
      deviceName: "Chrome trên Windows",
      location: "Hà Nội, Việt Nam",
      lastUsed: "2024-06-20T08:30:00Z",
      isCurrentDevice: true,
      browser: "Chrome 126",
      os: "Windows 11"
    },
    {
      id: "2", 
      deviceName: "Firefox trên MacOS",
      location: "TP. Hồ Chí Minh, Việt Nam",
      lastUsed: "2024-06-18T14:20:00Z",
      isCurrentDevice: false,
      browser: "Firefox 127",
      os: "macOS Sonoma"
    }
  ],
  recentActivity: [
    {
      id: "1",
      action: "Đăng nhập thành công",
      timestamp: "2024-06-20T08:30:00Z",
      location: "Hà Nội, Việt Nam",
      success: true
    },
    {
      id: "2",
      action: "Đổi mật khẩu",
      timestamp: "2024-06-15T16:45:00Z",
      location: "Hà Nội, Việt Nam",
      success: true
    },
    {
      id: "3",
      action: "Thử đăng nhập không thành công",
      timestamp: "2024-06-14T22:15:00Z",
      location: "Unknown Location",
      success: false
    }
  ]
};

export function AccountSecuritySettings({ user }: AccountSecuritySettingsProps) {
  const [securityData, setSecurityData] = useState<SecuritySettings>(mockSecurityData);
  const [isLoading, setIsLoading] = useState(false);

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getSecurityScoreLabel = (score: number) => {
    if (score >= 80) return "Tốt";
    if (score >= 60) return "Trung bình";
    return "Yếu";
  };

  const handleToggle2FA = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to enable/disable 2FA
      // await securityService.toggle2FA(user.id, !securityData.twoFactorEnabled);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSecurityData(prev => ({
        ...prev,
        twoFactorEnabled: !prev.twoFactorEnabled,
        securityScore: !prev.twoFactorEnabled ? 
          Math.min(prev.securityScore + 20, 100) : 
          Math.max(prev.securityScore - 20, 0)
      }));
      
      toast.success(
        securityData.twoFactorEnabled 
          ? "Đã tắt xác thực hai yếu tố" 
          : "Đã bật xác thực hai yếu tố"
      );
    } catch (error) {
      toast.error("Không thể thay đổi cài đặt bảo mật. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutDevice = async (deviceId: string) => {
    try {
      // TODO: API call to logout specific device
      // await securityService.logoutDevice(user.id, deviceId);
      
      setSecurityData(prev => ({
        ...prev,
        loginDevices: prev.loginDevices.filter(device => device.id !== deviceId)
      }));
      
      toast.success("Đã đăng xuất khỏi thiết bị");
    } catch (error) {
      toast.error("Không thể đăng xuất khỏi thiết bị. Vui lòng thử lại.");
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      // TODO: API call to logout all devices
      // await securityService.logoutAllDevices(user.id);
      
      setSecurityData(prev => ({
        ...prev,
        loginDevices: prev.loginDevices.filter(device => device.isCurrentDevice)
      }));
      
      toast.success("Đã đăng xuất khỏi tất cả thiết bị khác");
    } catch (error) {
      toast.error("Không thể đăng xuất khỏi các thiết bị. Vui lòng thử lại.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Điểm bảo mật tài khoản
          </CardTitle>
          <CardDescription>
            Đánh giá tổng quan về mức độ bảo mật của tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-2xl font-bold ${getSecurityScoreColor(securityData.securityScore)}`}>
                  {securityData.securityScore}/100
                </span>
                <Badge 
                  variant={securityData.securityScore >= 80 ? "default" : "secondary"}
                  className={securityData.securityScore >= 80 ? "bg-green-100 text-green-800" : ""}
                >
                  {getSecurityScoreLabel(securityData.securityScore)}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    securityData.securityScore >= 80 ? 'bg-green-500' :
                    securityData.securityScore >= 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${securityData.securityScore}%` }}
                />
              </div>
            </div>
            {securityData.securityScore >= 80 ? (
              <ShieldCheck className="h-8 w-8 text-green-500" />
            ) : (
              <ShieldAlert className="h-8 w-8 text-orange-500" />
            )}
          </div>
          
          {securityData.securityScore < 80 && (
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Để tăng điểm bảo mật, hãy bật xác thực hai yếu tố và đảm bảo mật khẩu mạnh.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Xác thực hai yếu tố (2FA)
          </CardTitle>
          <CardDescription>
            Thêm lớp bảo mật bổ sung cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {securityData.twoFactorEnabled ? "Đã bật" : "Chưa bật"}
                </span>
                {securityData.twoFactorEnabled && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-sm text-gray-600">
                {securityData.twoFactorEnabled 
                  ? "Tài khoản được bảo vệ bằng xác thực hai yếu tố"
                  : "Bảo vệ tài khoản tốt hơn bằng cách bật xác thực hai yếu tố"
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="2fa-toggle" className="sr-only">
                Bật/tắt xác thực hai yếu tố
              </Label>
              <Switch
                id="2fa-toggle"
                checked={securityData.twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
                disabled={isLoading}
              />
            </div>
          </div>
          
          {!securityData.twoFactorEnabled && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Khuyến nghị bật xác thực hai yếu tố để tăng cường bảo mật tài khoản.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Password Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Thông tin mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              Lần đổi mật khẩu cuối: {" "}
              {new Date(securityData.lastPasswordChange).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Nên thay đổi mật khẩu định kỳ 3-6 tháng một lần để đảm bảo bảo mật.
          </p>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Thiết bị đang đăng nhập</CardTitle>
          <CardDescription>
            Quản lý các thiết bị có quyền truy cập vào tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityData.loginDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{device.deviceName}</span>
                    {device.isCurrentDevice && (
                      <Badge variant="default" className="text-xs">
                        Thiết bị hiện tại
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>{device.browser} • {device.os}</p>
                    <p>{device.location}</p>
                    <p>
                      Lần cuối: {new Date(device.lastUsed).toLocaleDateString('vi-VN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                {!device.isCurrentDevice && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLogoutDevice(device.id)}
                  >
                    Đăng xuất
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {securityData.loginDevices.length > 1 && (
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleLogoutAllDevices}
                className="w-full"
              >
                Đăng xuất khỏi tất cả thiết bị khác
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Security Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động bảo mật gần đây</CardTitle>
          <CardDescription>
            Theo dõi các hoạt động liên quan đến bảo mật tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-2">
                <div className={`w-2 h-2 rounded-full ${
                  activity.success ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-600">
                    {activity.location} • {new Date(activity.timestamp).toLocaleDateString('vi-VN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {activity.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
