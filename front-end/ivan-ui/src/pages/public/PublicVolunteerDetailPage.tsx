import { useParams, Navigate } from "react-router-dom";
import { PublicDetailPageLayout } from "@/components/public/PublicDetailPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useApi } from "@/hooks/useApi";
import { publicContentService } from "@/services/publicContentService";
import type { PublicVolunteer } from "@/types/publicContent";
import {
  MapPin,
  GraduationCap,
  Star,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Award,
  Users,
} from "lucide-react";

export const PublicVolunteerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const volunteerId = id ? parseInt(id, 10) : null;

  if (!volunteerId || isNaN(volunteerId)) {
    return <Navigate to="/volunteers" replace />;
  }

  // Service adapter for public volunteers
  const publicVolunteersService = {
    getById: async (volId: string | number): Promise<PublicVolunteer> => {
      return await publicContentService.getPublicVolunteer(Number(volId));
    },
  };

  // Use the new useApi hook
  const volunteersApi = useApi(publicVolunteersService, { autoLoad: true });

  // Extract volunteer data
  const [volunteer, setVolunteer] = useState<PublicVolunteer | null>(null);
  const loading = volunteersApi.loading;
  const error = volunteersApi.error;

  useEffect(() => {
    if (volunteerId) {
      volunteersApi.loadById(volunteerId).then(setVolunteer);
    }
  }, [volunteerId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Volunteers", href: "/volunteers" },
    { label: volunteer?.fullName || "Loading...", isActive: true },
  ];

  return (
    <PublicDetailPageLayout
      loading={loading}
      error={error}
      data={volunteer}
      title={volunteer?.fullName || "Volunteer"}
      description={
        volunteer?.motivation ||
        volunteer?.experience ||
        `Learn more about ${volunteer?.fullName}, a dedicated volunteer ready to make a difference.`
      }
      breadcrumbs={breadcrumbs}
      loadingText="Đang tải thông tin tình nguyện viên..."
      notFoundMessage="Không tìm thấy tình nguyện viên"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={volunteer?.avatar}
                    alt={volunteer?.fullName}
                  />
                  <AvatarFallback className="text-lg">
                    {volunteer?.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">
                      {volunteer?.fullName}
                    </h1>
                    {volunteer?.isVerified && (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                  </div>

                  {volunteer?.university && (
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{volunteer.university}</span>
                    </div>
                  )}

                  {volunteer?.province && (
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{volunteer.province}</span>
                    </div>
                  )}

                  {volunteer?.rating && volunteer.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {volunteer.rating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({volunteer?.ratingCount || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Bio/Motivation */}
          {(volunteer?.motivation || volunteer?.experience) && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {volunteer.motivation || volunteer.experience}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {volunteer?.skillsList && volunteer.skillsList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {volunteer.skillsList.map((skill) => (
                    <Badge
                      key={skill.skillId}
                      variant="secondary"
                      className="text-sm"
                    >
                      {skill.skillName}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          {volunteer?.experience && (
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {volunteer.experience}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {volunteer?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{volunteer.email}</span>
                </div>
              )}

              {volunteer?.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{volunteer.phoneNumber}</span>
                </div>
              )}

              {volunteer?.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Born {formatDate(volunteer.dateOfBirth)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Volunteer Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {volunteer?.rating?.toFixed(1) || "N/A"}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reviews</span>
                <span className="text-sm font-medium">
                  {volunteer?.ratingCount || 0}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Verified</span>
                <div className="flex items-center gap-1">
                  {volunteer?.isVerified ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-sm text-green-600">Yes</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">No</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicDetailPageLayout>
  );
};

export default PublicVolunteerDetailPage;
