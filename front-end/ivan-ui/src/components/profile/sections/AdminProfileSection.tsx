import { useState } from "react";
import type { AdminProfile } from "@/types/profile/profiles";
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
  Shield,
  Activity,
  Clock,
} from "lucide-react";

interface AdminProfileSectionProps {
  profile: AdminProfile | null;
  isEditing: boolean;
  isCurrentUser: boolean;
  onSave: (data: Partial<AdminProfile>) => Promise<void>;
}

export default function AdminProfileSection({
  profile,
  isEditing,
  isCurrentUser,
  onSave,
}: AdminProfileSectionProps) {
  const [formData, setFormData] = useState<Partial<AdminProfile>>({
    fullName: profile?.fullName || "",
    phoneNumber: profile?.phoneNumber || "",
    dateOfBirth: profile?.dateOfBirth || "",
    gender: profile?.gender,
    address: profile?.address || "",
    emergencyContactName: profile?.emergencyContactName || "",
    emergencyContactPhone: profile?.emergencyContactPhone || "",
  });

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy thông tin quản trị viên</p>
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

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleString("vi-VN");
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
            Chỉnh sửa thông tin quản trị viên
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
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Thông tin quản trị viên</h2>
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
              <Shield className="h-5 w-5" />
              Thông tin quản trị
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium text-blue-600">
                  {profile.adminLevel || "Super Admin"}
                </p>
                <p className="text-sm text-gray-500">Cấp độ quản trị</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-green-500" />
              <div>
                <p className="font-medium text-green-600">
                  {profile.totalActionsPerformed || 0} hành động
                </p>
                <p className="text-sm text-gray-500">Tổng số thao tác</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="font-medium text-orange-600">
                  {formatDateTime(profile.lastLoginAt)}
                </p>
                <p className="text-sm text-gray-500">Đăng nhập cuối</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">{formatDate(profile.createdAt)}</p>
                <p className="text-sm text-gray-500">Ngày tạo tài khoản</p>
              </div>
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

        {profile.permissions && profile.permissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Quyền hạn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.permissions.map((permission, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
