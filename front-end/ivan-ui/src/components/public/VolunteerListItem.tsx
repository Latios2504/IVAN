import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, Star, Shield, Heart } from "lucide-react";

interface VolunteerListItemProps {
  volunteer: {
    id: string;
    name: string;
    bio?: string;
    location?: string;
    avatar?: string;
    skills: string[];
    isVerified: boolean;
    rating?: number;
    ratingCount?: number;
    totalHours: number;
  };
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}



export function VolunteerListItem({
  volunteer,
  isSelected = false,
  onClick,
  className,
}: VolunteerListItemProps) {

  return (
    <div
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 hover:from-blue-100 hover:via-purple-100 hover:to-pink-100",
        "dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 dark:hover:from-blue-900/40 dark:hover:via-purple-900/40 dark:hover:to-pink-900/40",
        "border-blue-200 dark:border-blue-800/50",
        isSelected
          ? "border-2 border-blue-400 dark:border-blue-600 shadow-lg shadow-purple-200/50 dark:shadow-purple-800/30"
          : "border hover:border-blue-300 dark:hover:border-blue-700",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white font-semibold">
              {volunteer.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                {volunteer.name}
              </h3>
              {volunteer.isVerified && (
                <Shield className="h-3 w-3 text-blue-500 flex-shrink-0" />
              )}
            </div>

          </div>

          {/* Bio */}
          {volunteer.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
              {volunteer.bio}
            </p>
          )}

          {/* Skills */}
          {volunteer.skills && volunteer.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {volunteer.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                  {skill}
                </Badge>
              ))}
              {volunteer.skills.length > 3 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{volunteer.skills.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Location */}
          {volunteer.location && (
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {volunteer.location}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-2">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{volunteer.totalHours}h</span>
            </div>
            {volunteer.rating && volunteer.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{volunteer.rating.toFixed(1)}</span>
                {volunteer.ratingCount && (
                  <span className="text-slate-500 dark:text-slate-500">({volunteer.ratingCount})</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}