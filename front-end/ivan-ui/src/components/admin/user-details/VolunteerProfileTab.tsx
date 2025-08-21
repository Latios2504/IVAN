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
          throw new Error("User ID is required");
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
      <div className="flex items-center justify-center py-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
        <span className="ml-2 text-emerald-700 dark:text-emerald-300">Đang tải thông tin tình nguyện viên...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 rounded-lg border border-red-200 dark:border-red-800">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500 dark:text-red-400" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!volunteerProfile) {
    return (
      <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950 rounded-lg border border-gray-200 dark:border-gray-800">
        <User className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
        <p className="text-gray-600 dark:text-gray-400">Chưa có thông tin hồ sơ tình nguyện viên</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Academic Information */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-emerald-800 dark:text-emerald-200">
          <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Thông tin học vấn
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-emerald-700 dark:text-emerald-300">Mã sinh viên</Label>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {volunteerProfile.studentId || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-emerald-700 dark:text-emerald-300">Trường đại học</Label>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {volunteerProfile.university || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-emerald-700 dark:text-emerald-300">Chuyên ngành</Label>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {volunteerProfile.major || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-emerald-700 dark:text-emerald-300">Năm học</Label>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {volunteerProfile.yearOfStudy
                ? `Năm ${volunteerProfile.yearOfStudy}`
                : "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-emerald-200 dark:bg-emerald-800" />

      {/* Volunteer Information */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 p-4 rounded-lg border border-teal-200 dark:border-teal-800 shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-teal-800 dark:text-teal-200">
          <Award className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          Thông tin tình nguyện
        </h3>
        <div className="space-y-4">
          <div>
            <Label className="text-teal-700 dark:text-teal-300">Động lực tham gia</Label>
            <p className="text-sm text-teal-600 dark:text-teal-400 bg-gradient-to-r from-white to-teal-50 dark:from-gray-800 dark:to-teal-950 p-3 rounded border border-teal-200 dark:border-teal-700">
              {volunteerProfile.motivation || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-teal-700 dark:text-teal-300">Kinh nghiệm</Label>
            <p className="text-sm text-teal-600 dark:text-teal-400 bg-gradient-to-r from-white to-teal-50 dark:from-gray-800 dark:to-teal-950 p-3 rounded border border-teal-200 dark:border-teal-700">
              {volunteerProfile.experience || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Label className="text-teal-700 dark:text-teal-300">Thời gian có thể tham gia</Label>
            <p className="text-sm text-teal-600 dark:text-teal-400">
              {volunteerProfile.availability || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-teal-200 dark:bg-teal-800" />

      {/* Statistics */}
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800 shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-cyan-800 dark:text-cyan-200">
          <Star className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Thống kê hoạt động
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-800 dark:text-blue-200">Giờ tình nguyện</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {volunteerProfile.totalHoursVolunteered || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-medium text-yellow-800 dark:text-yellow-200">Đánh giá</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {volunteerProfile.rating?.toFixed(1) || "0.0"}
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              ({volunteerProfile.ratingCount} lượt đánh giá)
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              {volunteerProfile.isVerified ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <span className="font-medium text-green-800 dark:text-green-200">Trạng thái</span>
            </div>
            <Badge
              variant={volunteerProfile.isVerified ? "default" : "secondary"}
              className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-sm"
            >
              {volunteerProfile.isVerified ? "Đã xác minh" : "Chưa xác minh"}
            </Badge>
            {volunteerProfile.verifiedAt && (
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
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
          <Separator className="bg-cyan-200 dark:bg-cyan-800" />
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">Kỹ năng</h3>
            <div className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-950 p-4 rounded border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-700 dark:text-blue-300">{volunteerProfile.skills}</p>
            </div>
          </div>
        </>
      )}

      {/* Activity Summary */}
      {volunteerProfile.updatedAt && (
        <>
          <Separator className="bg-blue-200 dark:bg-blue-800" />
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-sm">
            <Label className="text-indigo-700 dark:text-indigo-300">Cập nhật gần nhất</Label>
            <p className="text-sm text-indigo-600 dark:text-indigo-400">
              {new Date(volunteerProfile.updatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
