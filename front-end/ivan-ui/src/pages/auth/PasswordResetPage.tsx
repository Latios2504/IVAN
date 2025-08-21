import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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

export default function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: email,
    resetCode: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.resetCode) {
      newErrors.resetCode = "Mã xác nhận là bắt buộc";
    } else if (formData.resetCode.length !== 6) {
      newErrors.resetCode = "Mã xác nhận phải có 6 ký tự";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu mới là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email: formData.email,
        resetCode: formData.resetCode,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Redirect to login with success message
      navigate("/login", {
        state: {
          message:
            "Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.",
        },
      });
    } catch (error) {
      console.error("Password reset error:", error);
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Có lỗi xảy ra. Vui lòng thử lại." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If no email, show error
  if (!formData.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950/40 dark:via-violet-950/40 dark:to-indigo-950/40 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-violet-100/20 dark:from-purple-900/10 dark:via-transparent dark:to-violet-900/10" />
        <div className="relative z-10 w-full max-w-md">
          <Card className="bg-gradient-to-br from-white/90 via-purple-50/30 to-violet-50/30 dark:from-slate-900/90 dark:via-purple-950/30 dark:to-violet-950/30 backdrop-blur-sm border-2 border-purple-200/50 dark:border-purple-700/50 shadow-2xl shadow-purple-200/30 dark:shadow-purple-900/30">
          {" "}
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 dark:from-red-400 dark:via-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
              Email không hợp lệ
            </CardTitle>
            <CardDescription className="text-center text-slate-600 dark:text-slate-400">
              Email để đặt lại mật khẩu không được cung cấp
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4">
            <Link to="/forgot-password">
              <Button className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-200/50 dark:shadow-purple-900/50">Yêu cầu đặt lại mật khẩu mới</Button>
            </Link>

            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              <Link
                to="/login"
                className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950/40 dark:via-violet-950/40 dark:to-indigo-950/40 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-violet-100/20 dark:from-purple-900/10 dark:via-transparent dark:to-violet-900/10" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-gradient-to-br from-white/90 via-purple-50/30 to-violet-50/30 dark:from-slate-900/90 dark:via-purple-950/30 dark:to-violet-950/30 backdrop-blur-sm border-2 border-purple-200/50 dark:border-purple-700/50 shadow-2xl shadow-purple-200/30 dark:shadow-purple-900/30">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Đặt lại mật khẩu
          </CardTitle>
          <CardDescription className="text-center text-slate-600 dark:text-slate-400">
            Nhập mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          {" "}
          <CardContent className="space-y-4">
            {errors.general && (
              <div className="bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-950/50 dark:to-rose-950/50 border border-red-200/50 dark:border-red-800/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isLoading}
                className={errors.email ? "border-red-300 dark:border-red-600" : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"}
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="resetCode" className="text-slate-700 dark:text-slate-300 font-medium">Mã xác nhận (6 ký tự)</Label>
              <Input
                id="resetCode"
                name="resetCode"
                type="text"
                placeholder="123456"
                value={formData.resetCode}
                onChange={(e) => handleInputChange("resetCode", e.target.value)}
                required
                maxLength={6}
                disabled={isLoading}
                className={errors.resetCode ? "border-red-300 dark:border-red-600" : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"}
              />
              {errors.resetCode && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.resetCode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Mật khẩu mới</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                disabled={isLoading}
                className={errors.password ? "border-red-300 dark:border-red-600" : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"}
              />
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
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
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-200/50 dark:shadow-purple-900/50" disabled={isLoading}>
              {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
            </Button>

            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              <Link
                to="/login"
                className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </CardFooter>
        </form>
        </Card>
      </div>
    </div>
  );
}
