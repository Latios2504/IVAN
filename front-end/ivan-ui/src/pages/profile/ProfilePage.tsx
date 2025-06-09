import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  const isVolunteerProfile = (
    profile: UserProfile | undefined
  ): profile is VolunteerProfile => {
    return profile != null && "skills" in profile;
  };

  const volunteerProfile = isVolunteerProfile(user.profile)
    ? user.profile
    : null;
  return (
    <Tabs defaultValue="personal" className="space-y-4">
      <TabsList>
        <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
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
              {" "}
              <div className="space-y-2">
                <Label htmlFor="firstName">Họ</Label>
                <Input
                  id="firstName"
                  defaultValue={user.profile?.firstName}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Tên</Label>
                <Input
                  id="lastName"
                  defaultValue={user.profile?.lastName}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  defaultValue={user.profile?.phoneNumber}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  defaultValue={user.profile?.dateOfBirth}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                defaultValue={user.profile?.location?.addressLine1}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Giới thiệu bản thân</Label>
              <Textarea
                id="bio"
                defaultValue={user.profile?.bio}
                disabled={!isEditing}
                rows={4}
              />
            </div>
            {isEditing && <Button className="w-full">Lưu thay đổi</Button>}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="skills">
        <Card>
          <CardHeader>
            <CardTitle>Kỹ năng & Sở thích</CardTitle>
            <CardDescription>
              Quản lý kỹ năng và sở thích của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {" "}
            <div className="space-y-2">
              <Label>Kỹ năng</Label>
              <div className="flex flex-wrap gap-2">
                {volunteerProfile?.skills?.map(
                  (skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  )
                )}
                {(!volunteerProfile?.skills ||
                  volunteerProfile.skills.length === 0) && (
                  <p className="text-gray-500">Chưa có kỹ năng nào</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sở thích/Lĩnh vực quan tâm</Label>
              <div className="flex flex-wrap gap-2">
                {volunteerProfile?.preferredVolunteerTypes
                  ?.split(", ")
                  .map((interest: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                {!volunteerProfile?.preferredVolunteerTypes && (
                  <p className="text-gray-500">Chưa có lĩnh vực quan tâm nào</p>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newSkill">Thêm kỹ năng mới</Label>
                  <Input id="newSkill" placeholder="Nhập kỹ năng..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newInterest">Thêm sở thích mới</Label>
                  <Input id="newInterest" placeholder="Nhập sở thích..." />
                </div>
                <Button>Cập nhật kỹ năng</Button>
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
            <div className="space-y-4">
              {/* Mock activity data */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">
                  Hỗ trợ giáo dục trẻ em vùng cao
                </h4>
                <p className="text-sm text-gray-600">
                  Tổ chức ABC • 15/03/2024 - 22/03/2024
                </p>
                <p className="text-sm">
                  Tham gia giảng dạy và hỗ trợ học tập cho trẻ em
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">
                  Chương trình bảo vệ môi trường
                </h4>
                <p className="text-sm text-gray-600">
                  Tổ chức XYZ • 01/02/2024 - 03/02/2024
                </p>
                <p className="text-sm">
                  Tham gia làm sạch bãi biển và trồng cây
                </p>
              </div>
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
