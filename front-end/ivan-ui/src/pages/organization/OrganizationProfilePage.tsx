import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { organizationProfileService } from "@/services/organizationProfileService";
import type {
  OrganizationProfileViewModel,
  UpdateOrganizationProfileDto,
} from "@/types/organizationProfile";
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
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Camera,
  FileText,
  Globe,
  Users,
} from "lucide-react";

export default function OrganizationProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<OrganizationProfileViewModel | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] =
    useState<UpdateOrganizationProfileDto>({
      userId: 0,
      organizationName: "",
      typeId: 1,
    });

  // Determine if viewing current user's profile or someone else's
  const targetUserId = id ? parseInt(id, 10) : user?.id;
  const isCurrentUser = !id || user?.id === targetUserId;

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    // Check if user is organization when viewing own profile
    if (isCurrentUser && user.role !== "organization") {
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
      const profileData =
        await organizationProfileService.getOrganizationProfile(targetUserId);
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (profile) {
      setEditFormData({
        userId: profile.userId,
        organizationName: profile.organizationName,
        typeId: profile.typeId,
        shortName: profile.shortName || "",
        businessLicense: profile.businessLicense || "",
        description: profile.description || "",
        mission: profile.mission || "",
        vision: profile.vision || "",
        address: profile.address || "",
        wardCommune: profile.wardCommune || "",
        district: profile.district || "",
        province: profile.province || "",
        postalCode: profile.postalCode || "",
        contactPersonName: profile.contactPersonName || "",
        contactPersonTitle: profile.contactPersonTitle || "",
        contactEmail: profile.contactEmail || "",
        contactPhone: profile.contactPhone || "",
        website: profile.website || "",
        facebookPage: profile.facebookPage || "",
        linkedInPage: profile.linkedInPage || "",
        logoUrl: profile.logoUrl || "",
        bannerUrl: profile.bannerUrl || "",
        establishedYear: profile.establishedYear || new Date().getFullYear(),
        taxCode: profile.taxCode || "",
      });
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateProfile = async () => {
    if (!targetUserId) return;

    try {
      setIsUpdating(true);
      await organizationProfileService.updateOrganizationProfile(
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
    field: keyof UpdateOrganizationProfileDto,
    value: string | number
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-to-r from-blue-600 to-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-red-950/30 dark:to-orange-950/30">
        <div className="text-center bg-gradient-to-br from-white/80 to-red-50/80 dark:from-gray-800/80 dark:to-red-900/80 p-8 rounded-xl border border-red-200/50 dark:border-red-800/50 shadow-lg">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Lỗi tải hồ sơ
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <Button
            onClick={loadProfile}
            className="mt-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/30">
        <div className="text-center bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/80 p-8 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Không tìm thấy hồ sơ
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {isCurrentUser
              ? "Hãy tạo hồ sơ tổ chức của bạn"
              : "Hồ sơ không tồn tại"}
          </p>
          {isCurrentUser && (
            <Button
              onClick={() => navigate("/organization/profile/create")}
              className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Tạo hồ sơ
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-white/60 to-blue-50/60 dark:from-gray-800/60 dark:to-blue-900/60 p-6 rounded-xl border border-blue-200/30 dark:border-blue-800/30 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              {isCurrentUser && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  variant="secondary"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {profile.organizationName}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2" />
                {profile.contactEmail || "Chưa cập nhật"}
              </p>
              <div className="flex items-center mt-2">
                <Badge
                  variant="secondary"
                  className="mr-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  <Building2 className="w-3 h-3 mr-1" />
                  Tổ chức
                </Badge>
                {profile.isVerified && (
                  <Badge
                    variant="default"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Đã xác thực
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {isCurrentUser && (
            <div className="mt-4 md:mt-0">
              <Button
                onClick={handleEditClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
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
        className="space-y-6"
      >
        <TabsList className="bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/80 border border-blue-200/30 dark:border-blue-800/30 shadow-lg">
          <TabsTrigger
            value="info"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50"
          >
            Thông tin tổ chức
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 dark:hover:from-green-900/50 dark:hover:to-blue-900/50"
          >
            Liên hệ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Organization Information */}
            <Card className="bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/80 border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50 border-b border-blue-200/30 dark:border-blue-800/30">
                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Thông tin cơ bản
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Thông tin chính về tổ chức
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Tên tổ chức</p>
                    <p className="text-gray-600">{profile.organizationName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Mã số thuế</p>
                    <p className="text-gray-600">
                      {profile.taxCode || "Chưa cập nhật"}
                    </p>
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
                    <p className="text-sm font-medium">Năm thành lập</p>
                    <p className="text-gray-600">
                      {profile.establishedYear || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                {profile.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profile.website}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-gray-800/80 dark:to-purple-900/80 border border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/50 dark:to-pink-950/50 border-b border-purple-200/30 dark:border-purple-800/30">
                <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Thông tin bổ sung
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Chi tiết về hoạt động và mục tiêu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <p className="text-sm font-medium mb-2">Mô tả</p>
                  <p className="text-gray-600 text-sm">
                    {profile.description || "Chưa có mô tả"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Sứ mệnh</p>
                  <p className="text-gray-600 text-sm">
                    {profile.mission || "Chưa cập nhật"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Tầm nhìn</p>
                  <p className="text-gray-600 text-sm">
                    {profile.vision || "Chưa cập nhật"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Trạng thái</p>
                  <div className="flex gap-2">
                    <Badge variant={profile.isActive ? "default" : "secondary"}>
                      {profile.isActive ? "Đang hoạt động" : "Không hoạt động"}
                    </Badge>
                    {profile.isVerified && (
                      <Badge variant="default">
                        <Shield className="w-3 h-3 mr-1" />
                        Đã xác thực
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-white/80 to-green-50/80 dark:from-gray-800/80 dark:to-green-900/80 border border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-950/50 dark:to-blue-950/50 border-b border-green-200/30 dark:border-green-800/30">
                <CardTitle className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Thông tin liên hệ
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Chi tiết liên hệ của tổ chức
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Email liên hệ</p>
                    <p className="text-gray-600">
                      {profile.contactEmail || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Số điện thoại</p>
                    <p className="text-gray-600">
                      {profile.contactPhone || "Chưa cập nhật"}
                    </p>
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
              </CardContent>
            </Card>

            {/* Representative Information */}
            <Card className="bg-gradient-to-br from-white/80 to-teal-50/80 dark:from-gray-800/80 dark:to-teal-900/80 border border-teal-200/50 dark:border-teal-800/50 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-950/50 dark:to-cyan-950/50 border-b border-teal-200/30 dark:border-teal-800/30">
                <CardTitle className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Thông tin người đại diện
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Thông tin người liên hệ chính
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Người đại diện</p>
                    <p className="text-gray-600">
                      {profile.contactPersonName || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">
                      Số điện thoại đại diện
                    </p>
                    <p className="text-gray-600">
                      {profile.contactPhone || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Email đại diện</p>
                    <p className="text-gray-600">
                      {profile.contactEmail || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent
          className="w-[80vw] max-w-5xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-gray-900/95 dark:to-blue-950/95 border border-blue-200/50 dark:border-blue-800/50"
          style={{ width: "80vw", maxWidth: "64rem" }}
        >
          <DialogHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b border-blue-200/30 dark:border-blue-800/30 pb-4">
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Chỉnh sửa hồ sơ tổ chức
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Cập nhật thông tin tổ chức và chi tiết liên hệ
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Organization Information */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200/20 dark:border-blue-800/20">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Thông tin tổ chức
              </h3>

              <div>
                <Label htmlFor="organizationName">Tên tổ chức</Label>
                <Input
                  id="organizationName"
                  value={editFormData.organizationName || ""}
                  onChange={(e) =>
                    handleInputChange("organizationName", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="shortName">Tên viết tắt</Label>
                <Input
                  id="shortName"
                  value={editFormData.shortName || ""}
                  onChange={(e) =>
                    handleInputChange("shortName", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="taxCode">Mã số thuế</Label>
                <Input
                  id="taxCode"
                  value={editFormData.taxCode || ""}
                  onChange={(e) => handleInputChange("taxCode", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="businessLicense">Giấy phép kinh doanh</Label>
                <Input
                  id="businessLicense"
                  value={editFormData.businessLicense || ""}
                  onChange={(e) =>
                    handleInputChange("businessLicense", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="establishedYear">Năm thành lập</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={editFormData.establishedYear || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "establishedYear",
                      parseInt(e.target.value) || new Date().getFullYear()
                    )
                  }
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={editFormData.website || ""}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="facebookPage">Facebook Page</Label>
                <Input
                  id="facebookPage"
                  value={editFormData.facebookPage || ""}
                  onChange={(e) =>
                    handleInputChange("facebookPage", e.target.value)
                  }
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <Label htmlFor="linkedInPage">LinkedIn Page</Label>
                <Input
                  id="linkedInPage"
                  value={editFormData.linkedInPage || ""}
                  onChange={(e) =>
                    handleInputChange("linkedInPage", e.target.value)
                  }
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-green-50/30 to-teal-50/30 dark:from-green-900/30 dark:to-teal-900/30 rounded-lg border border-green-200/20 dark:border-green-800/20">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Thông tin liên hệ
              </h3>

              <div>
                <Label htmlFor="contactPersonName">Tên người đại diện</Label>
                <Input
                  id="contactPersonName"
                  value={editFormData.contactPersonName || ""}
                  onChange={(e) =>
                    handleInputChange("contactPersonName", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="contactPersonTitle">Chức vụ</Label>
                <Input
                  id="contactPersonTitle"
                  value={editFormData.contactPersonTitle || ""}
                  onChange={(e) =>
                    handleInputChange("contactPersonTitle", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Email liên hệ</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={editFormData.contactEmail || ""}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Số điện thoại</Label>
                <Input
                  id="contactPhone"
                  value={editFormData.contactPhone || ""}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                />
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

              <div>
                <Label htmlFor="postalCode">Mã bưu điện</Label>
                <Input
                  id="postalCode"
                  value={editFormData.postalCode || ""}
                  onChange={(e) =>
                    handleInputChange("postalCode", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="md:col-span-2 space-y-4 p-4 bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200/20 dark:border-purple-800/20">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Tầm nhìn & Sứ mệnh
              </h3>

              <div>
                <Label htmlFor="description">Mô tả tổ chức</Label>
                <Textarea
                  id="description"
                  value={editFormData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Mô tả về tổ chức, hoạt động và mục tiêu..."
                />
              </div>

              <div>
                <Label htmlFor="mission">Sứ mệnh</Label>
                <Textarea
                  id="mission"
                  value={editFormData.mission || ""}
                  onChange={(e) => handleInputChange("mission", e.target.value)}
                  placeholder="Sứ mệnh của tổ chức..."
                />
              </div>

              <div>
                <Label htmlFor="vision">Tầm nhìn</Label>
                <Textarea
                  id="vision"
                  value={editFormData.vision || ""}
                  onChange={(e) => handleInputChange("vision", e.target.value)}
                  placeholder="Tầm nhìn và định hướng phát triển..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logoUrl">URL Logo</Label>
                  <Input
                    id="logoUrl"
                    value={editFormData.logoUrl || ""}
                    onChange={(e) =>
                      handleInputChange("logoUrl", e.target.value)
                    }
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="bannerUrl">URL Banner</Label>
                  <Input
                    id="bannerUrl"
                    value={editFormData.bannerUrl || ""}
                    onChange={(e) =>
                      handleInputChange("bannerUrl", e.target.value)
                    }
                    placeholder="https://example.com/banner.png"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-950/50 border-t border-blue-200/30 dark:border-blue-800/30 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdating}
              className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600 hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600"
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isUpdating ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
