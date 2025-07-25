import { useState } from "react";
import type { OrganizationProfile } from "@/types/profiles";
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
    establishedYear: profile?.establishedYear || new Date().getFullYear(),
  });

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
    await onSave(formData);
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
                  value={formData.establishedYear}
                  onChange={(e) =>
                    handleInputChange(
                      "establishedYear",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="Năm thành lập"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Nhập địa chỉ trụ sở"
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

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">{profile.email}</p>
                <p className="text-sm text-gray-500">Email chính</p>
              </div>
            </div>

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
                {profile.totalEvents}
              </p>
              <p className="text-sm text-gray-600">Sự kiện</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {profile.totalVolunteers}
              </p>
              <p className="text-sm text-gray-600">Tình nguyện viên</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {profile.rating.toFixed(1)}/5.0
              </p>
              <p className="text-sm text-gray-600">Đánh giá</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {profile.ratingCount}
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
