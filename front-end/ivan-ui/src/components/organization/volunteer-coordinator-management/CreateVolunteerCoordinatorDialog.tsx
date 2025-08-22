import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useForm } from "react-hook-form";
import { Calendar, CalendarDays, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import type {
  CreateVolunteerCoordinatorDto,
  ManagementLevelDto,
  SpecializationDto,
  VolunteerCoordinatorDto,
} from "../../../types/volunteerCoordinator";
import { volunteerCoordinatorService } from "../../../services/volunteerCoordinatorService";

interface CreateVolunteerCoordinatorDialogProps {
  organizationId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  managementLevels: ManagementLevelDto[];
  specializations: SpecializationDto[];
}

interface FormData {
  // User account information
  email: string;
  
  // Personal information
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  avatar: string;
  address: string;
  wardCommune: string;
  district: string;
  province: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  
  // Employment information
  employeeId: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  managerId: number;
  responsibilities: string;
  notes: string;
}

export const CreateVolunteerCoordinatorDialog: React.FC<
  CreateVolunteerCoordinatorDialogProps
> = ({
  organizationId,
  isOpen,
  onClose,
  onSuccess,
  managementLevels,
  specializations,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableManagers, setAvailableManagers] = useState<VolunteerCoordinatorDto[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      // User account information
      email: "",
      
      // Personal information
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "",
      avatar: "",
      address: "",
      wardCommune: "",
      district: "",
      province: "",
      postalCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      
      // Employment information
      employeeId: "",
      position: "",
      department: "",
      hireDate: "",
      salary: 0,
      managerId: 0,
      responsibilities: "",
      notes: "",
    },
  });

  const watchedPosition = watch("position");
  const watchedDepartment = watch("department");

  // Load available managers when dialog opens
  useEffect(() => {
    const loadManagers = async () => {
      if (isOpen) {
        try {
          const managers = await volunteerCoordinatorService.getAvailableManagers(organizationId);
          setAvailableManagers(managers);
        } catch (error) {
          console.error('Failed to load managers:', error);
          toast.error('Failed to load available managers');
        }
      }
    };

    loadManagers();
  }, [isOpen, organizationId]);

  const handleClose = () => {
    reset();
    setAvailableManagers([]);
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const createDto: CreateVolunteerCoordinatorDto = {
        // User account information
        email: data.email,
        
        // Personal information
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        gender: data.gender || undefined,
        avatar: data.avatar || undefined,
        address: data.address || undefined,
        wardCommune: data.wardCommune || undefined,
        district: data.district || undefined,
        province: data.province || undefined,
        postalCode: data.postalCode || undefined,
        emergencyContactName: data.emergencyContactName || undefined,
        emergencyContactPhone: data.emergencyContactPhone || undefined,
        
        // Employment information
        employeeId: data.employeeId || undefined,
        position: data.position || undefined,
        department: data.department || undefined,
        hireDate: data.hireDate || undefined,
        salary: data.salary > 0 ? data.salary : undefined,
        managerId: data.managerId > 0 ? data.managerId : undefined,
        responsibilities: data.responsibilities || undefined,
        notes: data.notes || undefined,
      };

      await volunteerCoordinatorService.createCoordinator(
        organizationId,
        createDto
      );

      toast.success("Volunteer coordinator created successfully!");
      reset();
      setAvailableManagers([]);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error creating volunteer coordinator:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create volunteer coordinator. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Predefined options - these would typically come from your backend or configuration
  const departmentOptions = [
    "Human Resources",
    "IT",
    "Marketing",
    "Operations",
    "Finance",
    "Customer Service",
    "Administration",
    "Events",
    "Community Outreach",
  ];

  const positionOptions = [
    "Volunteer Coordinator",
    "Senior Volunteer Coordinator",
    "Lead Volunteer Coordinator",
    "Assistant Coordinator",
    "Program Coordinator",
    "Event Coordinator",
    "Community Coordinator",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-slate-900/95 dark:via-blue-900/20 dark:to-indigo-900/30 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-400/20 dark:via-indigo-400/20 dark:to-purple-400/20 rounded-lg p-4 border border-blue-200/30 dark:border-blue-700/30">
          <DialogTitle className="flex items-center gap-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent font-bold">
            <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Tạo Điều Phối Viên Tình Nguyện Mới
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-300">
            Thêm một điều phối viên tình nguyện mới vào tổ chức của bạn. Tất cả các trường
            được đánh dấu * là bắt buộc.
          </DialogDescription>
          <div className="bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30 rounded-md p-3 mt-2">
            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
              📧 Chính sách mật khẩu: Mật khẩu tạm thời sẽ được tự động tạo và gửi đến địa chỉ email của điều phối viên. Họ sẽ được yêu cầu thay đổi mật khẩu khi đăng nhập lần đầu.
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gradient-to-br from-white/60 via-blue-50/40 to-indigo-50/60 dark:from-slate-800/60 dark:via-slate-700/40 dark:to-slate-600/60 rounded-xl p-6 border border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
          {/* Personal Information */}
          <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-cyan-50/80 dark:from-emerald-900/20 dark:via-teal-900/15 dark:to-cyan-900/20 border border-emerald-200/40 dark:border-emerald-700/30 rounded-lg p-4 space-y-4 backdrop-blur-sm">
            <h3 className="font-semibold text-lg bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">Thông Tin Cá Nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Họ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName", {
                    required: "Họ là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Họ phải có ít nhất 2 ký tự",
                    },
                  })}
                  placeholder="Nhập họ"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName", {
                    required: "Tên là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Tên phải có ít nhất 2 ký tự",
                    },
                  })}
                  placeholder="Nhập tên"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Địa chỉ email không hợp lệ",
                    },
                  })}
                  placeholder="Nhập địa chỉ email"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số Điện Thoại</Label>
                <Input
                  id="phoneNumber"
                  {...register("phoneNumber", {
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: "Định dạng số điện thoại không hợp lệ",
                    },
                  })}
                  placeholder="Nhập số điện thoại"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth", {
                    validate: (value) => {
                      if (!value) return true; // Optional field
                      const birthDate = new Date(value);
                      const today = new Date();
                      const age = today.getFullYear() - birthDate.getFullYear();
                      if (age < 18) return "Phải ít nhất 18 tuổi";
                      if (age > 100) return "Ngày sinh không hợp lệ";
                      return true;
                    },
                  })}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Giới Tính</Label>
                <Select onValueChange={(value) => setValue("gender", value)}>
                  <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Địa Chỉ</Label>
                <Input
                  id="address"
                  {...register("address", {
                    minLength: {
                      value: 10,
                      message: "Địa chỉ phải có ít nhất 10 ký tự",
                    },
                    maxLength: {
                      value: 200,
                      message: "Địa chỉ không được vượt quá 200 ký tự",
                    },
                  })}
                  placeholder="Nhập địa chỉ đầy đủ"
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="wardCommune">Phường/Xã</Label>
                <Input
                  id="wardCommune"
                  {...register("wardCommune")}
                  placeholder="Nhập phường/xã"
                  className={errors.wardCommune ? "border-red-500" : ""}
                />
                {errors.wardCommune && (
                  <p className="text-sm text-red-500">
                    {errors.wardCommune.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">Quận/Huyện</Label>
                <Input
                  id="district"
                  {...register("district")}
                  placeholder="Nhập quận/huyện"
                  className={errors.district ? "border-red-500" : ""}
                />
                {errors.district && (
                  <p className="text-sm text-red-500">
                    {errors.district.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Tỉnh/Thành Phố</Label>
                <Input
                  id="province"
                  {...register("province")}
                  placeholder="Nhập tỉnh/thành phố"
                  className={errors.province ? "border-red-500" : ""}
                />
                {errors.province && (
                  <p className="text-sm text-red-500">
                    {errors.province.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Mã Bưu Điện</Label>
                <Input
                  id="postalCode"
                  {...register("postalCode", {
                    pattern: {
                      value: /^[0-9]{5,6}$/,
                      message: "Mã bưu điện phải có 5-6 chữ số",
                    },
                  })}
                  placeholder="Nhập mã bưu điện"
                  className={errors.postalCode ? "border-red-500" : ""}
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-500">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact Information */}
          <div className="bg-gradient-to-br from-red-50/80 via-pink-50/60 to-rose-50/80 dark:from-red-900/20 dark:via-pink-900/15 dark:to-rose-900/20 border border-red-200/40 dark:border-red-700/30 rounded-lg p-4 space-y-4 backdrop-blur-sm">
            <h3 className="font-semibold text-lg bg-gradient-to-r from-red-700 via-pink-700 to-rose-700 dark:from-red-300 dark:via-pink-300 dark:to-rose-300 bg-clip-text text-transparent">Thông Tin Liên Hệ Khẩn Cấp</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Tên Người Liên Hệ Khẩn Cấp</Label>
                <Input
                  id="emergencyContactName"
                  {...register("emergencyContactName", {
                    minLength: {
                      value: 2,
                      message: "Tên người liên hệ khẩn cấp phải có ít nhất 2 ký tự",
                    },
                    maxLength: {
                      value: 50,
                      message: "Tên người liên hệ khẩn cấp không được vượt quá 50 ký tự",
                    },
                  })}
                  placeholder="Nhập tên người liên hệ khẩn cấp"
                  className={errors.emergencyContactName ? "border-red-500" : ""}
                />
                {errors.emergencyContactName && (
                  <p className="text-sm text-red-500">
                    {errors.emergencyContactName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Số Điện Thoại Liên Hệ Khẩn Cấp</Label>
                <Input
                  id="emergencyContactPhone"
                  {...register("emergencyContactPhone", {
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: "Định dạng số điện thoại không hợp lệ",
                    },
                  })}
                  placeholder="Nhập số điện thoại liên hệ khẩn cấp"
                  className={errors.emergencyContactPhone ? "border-red-500" : ""}
                />
                {errors.emergencyContactPhone && (
                  <p className="text-sm text-red-500">
                    {errors.emergencyContactPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-yellow-50/80 dark:from-orange-900/20 dark:via-amber-900/15 dark:to-yellow-900/20 border border-orange-200/40 dark:border-orange-700/30 rounded-lg p-4 space-y-4 backdrop-blur-sm">
            <h3 className="font-semibold text-lg bg-gradient-to-r from-orange-700 via-amber-700 to-yellow-700 dark:from-orange-300 dark:via-amber-300 dark:to-yellow-300 bg-clip-text text-transparent">Thông Tin Việc Làm</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">
                  Mã Nhân Viên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="employeeId"
                  {...register("employeeId", {
                    required: "Mã nhân viên là bắt buộc",
                  })}
                  placeholder="Nhập mã nhân viên"
                  className={errors.employeeId ? "border-red-500" : ""}
                />
                {errors.employeeId && (
                  <p className="text-sm text-red-500">
                    {errors.employeeId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">
                  Chức Vụ <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watchedPosition}
                  onValueChange={(value) => setValue("position", value)}
                >
                  <SelectTrigger
                    className={errors.position ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn chức vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {positionOptions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("position", {
                    required: "Chức vụ là bắt buộc",
                  })}
                />
                {errors.position && (
                  <p className="text-sm text-red-500">
                    {errors.position.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">
                  Phòng Ban <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watchedDepartment}
                  onValueChange={(value) => setValue("department", value)}
                >
                  <SelectTrigger
                    className={errors.department ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("department", {
                    required: "Phòng ban là bắt buộc",
                  })}
                />
                {errors.department && (
                  <p className="text-sm text-red-500">
                    {errors.department.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate">
                  Ngày Tuyển Dụng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="hireDate"
                  type="date"
                  {...register("hireDate", {
                    required: "Ngày tuyển dụng là bắt buộc",
                    validate: (value) => {
                      if (!value) return "Ngày tuyển dụng là bắt buộc";
                      const hireDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (hireDate > today) return "Ngày tuyển dụng không thể ở tương lai";
                      return true;
                    },
                  })}
                  className={errors.hireDate ? "border-red-500" : ""}
                />
                {errors.hireDate && (
                  <p className="text-sm text-red-500">
                    {errors.hireDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Lương (Tùy chọn)</Label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("salary", {
                    min: {
                      value: 0,
                      message: "Lương phải là số dương",
                    },
                    max: {
                      value: 1000000000,
                      message: "Lương phải nhỏ hơn 1 tỷ",
                    },
                    valueAsNumber: true,
                    validate: (value) => {
                      if (value && value < 0) return "Lương phải là số dương";
                      return true;
                    },
                  })}
                  placeholder="Nhập lương"
                  className={errors.salary ? "border-red-500" : ""}
                />
                {errors.salary && (
                  <p className="text-sm text-red-500">
                    {errors.salary.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerId">Quản Lý (Tùy chọn)</Label>
                <Select
                  value={watch("managerId")?.toString() || ""}
                  onValueChange={(value) => setValue("managerId", value ? parseInt(value) : 0)}
                >
                  <SelectTrigger
                    className={errors.managerId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn quản lý" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Không có Quản lý</SelectItem>
                    {availableManagers.map((manager) => (
                      <SelectItem key={manager.coordinatorId} value={manager.coordinatorId.toString()}>
                        {manager.user?.fullName || 'Không có tên'} - {manager.position || 'Không có chức vụ'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("managerId", {
                    valueAsNumber: true,
                  })}
                />
                {errors.managerId && (
                  <p className="text-sm text-red-500">
                    {errors.managerId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-rose-50/80 dark:from-purple-900/20 dark:via-pink-900/15 dark:to-rose-900/20 border border-purple-200/40 dark:border-purple-700/30 rounded-lg p-4 space-y-4 backdrop-blur-sm">
            <h3 className="font-semibold text-lg bg-gradient-to-r from-purple-700 via-pink-700 to-rose-700 dark:from-purple-300 dark:via-pink-300 dark:to-rose-300 bg-clip-text text-transparent">Thông Tin Bổ Sung</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="responsibilities">Trách Nhiệm</Label>
                <Textarea
                  id="responsibilities"
                  {...register("responsibilities")}
                  placeholder="Nhập các trách nhiệm và nhiệm vụ chính..."
                  rows={4}
                  className={errors.responsibilities ? "border-red-500" : ""}
                />
                {errors.responsibilities && (
                  <p className="text-sm text-red-500">
                    {errors.responsibilities.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi Chú</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Nhập các ghi chú hoặc bình luận bổ sung..."
                  rows={3}
                  className={errors.notes ? "border-red-500" : ""}
                />
                {errors.notes && (
                  <p className="text-sm text-red-500">{errors.notes.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 bg-gradient-to-r from-slate-50/80 via-gray-50/60 to-slate-50/80 dark:from-slate-800/80 dark:via-gray-800/60 dark:to-slate-800/80 rounded-lg p-4 border border-slate-200/30 dark:border-slate-600/30 backdrop-blur-sm">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 dark:from-slate-700 dark:to-gray-700 dark:hover:from-slate-600 dark:hover:to-gray-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200 transition-all duration-300"
            >
              <X className="h-4 w-4 mr-1" />
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Tạo Điều Phối Viên
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
