import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { volunteerProfileService } from "@/services/volunteerProfileService";
import type {
  VolunteerProfileViewModel,
  UpdateVolunteerProfileDto,
  VolunteerSkillDto,
  SkillDto,
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
  Search,
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
  const [editFormData, setEditFormData] = useState<UpdateVolunteerProfileDto>({
    Skills: [],
  });

  const [availableSkills, setAvailableSkills] = useState<SkillDto[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");

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
    } catch (err: any) {
      console.error("Error loading profile:", err);
      // Handle .NET API error response format
      let errorMessage = "Không thể tải hồ sơ";
      if (err?.response?.data) {
        const errorData = err.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.title) {
          errorMessage = errorData.title;
        } else if (errorData.errors) {
          // Handle validation errors
          const validationErrors = Object.values(errorData.errors).flat();
          errorMessage = validationErrors.join(", ");
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSkills = async () => {
    try {
      setSkillsLoading(true);
      const skills = await volunteerProfileService.getSkills();
      setAvailableSkills(skills);
    } catch (error) {
      console.error("Error loading skills:", error);
      // Don't show error to user, just log it
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleEditClick = () => {
    if (profile) {
      // Split fullName into firstName and lastName for editing
      const nameParts = profile.fullName?.split(" ") || [];
      const firstName = nameParts[nameParts.length - 1] || ""; // Last part is firstName in Vietnamese
      const lastName = nameParts.slice(0, -1).join(" ") || ""; // Everything else is lastName

      setEditFormData({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: profile.phoneNumber || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || "",
        address: profile.address || "",
        // These fields are not in ViewModel but needed for UpdateDto
        wardCommune: "", // Not available in ViewModel
        district: "", // Not available in ViewModel
        province: "", // Not available in ViewModel
        postalCode: "", // Not available in ViewModel
        emergencyContactName: "", // Not available in ViewModel
        emergencyContactPhone: "", // Not available in ViewModel
        emergencyContactRelation: "", // Not available in ViewModel
        avatar: profile.avatar || "",
        // VolunteerProfile fields
        university: profile.university || "",
        major: profile.major || "",
        yearOfStudy: profile.yearOfStudy || 1,
        studentId: profile.studentId || "",
        motivation: profile.motivation || "",
        experience: profile.experience || "",
        availability: profile.availability || "",
        // Handle skills - use volunteerSkills array if available
        Skills: profile.volunteerSkills || [],
      });

      // Load available skills when opening edit modal
      loadAvailableSkills();
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateProfile = async () => {
    if (!targetUserId) return;

    try {
      setIsUpdating(true);
      setError(null);
      await volunteerProfileService.updateVolunteerProfile(
        targetUserId,
        editFormData
      );
      setIsEditModalOpen(false);
      await loadProfile(); // Reload profile data
    } catch (err: any) {
      console.error("Error updating profile:", err);
      // Handle .NET API error response format
      let errorMessage = "Không thể cập nhật hồ sơ";
      if (err?.response?.data) {
        const errorData = err.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.title) {
          errorMessage = errorData.title;
        } else if (errorData.errors) {
          // Handle validation errors
          const validationErrors = Object.values(errorData.errors).flat();
          errorMessage = validationErrors.join(", ");
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
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

            {/* Academic Information */}
            <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900 border-green-200/50 dark:border-green-700/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-800/50 dark:to-emerald-800/50 border-b border-green-200/30 dark:border-green-700/30">
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Thông tin học tập
                </CardTitle>
                <CardDescription>
                  Thông tin về trường học và chuyên ngành
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Trường đại học</p>
                    <p className="text-gray-600">
                      {profile.university || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Chuyên ngành</p>
                    <p className="text-gray-600">
                      {profile.major || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Năm học</p>
                    <p className="text-gray-600">
                      {profile.yearOfStudy
                        ? `Năm ${profile.yearOfStudy}`
                        : "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Mã số sinh viên</p>
                    <p className="text-gray-600">
                      {profile.studentId || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Volunteer Information */}
            <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900 border-purple-200/50 dark:border-purple-700/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-800/50 dark:to-pink-800/50 border-b border-purple-200/30 dark:border-purple-700/30">
                <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Thông tin tình nguyện
                </CardTitle>
                <CardDescription>
                  Chi tiết về hoạt động tình nguyện
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Động lực tham gia</p>
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
                  <p className="text-sm font-medium mb-2">
                    Thời gian có thể tham gia
                  </p>
                  <p className="text-gray-600 text-sm">
                    {profile.availability || "Chưa cập nhật"}
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

            {/* Statistics & Verification */}
            <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900 border-orange-200/50 dark:border-orange-700/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-100/50 to-yellow-100/50 dark:from-orange-800/50 dark:to-yellow-800/50 border-b border-orange-200/30 dark:border-orange-700/30">
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Thống kê & Xác minh
                </CardTitle>
                <CardDescription>
                  Thông tin về hoạt động và xác minh
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Tổng giờ tình nguyện</p>
                    <p className="text-gray-600">
                      {profile.totalHoursVolunteered || 0} giờ
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Đánh giá</p>
                    <p className="text-gray-600">
                      {profile.rating
                        ? `${profile.rating}/5 (${profile.ratingCount} đánh giá)`
                        : "Chưa có đánh giá"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Trạng thái xác minh</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={profile.isVerified ? "default" : "secondary"}
                      >
                        {profile.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                      </Badge>
                      {profile.isVerified && profile.verifiedAt && (
                        <span className="text-xs text-gray-500">
                          {new Date(profile.verifiedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {profile.verifiedByName && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Xác minh bởi</p>
                      <p className="text-gray-600 text-sm">
                        {profile.verifiedByName}
                      </p>
                    </div>
                  </div>
                )}
                {profile.lastActiveDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Hoạt động gần nhất</p>
                      <p className="text-gray-600 text-sm">
                        {new Date(profile.lastActiveDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>
                )}
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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.volunteerSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg border border-blue-200/50 dark:border-blue-700/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                            {skill.skillName}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {skill.proficiencyLevel || "Cơ bản"}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          {skill.yearsOfExperience !== undefined &&
                            skill.yearsOfExperience > 0 && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {skill.yearsOfExperience} năm kinh nghiệm
                                </span>
                              </div>
                            )}

                          {skill.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {skill.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
      </Tabs>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent
          className="w-[80vw] max-w-5xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900 border-blue-200/50 dark:border-blue-700/50"
          style={{ width: "80vw", maxWidth: "64rem" }}
        >
          <DialogHeader className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-800/50 dark:to-indigo-800/50 rounded-t-lg p-4 -m-6 mb-6 border-b border-blue-200/30 dark:border-blue-700/30">
            <DialogTitle className="text-blue-800 dark:text-blue-200">
              Chỉnh sửa hồ sơ tình nguyện viên
            </DialogTitle>
            <DialogDescription className="text-blue-600 dark:text-blue-300">
              Cập nhật thông tin cá nhân và chi tiết hồ sơ của bạn
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Information */}
            <div className="space-y-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                Thông tin cá nhân
              </h3>

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
                <Label htmlFor="skills">Kỹ năng</Label>
                {skillsLoading ? (
                  <div className="flex items-center justify-center p-4 border rounded-md">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    <span className="text-sm text-gray-500">
                      Đang tải danh sách kỹ năng...
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Search box */}
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Tìm kiếm kỹ năng..."
                        value={skillSearchTerm}
                        onChange={(e) => setSkillSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>

                    <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {availableSkills
                          .filter(
                            (skill) =>
                              skill.skillName
                                .toLowerCase()
                                .includes(skillSearchTerm.toLowerCase()) ||
                              (skill.category &&
                                skill.category
                                  .toLowerCase()
                                  .includes(skillSearchTerm.toLowerCase()))
                          )
                          .map((skill) => {
                            const isSelected =
                              editFormData.Skills?.some(
                                (s) => s.skillId === skill.skillId
                              ) || false;

                            return (
                              <label
                                key={skill.skillId}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const currentSkills =
                                      editFormData.Skills || [];
                                    let newSkills;

                                    if (e.target.checked) {
                                      // Add skill
                                      newSkills = [
                                        ...currentSkills,
                                        {
                                          skillId: skill.skillId,
                                          skillName: skill.skillName,
                                          proficiencyLevel: "Cơ bản",
                                          yearsOfExperience: 0,
                                          description: "",
                                        },
                                      ];
                                    } else {
                                      // Remove skill
                                      newSkills = currentSkills.filter(
                                        (s) => s.skillId !== skill.skillId
                                      );
                                    }

                                    handleInputChange("Skills", newSkills);
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-sm">
                                  {skill.skillName}
                                </span>
                                {skill.category && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                                    {skill.category}
                                  </span>
                                )}
                              </label>
                            );
                          })}
                      </div>
                    </div>

                    {/* Display selected skills */}
                    {editFormData.Skills && editFormData.Skills.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Kỹ năng đã chọn:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {editFormData.Skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill.skillName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-gray-500">
                      Chọn các kỹ năng phù hợp từ danh sách có sẵn. Bạn có thể
                      chọn nhiều kỹ năng.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="md:col-span-2 space-y-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-lg border border-purple-200/30 dark:border-purple-700/30">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                Thông tin bổ sung
              </h3>

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
