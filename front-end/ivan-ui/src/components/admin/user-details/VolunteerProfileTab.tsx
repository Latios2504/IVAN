import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  Award,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import { volunteerProfileService } from "@/services/volunteerProfileService";
import type { UserDetailsDto } from "@/types/userManagement";
import type { VolunteerProfileViewModel } from "@/types/volunteerProfile";

interface VolunteerProfileTabProps {
  user: UserDetailsDto;
}

export function VolunteerProfileTab({ user }: VolunteerProfileTabProps) {
  const [volunteerProfile, setVolunteerProfile] =
    useState<VolunteerProfileViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolunteerProfile = async () => {
      try {
        setLoading(true);
        if (!user.userId) {
          throw new Error("ID người dùng là bắt buộc");
        }
        const profile = await volunteerProfileService.getVolunteerProfile(
          user.userId
        );
        setVolunteerProfile(profile);
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin tình nguyện viên");
      } finally {
        setLoading(false);
      }
    };

    if (user.roleName?.toLowerCase() === "volunteer" && user.userId) {
      fetchVolunteerProfile();
    } else {
      setLoading(false);
    }
  }, [user.userId, user.roleName]);

  if (user.roleName?.toLowerCase() !== "volunteer") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 bg-muted/30 rounded-2xl border border-border">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-foreground">Đang tải thông tin tình nguyện viên...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-muted/30 rounded-2xl border border-border">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!volunteerProfile) {
    return (
      <div className="text-center py-8 bg-muted/30 rounded-2xl border border-border">
        <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Chưa có thông tin hồ sơ tình nguyện viên</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Academic Information */}
      <div className="bg-muted/30 p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
          <GraduationCap className="h-5 w-5 text-primary" />
          Thông tin học vấn
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground">Mã sinh viên</Label>
            <p className="text-sm text-muted-foreground">
              {volunteerProfile.studentId || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground">Trường đại học</Label>
            <p className="text-sm text-muted-foreground">
              {volunteerProfile.university || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground">Chuyên ngành</Label>
            <p className="text-sm text-muted-foreground">
              {volunteerProfile.major || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground">Năm học</Label>
            <p className="text-sm text-muted-foreground">
              {volunteerProfile.yearOfStudy
                ? `Năm ${volunteerProfile.yearOfStudy}`
                : "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Volunteer Information */}
      <div className="bg-muted/30 p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
          <Award className="h-5 w-5 text-primary" />
          Thông tin tình nguyện
        </h3>
        <div className="space-y-4">
          <div>
            <Label className="text-foreground">Động lực tham gia</Label>
            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border">
              {volunteerProfile.motivation || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground">Kinh nghiệm</Label>
            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border">
              {volunteerProfile.experience || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-foreground">Thời gian có thể tham gia</Label>
            <p className="text-sm text-muted-foreground">
              {volunteerProfile.availability || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Statistics */}
      <div className="bg-muted/30 p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
          <Star className="h-5 w-5 text-primary" />
          Thống kê hoạt động
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/30 p-4 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Giờ tình nguyện</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {volunteerProfile.totalHoursVolunteered || 0}
            </p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Đánh giá</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {volunteerProfile.rating?.toFixed(1) || "0.0"}
            </p>
            <p className="text-xs text-muted-foreground">
              ({volunteerProfile.ratingCount} lượt đánh giá)
            </p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              {volunteerProfile.isVerified ? (
                <CheckCircle className="h-5 w-5 text-primary" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span className="font-medium text-foreground">Trạng thái</span>
            </div>
            <Badge
              variant={volunteerProfile.isVerified ? "default" : "secondary"}
              className="text-sm shadow-sm"
            >
              {volunteerProfile.isVerified ? "Đã xác minh" : "Chưa xác minh"}
            </Badge>
            {volunteerProfile.verifiedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(volunteerProfile.verifiedAt).toLocaleDateString(
                  "vi-VN"
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      {volunteerProfile.skills && (
        <>
          <Separator className="bg-border" />
          <div className="bg-muted/30 p-4 rounded-2xl border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Kỹ năng</h3>
            <div className="bg-muted/30 p-4 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground">{volunteerProfile.skills}</p>
            </div>
          </div>
        </>
      )}

      {/* Activity Summary */}
      {volunteerProfile.updatedAt && (
        <>
          <Separator className="bg-border" />
          <div className="bg-muted/30 p-4 rounded-2xl border border-border shadow-sm">
            <Label className="text-foreground">Cập nhật gần nhất</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(volunteerProfile.updatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
