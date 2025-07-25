import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Edit,
  Save,
  X,
  Camera,
  Shield,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Building2,
  Users,
  Star,
  Award,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProfileBadges from "./ProfileBadges";

interface ProfileHeaderProps {
  profile: any;
  role: string;
  isCurrentUser?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  onImageUpload?: (file: File, imageType: "avatar" | "banner" | "logo") => void;
}

export default function ProfileHeader({
  profile,
  role,
  isCurrentUser = false,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  onImageUpload,
}: ProfileHeaderProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Get profile display name based on role
  const getDisplayName = () => {
    if (role === "organization") {
      return profile.organizationName || profile.fullName || "Chưa có tên";
    }
    if (role === "partner") {
      return profile.companyName || profile.fullName || "Chưa có tên";
    }
    return (
      profile.fullName ||
      `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
      "Chưa có tên"
    );
  };

  // Get profile avatar/logo
  const getProfileImage = () => {
    if (role === "organization") {
      return profile.logoUrl || profile.avatar;
    }
    if (role === "partner") {
      return profile.logoUrl || profile.avatar;
    }
    return profile.avatar;
  };

  // Get role display name
  const getRoleDisplayName = () => {
    switch (role) {
      case "volunteer":
        return "Tình nguyện viên";
      case "organization":
        return "Tổ chức";
      case "partner":
        return "Đối tác";
      case "coordinator":
        return "Điều phối viên";
      case "admin":
        return "Quản trị viên";
      default:
        return role;
    }
  };

  // Get role-specific stats
  const getStats = () => {
    switch (role) {
      case "volunteer":
        return [
          {
            label: "Giờ tình nguyện",
            value: profile.volunteerHours || 0,
            icon: Clock,
          },
          { label: "Đánh giá", value: `${profile.rating || 0}/5`, icon: Star },
          {
            label: "Sự kiện tham gia",
            value: profile.eventsJoined || 0,
            icon: Calendar,
          },
        ];
      case "organization":
        return [
          {
            label: "Sự kiện tổ chức",
            value: profile.totalEvents || 0,
            icon: Calendar,
          },
          {
            label: "Tình nguyện viên",
            value: profile.totalVolunteers || 0,
            icon: Users,
          },
          { label: "Đánh giá", value: `${profile.rating || 0}/5`, icon: Star },
        ];
      case "partner":
        return [
          {
            label: "Hợp tác",
            value: profile.totalCollaborations || 0,
            icon: Building2,
          },
          { label: "Đánh giá", value: `${profile.rating || 0}/5`, icon: Star },
          {
            label: "Năm thành lập",
            value: profile.establishedYear || "N/A",
            icon: Calendar,
          },
        ];
      default:
        return [];
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      const imageType =
        role === "organization" || role === "partner" ? "logo" : "avatar";
      onImageUpload(file, imageType);
    }
  };

  const stats = getStats();

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      {/* Banner/Cover Image */}
      {(role === "organization" || role === "partner") && profile.bannerUrl && (
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-t-lg relative overflow-hidden">
          <img
            src={profile.bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          {isCurrentUser && isEditing && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={() => document.getElementById("banner-upload")?.click()}
            >
              <Camera className="w-4 h-4 mr-1" />
              Thay đổi
            </Button>
          )}
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar/Logo */}
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={getProfileImage()} alt={getDisplayName()} />
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {getDisplayName().charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {isCurrentUser && isEditing && (
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {getDisplayName()}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-sm">
                    {getRoleDisplayName()}
                  </Badge>
                  <ProfileBadges profile={profile} role={role} />
                </div>
              </div>

              {/* Action Buttons */}
              {isCurrentUser && (
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <Button onClick={onEdit} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button onClick={onCancel} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Hủy
                      </Button>
                      <Button onClick={() => onSave?.({})} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Lưu
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {profile.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phoneNumber && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phoneNumber}</span>
                </div>
              )}
              {profile.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.address}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            {stats.length > 0 && (
              <div className="flex flex-wrap gap-6 pt-2">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <stat.icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      <span className="font-semibold text-gray-900">
                        {stat.value}
                      </span>
                      <span className="text-gray-600 ml-1">{stat.label}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <input
          id="banner-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && onImageUpload) {
              onImageUpload(file, "banner");
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
