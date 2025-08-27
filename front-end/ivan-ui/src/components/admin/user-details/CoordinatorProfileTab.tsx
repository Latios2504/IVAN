import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  UserCheck,
  Building,
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  ClipboardList,
  XCircle,
} from "lucide-react";
import type { UserDetailsDto } from "@/types/userManagement";

interface CoordinatorProfileTabProps {
  user: UserDetailsDto;
}

interface CoordinatorProfileData {
  coordinatorId: number;
  organizationId: number;
  organizationName?: string;
  employeeId?: string;
  position?: string;
  department?: string;
  responsibilities?: string;
  hireDate?: string;
  endDate?: string;
  salary?: number;
  managerId?: number;
  managerName?: string;
  notes?: string;
  isActive: boolean;
}

export function CoordinatorProfileTab({ user }: CoordinatorProfileTabProps) {
  const [coordinatorProfile, setCoordinatorProfile] =
    useState<CoordinatorProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoordinatorProfile = async () => {
      try {
        setLoading(true);
        // Since coordinator profile is not yet implemented in backend, we'll use mock data
        // const profile = await profileService.getProfileByRole(user.userId, "coordinator");

        // Mock coordinator profile data
        const mockProfile: CoordinatorProfileData = {
          coordinatorId: 1,
          organizationId: 1,
          organizationName: "Tổ chức từ thiện ABC",
          employeeId: "COORD001",
          position: "Điều phối viên trưởng",
          department: "Phòng Tình nguyện",
          responsibilities:
            "Quản lý và điều phối các hoạt động tình nguyện, đào tạo tình nguyện viên mới, lập kế hoạch sự kiện",
          hireDate: "2023-01-15",
          endDate: undefined,
          salary: 15000000,
          managerId: 2,
          managerName: "Nguyễn Văn A",
          notes: "Nhân viên xuất sắc, có kinh nghiệm quản lý tốt",
          isActive: true,
        };

        setCoordinatorProfile(mockProfile);
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin điều phối viên");
      } finally {
        setLoading(false);
      }
    };

    if (
      (user.roleName?.toLowerCase() === "volunteercoordinator" ||
      user.roleName?.toLowerCase() === "coordinator") &&
      user.userId
    ) {
      fetchCoordinatorProfile();
    } else {
      setLoading(false);
    }
  }, [user.userId, user.roleName]);

  const isCoordinator =
    user.roleName?.toLowerCase() === "volunteercoordinator" ||
    user.roleName?.toLowerCase() === "coordinator";

  if (!isCoordinator) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-800/20 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
        <span className="ml-2 text-emerald-800 dark:text-emerald-200 font-medium">
          Đang tải thông tin điều phối viên...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/20 dark:to-orange-800/20 backdrop-blur-sm border border-red-200 dark:border-red-700 rounded-lg shadow-lg">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500 dark:text-red-400" />
        <p className="text-red-600 dark:text-red-300 font-medium">{error}</p>
      </div>
    );
  }

  if (!coordinatorProfile) {
    return (
      <div className="text-center py-8 bg-muted/30 border-border rounded-2xl shadow-lg">
        <UserCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground font-medium">
          Chưa có thông tin hồ sơ điều phối viên
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Job Information */}
      <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
          <Briefcase className="h-5 w-5 text-primary" />
          Thông tin công việc
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground font-medium">
              Mã nhân viên
            </Label>
            <p className="text-sm text-muted-foreground">
              {coordinatorProfile.employeeId || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">
              Chức vụ
            </Label>
            <p className="text-sm text-foreground font-medium">
              {coordinatorProfile.position || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">
              Phòng ban
            </Label>
            <p className="text-sm text-muted-foreground">
              {coordinatorProfile.department || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">
              Trạng thái
            </Label>
            <Badge
              variant={coordinatorProfile.isActive ? "default" : "secondary"}
              className="rounded-xl"
            >
              {coordinatorProfile.isActive ? "Đang làm việc" : "Đã nghỉ việc"}
            </Badge>
          </div>
        </div>
      </div>

      <Separator className="bg-border h-0.5" />

      {/* Organization Information */}
      <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
          <Building className="h-5 w-5 text-primary" />
          Thông tin tổ chức
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground font-medium">
              Tên tổ chức
            </Label>
            <p className="text-sm text-foreground font-medium">
              {coordinatorProfile.organizationName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">
              Quản lý trực tiếp
            </Label>
            <p className="text-sm text-muted-foreground">
              {coordinatorProfile.managerName || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-border h-0.5" />

      {/* Employment Details */}
      <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          Thông tin tuyển dụng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground font-medium">
              Ngày bắt đầu
            </Label>
            <p className="text-sm text-muted-foreground">
              {coordinatorProfile.hireDate
                ? new Date(coordinatorProfile.hireDate).toLocaleDateString(
                    "vi-VN"
                  )
                : "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">
              Ngày kết thúc
            </Label>
            <p className="text-sm text-muted-foreground">
              {coordinatorProfile.endDate
                ? new Date(coordinatorProfile.endDate).toLocaleDateString(
                    "vi-VN"
                  )
                : "Đang làm việc"}
            </p>
          </div>
          {coordinatorProfile.salary && (
            <div>
              <Label className="text-foreground font-medium">
                Mức lương
              </Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <p className="text-sm text-foreground font-medium">
                  {coordinatorProfile.salary.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-border h-0.5" />

      {/* Responsibilities */}
      {coordinatorProfile.responsibilities && (
        <>
          <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
              <ClipboardList className="h-5 w-5 text-primary" />
              Trách nhiệm công việc
            </h3>
            <p className="text-sm text-foreground bg-muted/30 p-4 rounded-xl border-border shadow-inner">
              {coordinatorProfile.responsibilities}
            </p>
          </div>
          <Separator className="bg-border h-0.5" />
        </>
      )}

      {/* Notes */}
      {coordinatorProfile.notes && (
        <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Ghi chú
          </h3>
          <p className="text-sm text-foreground bg-muted/30 p-4 rounded-xl border-l-4 border-primary shadow-inner">
            {coordinatorProfile.notes}
          </p>
        </div>
      )}

      {/* Work Duration */}
      {coordinatorProfile.hireDate && (
        <>
          <Separator className="bg-border h-0.5" />
          <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
            <Label className="text-foreground font-medium text-base">
              Thời gian làm việc
            </Label>
            <p className="text-sm text-foreground font-medium mt-2">
              {(() => {
                const startDate = new Date(coordinatorProfile.hireDate);
                const endDate = coordinatorProfile.endDate
                  ? new Date(coordinatorProfile.endDate)
                  : new Date();
                const diffTime = Math.abs(
                  endDate.getTime() - startDate.getTime()
                );
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const years = Math.floor(diffDays / 365);
                const months = Math.floor((diffDays % 365) / 30);

                let duration = "";
                if (years > 0) duration += `${years} năm `;
                if (months > 0) duration += `${months} tháng`;
                if (!duration) duration = "Dưới 1 tháng";

                return duration;
              })()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
