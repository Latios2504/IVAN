import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, Building2, Star, Shield, ExternalLink } from "lucide-react";

interface PartnerListItemProps {
  partner: {
    id: string;
    name: string;
    description: string;
    type: string;
    industry: string;
    location: string;
    logo?: string;
    website?: string;
    isVerified: boolean;
    rating?: number;
    ratingCount?: number;
  };
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PartnerListItem({
  partner,
  isSelected = false,
  onClick,
  className,
}: PartnerListItemProps) {

  return (
    <div
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 hover:from-emerald-100 hover:via-teal-100 hover:to-cyan-100",
        "dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 dark:hover:from-emerald-900/40 dark:hover:via-teal-900/40 dark:hover:to-cyan-900/40",
        "border-emerald-200 dark:border-emerald-800/50",
        isSelected
          ? "border-2 border-emerald-400 dark:border-emerald-600 shadow-lg shadow-teal-200/50 dark:shadow-teal-800/30"
          : "border hover:border-emerald-300 dark:hover:border-emerald-700",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Logo */}
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={partner.logo} alt={partner.name} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
            {partner.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                {partner.name}
              </h3>
              {partner.isVerified && (
                <Shield className="h-3 w-3 text-blue-500 flex-shrink-0" />
              )}
              {partner.website && (
                <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          </div>

          {/* Type */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {partner.type}
            </Badge>
          </div>

          {/* Industry */}
          <div className="flex items-center gap-1 mb-2">
            <Building2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {partner.industry}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
            {partner.description}
          </p>

          {/* Location */}
          {partner.location && (
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {partner.location}
              </span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Rating */}
            {partner.rating && partner.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-slate-900 dark:text-slate-100">{partner.rating.toFixed(1)}</span>
                {partner.ratingCount && (
                  <span className="text-xs text-slate-500 dark:text-slate-500">({partner.ratingCount})</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}