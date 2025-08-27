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
import type { UserDetailsDto } from "@/types/userManagement";
import type { PartnerProfileViewModel } from "@/types/partnerProfile";

interface PartnerProfileTabProps {
  user: UserDetailsDto;
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
        if (!user.userId) {
          throw new Error("ID người dùng là bắt buộc");
        }
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

    if (user.roleName?.toLowerCase() === "partner" && user.userId) {
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
      <div className="flex items-center justify-center py-8 bg-muted/30 border-border rounded-2xl shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-foreground">Đang tải thông tin đối tác...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-muted/30 border-border rounded-2xl shadow-lg">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!partnerProfile) {
    return (
      <div className="text-center py-8 bg-muted/30 border-border rounded-2xl shadow-lg">
        <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Chưa có thông tin hồ sơ đối tác</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
          <Building className="h-5 w-5 text-primary" />
          Thông tin công ty
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground font-medium">Tên công ty</Label>
            <p className="text-sm text-foreground font-medium">
              {partnerProfile.companyName}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Lĩnh vực</Label>
            <p className="text-sm text-muted-foreground">
              {partnerProfile.industryName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Mã số thuế</Label>
            <p className="text-sm text-muted-foreground">
              {partnerProfile.taxCode || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Giấy phép kinh doanh</Label>
            <p className="text-sm text-muted-foreground">
              {partnerProfile.businessLicense || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-border h-0.5" />

      {/* Company Description */}
      {partnerProfile.description && (
        <>
          <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Mô tả công ty</h3>
            <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl border-border shadow-sm">
              {partnerProfile.description}
            </p>
          </div>
          <Separator className="bg-border h-0.5" />
        </>
      )}

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
              {partnerProfile.contactPersonName || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Chức vụ</Label>
            <p className="text-sm text-muted-foreground">
              {partnerProfile.contactPersonTitle || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Email liên hệ</Label>
            <p className="text-sm text-muted-foreground">
              {partnerProfile.contactEmail || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground font-medium">Điện thoại liên hệ</Label>
            <p className="text-sm text-muted-foreground">
              {partnerProfile.contactPhone || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-border h-0.5" />

      {/* Website */}
      {partnerProfile.website && (
        <>
          <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
              <Globe className="h-5 w-5 text-primary" />
              Website
            </h3>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href={partnerProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors"
              >
                {partnerProfile.website}
              </a>
            </div>
          </div>
          <Separator className="bg-border h-0.5" />
        </>
      )}

      {/* Partnership Statistics */}
      <div className="bg-muted/30 border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
          <Award className="h-5 w-5 text-primary" />
          Thống kê hợp tác
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/30 p-4 rounded-xl border-border shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Hợp tác</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {partnerProfile.totalCollaborations || 0}
            </p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border-border shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Đánh giá</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {partnerProfile.rating?.toFixed(1) || "0.0"}
            </p>
            <p className="text-xs text-muted-foreground">
              ({partnerProfile.ratingCount} lượt đánh giá)
            </p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border-border shadow-md">
            <div className="flex items-center gap-2 mb-2">
              {partnerProfile.isVerified ? (
                <CheckCircle className="h-5 w-5 text-primary" />
              ) : (
                <XCircle className="h-5 w-5 text-primary" />
              )}
              <span className="font-medium text-foreground">Trạng thái</span>
            </div>
            <Badge
              variant={partnerProfile.isVerified ? "default" : "secondary"}
              className="text-sm rounded-xl"
            >
              {partnerProfile.isVerified ? "Đã xác minh" : "Chưa xác minh"}
            </Badge>
            {partnerProfile.verifiedAt && (
              <p className="text-xs text-muted-foreground mt-1">
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
