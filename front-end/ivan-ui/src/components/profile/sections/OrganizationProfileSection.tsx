import { useState, useEffect } from "react";
import type { OrganizationProfile } from "@/types/profile/profiles";
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
  Building2,
  Mail,
  Phone,
  Globe,
  Users,
  Calendar,
  Check,
  Star,
} from "lucide-react";

interface OrganizationProfileSectionProps {
  profile: OrganizationProfile | null;
  isEditing: boolean;
  isCurrentUser: boolean;
  onSave: (data: Partial<OrganizationProfile>) => Promise<void>;
}

export default function OrganizationProfileSection({
  profile,
  isEditing,
  isCurrentUser,
  onSave,
}: OrganizationProfileSectionProps) {
  const [formData, setFormData] = useState<Partial<OrganizationProfile>>({
    organizationName: profile?.organizationName || "",
    shortName: profile?.shortName || "",
    typeId: profile?.typeId || 1,
    taxCode: profile?.taxCode || "",
    businessLicense: profile?.businessLicense || "",
    description: profile?.description || "",
    mission: profile?.mission || "",
    vision: profile?.vision || "",
    website: profile?.website || "",
    facebookPage: profile?.facebookPage || "",
    linkedInPage: profile?.linkedInPage || "",
    contactPersonName: profile?.contactPersonName || "",
    contactPersonTitle: profile?.contactPersonTitle || "",
    contactEmail: profile?.contactEmail || "",
    contactPhone: profile?.contactPhone || "",
    address: profile?.address || "",
    wardCommune: profile?.wardCommune || "",
    district: profile?.district || "",
    province: profile?.province || "",
    postalCode: profile?.postalCode || "",
    logoUrl: profile?.logoUrl || "",
    bannerUrl: profile?.bannerUrl || "",
    establishedYear: profile?.establishedYear || undefined,
  });

  // Sync formData with profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        organizationName: profile.organizationName || "",
        shortName: profile.shortName || "",
        typeId: profile.typeId || 1,
        taxCode: profile.taxCode || "",
        businessLicense: profile.businessLicense || "",
        description: profile.description || "",
        mission: profile.mission || "",
        vision: profile.vision || "",
        website: profile.website || "",
        facebookPage: profile.facebookPage || "",
        linkedInPage: profile.linkedInPage || "",
        contactPersonName: profile.contactPersonName || "",
        contactPersonTitle: profile.contactPersonTitle || "",
        contactEmail: profile.contactEmail || "",
        contactPhone: profile.contactPhone || "",
        address: profile.address || "",
        wardCommune: profile.wardCommune || "",
        district: profile.district || "",
        province: profile.province || "",
        postalCode: profile.postalCode || "",
        logoUrl: profile.logoUrl || "",
        bannerUrl: profile.bannerUrl || "",
        establishedYear: profile.establishedYear || undefined,
      });
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy thông tin tổ chức</p>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Clean up the data before sending - be more selective about null conversion
      const cleanedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          // For specific optional fields, convert empty strings to null
          const optionalFields = [
            "taxCode",
            "businessLicense",
            "description",
            "mission",
            "vision",
          ];
          if (value === "" && optionalFields.includes(key)) {
            return [key, null];
          }
          // For URL fields and other text fields, keep empty strings as empty strings
          // This preserves user input for fields like website, facebookPage, etc.
          return [key, value];
        })
      );

      console.log("Submitting form data:", cleanedData);
      await onSave(cleanedData);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Chỉnh sửa thông tin tổ chức</h2>
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
                <Building2 className="h-5 w-5" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="organizationName">Tên tổ chức</Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={(e) =>
                    handleInputChange("organizationName", e.target.value)
                  }
                  placeholder="Nhập tên đầy đủ của tổ chức"
                />
              </div>

              <div>
                <Label htmlFor="shortName">Tên viết tắt</Label>
                <Input
                  id="shortName"
                  value={formData.shortName}
                  onChange={(e) =>
                    handleInputChange("shortName", e.target.value)
                  }
                  placeholder="Nhập tên viết tắt"
                />
              </div>

              <div>
                <Label htmlFor="establishedYear">Năm thành lập</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  value={formData.establishedYear || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange(
                      "establishedYear",
                      value ? parseInt(value) : undefined
                    );
                  }}
                  placeholder="Năm thành lập"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <Label htmlFor="typeId">Loại tổ chức</Label>
                <Select
                  value={formData.typeId?.toString()}
                  onValueChange={(value) =>
                    handleInputChange("typeId", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại tổ chức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Tổ chức phi lợi nhuận</SelectItem>
                    <SelectItem value="2">Tổ chức từ thiện</SelectItem>
                    <SelectItem value="3">Tổ chức giáo dục</SelectItem>
                    <SelectItem value="4">Tổ chức môi trường</SelectItem>
                    <SelectItem value="5">Tổ chức y tế</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="taxCode">Mã số thuế</Label>
                <Input
                  id="taxCode"
                  value={formData.taxCode}
                  onChange={(e) => handleInputChange("taxCode", e.target.value)}
                  placeholder="Mã số thuế của tổ chức"
                />
              </div>

              <div>
                <Label htmlFor="businessLicense">Giấy phép kinh doanh</Label>
                <Input
                  id="businessLicense"
                  value={formData.businessLicense}
                  onChange={(e) =>
                    handleInputChange("businessLicense", e.target.value)
                  }
                  placeholder="Số giấy phép kinh doanh"
                />
              </div>

              <div>
                <Label htmlFor="address">Địa chỉ chi tiết</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Số nhà, tên đường"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wardCommune">Phường/Xã</Label>
                  <Input
                    id="wardCommune"
                    value={formData.wardCommune}
                    onChange={(e) =>
                      handleInputChange("wardCommune", e.target.value)
                    }
                    placeholder="Phường/Xã"
                  />
                </div>
                <div>
                  <Label htmlFor="district">Quận/Huyện</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) =>
                      handleInputChange("district", e.target.value)
                    }
                    placeholder="Quận/Huyện"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="province">Tỉnh/Thành phố</Label>
                  <Input
                    id="province"
                    value={formData.province}
                    onChange={(e) =>
                      handleInputChange("province", e.target.value)
                    }
                    placeholder="Tỉnh/Thành phố"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Mã bưu điện</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    placeholder="Mã bưu điện"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contactPersonName">Tên người liên hệ</Label>
                <Input
                  id="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={(e) =>
                    handleInputChange("contactPersonName", e.target.value)
                  }
                  placeholder="Tên người đại diện"
                />
              </div>

              <div>
                <Label htmlFor="contactPersonTitle">Chức vụ</Label>
                <Input
                  id="contactPersonTitle"
                  value={formData.contactPersonTitle}
                  onChange={(e) =>
                    handleInputChange("contactPersonTitle", e.target.value)
                  }
                  placeholder="Chức vụ người đại diện"
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Email liên hệ</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  placeholder="Email liên hệ chính"
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Số điện thoại</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                  placeholder="Số điện thoại liên hệ"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Mạng xã hội & Website
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://website.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebookPage">Facebook Page</Label>
                <Input
                  id="facebookPage"
                  value={formData.facebookPage}
                  onChange={(e) =>
                    handleInputChange("facebookPage", e.target.value)
                  }
                  placeholder="https://facebook.com/page"
                />
              </div>

              <div>
                <Label htmlFor="linkedInPage">LinkedIn Page</Label>
                <Input
                  id="linkedInPage"
                  value={formData.linkedInPage}
                  onChange={(e) =>
                    handleInputChange("linkedInPage", e.target.value)
                  }
                  placeholder="https://linkedin.com/company/name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mô tả tổ chức</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Mô tả về tổ chức, lĩnh vực hoạt động, thành tựu..."
              rows={4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hình ảnh tổ chức</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                placeholder="URL ảnh logo của tổ chức"
              />
            </div>
            <div>
              <Label htmlFor="bannerUrl">Banner URL</Label>
              <Input
                id="bannerUrl"
                value={formData.bannerUrl}
                onChange={(e) => handleInputChange("bannerUrl", e.target.value)}
                placeholder="URL ảnh banner của tổ chức"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sứ mệnh</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.mission}
                onChange={(e) => handleInputChange("mission", e.target.value)}
                placeholder="Sứ mệnh của tổ chức..."
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tầm nhìn</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.vision}
                onChange={(e) => handleInputChange("vision", e.target.value)}
                placeholder="Tầm nhìn của tổ chức..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Thông tin tổ chức</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">{profile.organizationName}</p>
                <p className="text-sm text-gray-500">Tên tổ chức</p>
              </div>
            </div>

            {profile.shortName && (
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{profile.shortName}</p>
                  <p className="text-sm text-gray-500">Tên viết tắt</p>
                </div>
              </div>
            )}

            {profile.establishedYear && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{profile.establishedYear}</p>
                  <p className="text-sm text-gray-500">Năm thành lập</p>
                </div>
              </div>
            )}

            {profile.address && (
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium">{profile.address}</p>
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Thông tin liên hệ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.contactPersonName && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{profile.contactPersonName}</p>
                  <p className="text-sm text-gray-500">
                    {profile.contactPersonTitle || "Người liên hệ"}
                  </p>
                </div>
              </div>
            )}

            {profile.contactEmail && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{profile.contactEmail}</p>
                  <p className="text-sm text-gray-500">Email liên hệ</p>
                </div>
              </div>
            )}

            {profile.contactPhone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{profile.contactPhone}</p>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                </div>
              </div>
            )}

            {profile.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gray-500" />
                <div>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {profile.website}
                  </a>
                  <p className="text-sm text-gray-500">Website</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Thống kê hoạt động
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {profile.totalEvents || 0}
              </p>
              <p className="text-sm text-gray-600">Sự kiện</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {profile.totalVolunteers || 0}
              </p>
              <p className="text-sm text-gray-600">Tình nguyện viên</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {(profile.rating || 0).toFixed(1)}/5.0
              </p>
              <p className="text-sm text-gray-600">Đánh giá</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {profile.ratingCount || 0}
              </p>
              <p className="text-sm text-gray-600">Lượt đánh giá</p>
            </div>
          </div>

          {profile.isVerified && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium">
                Tổ chức đã được xác minh
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {profile.description && (
        <Card>
          <CardHeader>
            <CardTitle>Mô tả tổ chức</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {profile.description}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile.mission && (
          <Card>
            <CardHeader>
              <CardTitle>Sứ mệnh</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {profile.mission}
              </p>
            </CardContent>
          </Card>
        )}

        {profile.vision && (
          <Card>
            <CardHeader>
              <CardTitle>Tầm nhìn</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {profile.vision}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {(profile.facebookPage || profile.linkedInPage) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Mạng xã hội
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {profile.facebookPage && (
                <a
                  href={profile.facebookPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Facebook
                </a>
              )}
              {profile.linkedInPage && (
                <a
                  href={profile.linkedInPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
