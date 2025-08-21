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
      <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800/20 dark:to-slate-700/20 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
        <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Chưa có thông tin hồ sơ điều phối viên
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Job Information */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 backdrop-blur-sm border border-blue-200 dark:border-blue-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-800 dark:text-blue-200">
          <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Thông tin công việc
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-blue-700 dark:text-blue-300 font-medium">
              Mã nhân viên
            </Label>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {coordinatorProfile.employeeId || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-blue-700 dark:text-blue-300 font-medium">
              Chức vụ
            </Label>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              {coordinatorProfile.position || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-blue-700 dark:text-blue-300 font-medium">
              Phòng ban
            </Label>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {coordinatorProfile.department || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-blue-700 dark:text-blue-300 font-medium">
              Trạng thái
            </Label>
            <Badge
              variant={coordinatorProfile.isActive ? "default" : "secondary"}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
            >
              {coordinatorProfile.isActive ? "Đang làm việc" : "Đã nghỉ việc"}
            </Badge>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-blue-200 to-indigo-300 dark:from-blue-700 dark:to-indigo-600 h-0.5" />

      {/* Organization Information */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 backdrop-blur-sm border border-green-200 dark:border-green-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-green-800 dark:text-green-200">
          <Building className="h-5 w-5 text-green-600 dark:text-green-400" />
          Thông tin tổ chức
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-green-700 dark:text-green-300 font-medium">
              Tên tổ chức
            </Label>
            <p className="text-sm text-green-800 dark:text-green-200 font-medium">
              {coordinatorProfile.organizationName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-green-700 dark:text-green-300 font-medium">
              Quản lý trực tiếp
            </Label>
            <p className="text-sm text-green-800 dark:text-green-200">
              {coordinatorProfile.managerName || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-green-200 to-emerald-300 dark:from-green-700 dark:to-emerald-600 h-0.5" />

      {/* Employment Details */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20 backdrop-blur-sm border border-purple-200 dark:border-purple-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-purple-800 dark:text-purple-200">
          <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Thông tin tuyển dụng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-purple-700 dark:text-purple-300 font-medium">
              Ngày bắt đầu
            </Label>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              {coordinatorProfile.hireDate
                ? new Date(coordinatorProfile.hireDate).toLocaleDateString(
                    "vi-VN"
                  )
                : "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-purple-700 dark:text-purple-300 font-medium">
              Ngày kết thúc
            </Label>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              {coordinatorProfile.endDate
                ? new Date(coordinatorProfile.endDate).toLocaleDateString(
                    "vi-VN"
                  )
                : "Đang làm việc"}
            </p>
          </div>
          {coordinatorProfile.salary && (
            <div>
              <Label className="text-purple-700 dark:text-purple-300 font-medium">
                Mức lương
              </Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">
                  {coordinatorProfile.salary.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-purple-200 to-pink-300 dark:from-purple-700 dark:to-pink-600 h-0.5" />

      {/* Responsibilities */}
      {coordinatorProfile.responsibilities && (
        <>
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-800/20 backdrop-blur-sm border border-orange-200 dark:border-orange-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-orange-800 dark:text-orange-200">
              <ClipboardList className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Trách nhiệm công việc
            </h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-800/30 dark:to-amber-700/30 p-4 rounded-lg border border-orange-200 dark:border-orange-600 shadow-inner">
              {coordinatorProfile.responsibilities}
            </p>
          </div>
          <Separator className="bg-gradient-to-r from-orange-200 to-amber-300 dark:from-orange-700 dark:to-amber-600 h-0.5" />
        </>
      )}

      {/* Notes */}
      {coordinatorProfile.notes && (
        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-800/20 backdrop-blur-sm border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">
            Ghi chú
          </h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-200 bg-gradient-to-br from-yellow-100 to-amber-50 dark:from-yellow-800/30 dark:to-amber-700/30 p-4 rounded-lg border-l-4 border-yellow-400 dark:border-yellow-500 shadow-inner">
            {coordinatorProfile.notes}
          </p>
        </div>
      )}

      {/* Work Duration */}
      {coordinatorProfile.hireDate && (
        <>
          <Separator className="bg-gradient-to-r from-teal-200 to-cyan-300 dark:from-teal-700 dark:to-cyan-600 h-0.5" />
          <div className="bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-800/20 backdrop-blur-sm border border-teal-200 dark:border-teal-700 rounded-lg p-6 shadow-lg">
            <Label className="text-teal-700 dark:text-teal-300 font-medium text-base">
              Thời gian làm việc
            </Label>
            <p className="text-sm text-teal-800 dark:text-teal-200 font-medium mt-2">
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
