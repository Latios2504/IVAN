import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, GraduationCap, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { VolunteerCardData } from "@/types/publicContent";

interface VolunteerCardProps {
  volunteer: VolunteerCardData;
}

export const VolunteerCard = ({ volunteer }: VolunteerCardProps) => {
  // Add safety checks for volunteer data
  if (!volunteer || !volunteer.id) {
    return null;
  }

  const safeVolunteer = {
    ...volunteer,
    fullName: volunteer.fullName || 'Unknown Volunteer',
    rating: Number(volunteer.rating) || 0,
    ratingCount: Number(volunteer.ratingCount) || 0,
    skills: Array.isArray(volunteer.skills) ? volunteer.skills : [],
  };

  return (
    <Link to={`/volunteers/${safeVolunteer.id}`} className="block">
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={safeVolunteer.avatar} alt={safeVolunteer.fullName} />
              <AvatarFallback>
                {safeVolunteer.fullName
                  .split(" ")
                  .map((n) => n[0] || '')
                  .join("")
                  .toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg truncate">
                  {safeVolunteer.fullName}
                </h3>
                {safeVolunteer.isVerified && (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
              </div>
              {safeVolunteer.university && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <GraduationCap className="h-3 w-3" />
                  <span className="truncate">{safeVolunteer.university}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {safeVolunteer.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {safeVolunteer.description}
            </p>
          )}
          
          {safeVolunteer.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="h-3 w-3" />
              <span>{safeVolunteer.location}</span>
            </div>
          )}
          
          {safeVolunteer.rating > 0 && (
            <div className="flex items-center gap-1 text-sm mb-3">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{safeVolunteer.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({safeVolunteer.ratingCount} reviews)
              </span>
            </div>
          )}
          
          {safeVolunteer.skills && safeVolunteer.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {safeVolunteer.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {String(skill)}
                </Badge>
              ))}
              {safeVolunteer.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{safeVolunteer.skills.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};