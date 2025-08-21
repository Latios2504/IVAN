import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, Users, Calendar, Star, Shield } from "lucide-react";

interface OrganizationListItemProps {
  organization: {
    id: string;
    name: string;
    description: string;
    type: string;
    location: string;
    avatar?: string;
    isVerified: boolean;
    rating?: number;
    ratingCount?: number;
    totalEvents?: number;
    totalVolunteers?: number;
  };
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function OrganizationListItem({
  organization,
  isSelected = false,
  onClick,
  className,
}: OrganizationListItemProps) {
  return (
    <div
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 hover:from-orange-100 hover:via-amber-100 hover:to-yellow-100",
        "dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 dark:hover:from-orange-900/40 dark:hover:via-amber-900/40 dark:hover:to-yellow-900/40",
        "border-orange-200 dark:border-orange-800/50",
        isSelected
          ? "border-2 border-orange-400 dark:border-orange-600 shadow-lg shadow-amber-200/50 dark:shadow-amber-800/30"
          : "border hover:border-orange-300 dark:hover:border-orange-700",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={organization.avatar} alt={organization.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-semibold">
            {organization.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                {organization.name}
              </h3>
              {organization.isVerified && (
                <Shield className="h-3 w-3 text-blue-500 flex-shrink-0" />
              )}
            </div>
          </div>

          {/* Type Badge */}
          <Badge variant="secondary" className="text-xs mb-2">
            {organization.type}
          </Badge>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
            {organization.description}
          </p>

          {/* Location */}
          {organization.location && (
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {organization.location}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            {organization.totalEvents !== undefined && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{organization.totalEvents}</span>
              </div>
            )}
            {organization.totalVolunteers !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{organization.totalVolunteers}</span>
              </div>
            )}
            {organization.rating && organization.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{organization.rating.toFixed(1)}</span>
                {organization.ratingCount && (
                  <span className="text-slate-500 dark:text-slate-500">({organization.ratingCount})</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}