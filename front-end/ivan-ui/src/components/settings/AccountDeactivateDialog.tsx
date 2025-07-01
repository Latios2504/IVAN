import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Lock } from "lucide-react";
import { toast } from "sonner";

// Deactivation form schema
const deactivationSchema = z.object({
  reason: z.string().min(1, "Vui lòng chọn lý do"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu để xác nhận"),
  feedback: z.string().optional(),
  dataExport: z.boolean(),
  confirmUnderstanding: z.boolean().refine(val => val === true, {
    message: "Bạn phải xác nhận hiểu về hậu quả của việc vô hiệu hóa tài khoản"
  }),
});

type DeactivationFormData = z.infer<typeof deactivationSchema>;

interface AccountDeactivateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const DEACTIVATION_REASONS = [
  "Không còn sử dụng dịch vụ",
  "Tạo tài khoản mới",
  "Quan ngại về quyền riêng tư",
  "Gặp vấn đề kỹ thuật",
  "Không hài lòng với dịch vụ",
  "Khác (vui lòng ghi rõ)",
];

export function AccountDeactivateDialog({ isOpen, onClose, user }: AccountDeactivateDialogProps) {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"confirm" | "form">("confirm");

  const form = useForm<DeactivationFormData>({
    resolver: zodResolver(deactivationSchema),
    defaultValues: {
      reason: "",
      password: "",
      feedback: "",
      dataExport: false,
      confirmUnderstanding: false,
    },
  });

  const watchedReason = form.watch("reason");

  const handleClose = () => {
    setStep("confirm");
    form.reset();
    onClose();
  };

  const handleConfirmProceed = () => {
    setStep("form");
  };

  const onSubmit = async (data: DeactivationFormData) => {
    setIsLoading(true);
    try {
      // TODO: Call API to deactivate account
      // await userService.deactivateAccount(user.id, {
      //   reason: data.reason,
      //   feedback: data.feedback,
      //   password: data.password,
      //   requestDataExport: data.dataExport,
      // });

      // Mock API call with validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate password validation
      if (data.password === "wrongpassword") {
        form.setError("password", { message: "Mật khẩu không đúng" });
        return;
      }

      // If data export is requested, initiate export process
      if (data.dataExport) {
        // TODO: Trigger data export process
        toast.success("Yêu cầu xuất dữ liệu đã được gửi. Bạn sẽ nhận được email khi hoàn tất.");
      }

      toast.success("Tài khoản đã được vô hiệu hóa thành công.");
      
      // Log out user after successful deactivation
      setTimeout(() => {
        logout();
      }, 1500);
      
      handleClose();
    } catch (error) {
      toast.error("Không thể vô hiệu hóa tài khoản. Vui lòng thử lại.");
      console.error("Error deactivating account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "confirm") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Vô hiệu hóa tài khoản
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn vô hiệu hóa tài khoản của mình?
            </DialogDescription>
          </DialogHeader>

          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-2">
                <p className="font-medium">Lưu ý quan trọng:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Bạn sẽ không thể đăng nhập vào tài khoản</li>
                  <li>Tất cả dữ liệu cá nhân sẽ được ẩn khỏi hệ thống</li>
                  <li>Các sự kiện đã đăng ký sẽ bị hủy</li>
                  <li>Bạn sẽ cần liên hệ admin để khôi phục tài khoản</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClose}>
              Hủy bỏ
            </Button>
            <Button variant="destructive" onClick={handleConfirmProceed}>
              Tiếp tục vô hiệu hóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Vô hiệu hóa tài khoản
          </DialogTitle>
          <DialogDescription>
            Vui lòng điền thông tin để hoàn tất việc vô hiệu hóa tài khoản
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Reason Selection */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do vô hiệu hóa tài khoản *</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {DEACTIVATION_REASONS.map((reason) => (
                        <div key={reason} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={reason}
                            value={reason}
                            checked={field.value === reason}
                            onChange={() => field.onChange(reason)}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <Label htmlFor={reason} className="text-sm font-normal cursor-pointer">
                            {reason}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Feedback */}
            {(watchedReason === "Khác (vui lòng ghi rõ)" || watchedReason) && (
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {watchedReason === "Khác (vui lòng ghi rõ)" ? "Chi tiết lý do *" : "Góp ý bổ sung (tùy chọn)"}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Chia sẻ thêm về lý do của bạn..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Data Export Option */}
            <FormField
              control={form.control}
              name="dataExport"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      Yêu cầu xuất dữ liệu cá nhân
                    </FormLabel>
                    <p className="text-xs text-gray-600">
                      Chúng tôi sẽ gửi email chứa tất cả dữ liệu của bạn trong vòng 7 ngày
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Confirmation Checkbox */}
            <FormField
              control={form.control}
              name="confirmUnderstanding"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      Tôi hiểu rằng việc vô hiệu hóa tài khoản sẽ khiến tôi không thể truy cập vào hệ thống
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Confirmation */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu hiện tại *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu để xác nhận"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Hủy bỏ
              </Button>
              <Button 
                type="submit" 
                variant="destructive" 
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? "Đang xử lý..." : "Vô hiệu hóa tài khoản"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
