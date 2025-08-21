import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { volunteerProfileService } from "@/services/volunteerProfileService";
import type {
  VolunteerProfileViewModel,
  UpdateVolunteerProfileDto,
  VolunteerSkillDto,
} from "@/types/volunteerProfile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Clock,
  Settings,
  Shield,
  Edit,
  Camera,
  Star,
} from "lucide-react";

export default function VolunteerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<VolunteerProfileViewModel | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateVolunteerProfileDto>(
    {}
  );

  // Determine if viewing current user's profile or someone else's
  const targetUserId = id ? parseInt(id, 10) : user?.id;
  const isCurrentUser = !id || user?.id === targetUserId;

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    // Check if user is volunteer when viewing own profile
    if (isCurrentUser && user.role !== "volunteer") {
      navigate("/dashboard");
      return;
    }

    loadProfile();
  }, [user, isAuthenticated, navigate, targetUserId, isCurrentUser]);

  const loadProfile = async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      setError(null);
      const profileData = await volunteerProfileService.getVolunteerProfile(
        targetUserId
      );
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (profile) {
      // Split fullName into firstName and lastName for editing
      const nameParts = profile.fullName.split(" ");
      const firstName = nameParts[nameParts.length - 1] || ""; // Last part is firstName in Vietnamese
      const lastName = nameParts.slice(0, -1).join(" ") || ""; // Everything else is lastName

      setEditFormData({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: profile.phoneNumber || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || "",
        address: profile.address || "",
        // Note: wardCommune, district, province, postalCode are not in ViewModel
        university: profile.university || "",
        major: profile.major || "",
        yearOfStudy: profile.yearOfStudy || 1,
        studentId: profile.studentId || "",
        motivation: profile.motivation || "",
        experience: profile.experience || "",
        availability: profile.availability || "",
        // Handle skills - convert from string to VolunteerSkillDto array if needed
        skills: profile.volunteerSkills || [],
        avatar: profile.avatar || "",
      });
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateProfile = async () => {
    if (!targetUserId) return;

    try {
      setIsUpdating(true);
      await volunteerProfileService.updateVolunteerProfile(
        targetUserId,
        editFormData
      );
      setIsEditModalOpen(false);
      await loadProfile(); // Reload profile data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật hồ sơ");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (
    field: keyof UpdateVolunteerProfileDto,
    value: string | number | VolunteerSkillDto[]
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lỗi tải hồ sơ
          </h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={loadProfile} className="mt-4">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy hồ sơ
          </h2>
          <p className="text-gray-600">
            {isCurrentUser
              ? "Hãy tạo hồ sơ tình nguyện viên của bạn"
              : "Hồ sơ không tồn tại"}
          </p>
          {isCurrentUser && (
            <Button
              onClick={() => navigate("/volunteer/profile/create")}
              className="mt-4"
            >
              Tạo hồ sơ
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-800/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              {isCurrentUser && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  variant="secondary"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.fullName}
              </h1>
              <p className="text-gray-600 flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2" />
                {profile.email}
              </p>
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="mr-2">
                  <Star className="w-3 h-3 mr-1" />
                  Tình nguyện viên
                </Badge>
                {profile.isActive && (
                  <Badge variant="default">
                    <Shield className="w-3 h-3 mr-1" />
                    Đang hoạt động
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {isCurrentUser && (
            <div className="mt-4 md:mt-0">
              <Button onClick={handleEditClick}>
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6 bg-gradient-to-r from-white/90 to-indigo-50/90 dark:from-gray-800/90 dark:to-indigo-800/90 backdrop-blur-sm rounded-xl border border-indigo-200/50 dark:border-indigo-700/50 shadow-lg p-6"
      >
        <TabsList className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 border-b border-blue-200/50 dark:border-blue-700/50">
          <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
          <TabsTrigger value="activities">Hoạt động</TabsTrigger>
          {isCurrentUser && <TabsTrigger value="settings">Cài đặt</TabsTrigger>}
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900 border-blue-200/50 dark:border-blue-700/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-800/50 dark:to-indigo-800/50 border-b border-blue-200/30 dark:border-blue-700/30">
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Thông tin cá nhân
                </CardTitle>
                <CardDescription>
                  Thông tin cơ bản về tình nguyện viên
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Họ và tên</p>
                    <p className="text-gray-600">{profile.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Số điện thoại</p>
                    <p className="text-gray-600">
                      {profile.phoneNumber || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Địa chỉ</p>
                    <p className="text-gray-600">
                      {profile.address || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Ngày sinh</p>
                    <p className="text-gray-600">
                      {profile.dateOfBirth
                        ? new Date(profile.dateOfBirth).toLocaleDateString(
                            "vi-VN"
                          )
                        : "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900 border-purple-200/50 dark:border-purple-700/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-800/50 dark:to-pink-800/50 border-b border-purple-200/30 dark:border-purple-700/30">
                <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Thông tin bổ sung
                </CardTitle>
                <CardDescription>
                  Chi tiết về hoạt động tình nguyện
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Mô tả bản thân</p>
                  <p className="text-gray-600 text-sm">
                    {profile.motivation || "Chưa có mô tả"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Kinh nghiệm</p>
                  <p className="text-gray-600 text-sm">
                    {profile.experience || "Chưa cập nhật"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Trạng thái</p>
                  <Badge variant={profile.isActive ? "default" : "secondary"}>
                    {profile.isActive ? "Đang hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900 border-green-200/50 dark:border-green-700/50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-800/50 dark:to-emerald-800/50 border-b border-green-200/30 dark:border-green-700/30">
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                Kỹ năng và chuyên môn
              </CardTitle>
              <CardDescription>Danh sách kỹ năng của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.volunteerSkills && profile.volunteerSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.volunteerSkills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill.skillName}
                    </Badge>
                  ))}
                </div>
              ) : profile.skills ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.split(",").map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Chưa có kỹ năng nào</p>
                  {isCurrentUser && (
                    <Button
                      variant="outline"
                      onClick={handleEditClick}
                      className="mt-4"
                    >
                      Thêm kỹ năng
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900 border-orange-200/50 dark:border-orange-700/50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-100/50 to-amber-100/50 dark:from-orange-800/50 dark:to-amber-800/50 border-b border-orange-200/30 dark:border-orange-700/30">
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                Lịch sử hoạt động
              </CardTitle>
              <CardDescription>
                Các hoạt động tình nguyện đã tham gia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Chưa có hoạt động nào</p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/events")}
                  className="mt-4"
                >
                  Tìm kiếm sự kiện
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isCurrentUser && (
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900 border-red-200/50 dark:border-red-700/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-100/50 to-rose-100/50 dark:from-red-800/50 dark:to-rose-800/50 border-b border-red-200/30 dark:border-red-700/30">
                <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <Settings className="h-5 w-5 text-red-600 dark:text-red-400" />
                  Cài đặt tài khoản
                </CardTitle>
                <CardDescription>
                  Quản lý tài khoản và quyền riêng tư
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Thay đổi mật khẩu
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Cài đặt quyền riêng tư
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Cài đặt thông báo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent
          className="w-[80vw] max-w-5xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900 border-blue-200/50 dark:border-blue-700/50"
          style={{ width: "80vw", maxWidth: "64rem" }}
        >
          <DialogHeader className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-800/50 dark:to-indigo-800/50 rounded-t-lg p-4 -m-6 mb-6 border-b border-blue-200/30 dark:border-blue-700/30">
            <DialogTitle className="text-blue-800 dark:text-blue-200">Chỉnh sửa hồ sơ tình nguyện viên</DialogTitle>
            <DialogDescription className="text-blue-600 dark:text-blue-300">
              Cập nhật thông tin cá nhân và chi tiết hồ sơ của bạn
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Information */}
            <div className="space-y-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Thông tin cá nhân</h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="firstName">Tên</Label>
                  <Input
                    id="firstName"
                    value={editFormData.firstName || ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Họ và tên đệm</Label>
                  <Input
                    id="lastName"
                    value={editFormData.lastName || ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  value={editFormData.phoneNumber || ""}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={editFormData.dateOfBirth || ""}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  value={editFormData.gender || ""}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  id="address"
                  value={editFormData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="wardCommune">Phường/Xã</Label>
                  <Input
                    id="wardCommune"
                    value={editFormData.wardCommune || ""}
                    onChange={(e) =>
                      handleInputChange("wardCommune", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="district">Quận/Huyện</Label>
                  <Input
                    id="district"
                    value={editFormData.district || ""}
                    onChange={(e) =>
                      handleInputChange("district", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="province">Tỉnh/Thành phố</Label>
                  <Input
                    id="province"
                    value={editFormData.province || ""}
                    onChange={(e) =>
                      handleInputChange("province", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Academic & Professional Information */}
            <div className="space-y-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-lg border border-green-200/30 dark:border-green-700/30">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Thông tin học tập & nghề nghiệp
              </h3>

              <div>
                <Label htmlFor="university">Trường đại học</Label>
                <Input
                  id="university"
                  value={editFormData.university || ""}
                  onChange={(e) =>
                    handleInputChange("university", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="major">Chuyên ngành</Label>
                <Input
                  id="major"
                  value={editFormData.major || ""}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="yearOfStudy">Năm học</Label>
                <Input
                  id="yearOfStudy"
                  type="number"
                  min="1"
                  max="6"
                  value={editFormData.yearOfStudy || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "yearOfStudy",
                      parseInt(e.target.value) || 1
                    )
                  }
                />
              </div>

              <div>
                <Label htmlFor="studentId">Mã số sinh viên</Label>
                <Input
                  id="studentId"
                  value={editFormData.studentId || ""}
                  onChange={(e) =>
                    handleInputChange("studentId", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="skills">
                  Kỹ năng (phân cách bằng dấu phẩy)
                </Label>
                <Textarea
                  id="skills"
                  value={
                    editFormData.skills?.map((s) => s.skillName).join(", ") ||
                    ""
                  }
                  onChange={(e) => {
                    // Convert comma-separated string back to VolunteerSkillDto array
                    const skillNames = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s);
                    const skillDtos = skillNames.map((name, index) => ({
                      skillId: index + 1, // Temporary ID, should be handled properly in backend
                      skillName: name,
                    }));
                    handleInputChange("skills", skillDtos);
                  }}
                  placeholder="Ví dụ: Tiếng Anh, Tin học, Giao tiếp..."
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="md:col-span-2 space-y-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-lg border border-purple-200/30 dark:border-purple-700/30">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">Thông tin bổ sung</h3>

              <div>
                <Label htmlFor="motivation">Động lực tham gia</Label>
                <Textarea
                  id="motivation"
                  value={editFormData.motivation || ""}
                  onChange={(e) =>
                    handleInputChange("motivation", e.target.value)
                  }
                  placeholder="Chia sẻ lý do bạn muốn tham gia hoạt động tình nguyện..."
                />
              </div>

              <div>
                <Label htmlFor="experience">Kinh nghiệm</Label>
                <Textarea
                  id="experience"
                  value={editFormData.experience || ""}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  placeholder="Mô tả kinh nghiệm tình nguyện hoặc hoạt động xã hội đã tham gia..."
                />
              </div>

              <div>
                <Label htmlFor="availability">Thời gian có thể tham gia</Label>
                <Textarea
                  id="availability"
                  value={editFormData.availability || ""}
                  onChange={(e) =>
                    handleInputChange("availability", e.target.value)
                  }
                  placeholder="Ví dụ: Cuối tuần, buổi tối, ngày lễ..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyContactName">
                    Tên người liên hệ khẩn cấp
                  </Label>
                  <Input
                    id="emergencyContactName"
                    value={editFormData.emergencyContactName || ""}
                    onChange={(e) =>
                      handleInputChange("emergencyContactName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactPhone">SĐT khẩn cấp</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={editFormData.emergencyContactPhone || ""}
                    onChange={(e) =>
                      handleInputChange("emergencyContactPhone", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactRelation">Mối quan hệ</Label>
                  <Input
                    id="emergencyContactRelation"
                    value={editFormData.emergencyContactRelation || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "emergencyContactRelation",
                        e.target.value
                      )
                    }
                    placeholder="Ví dụ: Cha, Mẹ, Anh/Chị..."
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-800/50 rounded-b-lg p-4 -m-6 mt-6 border-t border-blue-200/30 dark:border-blue-700/30">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdating}
              className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateProfile} 
              disabled={isUpdating}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white border-0 hover:from-blue-600 hover:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 shadow-lg"
            >
              {isUpdating ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
