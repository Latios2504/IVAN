import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { useAuth } from "@/hooks/useAuth";
import type { LoginRequest } from "@/types/auth";

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from location state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from history to prevent it from showing again
      window.history.replaceState(null, "", location.pathname);
    }
  }, [location]);

  const handleInputChange = (name: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!credentials.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!credentials.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userData = await login(credentials);

      // Get role-specific dashboard URL
      const getDashboardUrl = (role: string) => {
        switch (role) {
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

      // Navigate to role-specific dashboard, ignoring previous redirect attempts
      // This ensures each user goes to their proper dashboard regardless of previous navigation
      const dashboardUrl = getDashboardUrl(userData.role);
      navigate(dashboardUrl, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      setErrors({ general: error.message || "Email hoặc mật khẩu không đúng" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100/20 via-transparent to-blue-100/20 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-gradient-to-br from-white/90 via-violet-50/30 to-indigo-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-indigo-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-center text-slate-600 dark:text-slate-400">
            Đăng nhập vào tài khoản IVAN của bạn
          </CardDescription>
        </CardHeader>{" "}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {successMessage && (
              <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-950/50 dark:to-green-950/50 border border-emerald-200/50 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl">
                {successMessage}
              </div>
            )}

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
                value={credentials.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isLoading}
                className={errors.email ? "border-red-300 dark:border-red-600" : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                disabled={isLoading}
                className={errors.password ? "border-red-300 dark:border-red-600" : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
                >
                  Ghi nhớ đăng nhập
                </Label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-700 hover:via-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-violet-200/50 dark:shadow-violet-900/50" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                Đăng ký ngay
              </Link>
            </div>
          </CardFooter>
        </form>
        </Card>
      </div>
    </div>
  );
}
