import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Globe,
  Mail,
  Phone,
  Building,
  Star,
  CheckCircle,
  XCircle,
  Award,
  Users,
} from "lucide-react";
import { partnerProfileService } from "@/services/partnerProfileService";
import type { UserListDto } from "@/types/userManagement";
import type { PartnerProfileViewModel } from "@/types/partnerProfile";

interface PartnerProfileTabProps {
  user: UserListDto;
}

export function PartnerProfileTab({ user }: PartnerProfileTabProps) {
  const [partnerProfile, setPartnerProfile] =
    useState<PartnerProfileViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartnerProfile = async () => {
      try {
        setLoading(true);
        const profile = await partnerProfileService.getPartnerProfile(
          user.userId
        );
        setPartnerProfile(profile);
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin đối tác");
      } finally {
        setLoading(false);
      }
    };

    if (user.roleName?.toLowerCase() === "partner") {
      fetchPartnerProfile();
    } else {
      setLoading(false);
    }
  }, [user.userId, user.roleName]);

  if (user.roleName?.toLowerCase() !== "partner") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Đang tải thông tin đối tác...</span>
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

  if (!partnerProfile) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Chưa có thông tin hồ sơ đối tác</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Building className="h-5 w-5 text-blue-600" />
          Thông tin công ty
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tên công ty</Label>
            <p className="text-sm text-gray-700 font-medium">
              {partnerProfile.companyName}
            </p>
          </div>
          <div>
            <Label>Lĩnh vực</Label>
            <p className="text-sm text-gray-700">
              {partnerProfile.industryName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Mã số thuế</Label>
            <p className="text-sm text-gray-700">
              {partnerProfile.taxCode || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Giấy phép kinh doanh</Label>
            <p className="text-sm text-gray-700">
              {partnerProfile.businessLicense || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Company Description */}
      {partnerProfile.description && (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4">Mô tả công ty</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded">
              {partnerProfile.description}
            </p>
          </div>
          <Separator />
        </>
      )}

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
              {partnerProfile.contactPersonName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Chức vụ</Label>
            <p className="text-sm text-gray-700">
              {partnerProfile.contactPersonTitle || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Email liên hệ</Label>
            <p className="text-sm text-gray-700">
              {partnerProfile.contactEmail || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Điện thoại liên hệ</Label>
            <p className="text-sm text-gray-700">
              {partnerProfile.contactPhone || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Website */}
      {partnerProfile.website && (
        <>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-purple-600" />
              Website
            </h3>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <a
                href={partnerProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {partnerProfile.website}
              </a>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Partnership Statistics */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-orange-600" />
          Thống kê hợp tác
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Hợp tác</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {partnerProfile.totalCollaborations || 0}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Đánh giá</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {partnerProfile.rating?.toFixed(1) || "0.0"}
            </p>
            <p className="text-xs text-yellow-700">
              ({partnerProfile.ratingCount} lượt đánh giá)
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {partnerProfile.isVerified ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium text-green-900">Trạng thái</span>
            </div>
            <Badge
              variant={partnerProfile.isVerified ? "default" : "secondary"}
              className="text-sm"
            >
              {partnerProfile.isVerified ? "Đã xác minh" : "Chưa xác minh"}
            </Badge>
            {partnerProfile.verifiedAt && (
              <p className="text-xs text-green-700 mt-1">
                {new Date(partnerProfile.verifiedAt).toLocaleDateString(
                  "vi-VN"
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
