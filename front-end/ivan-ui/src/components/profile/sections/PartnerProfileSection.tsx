import { useState } from "react";
import type { PartnerProfile } from "@/types/profile/profiles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Users,
  Handshake,
  Check,
  Star,
} from "lucide-react";

interface PartnerProfileSectionProps {
  profile: PartnerProfile | null;
  isEditing: boolean;
  isCurrentUser: boolean;
  onSave: (data: Partial<PartnerProfile>) => Promise<void>;
}

export default function PartnerProfileSection({
  profile,
  isEditing,
  isCurrentUser,
  onSave,
}: PartnerProfileSectionProps) {
  const [formData, setFormData] = useState<Partial<PartnerProfile>>({
    companyName: profile?.companyName || "",
    industryId: profile?.industryId || 1,
    taxCode: profile?.taxCode || "",
    businessLicense: profile?.businessLicense || "",
    website: profile?.website || "",
    description: profile?.description || "",
    contactPersonName: profile?.contactPersonName || "",
    contactPersonTitle: profile?.contactPersonTitle || "",
    contactEmail: profile?.contactEmail || "",
    contactPhone: profile?.contactPhone || "",
    address: profile?.address || "",
  });

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy thông tin đối tác</p>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await onSave(formData);
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Chỉnh sửa thông tin đối tác</h2>
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
                Thông tin công ty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Tên công ty</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  placeholder="Nhập tên công ty"
                />
              </div>

              <div>
                <Label htmlFor="taxCode">Mã số thuế</Label>
                <Input
                  id="taxCode"
                  value={formData.taxCode}
                  onChange={(e) => handleInputChange("taxCode", e.target.value)}
                  placeholder="Nhập mã số thuế"
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
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://website.com"
                />
              </div>

              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Nhập địa chỉ công ty"
                  rows={2}
                />
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
            <CardTitle>Mô tả công ty</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Mô tả về công ty, lĩnh vực hoạt động, thế mạnh..."
              rows={4}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display mode
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Thông tin đối tác</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Thông tin công ty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">{profile.companyName}</p>
                <p className="text-sm text-gray-500">Tên công ty</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">{profile.email}</p>
                <p className="text-sm text-gray-500">Email chính</p>
              </div>
            </div>

            {profile.industryName && (
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{profile.industryName}</p>
                  <p className="text-sm text-gray-500">Lĩnh vực</p>
                </div>
              </div>
            )}

            {profile.taxCode && (
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{profile.taxCode}</p>
                  <p className="text-sm text-gray-500">Mã số thuế</p>
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Thống kê hợp tác
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {profile.totalCollaborations || 0}
              </p>
              <p className="text-sm text-gray-600">Dự án hợp tác</p>
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
                Đối tác đã được xác minh
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {profile.description && (
        <Card>
          <CardHeader>
            <CardTitle>Mô tả công ty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {profile.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
