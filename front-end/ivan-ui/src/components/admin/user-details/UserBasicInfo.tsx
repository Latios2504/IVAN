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
      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
        <Avatar className="h-20 w-20">
          <AvatarImage src={getUserProp("avatar")} alt={displayName} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{displayName}</h3>
          <p className="text-gray-600 flex items-center gap-2">
            <Mail className="h-4 w-4" />
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
      <div className="space-y-4">
        <h4 className="font-medium text-lg">Thông tin cơ bản</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Số điện thoại</Label>
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {getUserProp("phoneNumber") || "Chưa cập nhật"}
            </p>
          </div>

          <div>
            <Label>Vai trò</Label>
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4" />
              {getRoleName()}
            </p>
          </div>

          {getUserProp("createdAt") && (
            <div>
              <Label>Ngày tạo tài khoản</Label>
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(getUserProp("createdAt")).toLocaleDateString("vi-VN")}
              </p>
            </div>
          )}

          <div>
            <Label>Đăng nhập lần cuối</Label>
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
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
          <Separator />
          <div>
            <h4 className="font-medium text-lg">Thông tin vai trò</h4>
            <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded border">
              {getUserProp("roleSpecificInfo")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
