import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";
import type { VolunteerCoordinatorDto, UpdateVolunteerCoordinatorDto } from "@/types/volunteerCoordinator";
import { volunteerCoordinatorService } from "@/services/volunteerCoordinatorService";

interface EditVolunteerCoordinatorModalProps {
  coordinator: VolunteerCoordinatorDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  availableManagers?: any[];
}

export const EditVolunteerCoordinatorModal: React.FC<EditVolunteerCoordinatorModalProps> = ({
  coordinator,
  open,
  onOpenChange,
  onSuccess,
  availableManagers = [],
}) => {
  const [formData, setFormData] = useState<UpdateVolunteerCoordinatorDto>({
    employeeId: "",
    position: "",
    department: "",
    responsibilities: "",
    hireDate: "",
    endDate: "",
    salary: undefined,
    managerId: undefined,
    isActive: true,
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (coordinator && open) {
      setFormData({
        employeeId: coordinator.employeeId || "",
        position: coordinator.position || "",
        department: coordinator.department || "",
        responsibilities: coordinator.responsibilities || "",
        hireDate: coordinator.hireDate || "",
        endDate: coordinator.endDate || "",
        salary: coordinator.salary,
        managerId: coordinator.managerId,
        isActive: coordinator.isActive ?? true,
        notes: coordinator.notes || "",
      });
      setFieldErrors({});
    }
  }, [coordinator, open]);

  const handleInputChange = (field: keyof UpdateVolunteerCoordinatorDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.position?.trim()) {
      newErrors.position = "Vị trí là bắt buộc";
    }

    if (!formData.department?.trim()) {
      newErrors.department = "Phòng ban là bắt buộc";
    }

    if (formData.hireDate && formData.endDate) {
      const hireDate = new Date(formData.hireDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= hireDate) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    if (formData.salary && formData.salary < 0) {
      newErrors.salary = "Lương không thể âm";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coordinator || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await volunteerCoordinatorService.updateCoordinator(
        coordinator.coordinatorId,
        formData
      );
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update coordinator:", error);
      toast.error("Không thể cập nhật coordinator. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  if (!coordinator) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            Chỉnh sửa Volunteer Coordinator
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-blue-800 dark:text-blue-200">
                  Mã nhân viên
                </Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange("employeeId", e.target.value)}
                  placeholder="Nhập mã nhân viên"
                  className="bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position" className="text-blue-800 dark:text-blue-200">
                  Vị trí *
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  placeholder="Nhập vị trí"
                  className="bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-600"
                />
                {fieldErrors.position && (
                  <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.position}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-blue-800 dark:text-blue-200">
                  Phòng ban *
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  placeholder="Nhập phòng ban"
                  className="bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-600"
                />
                {fieldErrors.department && (
                  <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.department}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="managerId" className="text-blue-800 dark:text-blue-200">
                  Quản lý trực tiếp
                </Label>
                <Select
                  value={formData.managerId?.toString() || "none"}
                  onValueChange={(value) => handleInputChange("managerId", value === "none" ? undefined : parseInt(value))}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-600">
                    <SelectValue placeholder="Chọn quản lý" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không có quản lý</SelectItem>
                    {availableManagers.map((manager) => (
                      <SelectItem key={manager.userId} value={manager.userId.toString()}>
                        {manager.fullName || manager.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800" />

          {/* Employment Details */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
              Thông tin công việc
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hireDate" className="text-emerald-800 dark:text-emerald-200">
                  Ngày bắt đầu
                </Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => handleInputChange("hireDate", e.target.value)}
                  className="bg-white dark:bg-slate-800 border-emerald-300 dark:border-emerald-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-emerald-800 dark:text-emerald-200">
                  Ngày kết thúc
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="bg-white dark:bg-slate-800 border-emerald-300 dark:border-emerald-600"
                />
                {fieldErrors.endDate && (
                  <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.endDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-emerald-800 dark:text-emerald-200">
                  Lương (VND)
                </Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary || ""}
                  onChange={(e) => handleInputChange("salary", e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Nhập lương"
                  className="bg-white dark:bg-slate-800 border-emerald-300 dark:border-emerald-600"
                />
                {fieldErrors.salary && (
                  <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.salary}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-emerald-800 dark:text-emerald-200">
                  Trạng thái
                </Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">
                    {formData.isActive ? "Đang hoạt động" : "Không hoạt động"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800" />

          {/* Additional Information */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 dark:from-purple-900 dark:via-pink-900 dark:to-rose-900 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              Thông tin bổ sung
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="responsibilities" className="text-purple-800 dark:text-purple-200">
                  Trách nhiệm
                </Label>
                <Textarea
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => handleInputChange("responsibilities", e.target.value)}
                  placeholder="Mô tả trách nhiệm của coordinator"
                  rows={3}
                  className="bg-white dark:bg-slate-800 border-purple-300 dark:border-purple-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-purple-800 dark:text-purple-200">
                  Ghi chú
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Ghi chú thêm"
                  rows={3}
                  className="bg-white dark:bg-slate-800 border-purple-300 dark:border-purple-600"
                />
              </div>
            </div>
          </div>



          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Cập nhật
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};