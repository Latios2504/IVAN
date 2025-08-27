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
import type { UserDetailsDto } from "@/types/userManagement";
import type { OrganizationProfileViewModel } from "@/types/organizationProfile";

interface OrganizationProfileTabProps {
  user: UserDetailsDto;
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
        if (!user.userId) {
          throw new Error("ID người dùng là bắt buộc");
        }
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

    if (user.roleName?.toLowerCase() === "organization" && user.userId) {
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
      <div className="flex items-center justify-center py-8 bg-muted/30 border-border rounded-2xl shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-foreground font-medium">Đang tải thông tin tổ chức...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-muted/30 border-border rounded-2xl shadow-lg">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  }

  if (!orgProfile) {
    return (
      <div className="text-center py-8 bg-muted/30 border-border rounded-2xl shadow-lg">
        <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground font-medium">Chưa có thông tin hồ sơ tổ chức</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organization Basic Info */}
      <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
          <Building className="h-5 w-5 text-primary" />
          Thông tin tổ chức
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground font-medium">Tên tổ chức</Label>
            <p className="text-sm text-foreground font-medium">
              {orgProfile.organizationName}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Tên viết tắt</Label>
            <p className="text-sm text-muted-foreground">
              {orgProfile.shortName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Loại tổ chức</Label>
            <p className="text-sm text-muted-foreground">Loại {orgProfile.typeId}</p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Năm thành lập</Label>
            <p className="text-sm text-muted-foreground">
              {orgProfile.establishedYear || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Mã số thuế</Label>
            <p className="text-sm text-muted-foreground">
              {orgProfile.taxCode || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Giấy phép kinh doanh</Label>
            <p className="text-sm text-muted-foreground">
              {orgProfile.businessLicense || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-border h-0.5" />

      {/* Mission & Vision */}
      <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Sứ mệnh & Tầm nhìn</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-foreground font-medium">Mô tả</Label>
            <p className="text-sm text-foreground bg-muted/30 p-3 rounded-xl border-border shadow-inner">
              {orgProfile.description || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Sứ mệnh</Label>
            <p className="text-sm text-foreground bg-muted/30 p-3 rounded-xl border-border shadow-inner">
              {orgProfile.mission || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Tầm nhìn</Label>
            <p className="text-sm text-foreground bg-muted/30 p-3 rounded-xl border-border shadow-inner">
              {orgProfile.vision || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-border h-0.5" />

      {/* Contact Information */}
      <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
          <Mail className="h-5 w-5 text-primary" />
          Thông tin liên hệ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground font-medium">Người liên hệ</Label>
            <p className="text-sm text-muted-foreground">
              {orgProfile.contactPersonName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Chức vụ</Label>
            <p className="text-sm text-muted-foreground">
              {orgProfile.contactPersonTitle || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Email liên hệ</Label>
            <p className="text-sm text-muted-foreground">
              {orgProfile.contactEmail || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Điện thoại liên hệ</Label>
            <p className="text-sm text-muted-foreground">
              {orgProfile.contactPhone || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-border h-0.5" />

      {/* Online Presence */}
      <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
          <Globe className="h-5 w-5 text-primary" />
          Kênh truyền thông
        </h3>
        <div className="space-y-3">
          {orgProfile.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href={orgProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors"
              >
                {orgProfile.website}
              </a>
            </div>
          )}
          {orgProfile.facebookPage && (
            <div className="flex items-center gap-2">
              <Facebook className="h-4 w-4 text-primary" />
              <a
                href={orgProfile.facebookPage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors"
              >
                {orgProfile.facebookPage}
              </a>
            </div>
          )}
          {orgProfile.linkedInPage && (
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-primary" />
              <a
                href={orgProfile.linkedInPage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors"
              >
                {orgProfile.linkedInPage}
              </a>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-border h-0.5" />

      {/* Statistics */}
      <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
          <Activity className="h-5 w-5 text-primary" />
          Thống kê hoạt động
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted/30 p-4 rounded-xl border-border shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Sự kiện</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {orgProfile.totalEvents || 0}
            </p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border-border shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                Tình nguyện viên
              </span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {orgProfile.totalVolunteers || 0}
            </p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border-border shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Đánh giá</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {orgProfile.rating?.toFixed(1) || "0.0"}
            </p>
            <p className="text-xs text-muted-foreground">
              ({orgProfile.ratingCount || 0} lượt đánh giá)
            </p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border-border shadow-md">
            <div className="flex items-center gap-2 mb-2">
              {orgProfile.isVerified ? (
                <CheckCircle className="h-5 w-5 text-primary" />
              ) : (
                <XCircle className="h-5 w-5 text-primary" />
              )}
              <span className="font-medium text-foreground">Trạng thái</span>
            </div>
            <Badge variant={orgProfile.isVerified ? "default" : "secondary"} className="text-sm rounded-xl">
              {orgProfile.isVerified ? "Đã xác minh" : "Chưa xác minh"}
            </Badge>
            {orgProfile.verifiedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(orgProfile.verifiedAt).toLocaleDateString("vi-VN")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
