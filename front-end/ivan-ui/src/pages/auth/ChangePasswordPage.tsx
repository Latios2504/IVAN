import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  // Helper function to get role-specific dashboard URL
  const getDashboardUrl = () => {
    if (!user) return "/";

    switch (user.role) {
      case "admin":
        return "/admin";
      case "organization":
        return "/organization";
      case "volunteer":
        return "/volunteer";
      case "partner":
        return "/partner";
      case "coordinator":
        return "/coordinator";
      default:
        return "/";
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Mật khẩu hiện tại là bắt buộc";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới là bắt buộc";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      // Redirect to user's dashboard with success message
      const dashboardUrl = getDashboardUrl();
      navigate(dashboardUrl, {
        state: {
          message: "Mật khẩu đã được thay đổi thành công.",
        },
      });
    } catch (error) {
      console.error("Change password error:", error);
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Có lỗi xảy ra. Vui lòng thử lại." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-pink-950/40 dark:via-rose-950/40 dark:to-red-950/40 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-rose-100/20 dark:from-pink-900/10 dark:via-transparent dark:to-rose-900/10" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-gradient-to-br from-white/90 via-pink-50/30 to-rose-50/30 dark:from-slate-900/90 dark:via-pink-950/30 dark:to-rose-950/30 backdrop-blur-sm border-2 border-pink-200/50 dark:border-pink-700/50 shadow-2xl shadow-pink-200/30 dark:shadow-pink-900/30">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 dark:from-pink-400 dark:via-rose-400 dark:to-red-400 bg-clip-text text-transparent">
            Thay đổi mật khẩu
          </CardTitle>
          <CardDescription className="text-center text-slate-600 dark:text-slate-400">
            Cập nhật mật khẩu cho tài khoản của bạn
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errors.general && (
              <div className="bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-950/50 dark:to-rose-950/50 border border-red-200/50 dark:border-red-800/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
                {errors.general}
              </div>
            )}

            {successMessage && (
              <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/50 dark:to-emerald-950/50 border border-green-200/50 dark:border-green-800/30 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl">
                {successMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-slate-700 dark:text-slate-300 font-medium">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                required
                disabled={isLoading}
                className={errors.currentPassword ? "border-red-300 dark:border-red-600" : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"}
              />
              {errors.currentPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-slate-700 dark:text-slate-300 font-medium">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                required
                disabled={isLoading}
                className={errors.newPassword ? "border-red-300 dark:border-red-600" : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-medium">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                required
                disabled={isLoading}
                className={errors.confirmPassword ? "border-red-300 dark:border-red-600" : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-700 hover:via-rose-700 hover:to-red-700 text-white shadow-lg shadow-pink-200/50 dark:shadow-pink-900/50" disabled={isLoading}>
              {isLoading ? "Đang cập nhật..." : "Thay đổi mật khẩu"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-pink-200 dark:border-pink-700 text-pink-700 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/50"
              onClick={() => navigate(getDashboardUrl())}
              disabled={isLoading}
            >
              Hủy
            </Button>
          </CardFooter>
        </form>
        </Card>
      </div>
    </div>
  );
}
