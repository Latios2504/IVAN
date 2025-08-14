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
import type { UserListDto } from "@/types/userManagement";

interface CoordinatorProfileTabProps {
  user: UserListDto;
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
      user.roleName?.toLowerCase() === "volunteercoordinator" ||
      user.roleName?.toLowerCase() === "coordinator"
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
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Đang tải thông tin điều phối viên...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <XCircle className="h-12 w-12 mx-auto mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  if (!coordinatorProfile) {
    return (
      <div className="text-center py-8 text-gray-500">
        <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Chưa có thông tin hồ sơ điều phối viên</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Job Information */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-blue-600" />
          Thông tin công việc
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Mã nhân viên</Label>
            <p className="text-sm text-gray-700">
              {coordinatorProfile.employeeId || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Chức vụ</Label>
            <p className="text-sm text-gray-700 font-medium">
              {coordinatorProfile.position || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Phòng ban</Label>
            <p className="text-sm text-gray-700">
              {coordinatorProfile.department || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Trạng thái</Label>
            <Badge
              variant={coordinatorProfile.isActive ? "default" : "secondary"}
            >
              {coordinatorProfile.isActive ? "Đang làm việc" : "Đã nghỉ việc"}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Organization Information */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Building className="h-5 w-5 text-green-600" />
          Thông tin tổ chức
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tên tổ chức</Label>
            <p className="text-sm text-gray-700 font-medium">
              {coordinatorProfile.organizationName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Quản lý trực tiếp</Label>
            <p className="text-sm text-gray-700">
              {coordinatorProfile.managerName || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Employment Details */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-purple-600" />
          Thông tin tuyển dụng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Ngày bắt đầu</Label>
            <p className="text-sm text-gray-700">
              {coordinatorProfile.hireDate
                ? new Date(coordinatorProfile.hireDate).toLocaleDateString(
                    "vi-VN"
                  )
                : "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Ngày kết thúc</Label>
            <p className="text-sm text-gray-700">
              {coordinatorProfile.endDate
                ? new Date(coordinatorProfile.endDate).toLocaleDateString(
                    "vi-VN"
                  )
                : "Đang làm việc"}
            </p>
          </div>
          {coordinatorProfile.salary && (
            <div>
              <Label>Mức lương</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <p className="text-sm text-gray-700 font-medium">
                  {coordinatorProfile.salary.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Responsibilities */}
      {coordinatorProfile.responsibilities && (
        <>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-orange-600" />
              Trách nhiệm công việc
            </h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded">
              {coordinatorProfile.responsibilities}
            </p>
          </div>
          <Separator />
        </>
      )}

      {/* Notes */}
      {coordinatorProfile.notes && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Ghi chú</h3>
          <p className="text-sm text-gray-700 bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
            {coordinatorProfile.notes}
          </p>
        </div>
      )}

      {/* Work Duration */}
      {coordinatorProfile.hireDate && (
        <>
          <Separator />
          <div>
            <Label>Thời gian làm việc</Label>
            <p className="text-sm text-gray-600">
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
