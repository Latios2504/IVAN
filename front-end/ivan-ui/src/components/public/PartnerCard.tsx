import { Link } from "react-router-dom";
import {
  MapPin,
  Star,
  ExternalLink,
  Shield,
  Heart,
  Building2,
  Handshake,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PartnerCardProps {
  partner: {
    id: string;
    name: string;
    description: string;
    industry: string;
    location: string;
    website?: string;
    logo?: string;
    isVerified: boolean;
    rating?: number;
    ratingCount?: number;
    totalCollaborations?: number;
    partnershipType?: string;
  };
  className?: string;
}

export function PartnerCard({ partner, className }: PartnerCardProps) {
  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") {
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
        "group hover:shadow-lg transition-all duration-200 cursor-pointer",
        partner.isVerified && "ring-2 ring-purple-500/20 shadow-purple-500/10",
        className
      )}
    >
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={partner.logo} alt={partner.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                {getInitials(partner.name)}
              </AvatarFallback>
            </Avatar>

            {partner.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1">
                <Shield className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Header Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                  {partner.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-200 text-slate-600"
                  >
                    <Building2 className="w-3 h-3 mr-1" />
                    {partner.industry}
                  </Badge>
                  {partner.isVerified && (
                    <Badge className="bg-purple-500/10 text-purple-700 border-purple-200 text-xs">
                      Đối tác xác minh
                    </Badge>
                  )}
                </div>
              </div>

              {/* Website Link */}
              {partner.website && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0 text-slate-400 hover:text-purple-600"
                >
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>

            {/* Rating */}
            {partner.rating && partner.ratingCount && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-slate-700">
                  {(partner.rating || 0).toFixed(1)}
                </span>
                <span className="text-sm text-slate-500">
                  ({partner.ratingCount || 0} đánh giá)
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-4">
        {/* Description */}
        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
          {partner.description}
        </p>

        {/* Partnership Type */}
        {partner.partnershipType && (
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-xs bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
            >
              <Handshake className="w-3 h-3 mr-1" />
              {partner.partnershipType}
            </Badge>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="h-4 w-4 text-red-500" />
          <span className="text-sm line-clamp-1">{partner.location}</span>
        </div>

        {/* Stats */}
        {partner.totalCollaborations !== undefined && (
          <div className="flex items-center gap-2 pt-2">
            <Handshake className="h-4 w-4 text-purple-500" />
            <div>
              <span className="text-sm font-semibold text-slate-900">
                {partner.totalCollaborations}
              </span>
              <span className="text-xs text-slate-500 ml-1">hợp tác</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-lg font-medium"
          >
            <Link to={`/partners/${partner.id}`}>Xem chi tiết</Link>
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
