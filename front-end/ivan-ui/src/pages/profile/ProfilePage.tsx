import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useVolunteerProfile } from "@/hooks/useVolunteerProfile";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, type User } from "@/types/auth";
import type {
  UserProfile,
  VolunteerProfile,
  OrganizationProfile,
} from "@/types/profile";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  const getUserDisplayName = () => {
    return user.fullName;
  };

  const getUserInitials = () => {
    return user.fullName
      .split(" ")
      .map((n: string) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              {" "}
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">{getUserDisplayName()}</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {user.role === UserRole.VOLUNTEER
                      ? "Tình nguyện viên"
                      : user.role === UserRole.ORGANIZATION
                      ? "Tổ chức"
                      : "Quản trị viên"}
                  </Badge>{" "}
                  {user.role === UserRole.ORGANIZATION &&
                    user.profile &&
                    "isVerified" in user.profile &&
                    user.profile.isVerified && (
                      <Badge className="bg-green-100 text-green-800">
                        Đã xác thực
                      </Badge>
                    )}
                </div>
              </div>
              <div className="ml-auto">
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Hủy" : "Chỉnh sửa"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content based on Role */}
        {user.role === UserRole.VOLUNTEER && (
          <VolunteerProfile user={user} isEditing={isEditing} />
        )}

        {user.role === UserRole.ORGANIZATION && (
          <OrganizationProfile user={user} isEditing={isEditing} />
        )}

        {user.role === UserRole.ADMIN && (
          <AdminProfile user={user} isEditing={isEditing} />
        )}
      </div>
    </div>
  );
}

// Volunteer Profile Component
function VolunteerProfile({
  user,
  isEditing,
}: {
  user: User;
  isEditing: boolean;
}) {
  const [isEditingVolunteer, setIsEditingVolunteer] = useState(false);
  const {
    profile: volunteerProfile,
    loading,
    error,
    loadProfile,
    updateProfile,
    createProfile,
    hasProfile,
  } = useVolunteerProfile({ userId: user.id, autoLoad: true });

  // Form state for editing
  const [formData, setFormData] = useState({
    studentId: "",
    university: "",
    major: "",
    yearOfStudy: "",
    motivation: "",
    experience: "",
    availability: "",
  });

  // Update form data when profile loads
  useEffect(() => {
    if (volunteerProfile) {
      setFormData({
        studentId: volunteerProfile.studentId || "",
        university: volunteerProfile.university || "",
        major: volunteerProfile.major || "",
        yearOfStudy: volunteerProfile.yearOfStudy?.toString() || "",
        motivation: volunteerProfile.motivation || "",
        experience: volunteerProfile.experience || "",
        availability: volunteerProfile.availability || "",
      });
    }
  }, [volunteerProfile]);

  const handleSave = async () => {
    try {
      const updateData = {
        ...formData,
        yearOfStudy: formData.yearOfStudy
          ? parseInt(formData.yearOfStudy)
          : undefined,
        skills: volunteerProfile?.skills || [], // Keep existing skills for now
      };

      if (hasProfile) {
        await updateProfile(updateData);
      } else {
        await createProfile({
          userId: user.id,
          ...updateData,
          skills: [],
        });
      }
      setIsEditingVolunteer(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Đang tải hồ sơ tình nguyện viên...</span>
      </div>
    );
  }

  return (
    <Tabs defaultValue="personal" className="space-y-4">
      <TabsList>
        <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
        <TabsTrigger value="volunteer">Hồ sơ tình nguyện</TabsTrigger>
        <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
        <TabsTrigger value="activities">Hoạt động</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>
              Cập nhật thông tin cá nhân của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  defaultValue={volunteerProfile?.fullName || user.fullName}
                  disabled={true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue={volunteerProfile?.email || user.email}
                  disabled={true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  defaultValue={volunteerProfile?.phoneNumber || ""}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="volunteer">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Hồ sơ tình nguyện viên</CardTitle>
                <CardDescription>
                  Cập nhật thông tin về việc tình nguyện của bạn
                </CardDescription>
              </div>
              <Button
                variant={isEditingVolunteer ? "outline" : "default"}
                onClick={() => setIsEditingVolunteer(!isEditingVolunteer)}
              >
                {isEditingVolunteer ? "Hủy" : "Chỉnh sửa"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">Có lỗi xảy ra: {error}</p>
              </div>
            )}

            {!hasProfile && !isEditingVolunteer && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Bạn chưa có hồ sơ tình nguyện viên
                </p>
                <Button onClick={() => setIsEditingVolunteer(true)}>
                  Tạo hồ sơ tình nguyện viên
                </Button>
              </div>
            )}

            {(hasProfile || isEditingVolunteer) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Mã sinh viên</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) =>
                      handleInputChange("studentId", e.target.value)
                    }
                    disabled={!isEditingVolunteer}
                    placeholder="Nhập mã sinh viên..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">Trường đại học</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) =>
                      handleInputChange("university", e.target.value)
                    }
                    disabled={!isEditingVolunteer}
                    placeholder="Nhập tên trường..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">Chuyên ngành</Label>
                  <Input
                    id="major"
                    value={formData.major}
                    onChange={(e) => handleInputChange("major", e.target.value)}
                    disabled={!isEditingVolunteer}
                    placeholder="Nhập chuyên ngành..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearOfStudy">Năm học</Label>
                  <Select
                    value={formData.yearOfStudy}
                    onValueChange={(value) =>
                      handleInputChange("yearOfStudy", value)
                    }
                    disabled={!isEditingVolunteer}
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
                      <SelectItem value="7">Sau đại học</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {(hasProfile || isEditingVolunteer) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="motivation">Động lực tình nguyện</Label>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) =>
                      handleInputChange("motivation", e.target.value)
                    }
                    disabled={!isEditingVolunteer}
                    rows={3}
                    placeholder="Chia sẻ về động lực tham gia hoạt động tình nguyện..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Kinh nghiệm</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    disabled={!isEditingVolunteer}
                    rows={3}
                    placeholder="Mô tả kinh nghiệm tình nguyện của bạn..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Thời gian rảnh</Label>
                  <Textarea
                    id="availability"
                    value={formData.availability}
                    onChange={(e) =>
                      handleInputChange("availability", e.target.value)
                    }
                    disabled={!isEditingVolunteer}
                    rows={2}
                    placeholder="Mô tả thời gian rảnh của bạn..."
                  />
                </div>

                {hasProfile && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {volunteerProfile?.volunteerHours || 0}
                      </p>
                      <p className="text-sm text-gray-600">Giờ tình nguyện</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {volunteerProfile?.rating
                          ? volunteerProfile.rating.toFixed(1)
                          : "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">Đánh giá</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {volunteerProfile?.ratingCount || 0}
                      </p>
                      <p className="text-sm text-gray-600">Lượt đánh giá</p>
                    </div>
                  </div>
                )}

                {isEditingVolunteer && (
                  <Button onClick={handleSave} className="w-full">
                    {hasProfile ? "Cập nhật hồ sơ" : "Tạo hồ sơ"}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="skills">
        <Card>
          <CardHeader>
            <CardTitle>Kỹ năng</CardTitle>
            <CardDescription>
              Quản lý kỹ năng chuyên môn của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Kỹ năng hiện tại</Label>
              <div className="flex flex-wrap gap-2">
                {volunteerProfile?.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill.skillName}
                    {skill.proficiencyLevel && ` • ${skill.proficiencyLevel}`}
                  </Badge>
                ))}
                {(!volunteerProfile?.skills ||
                  volunteerProfile.skills.length === 0) && (
                  <p className="text-gray-500">Chưa có kỹ năng nào</p>
                )}
              </div>
            </div>
            {hasProfile && volunteerProfile?.isVerified && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <Badge className="bg-green-100 text-green-800">
                  ✓ Đã xác thực
                </Badge>
                <span className="text-sm text-green-700">
                  Hồ sơ của bạn đã được xác thực
                  {volunteerProfile.verifiedAt &&
                    ` vào ${new Date(
                      volunteerProfile.verifiedAt
                    ).toLocaleDateString("vi-VN")}`}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activities">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động tình nguyện</CardTitle>
            <CardDescription>
              Lịch sử tham gia hoạt động tình nguyện
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Tính năng này sẽ được phát triển trong phiên bản tiếp theo
              </p>
              <p className="text-sm text-gray-400">
                Sẽ hiển thị lịch sử tham gia các sự kiện và hoạt động tình
                nguyện
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// Organization Profile Component
function OrganizationProfile({
  user,
  isEditing,
}: {
  user: User;
  isEditing: boolean;
}) {
  const isOrgProfile = (
    profile: UserProfile | undefined
  ): profile is OrganizationProfile => {
    return profile != null && "organizationName" in profile;
  };

  const orgProfile = isOrgProfile(user.profile) ? user.profile : null;
  return (
    <Tabs defaultValue="info" className="space-y-4">
      <TabsList>
        <TabsTrigger value="info">Thông tin tổ chức</TabsTrigger>
        <TabsTrigger value="events">Sự kiện</TabsTrigger>
        <TabsTrigger value="verification">Xác thực</TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tổ chức</CardTitle>
            <CardDescription>
              Cập nhật thông tin về tổ chức của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {" "}
              <div className="space-y-2">
                <Label htmlFor="orgName">Tên tổ chức</Label>
                <Input
                  id="orgName"
                  defaultValue={orgProfile?.organizationName}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgType">Loại tổ chức</Label>
                <Select disabled={!isEditing}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        orgProfile?.organizationType || "Chọn loại tổ chức"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGO">Tổ chức phi chính phủ</SelectItem>
                    <SelectItem value="Non-profit">Tổ chức từ thiện</SelectItem>
                    <SelectItem value="Government">
                      Cơ quan chính phủ
                    </SelectItem>
                    <SelectItem value="Educational">
                      Tổ chức giáo dục
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgPhone">Số điện thoại</Label>
                <Input
                  id="orgPhone"
                  defaultValue={orgProfile?.phoneNumber}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgWebsite">Website</Label>
                <Input
                  id="orgWebsite"
                  defaultValue={orgProfile?.website}
                  disabled={!isEditing}
                />
              </div>
            </div>{" "}
            <div className="space-y-2">
              <Label htmlFor="orgAddress">Địa chỉ</Label>
              <Input
                id="orgAddress"
                defaultValue={orgProfile?.location?.addressLine1}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgDescription">Mô tả tổ chức</Label>
              <Textarea
                id="orgDescription"
                defaultValue={orgProfile?.organizationDescription}
                disabled={!isEditing}
                rows={4}
              />
            </div>
            {isEditing && <Button className="w-full">Lưu thay đổi</Button>}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="events">
        <Card>
          <CardHeader>
            <CardTitle>Sự kiện đã tổ chức</CardTitle>
            <CardDescription>
              Danh sách các sự kiện tình nguyện đã tổ chức
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock events data */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      Hỗ trợ giáo dục trẻ em vùng cao
                    </h4>
                    <p className="text-sm text-gray-600">
                      15/03/2024 - 22/03/2024
                    </p>
                    <p className="text-sm">25 tình nguyện viên đã tham gia</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Hoàn thành
                  </Badge>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      Chương trình bảo vệ môi trường
                    </h4>
                    <p className="text-sm text-gray-600">
                      01/02/2024 - 03/02/2024
                    </p>
                    <p className="text-sm">40 tình nguyện viên đã tham gia</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    Đang diễn ra
                  </Badge>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4">Tạo sự kiện mới</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="verification">
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái xác thực</CardTitle>
            <CardDescription>
              Thông tin về việc xác thực tổ chức
            </CardDescription>
          </CardHeader>{" "}
          <CardContent>
            {orgProfile?.isVerified ? (
              <div className="flex items-center space-x-2 text-green-600">
                <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                <span>Tổ chức đã được xác thực</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-yellow-600">
                  <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                  <span>Tổ chức chưa được xác thực</span>
                </div>
                <p className="text-sm text-gray-600">
                  Để được xác thực, vui lòng cung cấp các tài liệu chứng minh
                  tính hợp pháp của tổ chức.
                </p>
                <Button>Gửi yêu cầu xác thực</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// Admin Profile Component
function AdminProfile({ user, isEditing }: { user: User; isEditing: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin quản trị viên</CardTitle>
        <CardDescription>Cập nhật thông tin cá nhân</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adminName">Họ tên</Label>{" "}
            <Input
              id="adminName"
              defaultValue={user.fullName || ""}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminPhone">Số điện thoại</Label>
            <Input
              id="adminPhone"
              defaultValue={user.profile?.phoneNumber || ""}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminRole">Vai trò</Label>
          <Input id="adminRole" value="Quản trị viên hệ thống" disabled />
        </div>
        {isEditing && <Button className="w-full">Lưu thay đổi</Button>}
      </CardContent>
    </Card>
  );
}
