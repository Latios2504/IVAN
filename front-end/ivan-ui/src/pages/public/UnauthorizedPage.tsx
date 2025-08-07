import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Navigate to login page and clear navigation state
    navigate("/login", { replace: true, state: null });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="border-2 border-destructive/25 bg-destructive/5">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-destructive" />
            </div>
            <CardTitle className="text-4xl font-bold text-destructive">
              403
            </CardTitle>
            <h2 className="text-xl font-semibold text-destructive">
              Truy cập bị từ chối
            </h2>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-muted-foreground">
                Bạn không có quyền truy cập trang này.
              </p>
            </div>

            {user && (
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <p className="text-muted-foreground">
                  Đăng nhập với vai trò:{" "}
                  <span className="font-medium text-foreground">
                    {user.role}
                  </span>
                </p>
                <p className="text-muted-foreground mt-1">
                  Email:{" "}
                  <span className="font-medium text-foreground">
                    {user.email}
                  </span>
                </p>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
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
              <div className="pt-4 border-t border-muted">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
