import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FormProgress,
  commonProgressStages,
} from "@/components/common/FormProgress";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Password validation schema
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// Password strength checker
function getPasswordStrength(password: string): {
  score: number;
  feedback: string;
  color: string;
} {
  let score = 0;
  let feedback = "Rất yếu";
  let color = "text-red-500";

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  switch (score) {
    case 0:
    case 1:
      feedback = "Rất yếu";
      color = "text-red-500";
      break;
    case 2:
      feedback = "Yếu";
      color = "text-orange-500";
      break;
    case 3:
      feedback = "Trung bình";
      color = "text-yellow-500";
      break;
    case 4:
      feedback = "Mạnh";
      color = "text-blue-500";
      break;
    case 5:
      feedback = "Rất mạnh";
      color = "text-green-500";
      break;
  }

  return { score, feedback, color };
}

export function PasswordChangeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitStage, setSubmitStage] = useState<
    "idle" | "validating" | "submitting" | "completed"
  >("idle");

  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = form.watch("newPassword");
  const passwordStrength = getPasswordStrength(newPassword);

  const onSubmit = async (data: PasswordChangeFormData) => {
    setIsLoading(true);
    setSubmitStage("validating");
    setSubmitProgress(30);

    try {
      // Validation stage
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Password change stage
      setSubmitStage("submitting");
      setSubmitProgress(70);

      // TODO: Call API to change password
      // await authService.changePassword({
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword,
      // });

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate potential errors for demo
      if (data.currentPassword === "wrongpassword") {
        throw new Error("Mật khẩu hiện tại không đúng");
      }

      // Completion
      setSubmitStage("completed");
      setSubmitProgress(100);

      setPasswordChanged(true);
      form.reset();
      toast.success("Đổi mật khẩu thành công!");

      // Reset progress after a brief delay
      setTimeout(() => {
        setSubmitStage("idle");
        setSubmitProgress(0);
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể đổi mật khẩu. Vui lòng thử lại.";
      toast.error(errorMessage);

      // If current password is wrong, focus on that field
      if (errorMessage.includes("mật khẩu hiện tại")) {
        form.setError("currentPassword", { message: errorMessage });
      }

      setSubmitStage("idle");
      setSubmitProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (passwordChanged) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Mật khẩu đã được thay đổi thành công. Vui lòng sử dụng mật khẩu mới để
          đăng nhập lần sau.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu hiện tại</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="pl-10 pr-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Password */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      className="pl-10 pr-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.score <= 1
                              ? "bg-red-500"
                              : passwordStrength.score === 2
                              ? "bg-orange-500"
                              : passwordStrength.score === 3
                              ? "bg-yellow-500"
                              : passwordStrength.score === 4
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${passwordStrength.color}`}
                      >
                        {passwordStrength.feedback}
                      </span>
                    </div>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu mới"
                      className="pl-10 pr-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Requirements */}
          <Alert>
            <AlertDescription>
              <div className="text-sm">
                <p className="font-medium mb-2">Yêu cầu mật khẩu:</p>
                <ul className="space-y-1 text-gray-600">
                  <li
                    className={`flex items-center gap-2 ${
                      newPassword.length >= 8 ? "text-green-600" : ""
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    Ít nhất 8 ký tự
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      /[a-z]/.test(newPassword) ? "text-green-600" : ""
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        /[a-z]/.test(newPassword)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    Chứa chữ thường
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      /[A-Z]/.test(newPassword) ? "text-green-600" : ""
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        /[A-Z]/.test(newPassword)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    Chứa chữ hoa
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      /\d/.test(newPassword) ? "text-green-600" : ""
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        /\d/.test(newPassword) ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    Chứa số
                  </li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Progress Indicator */}
          {isLoading && (
            <FormProgress
              currentStage={submitStage}
              progress={submitProgress}
              stages={commonProgressStages.passwordChange}
              showPercentage={true}
            />
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || passwordStrength.score < 3}
            className="w-full"
          >
            {isLoading ? "Đang thay đổi..." : "Đổi mật khẩu"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
