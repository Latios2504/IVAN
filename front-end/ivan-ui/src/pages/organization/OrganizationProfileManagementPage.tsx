import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { 
  OrganizationProfileData,
  UpdateOrganizationProfileData,
  OrganizationType,
  VerificationDocument,
  OrganizationVerificationData
} from "@/types/organization-profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { 
  Building2, 
  Shield, 
  ShieldCheck, 
  Upload, 
  FileText, 
  Eye, 
  Edit, 
  Save, 
  X,
  MapPin,
  Globe,
  Phone,
  Mail,
  Calendar,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Camera,
  Link
} from "lucide-react";

// Simple notification function for demo
const showNotification = (message: string, type: "success" | "error" = "success") => {
  console.log(`${type.toUpperCase()}: ${message}`);
  // In a real app, this would be replaced with a proper toast system
};

/**
 * Organization Profile Management Page
 * Implements FE-03: Manage Organization Profile
 * 
 * Features:
 * - View/Edit organization profile information
 * - Upload and manage verification documents
 * - Organization statistics and verification status
 * - Contact person management
 * - Social media links management
 */

const OrganizationProfileManagementPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState("info");
  
  const [organizationProfile, setOrganizationProfile] = useState<OrganizationProfileData | null>(null);
  const [editData, setEditData] = useState<UpdateOrganizationProfileData>({
    organizationId: 0,
    organizationName: '',
    shortName: '',
    typeId: 1,
    description: '',
    mission: '',
    vision: ''
  });
  
  const [organizationTypes, setOrganizationTypes] = useState<OrganizationType[]>([]);
  const [verificationData, setVerificationData] = useState<OrganizationVerificationData | null>(null);

  // Check if user is organization owner or admin
  const canEdit = user?.role === 'organization' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  // Sample organization types data
  const sampleOrganizationTypes: OrganizationType[] = [
    { typeId: 1, typeName: "Tổ chức phi lợi nhuận", description: "NGO, từ thiện, tình nguyện", isActive: true },
    { typeId: 2, typeName: "Doanh nghiệp", description: "Công ty tư nhân, CSR", isActive: true },
    { typeId: 3, typeName: "Tổ chức nhà nước", description: "Cơ quan chính phủ, công lập", isActive: true },
    { typeId: 4, typeName: "Trường học", description: "Trường đại học, phổ thông", isActive: true },
    { typeId: 5, typeName: "Tôn giáo", description: "Tổ chức tôn giáo, tín ngưỡng", isActive: true }
  ];

  // Sample organization profile data
  const sampleOrganizationProfile: OrganizationProfileData = {
    organizationId: 1,
    userId: user?.id || 1,
    organizationName: "Quỹ Từ thiện IVAN",
    shortName: "IVAN",
    typeId: 1,
    taxCode: "0123456789",
    businessLicense: "GP123456789",
    establishedYear: 2020,
    website: "https://ivan.org.vn",
    facebookPage: "https://facebook.com/ivan.vn",
    linkedInPage: "https://linkedin.com/company/ivan-vn",
    description: "Tổ chức tình nguyện viên hàng đầu Việt Nam, kết nối các cá nhân và tổ chức để tạo ra những thay đổi tích cực trong cộng đồng.",
    mission: "Kết nối và trao quyền cho những người muốn tạo ra sự thay đổi tích cực trong cộng đồng thông qua hoạt động tình nguyện.",
    vision: "Trở thành nền tảng kết nối tình nguyện viên hàng đầu tại Việt Nam, nơi mọi người có thể dễ dàng tìm thấy và tham gia các hoạt động từ thiện, tình nguyện có ý nghĩa.",
    address: "123 Đường ABC, Phường XYZ",
    wardCommune: "Phường Đống Đa",
    district: "Quận Đống Đa", 
    province: "Hà Nội",
    postalCode: "100000",
    contactPersonName: "Nguyễn Thị Lan",
    contactPersonTitle: "Giám đốc điều hành",
    contactEmail: "contact@ivan.org.vn",
    contactPhone: "024 1234 5678",
    logoUrl: "/api/placeholder/150/150",
    bannerUrl: "/api/placeholder/800/200",
    isVerified: true,
    verifiedAt: "2024-01-15T10:30:00Z",
    verifiedBy: 1,
    rating: 4.8,
    ratingCount: 156,
    totalEvents: 45,
    totalVolunteers: 1250,
    isActive: true,
    createdAt: "2023-12-01T09:00:00Z",
    updatedAt: "2024-06-15T14:30:00Z"
  };

  // Sample verification data
  const sampleVerificationData: OrganizationVerificationData = {
    organizationId: 1,
    verificationStatus: "verified",
    verifiedBy: 1,
    verifiedAt: "2024-01-15T10:30:00Z",
    requiredDocuments: [
      "Giấy phép kinh doanh",
      "Giấy chứng nhận đăng ký thuế", 
      "Quyết định thành lập",
      "Danh sách ban điều hành"
    ],
    submittedDocuments: [
      {
        documentId: 1,
        organizationId: 1,
        documentType: "business_license",
        fileName: "giay-phep-kinh-doanh.pdf",
        fileUrl: "/documents/business-license-1.pdf",
        uploadedAt: "2024-01-10T09:00:00Z",
        verifiedAt: "2024-01-15T10:30:00Z",
        verifiedBy: 1,
        status: "approved"
      },
      {
        documentId: 2,
        organizationId: 1,
        documentType: "tax_certificate",
        fileName: "chung-nhan-dang-ky-thue.pdf",
        fileUrl: "/documents/tax-certificate-1.pdf",
        uploadedAt: "2024-01-10T09:15:00Z",
        verifiedAt: "2024-01-15T10:30:00Z",
        verifiedBy: 1,
        status: "approved"
      }
    ]
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simulate API calls with sample data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setOrganizationTypes(sampleOrganizationTypes);
        setOrganizationProfile(sampleOrganizationProfile);
        setVerificationData(sampleVerificationData);
        
        // Initialize edit data
        setEditData({
          organizationId: sampleOrganizationProfile.organizationId,
          organizationName: sampleOrganizationProfile.organizationName,
          shortName: sampleOrganizationProfile.shortName,
          typeId: sampleOrganizationProfile.typeId,
          taxCode: sampleOrganizationProfile.taxCode,
          businessLicense: sampleOrganizationProfile.businessLicense,
          establishedYear: sampleOrganizationProfile.establishedYear,
          website: sampleOrganizationProfile.website,
          facebookPage: sampleOrganizationProfile.facebookPage,
          linkedInPage: sampleOrganizationProfile.linkedInPage,
          description: sampleOrganizationProfile.description,
          mission: sampleOrganizationProfile.mission,
          vision: sampleOrganizationProfile.vision,
          address: sampleOrganizationProfile.address,
          wardCommune: sampleOrganizationProfile.wardCommune,
          district: sampleOrganizationProfile.district,
          province: sampleOrganizationProfile.province,
          postalCode: sampleOrganizationProfile.postalCode,
          contactPersonName: sampleOrganizationProfile.contactPersonName,
          contactPersonTitle: sampleOrganizationProfile.contactPersonTitle,
          contactEmail: sampleOrganizationProfile.contactEmail,
          contactPhone: sampleOrganizationProfile.contactPhone
        });
        
      } catch (error) {
        console.error("Error loading organization profile:", error);
        showNotification("Có lỗi xảy ra khi tải thông tin tổ chức", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      if (organizationProfile) {
        const updatedProfile: OrganizationProfileData = {
          ...organizationProfile,
          ...editData,
          updatedAt: new Date().toISOString()
        };
        setOrganizationProfile(updatedProfile);
      }
      
      setIsEditing(false);
      showNotification("Thông tin tổ chức đã được cập nhật thành công");
      
    } catch (error) {
      console.error("Error saving organization profile:", error);
      showNotification("Có lỗi xảy ra khi lưu thông tin", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    if (organizationProfile) {
      setEditData({
        organizationId: organizationProfile.organizationId,
        organizationName: organizationProfile.organizationName,
        shortName: organizationProfile.shortName,
        typeId: organizationProfile.typeId,
        description: organizationProfile.description,
        mission: organizationProfile.mission,
        vision: organizationProfile.vision
      });
    }
    setIsEditing(false);
  };

  // Get verification status color and icon
  const getVerificationStatus = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <ShieldCheck className="w-4 h-4" />,
          text: 'Đã xác thực'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Shield className="w-4 h-4" />,
          text: 'Chờ xác thực'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-4 h-4" />,
          text: 'Bị từ chối'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Chưa xác thực'
        };
    }
  };

  // Get document status
  const getDocumentStatus = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Đã duyệt'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Chờ duyệt'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className="w-4 h-4" />,
          text: 'Bị từ chối'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <FileText className="w-4 h-4" />,
          text: 'Chưa có'
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Render stars for rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">{rating}/5</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!organizationProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy thông tin tổ chức</h3>
            <p className="text-gray-500">
              Vui lòng liên hệ quản trị viên để được hỗ trợ.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const verificationStatus = getVerificationStatus(verificationData?.verificationStatus || '');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Building2 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hồ sơ Tổ chức</h1>
            <p className="text-gray-600">Quản lý thông tin và tài liệu xác thực của tổ chức</p>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? (
                    <LoadingSpinner size="sm" text="" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            )}
          </div>
        )}
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="contact">Liên hệ</TabsTrigger>
          <TabsTrigger value="verification">Xác thực</TabsTrigger>
          <TabsTrigger value="stats">Thống kê</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Logo and Banner */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hình ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo */}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    {organizationProfile.logoUrl ? (
                      <img 
                        src={organizationProfile.logoUrl} 
                        alt="Logo" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <Label className="text-sm font-medium">Logo tổ chức</Label>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="mt-2">
                      <Upload className="w-4 h-4 mr-2" />
                      Tải lên
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Banner */}
                <div className="text-center">
                  <div className="w-full h-24 mb-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    {organizationProfile.bannerUrl ? (
                      <img 
                        src={organizationProfile.bannerUrl} 
                        alt="Banner" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <Label className="text-sm font-medium">Banner tổ chức</Label>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="mt-2">
                      <Upload className="w-4 h-4 mr-2" />
                      Tải lên
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Thông tin cơ bản</span>
                  <Badge className={verificationStatus.color}>
                    {verificationStatus.icon}
                    <span className="ml-1">{verificationStatus.text}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Tên tổ chức *</Label>
                    {isEditing ? (
                      <Input
                        id="organizationName"
                        value={editData.organizationName || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, organizationName: e.target.value }))}
                        placeholder="Nhập tên tổ chức"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{organizationProfile.organizationName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortName">Tên viết tắt</Label>
                    {isEditing ? (
                      <Input
                        id="shortName"
                        value={editData.shortName || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, shortName: e.target.value }))}
                        placeholder="Nhập tên viết tắt"
                      />
                    ) : (
                      <p className="text-gray-900">{organizationProfile.shortName || 'Chưa có'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="typeId">Loại tổ chức *</Label>
                    {isEditing ? (
                      <Select
                        value={editData.typeId?.toString() || ''}
                        onValueChange={(value) => setEditData(prev => ({ ...prev, typeId: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại tổ chức" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizationTypes.map(type => (
                            <SelectItem key={type.typeId} value={type.typeId.toString()}>
                              {type.typeName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900">
                        {organizationTypes.find(t => t.typeId === organizationProfile.typeId)?.typeName || 'Chưa xác định'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">Năm thành lập</Label>
                    {isEditing ? (
                      <Input
                        id="establishedYear"
                        type="number"
                        value={editData.establishedYear?.toString() || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, establishedYear: parseInt(e.target.value) || undefined }))}
                        placeholder="Năm thành lập"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    ) : (
                      <p className="text-gray-900">{organizationProfile.establishedYear || 'Chưa có'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxCode">Mã số thuế</Label>
                    {isEditing ? (
                      <Input
                        id="taxCode"
                        value={editData.taxCode || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, taxCode: e.target.value }))}
                        placeholder="Nhập mã số thuế"
                      />
                    ) : (
                      <p className="text-gray-900">{organizationProfile.taxCode || 'Chưa có'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessLicense">Số giấy phép</Label>
                    {isEditing ? (
                      <Input
                        id="businessLicense"
                        value={editData.businessLicense || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, businessLicense: e.target.value }))}
                        placeholder="Nhập số giấy phép kinh doanh"
                      />
                    ) : (
                      <p className="text-gray-900">{organizationProfile.businessLicense || 'Chưa có'}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả tổ chức</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={editData.description || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Mô tả ngắn về tổ chức và hoạt động"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {organizationProfile.description || 'Chưa có mô tả'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mission">Sứ mệnh</Label>
                    {isEditing ? (
                      <Textarea
                        id="mission"
                        value={editData.mission || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, mission: e.target.value }))}
                        placeholder="Sứ mệnh của tổ chức"
                        rows={2}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm whitespace-pre-wrap">
                        {organizationProfile.mission || 'Chưa có sứ mệnh'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vision">Tầm nhìn</Label>
                    {isEditing ? (
                      <Textarea
                        id="vision"
                        value={editData.vision || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, vision: e.target.value }))}
                        placeholder="Tầm nhìn của tổ chức"
                        rows={2}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm whitespace-pre-wrap">
                        {organizationProfile.vision || 'Chưa có tầm nhìn'}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Địa chỉ</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editData.address || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Số nhà, tên đường"
                    />
                  ) : (
                    <p className="text-gray-900">{organizationProfile.address || 'Chưa có'}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wardCommune">Phường/Xã</Label>
                    {isEditing ? (
                      <Input
                        id="wardCommune"
                        value={editData.wardCommune || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, wardCommune: e.target.value }))}
                        placeholder="Phường/Xã"
                      />
                    ) : (
                      <p className="text-gray-900">{organizationProfile.wardCommune || 'Chưa có'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện</Label>
                    {isEditing ? (
                      <Input
                        id="district"
                        value={editData.district || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, district: e.target.value }))}
                        placeholder="Quận/Huyện"
                      />
                    ) : (
                      <p className="text-gray-900">{organizationProfile.district || 'Chưa có'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province">Tỉnh/Thành phố</Label>
                    {isEditing ? (
                      <Input
                        id="province"
                        value={editData.province || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, province: e.target.value }))}
                        placeholder="Tỉnh/Thành phố"
                      />
                    ) : (
                      <p className="text-gray-900">{organizationProfile.province || 'Chưa có'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Mã bưu điện</Label>
                    {isEditing ? (
                      <Input
                        id="postalCode"
                        value={editData.postalCode || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, postalCode: e.target.value }))}
                        placeholder="Mã bưu điện"
                      />
                    ) : (
                      <p className="text-gray-900">{organizationProfile.postalCode || 'Chưa có'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Thông tin liên hệ</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Người liên hệ</Label>
                  {isEditing ? (
                    <Input
                      id="contactPersonName"
                      value={editData.contactPersonName || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, contactPersonName: e.target.value }))}
                      placeholder="Tên người liên hệ"
                    />
                  ) : (
                    <p className="text-gray-900">{organizationProfile.contactPersonName || 'Chưa có'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPersonTitle">Chức vụ</Label>
                  {isEditing ? (
                    <Input
                      id="contactPersonTitle"
                      value={editData.contactPersonTitle || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, contactPersonTitle: e.target.value }))}
                      placeholder="Chức vụ của người liên hệ"
                    />
                  ) : (
                    <p className="text-gray-900">{organizationProfile.contactPersonTitle || 'Chưa có'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email liên hệ</Label>
                  {isEditing ? (
                    <Input
                      id="contactEmail"
                      type="email"
                      value={editData.contactEmail || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="email@organization.com"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{organizationProfile.contactEmail || 'Chưa có'}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Số điện thoại</Label>
                  {isEditing ? (
                    <Input
                      id="contactPhone"
                      value={editData.contactPhone || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="Số điện thoại liên hệ"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{organizationProfile.contactPhone || 'Chưa có'}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Mạng xã hội</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm">Website</Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        value={editData.website || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://organization.com"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {organizationProfile.website ? (
                          <a 
                            href={organizationProfile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {organizationProfile.website}
                          </a>
                        ) : (
                          <p className="text-gray-900">Chưa có</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebookPage" className="text-sm">Facebook</Label>
                    {isEditing ? (
                      <Input
                        id="facebookPage"
                        value={editData.facebookPage || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, facebookPage: e.target.value }))}
                        placeholder="https://facebook.com/organization"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Link className="w-4 h-4 text-gray-400" />
                        {organizationProfile.facebookPage ? (
                          <a 
                            href={organizationProfile.facebookPage} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {organizationProfile.facebookPage}
                          </a>
                        ) : (
                          <p className="text-gray-900">Chưa có</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedInPage" className="text-sm">LinkedIn</Label>
                    {isEditing ? (
                      <Input
                        id="linkedInPage"
                        value={editData.linkedInPage || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, linkedInPage: e.target.value }))}
                        placeholder="https://linkedin.com/company/organization"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Link className="w-4 h-4 text-gray-400" />
                        {organizationProfile.linkedInPage ? (
                          <a 
                            href={organizationProfile.linkedInPage} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {organizationProfile.linkedInPage}
                          </a>
                        ) : (
                          <p className="text-gray-900">Chưa có</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Trạng thái xác thực</span>
                  <Badge className={verificationStatus.color}>
                    {verificationStatus.icon}
                    <span className="ml-1">{verificationStatus.text}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {verificationData?.verificationStatus === 'verified' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Tổ chức đã được xác thực</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Xác thực vào ngày {formatDate(verificationData.verifiedAt || '')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="font-medium">Tài liệu yêu cầu:</h4>
                  <ul className="space-y-2">
                    {verificationData?.requiredDocuments.map((doc, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {verificationData?.verificationStatus === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Đang chờ xác thực</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Hồ sơ của bạn đang được xem xét. Thời gian xử lý khoảng 3-5 ngày làm việc.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {verificationData?.verificationStatus === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900">Xác thực bị từ chối</h4>
                        <p className="text-sm text-red-700 mt-1">
                          {verificationData.rejectionReason || 'Vui lòng kiểm tra lại tài liệu và gửi lại.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tài liệu đã gửi</CardTitle>
                <CardDescription>
                  Danh sách các tài liệu đã tải lên để xác thực
                </CardDescription>
              </CardHeader>
              <CardContent>
                {verificationData?.submittedDocuments && verificationData.submittedDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {verificationData.submittedDocuments.map((doc) => {
                      const docStatus = getDocumentStatus(doc.status);
                      return (
                        <div key={doc.documentId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium">{doc.fileName}</p>
                              <p className="text-sm text-gray-500">
                                Tải lên: {formatDate(doc.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge className={docStatus.color}>
                              {docStatus.icon}
                              <span className="ml-1">{docStatus.text}</span>
                            </Badge>
                            
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có tài liệu nào được tải lên</p>
                    <Button className="mt-4" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Tải lên tài liệu
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng sự kiện</p>
                    <p className="text-2xl font-bold text-gray-900">{organizationProfile.totalEvents}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tình nguyện viên</p>
                    <p className="text-2xl font-bold text-gray-900">{organizationProfile.totalVolunteers}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Đánh giá</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-gray-900">{organizationProfile.rating}</p>
                      <div className="flex">
                        {renderStars(organizationProfile.rating || 0)}
                      </div>
                    </div>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lượt đánh giá</p>
                    <p className="text-2xl font-bold text-gray-900">{organizationProfile.ratingCount}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>
                Chi tiết về trạng thái và thời gian tạo tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ngày tạo tài khoản:</span>
                    <span className="font-medium">{formatDate(organizationProfile.createdAt || '')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cập nhật gần nhất:</span>
                    <span className="font-medium">{formatDate(organizationProfile.updatedAt || '')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trạng thái tài khoản:</span>
                    <Badge className={organizationProfile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {organizationProfile.isActive ? 'Hoạt động' : 'Tạm khóa'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {verificationData?.verifiedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ngày xác thực:</span>
                      <span className="font-medium">{formatDate(verificationData.verifiedAt)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mã tổ chức:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      ORG-{organizationProfile.organizationId.toString().padStart(6, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationProfileManagementPage;
