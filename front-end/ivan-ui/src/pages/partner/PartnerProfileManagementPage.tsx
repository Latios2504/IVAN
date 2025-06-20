import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { 
  PartnerProfileData,
  UpdatePartnerProfileData,
  PartnerIndustry,
  PartnerDocument,
  PartnerVerificationData
} from "@/types/partner-profile";
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
  Link,
  Briefcase,
  Factory
} from "lucide-react";

// Simple notification function for demo
const showNotification = (message: string, type: "success" | "error" = "success") => {
  console.log(`${type.toUpperCase()}: ${message}`);
  // In a real app, this would be replaced with a proper toast system
};

/**
 * Partner Profile Management Page
 * Implements FE-04: Manage Partner Profile
 * 
 * Features:
 * - View/Edit partner profile information
 * - Upload and manage verification documents
 * - Partner statistics and verification status
 * - Contact person management
 * - Business information management
 */

const PartnerProfileManagementPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState("info");
  
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfileData | null>(null);
  const [editData, setEditData] = useState<UpdatePartnerProfileData>({
    partnerId: 0,
    companyName: '',
    industryId: 1,
    description: '',
  });
  
  const [partnerIndustries, setPartnerIndustries] = useState<PartnerIndustry[]>([]);
  const [verificationData, setVerificationData] = useState<PartnerVerificationData | null>(null);

  // Check if user is partner owner or admin
  const canEdit = user?.role === 'partner' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  // Sample partner industries data
  const samplePartnerIndustries: PartnerIndustry[] = [
    { industryId: 1, industryName: "Công nghệ thông tin", description: "Phần mềm, phần cứng, dịch vụ IT", isActive: true },
    { industryId: 2, industryName: "Tài chính - Ngân hàng", description: "Ngân hàng, bảo hiểm, đầu tư", isActive: true },
    { industryId: 3, industryName: "Giáo dục", description: "Trường học, đào tạo, nghiên cứu", isActive: true },
    { industryId: 4, industryName: "Y tế", description: "Bệnh viện, phòng khám, dược phẩm", isActive: true },
    { industryId: 5, industryName: "Sản xuất", description: "Nhà máy, công nghiệp, chế biến", isActive: true },
    { industryId: 6, industryName: "Dịch vụ", description: "Tư vấn, marketing, logistics", isActive: true },
    { industryId: 7, industryName: "Bán lẻ", description: "Cửa hàng, siêu thị, thương mại", isActive: true },
    { industryId: 8, industryName: "Bất động sản", description: "Xây dựng, phát triển, môi giới", isActive: true }
  ];

  // Sample partner profile data
  const samplePartnerProfile: PartnerProfileData = {
    partnerId: 1,
    userId: user?.id || 1,
    companyName: "Công ty TNHH FPT Software",
    industryId: 1,
    taxCode: "0312783688",
    businessLicense: "GP123456789",
    website: "https://fpt-software.com",
    description: "Công ty phần mềm hàng đầu Việt Nam, chuyên cung cấp các giải pháp công nghệ cho doanh nghiệp và cộng đồng.",
    address: "Tòa nhà FPT Cầu Giấy, Duy Tân",
    wardCommune: "Phường Dịch Vọng Hậu",
    district: "Quận Cầu Giấy",
    province: "Hà Nội",
    postalCode: "100000",
    contactPersonName: "Nguyễn Văn An",
    contactPersonTitle: "Giám đốc Phát triển Bền vững",
    contactEmail: "an.nguyen@fpt.com.vn",
    contactPhone: "024 7300 8866",
    logoUrl: "/api/placeholder/150/150",
    isVerified: true,
    verifiedAt: "2024-02-20T08:30:00Z",
    verifiedBy: 1,
    rating: 4.7,
    ratingCount: 89,
    totalCollaborations: 12,
    isActive: true,
    createdAt: "2023-11-15T10:00:00Z",
    updatedAt: "2024-06-15T16:20:00Z",
    industryName: "Công nghệ thông tin"
  };

  // Sample verification data
  const sampleVerificationData: PartnerVerificationData = {
    partnerId: 1,
    verificationStatus: "verified",
    verifiedBy: 1,
    verifiedAt: "2024-02-20T08:30:00Z",
    requiredDocuments: [
      "Giấy phép kinh doanh",
      "Giấy chứng nhận đăng ký thuế", 
      "Quyết định thành lập công ty",
      "Hồ sơ năng lực công ty"
    ],
    submittedDocuments: [
      {
        documentId: 1,
        partnerId: 1,
        documentType: "business_license",
        fileName: "giay-phep-kinh-doanh-fpt.pdf",
        fileUrl: "/documents/business-license-fpt.pdf",
        uploadedAt: "2024-02-15T09:00:00Z",
        verifiedAt: "2024-02-20T08:30:00Z",
        verifiedBy: 1,
        status: "approved"
      },
      {
        documentId: 2,
        partnerId: 1,
        documentType: "tax_certificate",
        fileName: "chung-nhan-dang-ky-thue-fpt.pdf",
        fileUrl: "/documents/tax-certificate-fpt.pdf",
        uploadedAt: "2024-02-15T09:15:00Z",
        verifiedAt: "2024-02-20T08:30:00Z",
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
        
        setPartnerIndustries(samplePartnerIndustries);
        setPartnerProfile(samplePartnerProfile);
        setVerificationData(sampleVerificationData);
        
        // Initialize edit data
        setEditData({
          partnerId: samplePartnerProfile.partnerId,
          companyName: samplePartnerProfile.companyName,
          industryId: samplePartnerProfile.industryId,
          taxCode: samplePartnerProfile.taxCode,
          businessLicense: samplePartnerProfile.businessLicense,
          website: samplePartnerProfile.website,
          description: samplePartnerProfile.description,
          address: samplePartnerProfile.address,
          wardCommune: samplePartnerProfile.wardCommune,
          district: samplePartnerProfile.district,
          province: samplePartnerProfile.province,
          postalCode: samplePartnerProfile.postalCode,
          contactPersonName: samplePartnerProfile.contactPersonName,
          contactPersonTitle: samplePartnerProfile.contactPersonTitle,
          contactEmail: samplePartnerProfile.contactEmail,
          contactPhone: samplePartnerProfile.contactPhone
        });
        
      } catch (error) {
        console.error("Error loading partner profile:", error);
        showNotification("Không thể tải thông tin đối tác", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      if (partnerProfile) {
        setPartnerProfile({
          ...partnerProfile,
          ...editData,
          updatedAt: new Date().toISOString()
        });
      }
      
      setIsEditing(false);
      showNotification("Cập nhật hồ sơ đối tác thành công", "success");
      
    } catch (error) {
      console.error("Error saving profile:", error);
      showNotification("Lỗi khi cập nhật hồ sơ đối tác", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    if (partnerProfile) {
      setEditData({
        partnerId: partnerProfile.partnerId,
        companyName: partnerProfile.companyName,
        industryId: partnerProfile.industryId,
        description: partnerProfile.description,
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
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Chờ xác thực'
        };
      case 'under_review':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Eye className="w-4 h-4" />,
          text: 'Đang xem xét'
        };
      default:
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-4 h-4" />,
          text: 'Chưa xác thực'
        };
    }
  };

  // Render stars for rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
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

  if (!partnerProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy hồ sơ đối tác
            </h3>
            <p className="text-gray-600 mb-4">
              Hồ sơ đối tác không tồn tại hoặc bạn không có quyền truy cập.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const verificationStatus = getVerificationStatus(verificationData?.verificationStatus || 'pending');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý Hồ sơ Đối tác
              </h1>
            </div>
            <p className="text-gray-600">Quản lý thông tin và tài liệu xác thực của đối tác</p>
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
            {/* Logo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hình ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo */}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    {partnerProfile.logoUrl ? (
                      <img 
                        src={partnerProfile.logoUrl} 
                        alt="Logo" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <Label className="text-sm font-medium">Logo công ty</Label>
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
                    <Label htmlFor="companyName">Tên công ty *</Label>
                    {isEditing ? (
                      <Input
                        id="companyName"
                        value={editData.companyName || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Nhập tên công ty"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{partnerProfile.companyName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industryId">Lĩnh vực hoạt động *</Label>
                    {isEditing ? (
                      <Select
                        value={editData.industryId?.toString() || ''}
                        onValueChange={(value) => setEditData(prev => ({ ...prev, industryId: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn lĩnh vực" />
                        </SelectTrigger>
                        <SelectContent>
                          {partnerIndustries.map(industry => (
                            <SelectItem key={industry.industryId} value={industry.industryId.toString()}>
                              {industry.industryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900">
                        {partnerIndustries.find(i => i.industryId === partnerProfile.industryId)?.industryName || 'Chưa xác định'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxCode">Mã số thuế</Label>
                    {isEditing ? (
                      <Input
                        id="taxCode"
                        value={editData.taxCode || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, taxCode: e.target.value }))}
                        placeholder="Mã số thuế"
                      />
                    ) : (
                      <p className="text-gray-900">{partnerProfile.taxCode || 'Chưa có'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessLicense">Giấy phép kinh doanh</Label>
                    {isEditing ? (
                      <Input
                        id="businessLicense"
                        value={editData.businessLicense || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, businessLicense: e.target.value }))}
                        placeholder="Số giấy phép kinh doanh"
                      />
                    ) : (
                      <p className="text-gray-900">{partnerProfile.businessLicense || 'Chưa có'}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả công ty</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={editData.description || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Mô tả về công ty và hoạt động"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900 text-sm whitespace-pre-wrap">
                      {partnerProfile.description || 'Chưa có mô tả'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Địa chỉ công ty</CardTitle>
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
                    <p className="text-gray-900">{partnerProfile.address || 'Chưa có'}</p>
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
                      <p className="text-gray-900">{partnerProfile.wardCommune || 'Chưa có'}</p>
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
                      <p className="text-gray-900">{partnerProfile.district || 'Chưa có'}</p>
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
                      <p className="text-gray-900">{partnerProfile.province || 'Chưa có'}</p>
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
                      <p className="text-gray-900">{partnerProfile.postalCode || 'Chưa có'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Người liên hệ</Label>
                  {isEditing ? (
                    <Input
                      id="contactPersonName"
                      value={editData.contactPersonName || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, contactPersonName: e.target.value }))}
                      placeholder="Họ và tên người liên hệ"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{partnerProfile.contactPersonName || 'Chưa có'}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPersonTitle">Chức vụ</Label>
                  {isEditing ? (
                    <Input
                      id="contactPersonTitle"
                      value={editData.contactPersonTitle || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, contactPersonTitle: e.target.value }))}
                      placeholder="Chức vụ"
                    />
                  ) : (
                    <p className="text-gray-900">{partnerProfile.contactPersonTitle || 'Chưa có'}</p>
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
                      placeholder="Email liên hệ"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {partnerProfile.contactEmail ? (
                        <a 
                          href={`mailto:${partnerProfile.contactEmail}`}
                          className="text-blue-600 hover:underline"
                        >
                          {partnerProfile.contactEmail}
                        </a>
                      ) : (
                        <p className="text-gray-900">Chưa có</p>
                      )}
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
                      <p className="text-gray-900">{partnerProfile.contactPhone || 'Chưa có'}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm">Website</Label>
                  {isEditing ? (
                    <Input
                      id="website"
                      value={editData.website || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://company.com"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      {partnerProfile.website ? (
                        <a 
                          href={partnerProfile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {partnerProfile.website}
                        </a>
                      ) : (
                        <p className="text-gray-900">Chưa có</p>
                      )}
                    </div>
                  )}
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
                        <h4 className="font-medium text-green-900">Đối tác đã được xác thực</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Đối tác đã hoàn tất quy trình xác thực và có thể tham gia các hoạt động hợp tác.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Required Documents */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tài liệu yêu cầu</h4>
                  <div className="space-y-2">
                    {verificationData?.requiredDocuments.map((doc, index) => {
                      const submitted = verificationData.submittedDocuments.find(
                        d => d.documentType === doc.toLowerCase().replace(/\s+/g, '_')
                      );
                      
                      return (
                        <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{doc}</span>
                          {submitted ? (
                            <Badge variant={submitted.status === 'approved' ? 'default' : 'secondary'}>
                              {submitted.status === 'approved' ? 'Đã duyệt' : 
                               submitted.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Chưa nộp</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upload Documents */}
                {canEdit && verificationData?.verificationStatus !== 'verified' && (
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Tải lên tài liệu
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin xác thực</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationData?.verifiedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ngày xác thực:</span>
                      <span className="font-medium">{formatDate(verificationData.verifiedAt)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mã đối tác:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      PAR-{partnerProfile.partnerId.toString().padStart(6, '0')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ngày tạo tài khoản:</span>
                    <span className="font-medium">{formatDate(partnerProfile.createdAt || '')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cập nhật gần nhất:</span>
                    <span className="font-medium">{formatDate(partnerProfile.updatedAt || '')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trạng thái tài khoản:</span>
                    <Badge className={partnerProfile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {partnerProfile.isActive ? 'Hoạt động' : 'Tạm khóa'}
                    </Badge>
                  </div>
                </div>
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
                    <p className="text-sm font-medium text-gray-600">Tổng hợp tác</p>
                    <p className="text-2xl font-bold text-gray-900">{partnerProfile.totalCollaborations}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Đánh giá</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-gray-900">{partnerProfile.rating}</p>
                      <div className="flex">
                        {renderStars(partnerProfile.rating || 0)}
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
                    <p className="text-2xl font-bold text-gray-900">{partnerProfile.ratingCount}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lĩnh vực</p>
                    <p className="text-lg font-bold text-gray-900">{partnerProfile.industryName}</p>
                  </div>
                  <Factory className="w-8 h-8 text-green-600" />
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
                    <span className="font-medium">{formatDate(partnerProfile.createdAt || '')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cập nhật gần nhất:</span>
                    <span className="font-medium">{formatDate(partnerProfile.updatedAt || '')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trạng thái tài khoản:</span>
                    <Badge className={partnerProfile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {partnerProfile.isActive ? 'Hoạt động' : 'Tạm khóa'}
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
                    <span className="text-sm text-gray-600">Mã đối tác:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      PAR-{partnerProfile.partnerId.toString().padStart(6, '0')}
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

export default PartnerProfileManagementPage;
