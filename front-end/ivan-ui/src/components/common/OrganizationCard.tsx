import { Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Calendar,
  Star,
  ExternalLink,
  Shield,
  Heart,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface OrganizationCardProps {
  organization: {
    id: string;
    name: string;
    description: string;
    type: string;
    location: string;
    website?: string;
    avatar?: string;
    isVerified: boolean;
    rating?: number;
    ratingCount?: number;
    totalEvents?: number;
    totalVolunteers?: number;
    focusAreas?: string[];
  };
  className?: string;
}

export function OrganizationCard({
  organization,
  className,
}: OrganizationCardProps) {
  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') {
      return "??";
    }
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card
      className={cn(
        "group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm overflow-hidden",
        organization.isVerified &&
          "ring-2 ring-green-500/20 shadow-green-500/10",
        className
      )}
    >
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-16 w-16 ring-2 ring-white shadow-lg">
              <AvatarImage src={organization.avatar} alt={organization.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-semibold text-lg">
                {getInitials(organization.name)}
              </AvatarFallback>
            </Avatar>

            {organization.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <Shield className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Header Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {organization.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-200 text-slate-600"
                  >
                    {organization.type}
                  </Badge>
                  {organization.isVerified && (
                    <Badge className="bg-green-500/10 text-green-700 border-green-200 text-xs">
                      Đã xác minh
                    </Badge>
                  )}
                </div>
              </div>

              {/* Website Link */}
              {organization.website && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                >
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>

            {/* Rating */}
            {organization.rating && organization.ratingCount && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-slate-700">
                  {organization.rating.toFixed(1)}
                </span>
                <span className="text-sm text-slate-500">
                  ({organization.ratingCount} đánh giá)
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-4">
        {/* Description */}
        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
          {organization.description}
        </p>

        {/* Focus Areas */}
        {organization.focusAreas && organization.focusAreas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {organization.focusAreas.slice(0, 3).map((area, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                {area}
              </Badge>
            ))}
            {organization.focusAreas.length > 3 && (
              <Badge variant="outline" className="text-xs text-slate-500">
                +{organization.focusAreas.length - 3} khác
              </Badge>
            )}
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="h-4 w-4 text-red-500" />
          <span className="text-sm line-clamp-1">{organization.location}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {organization.totalEvents !== undefined && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {organization.totalEvents}
                </div>
                <div className="text-xs text-slate-500">Sự kiện</div>
              </div>
            </div>
          )}

          {organization.totalVolunteers !== undefined && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {organization.totalVolunteers}
                </div>
                <div className="text-xs text-slate-500">Tình nguyện viên</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white border-0 rounded-lg font-medium"
          >
            <Link to={`/organizations/${organization.id}`}>Xem chi tiết</Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 hover:bg-slate-50 rounded-lg"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
