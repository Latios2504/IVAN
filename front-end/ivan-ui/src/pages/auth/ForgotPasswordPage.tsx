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
      await authService.requestPasswordReset(email);
      setIsSubmitted(true);
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-yellow-950/40 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-orange-100/20 dark:from-amber-900/10 dark:via-transparent dark:to-orange-900/10" />
        <div className="relative z-10 w-full max-w-md">
          <Card className="bg-gradient-to-br from-white/90 via-amber-50/30 to-orange-50/30 dark:from-slate-900/90 dark:via-amber-950/30 dark:to-orange-950/30 backdrop-blur-sm border-2 border-amber-200/50 dark:border-amber-700/50 shadow-2xl shadow-amber-200/30 dark:shadow-amber-900/30">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Kiểm tra email của bạn
            </CardTitle>
            <CardDescription className="text-center text-slate-600 dark:text-slate-400">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn
            </CardDescription>
          </CardHeader>{" "}
          <CardContent className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Email đã được gửi đến <strong className="text-amber-600 dark:text-amber-400">{email}</strong>
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Vui lòng kiểm tra email và sử dụng mã 6 số trong email để đặt lại
              mật khẩu.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Không nhận được email? Kiểm tra thư mục spam hoặc thử lại sau vài
              phút.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Link to={`/password-reset?email=${encodeURIComponent(email)}`}>
              <Button className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-700 hover:via-orange-700 hover:to-yellow-700 text-white shadow-lg shadow-amber-200/50 dark:shadow-amber-900/50">Tiếp tục đặt lại mật khẩu</Button>
            </Link>

            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50"
            >
              Gửi lại email
            </Button>

            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              <Link
                to="/login"
                className="font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-yellow-950/40 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-orange-100/20 dark:from-amber-900/10 dark:via-transparent dark:to-orange-900/10" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-gradient-to-br from-white/90 via-amber-50/30 to-orange-50/30 dark:from-slate-900/90 dark:via-amber-950/30 dark:to-orange-950/30 backdrop-blur-sm border-2 border-amber-200/50 dark:border-amber-700/50 shadow-2xl shadow-amber-200/30 dark:shadow-amber-900/30">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 dark:from-amber-400 dark:via-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
            Quên mật khẩu
          </CardTitle>
          <CardDescription className="text-center text-slate-600 dark:text-slate-400">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className={errors.email ? "border-red-300 dark:border-red-600" : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"}
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-700 hover:via-orange-700 hover:to-yellow-700 text-white shadow-lg shadow-amber-200/50 dark:shadow-amber-900/50" disabled={isLoading}>
              {isLoading ? "Đang gửi..." : "Gửi hướng dẫn"}
            </Button>

            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              Nhớ mật khẩu rồi?{" "}
              <Link
                to="/login"
                className="font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                Đăng nhập
              </Link>
            </div>
          </CardFooter>
        </form>
        </Card>
      </div>
    </div>
  );
}
