import { useState } from "react";
import { Link } from "react-router-dom";
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
import { ApiError } from "@/services/errorHandler";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset error:", error);
      if (error instanceof ApiError) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Có lỗi xảy ra. Vui lòng thử lại." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-green-600">
              Kiểm tra email của bạn
            </CardTitle>
            <CardDescription className="text-center">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn
            </CardDescription>
          </CardHeader>{" "}
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Email đã được gửi đến <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Vui lòng kiểm tra email và sử dụng mã 6 số trong email để đặt lại
              mật khẩu.
            </p>
            <p className="text-sm text-gray-500">
              Không nhận được email? Kiểm tra thư mục spam hoặc thử lại sau vài
              phút.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Link to={`/password-reset?email=${encodeURIComponent(email)}`}>
              <Button className="w-full">Tiếp tục đặt lại mật khẩu</Button>
            </Link>

            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full"
            >
              Gửi lại email
            </Button>

            <div className="text-center text-sm text-gray-600">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Quên mật khẩu
          </CardTitle>
          <CardDescription className="text-center">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className={errors.email ? "border-red-300" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang gửi..." : "Gửi hướng dẫn"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Nhớ mật khẩu rồi?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Đăng nhập
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
