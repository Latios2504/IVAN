import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Calendar, Clock, User } from "lucide-react";
import type { UserDetailsDto } from "@/types/userManagement";

interface UserBasicInfoProps {
  user: UserDetailsDto;
}

export function UserBasicInfo({ user }: UserBasicInfoProps) {
  // Helper function to safely get user properties
  const getUserProp = (prop: string) => (user as any)?.[prop];

  // Get user display name - could be fullName, FullName, or constructed from first/last name
  const getDisplayName = () => {
    return (
      getUserProp("fullName") ||
      getUserProp("FullName") ||
      (getUserProp("firstName") && getUserProp("lastName")
        ? `${getUserProp("firstName")} ${getUserProp("lastName")}`.trim()
        : getUserProp("FirstName") && getUserProp("LastName")
        ? `${getUserProp("FirstName")} ${getUserProp("LastName")}`.trim()
        : "Chưa cập nhật")
    );
  };

  // Get user role name
  const getRoleName = () => {
    return (
      getUserProp("roleName") ||
      getUserProp("RoleName") ||
      getUserProp("role")?.roleName ||
      getUserProp("Role")?.RoleName ||
      "Chưa xác định"
    );
  };

  const displayName = getDisplayName();
  const initials =
    displayName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-100/80 via-indigo-100/80 to-purple-100/80 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50 shadow-md">
        <Avatar className="h-20 w-20 ring-2 ring-blue-200 dark:ring-blue-800 shadow-lg">
          <AvatarImage src={getUserProp("avatar")} alt={displayName} />
          <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
            {displayName}
          </h3>
          <p className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            {getUserProp("email") || "Chưa có email"}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge
              variant={getUserProp("isActive") ? "default" : "destructive"}
            >
              {getUserProp("isActive") ? "Đang hoạt động" : "Không hoạt động"}
            </Badge>
            <Badge
              variant={getUserProp("isEmailVerified") ? "default" : "secondary"}
            >
              {getUserProp("isEmailVerified")
                ? "Email đã xác thực"
                : "Email chưa xác thực"}
            </Badge>
            <Badge variant="outline">{getRoleName()}</Badge>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200/30 dark:border-blue-800/30 shadow-sm">
        <h4 className="font-medium text-lg text-blue-900 dark:text-blue-100">
          Thông tin cơ bản
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-blue-800 dark:text-blue-200">
              Số điện thoại
            </Label>
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {getUserProp("phoneNumber") || "Chưa cập nhật"}
            </p>
          </div>

          <div>
            <Label className="text-blue-800 dark:text-blue-200">Vai trò</Label>
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {getRoleName()}
            </p>
          </div>

          {getUserProp("createdAt") && (
            <div>
              <Label className="text-blue-800 dark:text-blue-200">
                Ngày tạo tài khoản
              </Label>
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {new Date(getUserProp("createdAt")).toLocaleDateString("vi-VN")}
              </p>
            </div>
          )}

          <div>
            <Label className="text-blue-800 dark:text-blue-200">
              Đăng nhập lần cuối
            </Label>
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {getUserProp("lastLoginAt")
                ? new Date(getUserProp("lastLoginAt")).toLocaleString("vi-VN")
                : "Chưa đăng nhập"}
            </p>
          </div>
        </div>
      </div>

      {/* Role Specific Info */}
      {getUserProp("roleSpecificInfo") && (
        <>
          <Separator className="bg-blue-200/50 dark:bg-blue-800/50" />
          <div className="p-4 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200/30 dark:border-blue-800/30 shadow-sm">
            <h4 className="font-medium text-lg text-blue-900 dark:text-blue-100">
              Thông tin vai trò
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 p-3 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded border border-blue-200/50 dark:border-blue-800/50">
              {getUserProp("roleSpecificInfo")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
