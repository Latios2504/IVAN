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
import type { UserListDto } from "@/types/userManagement";
import type { VolunteerProfileViewModel } from "@/types/volunteerProfile";

interface VolunteerProfileTabProps {
  user: UserListDto;
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

    if (user.roleName?.toLowerCase() === "volunteer") {
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
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Đang tải thông tin tình nguyện viên...</span>
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

  if (!volunteerProfile) {
    return (
      <div className="text-center py-8 text-gray-500">
        <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Chưa có thông tin hồ sơ tình nguyện viên</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Academic Information */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          Thông tin học vấn
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Mã sinh viên</Label>
            <p className="text-sm text-gray-700">
              {volunteerProfile.studentId || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Trường đại học</Label>
            <p className="text-sm text-gray-700">
              {volunteerProfile.university || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Chuyên ngành</Label>
            <p className="text-sm text-gray-700">
              {volunteerProfile.major || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Năm học</Label>
            <p className="text-sm text-gray-700">
              {volunteerProfile.yearOfStudy
                ? `Năm ${volunteerProfile.yearOfStudy}`
                : "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Volunteer Information */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-green-600" />
          Thông tin tình nguyện
        </h3>
        <div className="space-y-4">
          <div>
            <Label>Động lực tham gia</Label>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {volunteerProfile.motivation || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Kinh nghiệm</Label>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {volunteerProfile.experience || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label>Thời gian có thể tham gia</Label>
            <p className="text-sm text-gray-700">
              {volunteerProfile.availability || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Statistics */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-yellow-600" />
          Thống kê hoạt động
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Giờ tình nguyện</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {volunteerProfile.totalHoursVolunteered || 0}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Đánh giá</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {volunteerProfile.rating?.toFixed(1) || "0.0"}
            </p>
            <p className="text-xs text-yellow-700">
              ({volunteerProfile.ratingCount} lượt đánh giá)
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {volunteerProfile.isVerified ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium text-green-900">Trạng thái</span>
            </div>
            <Badge
              variant={volunteerProfile.isVerified ? "default" : "secondary"}
              className="text-sm"
            >
              {volunteerProfile.isVerified ? "Đã xác minh" : "Chưa xác minh"}
            </Badge>
            {volunteerProfile.verifiedAt && (
              <p className="text-xs text-green-700 mt-1">
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
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4">Kỹ năng</h3>
            <div className="bg-gray-50 p-4 rounded border">
              <p className="text-sm text-gray-700">{volunteerProfile.skills}</p>
            </div>
          </div>
        </>
      )}

      {/* Activity Summary */}
      {volunteerProfile.updatedAt && (
        <>
          <Separator />
          <div>
            <Label>Cập nhật gần nhất</Label>
            <p className="text-sm text-gray-600">
              {new Date(volunteerProfile.updatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
