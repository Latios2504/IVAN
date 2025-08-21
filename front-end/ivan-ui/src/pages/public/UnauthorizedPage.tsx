import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Navigate to login page and clear navigation state
    navigate("/login", { replace: true, state: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-red-950/40 dark:via-orange-950/40 dark:to-amber-950/40 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="bg-gradient-to-br from-white/90 via-red-50/50 to-orange-50/50 dark:from-slate-900/90 dark:via-red-950/50 dark:to-orange-950/50 backdrop-blur-sm border-2 border-red-300/50 dark:border-red-700/50 shadow-2xl shadow-red-200/30 dark:shadow-red-900/30">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 rounded-full flex items-center justify-center mb-4 border-2 border-red-200/50 dark:border-red-800/50">
              <Shield className="w-12 h-12 text-red-500 dark:text-red-400" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
              403
            </CardTitle>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              Truy cập bị từ chối
            </h2>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-slate-600 dark:text-slate-400">
                Bạn không có quyền truy cập trang này.
              </p>
            </div>

            {user && (
              <div className="p-3 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/50 dark:to-orange-950/50 rounded-lg text-sm border border-amber-200/50 dark:border-amber-800/30">
                <p className="text-slate-600 dark:text-slate-400">
                  Đăng nhập với vai trò:{" "}
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {user.role}
                  </span>
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Email:{" "}
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {user.email}
                  </span>
                </p>
              </div>
            )}

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="default" className="w-full sm:w-auto">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Về trang chủ
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => window.history.back()}
              >
                <button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </button>
              </Button>
            </div>

            {user && (
              <div className="pt-4 border-t border-red-200/50 dark:border-red-800/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                >
                  Đăng xuất và đăng nhập tài khoản khác
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
