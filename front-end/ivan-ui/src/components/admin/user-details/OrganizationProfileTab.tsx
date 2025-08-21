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
      <div className="flex items-center justify-center py-8 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-800/20 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
        <span className="ml-2 text-emerald-800 dark:text-emerald-200 font-medium">Đang tải thông tin tổ chức...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/20 dark:to-orange-800/20 backdrop-blur-sm border border-red-200 dark:border-red-700 rounded-lg shadow-lg">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500 dark:text-red-400" />
        <p className="text-red-600 dark:text-red-300 font-medium">{error}</p>
      </div>
    );
  }

  if (!orgProfile) {
    return (
      <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800/20 dark:to-slate-700/20 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
        <Building className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Chưa có thông tin hồ sơ tổ chức</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organization Basic Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 backdrop-blur-sm border border-blue-200 dark:border-blue-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-800 dark:text-blue-200">
          <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Thông tin tổ chức
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-blue-700 dark:text-blue-300 font-medium">Tên tổ chức</Label>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              {orgProfile.organizationName}
            </p>
          </div>
          <div>
            <Label className="text-blue-700 dark:text-blue-300 font-medium">Tên viết tắt</Label>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {orgProfile.shortName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-blue-700 dark:text-blue-300 font-medium">Loại tổ chức</Label>
            <p className="text-sm text-blue-800 dark:text-blue-200">Loại {orgProfile.typeId}</p>
          </div>
          <div>
            <Label className="text-blue-700 dark:text-blue-300 font-medium">Năm thành lập</Label>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {orgProfile.establishedYear || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-blue-700 dark:text-blue-300 font-medium">Mã số thuế</Label>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {orgProfile.taxCode || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-blue-700 dark:text-blue-300 font-medium">Giấy phép kinh doanh</Label>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {orgProfile.businessLicense || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-blue-200 to-indigo-300 dark:from-blue-700 dark:to-indigo-600 h-0.5" />

      {/* Mission & Vision */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-800/20 backdrop-blur-sm border border-indigo-200 dark:border-indigo-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-indigo-800 dark:text-indigo-200">Sứ mệnh & Tầm nhìn</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-indigo-700 dark:text-indigo-300 font-medium">Mô tả</Label>
            <p className="text-sm text-indigo-800 dark:text-indigo-200 bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-indigo-800/30 dark:to-purple-700/30 p-3 rounded-lg border border-indigo-200 dark:border-indigo-600 shadow-inner">
              {orgProfile.description || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-indigo-700 dark:text-indigo-300 font-medium">Sứ mệnh</Label>
            <p className="text-sm text-indigo-800 dark:text-indigo-200 bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-indigo-800/30 dark:to-purple-700/30 p-3 rounded-lg border border-indigo-200 dark:border-indigo-600 shadow-inner">
              {orgProfile.mission || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-indigo-700 dark:text-indigo-300 font-medium">Tầm nhìn</Label>
            <p className="text-sm text-indigo-800 dark:text-indigo-200 bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-indigo-800/30 dark:to-purple-700/30 p-3 rounded-lg border border-indigo-200 dark:border-indigo-600 shadow-inner">
              {orgProfile.vision || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-indigo-200 to-purple-300 dark:from-indigo-700 dark:to-purple-600 h-0.5" />

      {/* Contact Information */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 backdrop-blur-sm border border-green-200 dark:border-green-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-green-800 dark:text-green-200">
          <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
          Thông tin liên hệ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-green-700 dark:text-green-300 font-medium">Người liên hệ</Label>
            <p className="text-sm text-green-800 dark:text-green-200">
              {orgProfile.contactPersonName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-green-700 dark:text-green-300 font-medium">Chức vụ</Label>
            <p className="text-sm text-green-800 dark:text-green-200">
              {orgProfile.contactPersonTitle || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-green-700 dark:text-green-300 font-medium">Email liên hệ</Label>
            <p className="text-sm text-green-800 dark:text-green-200">
              {orgProfile.contactEmail || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-green-700 dark:text-green-300 font-medium">Điện thoại liên hệ</Label>
            <p className="text-sm text-green-800 dark:text-green-200">
              {orgProfile.contactPhone || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-green-200 to-emerald-300 dark:from-green-700 dark:to-emerald-600 h-0.5" />

      {/* Online Presence */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20 backdrop-blur-sm border border-purple-200 dark:border-purple-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-purple-800 dark:text-purple-200">
          <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Kênh truyền thông
        </h3>
        <div className="space-y-3">
          {orgProfile.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <a
                href={orgProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {orgProfile.website}
              </a>
            </div>
          )}
          {orgProfile.facebookPage && (
            <div className="flex items-center gap-2">
              <Facebook className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <a
                href={orgProfile.facebookPage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {orgProfile.facebookPage}
              </a>
            </div>
          )}
          {orgProfile.linkedInPage && (
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <a
                href={orgProfile.linkedInPage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {orgProfile.linkedInPage}
              </a>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-purple-200 to-pink-300 dark:from-purple-700 dark:to-pink-600 h-0.5" />

      {/* Statistics */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-800/20 backdrop-blur-sm border border-orange-200 dark:border-orange-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-orange-800 dark:text-orange-200">
          <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          Thống kê hoạt động
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-800/30 dark:to-indigo-700/30 p-4 rounded-lg border border-blue-200 dark:border-blue-600 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-200">Sự kiện</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {orgProfile.totalEvents || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-800/30 dark:to-emerald-700/30 p-4 rounded-lg border border-green-200 dark:border-green-600 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-900 dark:text-green-200">
                Tình nguyện viên
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {orgProfile.totalVolunteers || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-amber-50 dark:from-yellow-800/30 dark:to-amber-700/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-600 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-medium text-yellow-900 dark:text-yellow-200">Đánh giá</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {orgProfile.rating?.toFixed(1) || "0.0"}
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              ({orgProfile.ratingCount || 0} lượt đánh giá)
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-50 dark:from-purple-800/30 dark:to-pink-700/30 p-4 rounded-lg border border-purple-200 dark:border-purple-600 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              {orgProfile.isVerified ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <span className="font-medium text-purple-900 dark:text-purple-200">Trạng thái</span>
            </div>
            <Badge variant={orgProfile.isVerified ? "default" : "secondary"} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
              {orgProfile.isVerified ? "Đã xác minh" : "Chưa xác minh"}
            </Badge>
            {orgProfile.verifiedAt && (
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                {new Date(orgProfile.verifiedAt).toLocaleDateString("vi-VN")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
