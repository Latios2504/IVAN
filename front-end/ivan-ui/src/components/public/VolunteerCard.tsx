import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, GraduationCap, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface VolunteerCardData {
  id: string;
  fullName: string;
  avatar?: string;
  university?: string;
  location?: string;
  rating: number;
  ratingCount: number;
  totalHoursVolunteered?: number;
  isVerified: boolean;
  skills: string[];
  description?: string;
}

interface VolunteerCardProps {
  volunteer: VolunteerCardData;
  className?: string;
}

export const VolunteerCard = ({ volunteer, className }: VolunteerCardProps) => {
  // Add safety checks for volunteer data
  if (!volunteer || !volunteer.id) {
    return null;
  }

  const safeVolunteer = {
    ...volunteer,
    fullName: volunteer.fullName || "Unknown Volunteer",
    rating: Number(volunteer.rating) || 0,
    ratingCount: Number(volunteer.ratingCount) || 0,
    skills: Array.isArray(volunteer.skills) ? volunteer.skills : [],
  };

  return (
    <Link to={`/volunteers/${safeVolunteer.id}`} className="block">
      <Card
        className={cn(
          "group hover:shadow-lg transition-all duration-200 cursor-pointer",
          safeVolunteer.isVerified &&
            "ring-2 ring-emerald-500/20 shadow-emerald-500/10 dark:ring-emerald-400/30",
          className
        )}
      >
        <CardHeader className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={safeVolunteer.avatar}
                  alt={safeVolunteer.fullName}
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                  {safeVolunteer.fullName
                    .split(" ")
                    .map((n) => n[0] || "")
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              {safeVolunteer.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 dark:bg-emerald-600">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xl font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {safeVolunteer.fullName}
                  </h3>
                  {safeVolunteer.university && (
                    <div className="flex items-center gap-1 text-muted-foreground mt-1">
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-sm line-clamp-1">
                        {safeVolunteer.university}
                      </span>
                    </div>
                  )}
                  {safeVolunteer.location && (
                    <div className="flex items-center gap-1 text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm line-clamp-1">
                        {safeVolunteer.location}
                      </span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                {safeVolunteer.rating > 0 && (
                  <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium text-foreground">
                      {(safeVolunteer.rating || 0).toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({safeVolunteer.ratingCount || 0})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          {safeVolunteer.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {safeVolunteer.description}
            </p>
          )}

          {safeVolunteer.skills && safeVolunteer.skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-foreground uppercase tracking-wide">
                Kỹ năng
              </h4>
              <div className="flex flex-wrap gap-2">
                {safeVolunteer.skills.slice(0, 4).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {String(skill)}
                  </Badge>
                ))}
                {safeVolunteer.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{safeVolunteer.skills.length - 4} thêm
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
