import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Camera,
  AlertCircle,
} from "lucide-react";
import { adminProfileService } from "@/services/adminProfileService";
import type { AdminProfileViewModel } from "@/types/adminProfile";
import EditAdminProfileModal from "@/components/admin/profile/EditAdminProfileModal";

export default function AdminProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AdminProfileViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Determine if viewing current user's profile or someone else's
  const targetUserId = id ? parseInt(id, 10) : user?.id;
  const isCurrentUser = !id || user?.id === targetUserId;

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const profileData = await adminProfileService.getMyProfile();
        setProfile(profileData);
      } catch (err: any) {
        console.error("Failed to load admin profile:", err);
        setError(err.message || "Không thể tải thông tin hồ sơ");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, user, navigate]);

  const handleProfileUpdated = (updatedProfile: AdminProfileViewModel) => {
    setProfile(updatedProfile);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && profile && user?.id) {
      try {
        setLoading(true);
        setError(null);
        const updatedProfile = await adminProfileService.uploadAndUpdateAvatar(file, user.id);
        setProfile(updatedProfile);
      } catch (err: any) {
        console.error("Failed to update avatar:", err);
        setError(err.message || "Không thể cập nhật ảnh đại diện");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không tìm thấy thông tin hồ sơ</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950/40 dark:via-pink-950/40 dark:to-red-950/40 min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100/20 via-transparent to-red-100/20 dark:from-rose-900/10 dark:via-transparent dark:to-red-900/10" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="bg-gradient-to-br from-white/90 via-rose-50/30 to-pink-50/30 dark:from-slate-900/90 dark:via-rose-950/30 dark:to-pink-950/30 backdrop-blur-sm border-2 border-rose-200/50 dark:border-rose-700/50 shadow-2xl shadow-rose-200/30 dark:shadow-rose-900/30">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-rose-100 to-red-200 dark:from-rose-800 dark:to-red-700 rounded-full flex items-center justify-center shadow-lg">
                  {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-rose-600 dark:text-rose-300" />
                )}
                </div>
                {isCurrentUser && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-lg"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={loading}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 dark:from-rose-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent">
                    {profile.firstName && profile.lastName
                      ? `${profile.firstName} ${profile.lastName}`
                      : profile.email}
                  </h1>
                  <Badge
                    variant="destructive"
                    className="bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Quản trị viên
                  </Badge>
                  <Badge
                    variant="default"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                  >
                    Đang hoạt động
                  </Badge>
                </div>
                <p className="text-rose-700 dark:text-rose-300">
                  Quản trị viên hệ thống IVAN - Quản lý tổng thể và vận hành
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-rose-600 dark:text-rose-400">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </div>
                  {profile.phoneNumber && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {profile.phoneNumber}
                    </div>
                  )}
                  {profile.createdAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Tham gia từ {new Date(profile.createdAt).getFullYear()}
                    </div>
                  )}
                </div>
              </div>

              {isCurrentUser && (
                <Button 
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa hồ sơ
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-1 bg-gradient-to-r from-white/80 via-rose-50/50 to-pink-50/50 dark:from-slate-900/80 dark:via-rose-950/50 dark:to-pink-950/50 backdrop-blur-sm border border-rose-200/50 dark:border-rose-700/50 shadow-lg">
            <TabsTrigger
              value="info"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-300"
            >
              Thông tin
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="info"
            className="space-y-6 bg-gradient-to-br from-white/60 via-rose-50/30 to-pink-50/30 dark:from-slate-900/60 dark:via-rose-950/30 dark:to-pink-950/30 backdrop-blur-sm border border-rose-200/50 dark:border-rose-700/50 rounded-lg p-4 shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="bg-gradient-to-br from-white/90 via-rose-50/30 to-pink-50/30 dark:from-slate-900/90 dark:via-rose-950/30 dark:to-pink-950/30 backdrop-blur-sm border-2 border-rose-200/50 dark:border-rose-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-rose-800 dark:text-rose-200 font-semibold">
                    Thông tin cá nhân
                  </CardTitle>
                  <CardDescription className="text-rose-600 dark:text-rose-400">
                    Thông tin cơ bản của quản trị viên
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                    <div>
                      <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                        Họ và tên
                      </p>
                      <p className="text-rose-600 dark:text-rose-400">
                        {profile.firstName && profile.lastName
                          ? `${profile.firstName} ${profile.lastName}`
                          : "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                  {profile.dateOfBirth && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                      <div>
                        <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                          Ngày sinh
                        </p>
                        <p className="text-rose-600 dark:text-rose-400">
                          {new Date(profile.dateOfBirth).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                    <div>
                      <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                        Địa chỉ
                      </p>
                      <p className="text-rose-600 dark:text-rose-400">
                        {profile.address || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-gradient-to-br from-white/90 via-rose-50/30 to-pink-50/30 dark:from-slate-900/90 dark:via-rose-950/30 dark:to-pink-950/30 backdrop-blur-sm border-2 border-rose-200/50 dark:border-rose-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-rose-800 dark:text-rose-200 font-semibold">
                    Thông tin liên hệ
                  </CardTitle>
                  <CardDescription className="text-rose-600 dark:text-rose-400">
                    Thông tin liên lạc và đăng nhập
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                    <div>
                      <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                        Email
                      </p>
                      <p className="text-rose-600 dark:text-rose-400">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                    <div>
                      <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                        Số điện thoại
                      </p>
                      <p className="text-rose-600 dark:text-rose-400">
                        {profile.phoneNumber || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card className="md:col-span-2 bg-gradient-to-br from-white/90 via-rose-50/30 to-pink-50/30 dark:from-slate-900/90 dark:via-rose-950/30 dark:to-pink-950/30 backdrop-blur-sm border-2 border-rose-200/50 dark:border-rose-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-rose-800 dark:text-rose-200 font-semibold">
                    Thông tin bổ sung
                  </CardTitle>
                  <CardDescription className="text-rose-600 dark:text-rose-400">
                    Thông tin chi tiết về hồ sơ quản trị viên
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.gender && (
                      <div>
                        <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                          Giới tính
                        </p>
                        <p className="text-rose-600 dark:text-rose-400">
                          {profile.gender}
                        </p>
                      </div>
                    )}
                    {profile.wardCommune && (
                      <div>
                        <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                          Phường/Xã
                        </p>
                        <p className="text-rose-600 dark:text-rose-400">
                          {profile.wardCommune}
                        </p>
                      </div>
                    )}
                    {profile.district && (
                      <div>
                        <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                          Quận/Huyện
                        </p>
                        <p className="text-rose-600 dark:text-rose-400">
                          {profile.district}
                        </p>
                      </div>
                    )}
                    {profile.province && (
                      <div>
                        <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                          Tỉnh/Thành phố
                        </p>
                        <p className="text-rose-600 dark:text-rose-400">
                          {profile.province}
                        </p>
                      </div>
                    )}
                    {profile.emergencyContactName && (
                      <div>
                        <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                          Liên hệ khẩn cấp
                        </p>
                        <p className="text-rose-600 dark:text-rose-400">
                          {profile.emergencyContactName}
                        </p>
                      </div>
                    )}
                    {profile.emergencyContactPhone && (
                      <div>
                        <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                          SĐT khẩn cấp
                        </p>
                        <p className="text-rose-600 dark:text-rose-400">
                          {profile.emergencyContactPhone}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      {profile && (
        <EditAdminProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
}
