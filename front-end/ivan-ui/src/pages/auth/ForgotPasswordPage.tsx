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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement actual forgot password logic
      console.log("Forgot password for:", email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);
    } catch (error) {
      console.error("Forgot password failed:", error);
      setError("Gửi email thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-green-600">
              Email đã được gửi!
            </CardTitle>
            <CardDescription className="text-center">
              Kiểm tra hộp thư của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">
              Chúng tôi đã gửi link đặt lại mật khẩu đến email{" "}
              <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Nếu không thấy email, hãy kiểm tra thư mục spam hoặc thử lại sau
              vài phút.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button asChild className="w-full">
              <Link to="/login">Quay lại đăng nhập</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
            >
              Gửi lại email
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Quên mật khẩu</CardTitle>
          <CardDescription className="text-center">
            Nhập email để nhận link đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                Lưu ý:
              </p>
              <p>
                Email sẽ chứa link đặt lại mật khẩu có hiệu lực trong 15 phút.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 pt-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang gửi email..." : "Gửi link đặt lại"}
            </Button>
            <div className="flex flex-col space-y-3 text-sm text-center">
              <Link to="/login" className="text-primary hover:underline">
                ← Quay lại đăng nhập
              </Link>
              <p className="text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
