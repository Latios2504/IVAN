import { useState } from "react";
import type { CoordinatorProfile } from "@/types/profile/profiles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  User,
  Check,
  Building2,
  Users,
  BriefcaseIcon,
} from "lucide-react";

interface CoordinatorProfileSectionProps {
  profile: CoordinatorProfile | null;
  isEditing: boolean;
  isCurrentUser: boolean;
  onSave: (data: Partial<CoordinatorProfile>) => Promise<void>;
}

export default function CoordinatorProfileSection({
  profile,
  isEditing,
  isCurrentUser,
  onSave,
}: CoordinatorProfileSectionProps) {
  const [formData, setFormData] = useState<Partial<CoordinatorProfile>>({
    fullName: profile?.fullName || "",
    phoneNumber: profile?.phoneNumber || "",
    dateOfBirth: profile?.dateOfBirth || "",
    gender: profile?.gender,
    address: profile?.address || "",
    employeeId: profile?.employeeId || "",
    position: profile?.position || "",
    department: profile?.department || "",
    responsibilities: profile?.responsibilities || "",
    emergencyContactName: profile?.emergencyContactName || "",
    emergencyContactPhone: profile?.emergencyContactPhone || "",
  });

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy thông tin điều phối viên</p>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await onSave(formData);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getGenderDisplay = (gender?: string) => {
    switch (gender) {
      case "Male":
        return "Nam";
      case "Female":
        return "Nữ";
      case "Other":
        return "Khác";
      case "Prefer not to say":
        return "Không muốn tiết lộ";
      default:
        return "Chưa cập nhật";
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Chỉnh sửa thông tin điều phối viên
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Lưu
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Nhập địa chỉ"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5" />
                Thông tin công việc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="employeeId">Mã nhân viên</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) =>
                    handleInputChange("employeeId", e.target.value)
                  }
                  placeholder="Nhập mã nhân viên"
                />
              </div>

              <div>
                <Label htmlFor="position">Chức vụ</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  placeholder="Nhập chức vụ"
                />
              </div>

              <div>
                <Label htmlFor="department">Phòng ban</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  placeholder="Nhập phòng ban"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Liên hệ khẩn cấp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emergencyContactName">Tên người liên hệ</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) =>
                    handleInputChange("emergencyContactName", e.target.value)
                  }
                  placeholder="Tên người liên hệ khẩn cấp"
                />
              </div>

              <div>
                <Label htmlFor="emergencyContactPhone">Số điện thoại</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) =>
                    handleInputChange("emergencyContactPhone", e.target.value)
                  }
                  placeholder="Số điện thoại khẩn cấp"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mô tả công việc</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.responsibilities}
                onChange={(e) =>
                  handleInputChange("responsibilities", e.target.value)
                }
                placeholder="Mô tả trách nhiệm và công việc chính..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Thông tin điều phối viên</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.fullName || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Họ và tên</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.email || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Email</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.phoneNumber || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Số điện thoại</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">{formatDate(profile.dateOfBirth)}</p>
                <p className="text-sm text-gray-500">Ngày sinh</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {getGenderDisplay(profile.gender)}
                </p>
                <p className="text-sm text-gray-500">Giới tính</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <p className="font-medium">
                  {profile.address || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Địa chỉ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BriefcaseIcon className="h-5 w-5" />
              Thông tin công việc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.organizationName || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Tổ chức</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BriefcaseIcon className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.employeeId || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Mã nhân viên</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.position || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Chức vụ</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.department || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Phòng ban</p>
              </div>
            </div>

            {profile.hireDate && (
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{formatDate(profile.hireDate)}</p>
                  <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                </div>
              </div>
            )}

            {profile.managerName && (
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{profile.managerName}</p>
                  <p className="text-sm text-gray-500">Người quản lý</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Liên hệ khẩn cấp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.emergencyContactName || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Tên người liên hệ</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.emergencyContactPhone || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Số điện thoại</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {profile.responsibilities && (
          <Card>
            <CardHeader>
              <CardTitle>Mô tả công việc</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {profile.responsibilities}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {profile.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Ghi chú</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {profile.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
