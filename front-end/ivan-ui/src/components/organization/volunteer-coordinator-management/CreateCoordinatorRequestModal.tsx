import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Send, X } from "lucide-react";
import { coordinatorRequestService } from "@/services/coordinatorRequestService";
import { useAuth } from "@/hooks/useAuth";
import type { CoordinatorRequestCreatePayload } from "@/types/coordinatorRequest";

interface CreateCoordinatorRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateCoordinatorRequestModal: React.FC<
  CreateCoordinatorRequestModalProps
> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CoordinatorRequestCreatePayload>({
    candidateEmail: "",
    fullName: "",
    position: "",
    department: "",
    responsibilities: "",
    hireDate: new Date(),
    managerUserId: null,
  });

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleInputChange = (
    field: keyof CoordinatorRequestCreatePayload,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.candidateEmail.trim()) {
         toast.error("Email ứng viên không được để trống");
         return;
       }
       if (!formData.fullName.trim()) {
         toast.error("Họ và tên không được để trống");
         return;
       }
       if (!formData.position.trim()) {
         toast.error("Vị trí không được để trống");
         return;
       }
       if (!formData.department.trim()) {
         toast.error("Phòng ban không được để trống");
         return;
       }
       if (!formData.responsibilities.trim()) {
         toast.error("Mô tả trách nhiệm không được để trống");
         return;
       }
       if (!formData.hireDate) {
         toast.error("Ngày bắt đầu làm việc không được để trống");
         return;
       }

      // Submit request
      await coordinatorRequestService.createCoordinatorRequest(formData);

      toast.success("Yêu cầu tạo coordinator đã được gửi thành công!", {
        description: "Admin sẽ xem xét và phản hồi trong thời gian sớm nhất.",
      });

      // Reset form
      setFormData({
        candidateEmail: "",
        fullName: "",
        position: "",
        department: "",
        responsibilities: "",
        hireDate: new Date(),
        managerUserId: null,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error creating coordinator request:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        candidateEmail: "",
        fullName: "",
        position: "",
        department: "",
        responsibilities: "",
        hireDate: new Date(),
        managerUserId: null,
      });

      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Send className="w-6 h-6" />
            Gửi yêu cầu tạo Coordinator
          </DialogTitle>
          <DialogDescription className="text-blue-700 dark:text-blue-300">
            Điền thông tin ứng viên để gửi yêu cầu tạo tài khoản coordinator cho
            admin xét duyệt.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Candidate Email */}
            <div className="space-y-2">
              <Label
                htmlFor="candidateEmail"
                className="text-blue-900 dark:text-blue-100 font-medium"
              >
                Email ứng viên *
              </Label>
              <Input
                id="candidateEmail"
                type="email"
                value={formData.candidateEmail}
                onChange={(e) =>
                  handleInputChange("candidateEmail", e.target.value)
                }
                placeholder="candidate@example.com"
                className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                required
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-blue-900 dark:text-blue-100 font-medium"
              >
                Họ và tên *
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Nguyễn Văn A"
                className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                maxLength={200}
                required
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label
                htmlFor="position"
                className="text-blue-900 dark:text-blue-100 font-medium"
              >
                Vị trí *
              </Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="Coordinator Tình nguyện viên"
                className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                maxLength={100}
                required
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label
                htmlFor="department"
                className="text-blue-900 dark:text-blue-100 font-medium"
              >
                Phòng ban *
              </Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                placeholder="Phòng Tình nguyện"
                className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                maxLength={100}
                required
              />
            </div>

            {/* Hire Date */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-blue-900 dark:text-blue-100 font-medium">
                Ngày bắt đầu làm việc *
              </Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900",
                      !formData.hireDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.hireDate ? (
                      format(new Date(formData.hireDate), "dd/MM/yyyy")
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.hireDate
                        ? new Date(formData.hireDate)
                        : undefined
                    }
                    onSelect={(date) => {
                      handleInputChange("hireDate", date || new Date());
                      setDatePickerOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <Label
              htmlFor="responsibilities"
              className="text-blue-900 dark:text-blue-100 font-medium"
            >
              Mô tả trách nhiệm *
            </Label>
            <Textarea
              id="responsibilities"
              value={formData.responsibilities}
              onChange={(e) =>
                handleInputChange("responsibilities", e.target.value)
              }
              placeholder="Mô tả chi tiết các trách nhiệm và nhiệm vụ của coordinator..."
              className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 min-h-[120px]"
              maxLength={1000}
              required
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
              {formData.responsibilities.length}/1000 ký tự
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
