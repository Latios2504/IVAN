import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Shield, Star, Award, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileBadgesProps {
  profile: any;
  role: string;
  className?: string;
}

export default function ProfileBadges({
  profile,
  role,
  className,
}: ProfileBadgesProps) {
  const badges = [];

  // Verification badge
  if (profile.isVerified) {
    badges.push({
      icon: <ShieldCheck className="w-3 h-3" />,
      label: "Đã xác thực",
      variant: "default" as const,
      className: "bg-green-100 text-green-800 border-green-200",
    });
  } else if (profile.isVerified === false) {
    badges.push({
      icon: <Shield className="w-3 h-3" />,
      label: "Chưa xác thực",
      variant: "secondary" as const,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    });
  }

  // Role-specific badges
  switch (role) {
    case "volunteer":
      // Rating badge for high-rated volunteers
      if (profile.rating >= 4.5) {
        badges.push({
          icon: <Star className="w-3 h-3" />,
          label: "Xuất sắc",
          variant: "default" as const,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        });
      }

      // Active volunteer badge
      if (profile.volunteerHours >= 100) {
        badges.push({
          icon: <Award className="w-3 h-3" />,
          label: "Tình nguyện viên tích cực",
          variant: "default" as const,
          className: "bg-blue-100 text-blue-800 border-blue-200",
        });
      }
      break;

    case "organization":
      // Trusted organization
      if (profile.totalEvents >= 10 && profile.rating >= 4.0) {
        badges.push({
          icon: <Award className="w-3 h-3" />,
          label: "Tổ chức uy tín",
          variant: "default" as const,
          className: "bg-purple-100 text-purple-800 border-purple-200",
        });
      }

      // Active organization
      if (profile.totalEvents >= 5) {
        badges.push({
          icon: <CheckCircle className="w-3 h-3" />,
          label: "Hoạt động tích cực",
          variant: "default" as const,
          className: "bg-green-100 text-green-800 border-green-200",
        });
      }
      break;

    case "partner":
      // Trusted partner
      if (profile.totalCollaborations >= 5 && profile.rating >= 4.0) {
        badges.push({
          icon: <Award className="w-3 h-3" />,
          label: "Đối tác tin cậy",
          variant: "default" as const,
          className: "bg-indigo-100 text-indigo-800 border-indigo-200",
        });
      }
      break;

    case "coordinator":
      badges.push({
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Điều phối viên",
        variant: "default" as const,
        className: "bg-teal-100 text-teal-800 border-teal-200",
      });
      break;

    case "admin":
      badges.push({
        icon: <ShieldCheck className="w-3 h-3" />,
        label: "Quản trị viên",
        variant: "default" as const,
        className: "bg-red-100 text-red-800 border-red-200",
      });
      break;
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {badges.map((badge, index) => (
        <Badge
          key={index}
          variant={badge.variant}
          className={cn("text-xs flex items-center gap-1", badge.className)}
        >
          {badge.icon}
          {badge.label}
        </Badge>
      ))}
    </div>
  );
}
