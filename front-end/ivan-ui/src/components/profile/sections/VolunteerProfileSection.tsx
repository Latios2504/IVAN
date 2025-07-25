import { useState } from "react";
import type { VolunteerProfile } from "@/types/profiles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  User,
  Check,
  GraduationCap,
  Clock,
  Star,
} from "lucide-react";

interface VolunteerProfileSectionProps {
  profile: VolunteerProfile | null;
  isEditing: boolean;
  isCurrentUser: boolean;
  onSave: (data: Partial<VolunteerProfile>) => Promise<void>;
}

export default function VolunteerProfileSection({
  profile,
  isEditing,
  isCurrentUser,
  onSave,
}: VolunteerProfileSectionProps) {
  const [formData, setFormData] = useState<Partial<VolunteerProfile>>({
    fullName: profile?.fullName || "",
    phoneNumber: profile?.phoneNumber || "",
    dateOfBirth: profile?.dateOfBirth || "",
    gender: profile?.gender,
    address: profile?.address || "",
    studentId: profile?.studentId || "",
    university: profile?.university || "",
    major: profile?.major || "",
    yearOfStudy: profile?.yearOfStudy || 1,
    motivation: profile?.motivation || "",
    experience: profile?.experience || "",
    availability: profile?.availability || "",
    emergencyContactName: profile?.emergencyContactName || "",
    emergencyContactPhone: profile?.emergencyContactPhone || "",
  });

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy thông tin hồ sơ</p>
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
          <h2 className="text-2xl font-bold">Chỉnh sửa thông tin cá nhân</h2>
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
                Thông tin cơ bản
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
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Nam</SelectItem>
                    <SelectItem value="Female">Nữ</SelectItem>
                    <SelectItem value="Other">Khác</SelectItem>
                    <SelectItem value="Prefer not to say">
                      Không muốn tiết lộ
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                <GraduationCap className="h-5 w-5" />
                Thông tin học tập
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="studentId">Mã số sinh viên</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) =>
                    handleInputChange("studentId", e.target.value)
                  }
                  placeholder="Nhập mã số sinh viên"
                />
              </div>

              <div>
                <Label htmlFor="university">Trường đại học</Label>
                <Input
                  id="university"
                  value={formData.university}
                  onChange={(e) =>
                    handleInputChange("university", e.target.value)
                  }
                  placeholder="Nhập tên trường đại học"
                />
              </div>

              <div>
                <Label htmlFor="major">Chuyên ngành</Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  placeholder="Nhập chuyên ngành"
                />
              </div>

              <div>
                <Label htmlFor="yearOfStudy">Năm học</Label>
                <Select
                  value={formData.yearOfStudy?.toString()}
                  onValueChange={(value) =>
                    handleInputChange("yearOfStudy", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn năm học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Năm 1</SelectItem>
                    <SelectItem value="2">Năm 2</SelectItem>
                    <SelectItem value="3">Năm 3</SelectItem>
                    <SelectItem value="4">Năm 4</SelectItem>
                    <SelectItem value="5">Năm 5</SelectItem>
                    <SelectItem value="6">Năm 6</SelectItem>
                  </SelectContent>
                </Select>
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
              <CardTitle>Thông tin tình nguyện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="availability">Thời gian có thể tham gia</Label>
                <Textarea
                  id="availability"
                  value={formData.availability}
                  onChange={(e) =>
                    handleInputChange("availability", e.target.value)
                  }
                  placeholder="Mô tả thời gian có thể tham gia hoạt động"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Động lực tham gia</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.motivation}
              onChange={(e) => handleInputChange("motivation", e.target.value)}
              placeholder="Chia sẻ về động lực tham gia hoạt động tình nguyện..."
              rows={3}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kinh nghiệm</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              placeholder="Mô tả kinh nghiệm tình nguyện, kỹ năng liên quan..."
              rows={3}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display mode
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin cơ bản
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
              <GraduationCap className="h-5 w-5" />
              Thông tin học tập
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.studentId || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Mã số sinh viên</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.university || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Trường đại học</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.major || "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Chuyên ngành</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">
                  {profile.yearOfStudy
                    ? `Năm ${profile.yearOfStudy}`
                    : "Chưa cập nhật"}
                </p>
                <p className="text-sm text-gray-500">Năm học</p>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Thống kê hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium text-blue-600">
                  {profile.totalHoursVolunteered} giờ
                </p>
                <p className="text-sm text-gray-500">Tổng giờ tình nguyện</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-600">
                  {profile.rating.toFixed(1)}/5.0 ({profile.ratingCount} đánh
                  giá)
                </p>
                <p className="text-sm text-gray-500">Xếp hạng</p>
              </div>
            </div>

            {profile.isVerified && (
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium text-green-600">Đã xác minh</p>
                  <p className="text-sm text-gray-500">Trạng thái tài khoản</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {profile.motivation && (
        <Card>
          <CardHeader>
            <CardTitle>Động lực tham gia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {profile.motivation}
            </p>
          </CardContent>
        </Card>
      )}

      {profile.experience && (
        <Card>
          <CardHeader>
            <CardTitle>Kinh nghiệm</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {profile.experience}
            </p>
          </CardContent>
        </Card>
      )}

      {profile.availability && (
        <Card>
          <CardHeader>
            <CardTitle>Thời gian có thể tham gia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {profile.availability}
            </p>
          </CardContent>
        </Card>
      )}

      {profile.skills && profile.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kỹ năng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.skills.map((skill) => (
                <div
                  key={skill.skillId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{skill.skillName}</p>
                    {skill.category && (
                      <p className="text-sm text-gray-500">{skill.category}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {skill.proficiencyLevel}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {skill.yearsOfExperience} năm kinh nghiệm
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
