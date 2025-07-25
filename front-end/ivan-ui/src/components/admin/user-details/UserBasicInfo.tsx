import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Calendar, MapPin, Clock, User } from "lucide-react";
import type { UserAccountDetailDto } from "@/services/userManagementService";

interface UserBasicInfoProps {
  user: UserAccountDetailDto;
}

export function UserBasicInfo({ user }: UserBasicInfoProps) {
  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar} alt={user.fullName} />
          <AvatarFallback className="text-lg">
            {user.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">
            {user.fullName || "Chưa cập nhật"}
          </h3>
          <p className="text-gray-600 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {user.email}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant={user.isActive ? "default" : "destructive"}>
              {user.statusDisplay}
            </Badge>
            <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
              {user.verificationDisplay}
            </Badge>
            <Badge variant="outline">{user.roleName}</Badge>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-lg">Thông tin cơ bản</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.phoneNumber && (
            <div>
              <Label>Số điện thoại</Label>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {user.phoneNumber}
              </p>
            </div>
          )}
          {user.dateOfBirth && (
            <div>
              <Label>Ngày sinh</Label>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(user.dateOfBirth).toLocaleDateString("vi-VN")}
                {user.age && ` (${user.age} tuổi)`}
              </p>
            </div>
          )}
          {user.gender && (
            <div>
              <Label>Giới tính</Label>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <User className="h-4 w-4" />
                {user.gender === "Male"
                  ? "Nam"
                  : user.gender === "Female"
                  ? "Nữ"
                  : user.gender}
              </p>
            </div>
          )}
          <div>
            <Label>Đăng nhập cuối</Label>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString("vi-VN")
                : "Chưa đăng nhập"}
            </p>
          </div>
          <div>
            <Label>Ngày tạo</Label>
            <p className="text-sm text-gray-600">
              {new Date(user.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
          <div>
            <Label>Cập nhật cuối</Label>
            <p className="text-sm text-gray-600">
              {new Date(user.updatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      </div>

      {/* Address Information */}
      {(user.address || user.wardCommune || user.district || user.province) && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Địa chỉ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Địa chỉ chi tiết</Label>
                <p className="text-sm text-gray-600">
                  {user.address || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <Label>Phường/Xã</Label>
                <p className="text-sm text-gray-600">
                  {user.wardCommune || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <Label>Quận/Huyện</Label>
                <p className="text-sm text-gray-600">
                  {user.district || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <Label>Tỉnh/Thành phố</Label>
                <p className="text-sm text-gray-600">
                  {user.province || "Chưa cập nhật"}
                </p>
              </div>
            </div>
            {user.fullAddress && (
              <div className="mt-3">
                <Label>Địa chỉ đầy đủ</Label>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {user.fullAddress}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Emergency Contact */}
      {(user.emergencyContactName || user.emergencyContactPhone) && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium mb-3">Liên hệ khẩn cấp</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tên người liên hệ</Label>
                <p className="text-sm text-gray-600">
                  {user.emergencyContactName || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <Label>Số điện thoại</Label>
                <p className="text-sm text-gray-600">
                  {user.emergencyContactPhone || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
