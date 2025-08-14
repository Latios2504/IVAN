import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Building,
  Globe,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  Calendar,
  Users,
  Activity,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { organizationProfileService } from "@/services/organizationProfileService";
import type { UserListDto } from "@/types/userManagement";
import type { OrganizationProfileViewModel } from "@/types/organizationProfile";

interface OrganizationProfileTabProps {
  user: UserListDto;
}

export function OrganizationProfileTab({ user }: OrganizationProfileTabProps) {
  const [orgProfile, setOrgProfile] =
    useState<OrganizationProfileViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgProfile = async () => {
      try {
        setLoading(true);
        const profile = await organizationProfileService.getOrganizationProfile(
          user.userId
        );
        setOrgProfile(profile);
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin tổ chức");
      } finally {
        setLoading(false);
      }
    };

    if (user.roleName?.toLowerCase() === "organization") {
      fetchOrgProfile();
    } else {
      setLoading(false);
    }
  }, [user.userId, user.roleName]);

  if (user.roleName?.toLowerCase() !== "organization") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Đang tải thông tin tổ chức...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <XCircle className="h-12 w-12 mx-auto mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  if (!orgProfile) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Chưa có thông tin hồ sơ tổ chức</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organization Basic Info */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Building className="h-5 w-5 text-blue-600" />
          Thông tin tổ chức
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tên tổ chức</Label>
            <p className="text-sm text-gray-700 font-medium">
              {orgProfile.organizationName}
            </p>
          </div>
          <div>
            <Label>Tên viết tắt</Label>
            <p className="text-sm text-gray-700">
              {orgProfile.shortName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Loại tổ chức</Label>
            <p className="text-sm text-gray-700">Loại {orgProfile.typeId}</p>
          </div>
          <div>
            <Label>Năm thành lập</Label>
            <p className="text-sm text-gray-700">
              {orgProfile.establishedYear || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Mã số thuế</Label>
            <p className="text-sm text-gray-700">
              {orgProfile.taxCode || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Giấy phép kinh doanh</Label>
            <p className="text-sm text-gray-700">
              {orgProfile.businessLicense || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Mission & Vision */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Sứ mệnh & Tầm nhìn</h3>
        <div className="space-y-4">
          <div>
            <Label>Mô tả</Label>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {orgProfile.description || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Sứ mệnh</Label>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {orgProfile.mission || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Tầm nhìn</Label>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {orgProfile.vision || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-green-600" />
          Thông tin liên hệ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Người liên hệ</Label>
            <p className="text-sm text-gray-700">
              {orgProfile.contactPersonName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Chức vụ</Label>
            <p className="text-sm text-gray-700">
              {orgProfile.contactPersonTitle || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Email liên hệ</Label>
            <p className="text-sm text-gray-700">
              {orgProfile.contactEmail || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Điện thoại liên hệ</Label>
            <p className="text-sm text-gray-700">
              {orgProfile.contactPhone || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Online Presence */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-purple-600" />
          Kênh truyền thông
        </h3>
        <div className="space-y-3">
          {orgProfile.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <a
                href={orgProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {orgProfile.website}
              </a>
            </div>
          )}
          {orgProfile.facebookPage && (
            <div className="flex items-center gap-2">
              <Facebook className="h-4 w-4 text-blue-600" />
              <a
                href={orgProfile.facebookPage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {orgProfile.facebookPage}
              </a>
            </div>
          )}
          {orgProfile.linkedInPage && (
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-blue-600" />
              <a
                href={orgProfile.linkedInPage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {orgProfile.linkedInPage}
              </a>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Statistics */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-orange-600" />
          Thống kê hoạt động
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Sự kiện</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {orgProfile.totalEvents || 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900">
                Tình nguyện viên
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {orgProfile.totalVolunteers || 0}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Đánh giá</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {orgProfile.rating?.toFixed(1) || "0.0"}
            </p>
            <p className="text-xs text-yellow-700">
              ({orgProfile.ratingCount || 0} lượt đánh giá)
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {orgProfile.isVerified ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium text-purple-900">Trạng thái</span>
            </div>
            <Badge variant={orgProfile.isVerified ? "default" : "secondary"}>
              {orgProfile.isVerified ? "Đã xác minh" : "Chưa xác minh"}
            </Badge>
            {orgProfile.verifiedAt && (
              <p className="text-xs text-purple-700 mt-1">
                {new Date(orgProfile.verifiedAt).toLocaleDateString("vi-VN")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
