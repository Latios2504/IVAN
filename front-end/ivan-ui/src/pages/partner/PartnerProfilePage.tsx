import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { partnerProfileService } from "@/services/partnerProfileService";
import type {
  PartnerProfileViewModel,
  UpdatePartnerProfileDto,
} from "@/types/partnerProfile";
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
  Handshake,
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
  Building2,
  FileText,
  Globe,
  Users,
  DollarSign,
} from "lucide-react";

export default function PartnerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PartnerProfileViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdatePartnerProfileDto>({});

  // Determine if viewing current user's profile or someone else's
  const targetUserId = id ? parseInt(id, 10) : user?.id;
  const isCurrentUser = !id || user?.id === targetUserId;

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    // Check if user is partner when viewing own profile
    if (isCurrentUser && user.role !== "partner") {
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
      const profileData = await partnerProfileService.getPartnerProfile(
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
      setEditFormData({
        companyName: profile.companyName,
        industryId: profile.industryId || 1,
        website: profile.website || "",
        description: profile.description || "",
        address: profile.address || "",
        wardCommune: profile.wardCommune || "",
        district: profile.district || "",
        province: profile.province || "",
        postalCode: profile.postalCode || "",
        contactPersonName: profile.contactPersonName || "",
        contactPersonTitle: profile.contactPersonTitle || "",
        contactEmail: profile.contactEmail || "",
        contactPhone: profile.contactPhone || "",
        isActive: profile.isActive || true,
        isVerified: profile.isVerified || false,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateProfile = async () => {
    if (!targetUserId) return;

    try {
      setIsUpdating(true);
      await partnerProfileService.updatePartnerProfile(
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
    field: keyof UpdatePartnerProfileDto,
    value: string | number | boolean
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
              ? "Hãy tạo hồ sơ đối tác của bạn"
              : "Hồ sơ không tồn tại"}
          </p>
          {isCurrentUser && (
            <Button
              onClick={() => navigate("/partner/profile/create")}
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Handshake className="w-10 h-10 text-white" />
              </div>
              {isCurrentUser && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-2 border-white dark:border-gray-800"
                  variant="secondary"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {profile.companyName}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2" />
                {profile.contactEmail || "Chưa cập nhật"}
              </p>
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="mr-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                  <Handshake className="w-3 h-3 mr-1" />
                  Đối tác
                </Badge>
                {profile.isVerified && (
                  <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Đã xác thực
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {isCurrentUser && (
            <div className="mt-4 md:mt-0">
              <Button onClick={handleEditClick} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg">
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
        <TabsList className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800/50">
          <TabsTrigger value="info" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200">Thông tin công ty</TabsTrigger>
          <TabsTrigger value="business" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200">Kinh doanh</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Information */}
            <Card className="bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800/30">
              <CardHeader className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-t-lg">
                <CardTitle className="text-blue-800 dark:text-blue-200">Thông tin công ty</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-300">
                  Thông tin cơ bản về công ty đối tác
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Tên công ty</p>
                    <p className="text-gray-600">{profile.companyName}</p>
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
            <Card className="bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-rose-50/50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-rose-950/20 border-purple-200 dark:border-purple-800/30">
              <CardHeader className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-t-lg">
                <CardTitle className="text-purple-800 dark:text-purple-200">Thông tin bổ sung</CardTitle>
                <CardDescription className="text-purple-600 dark:text-purple-300">
                  Chi tiết về hoạt động và cam kết
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Mô tả công ty</p>
                  <p className="text-gray-600 text-sm">
                    {profile.description || "Chưa có mô tả"}
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

        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-green-50/50 via-emerald-50/50 to-teal-50/50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20 border-green-200 dark:border-green-800/30">
              <CardHeader className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-t-lg">
                <CardTitle className="text-green-800 dark:text-green-200">Thông tin liên hệ</CardTitle>
                <CardDescription className="text-green-600 dark:text-green-300">Chi tiết liên hệ kinh doanh</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Người liên hệ</p>
                    <p className="text-gray-600">
                      {profile.contactPersonName || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Details */}
            <Card className="bg-gradient-to-br from-orange-50/50 via-amber-50/50 to-yellow-50/50 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-yellow-950/20 border-orange-200 dark:border-orange-800/30">
              <CardHeader className="bg-gradient-to-r from-orange-100/50 to-amber-100/50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-t-lg">
                <CardTitle className="text-orange-800 dark:text-orange-200">Chi tiết kinh doanh</CardTitle>
                <CardDescription className="text-orange-600 dark:text-orange-300">
                  Thông tin pháp lý và kinh doanh
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Giấy phép kinh doanh</p>
                    <p className="text-gray-600">
                      {profile.businessLicense || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Lĩnh vực kinh doanh</p>
                    <p className="text-gray-600">
                      {profile.industryId
                        ? `Ngành ${profile.industryId}`
                        : "Chưa cập nhật"}
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
          className="w-[80vw] max-w-5xl max-h-[85vh] overflow-y-auto"
          style={{ width: "80vw", maxWidth: "64rem" }}
        >
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hồ sơ đối tác</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin công ty và chi tiết hợp tác
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin công ty</h3>

              <div>
                <Label htmlFor="companyName">Tên công ty</Label>
                <Input
                  id="companyName"
                  value={editFormData.companyName || ""}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="industryId">Lĩnh vực kinh doanh</Label>
                <Input
                  id="industryId"
                  type="number"
                  value={editFormData.industryId || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "industryId",
                      parseInt(e.target.value) || 1
                    )
                  }
                  placeholder="ID ngành nghề"
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
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin liên hệ</h3>

              <div>
                <Label htmlFor="contactPersonName">Tên người liên hệ</Label>
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

            {/* Business Details */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">Chi tiết kinh doanh</h3>

              <div>
                <Label htmlFor="description">Mô tả công ty</Label>
                <Textarea
                  id="description"
                  value={editFormData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Mô tả về công ty, lĩnh vực hoạt động và thế mạnh..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    <input
                      type="checkbox"
                      checked={editFormData.isActive || false}
                      onChange={(e) =>
                        handleInputChange("isActive", e.target.checked)
                      }
                      className="mr-2"
                    />
                    Hoạt động
                  </Label>
                </div>
                <div>
                  <Label>
                    <input
                      type="checkbox"
                      checked={editFormData.isVerified || false}
                      onChange={(e) =>
                        handleInputChange("isVerified", e.target.checked)
                      }
                      className="mr-2"
                    />
                    Đã xác thực
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdating}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateProfile} disabled={isUpdating}>
              {isUpdating ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
