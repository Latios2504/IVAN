import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useAuth } from "../../hooks/useAuth";
import {
  type RegisterData,
  type PublicRegistrationRole,
} from "../../types/auth";

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "volunteer" as PublicRegistrationRole,
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const navigate = useNavigate();
  const handleInputChange = (
    name: string,
    value: string | PublicRegistrationRole
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Tên không được để trống";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Họ không được để trống";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    if (!formData.role) {
      newErrors.role = "Vui lòng chọn vai trò";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await register(formData);

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

      // Navigate to role-specific dashboard
      navigate(getDashboardUrl(formData.role));
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ submit: "Đăng ký thất bại. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Đăng ký tài khoản
          </CardTitle>
          <CardDescription className="text-center">
            Tạo tài khoản mới để tham gia vào cộng đồng tình nguyện
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Tên</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Văn"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  required
                  disabled={isLoading}
                  className={errors.firstName ? "border-destructive" : ""}
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Họ</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Nguyễn"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  required
                  disabled={isLoading}
                  className={errors.lastName ? "border-destructive" : ""}
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isLoading}
                className={errors.email ? "border-destructive" : ""}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                disabled={isLoading}
                className={errors.password ? "border-destructive" : ""}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className={errors.confirmPassword ? "border-destructive" : ""}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  handleInputChange("role", value as PublicRegistrationRole)
                }
                disabled={isLoading}
              >
                <SelectTrigger
                  className={errors.role ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Chọn vai trò của bạn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteer">
                    <div className="flex flex-col">
                      <span className="font-medium">Tình nguyện viên</span>
                      <span className="text-sm text-muted-foreground">
                        Tham gia các hoạt động tình nguyện
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="organization">
                    <div className="flex flex-col">
                      <span className="font-medium">Tổ chức</span>
                      <span className="text-sm text-muted-foreground">
                        Tạo và quản lý các hoạt động tình nguyện
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="partner">
                    <div className="flex flex-col">
                      <span className="font-medium">Đối tác</span>
                      <span className="text-sm text-muted-foreground">
                        Hợp tác và tài trợ các hoạt động
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role}</p>
              )}
            </div>

            {errors.submit && (
              <p className="text-sm text-destructive text-center">
                {errors.submit}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
