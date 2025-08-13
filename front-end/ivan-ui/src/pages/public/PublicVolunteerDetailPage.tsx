import { useParams, Navigate } from "react-router-dom";
import { PublicDetailPageLayout } from "@/components/public/PublicDetailPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { volunteerProfileService } from "@/services/volunteerProfileService";
import type { PublicVolunteerDto } from "@/types/volunteerProfile";
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

  const [volunteer, setVolunteer] = useState<PublicVolunteerDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (volunteerId) {
      const loadVolunteer = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await volunteerProfileService.getPublicVolunteer(
            volunteerId
          );
          setVolunteer(result);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load volunteer"
          );
        } finally {
          setLoading(false);
        }
      };

      loadVolunteer();
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
                      <span>
                        {volunteer.university}
                        {volunteer.major && ` - ${volunteer.major}`}
                        {volunteer.yearOfStudy &&
                          ` (Năm ${volunteer.yearOfStudy})`}
                      </span>
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
          {(volunteer?.motivation ||
            volunteer?.experience ||
            volunteer?.availability) && (
            <Card>
              <CardHeader>
                <CardTitle>Giới thiệu bản thân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {volunteer?.motivation && (
                  <div>
                    <h4 className="font-medium mb-2">Động lực tham gia:</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {volunteer.motivation}
                    </p>
                  </div>
                )}
                {volunteer?.experience && (
                  <div>
                    <h4 className="font-medium mb-2">Kinh nghiệm:</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {volunteer.experience}
                    </p>
                  </div>
                )}
                {volunteer?.availability && (
                  <div>
                    <h4 className="font-medium mb-2">
                      Thời gian có thể tham gia:
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {volunteer.availability}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {volunteer?.skillsList && volunteer.skillsList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Kỹ năng & Chuyên môn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {volunteer.skillsList.map((skill) => (
                    <div key={skill.skillId} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{skill.skillName}</h4>
                        <Badge variant="outline">
                          {skill.proficiencyLevel}
                        </Badge>
                      </div>
                      {skill.category && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Lĩnh vực: {skill.category}
                        </p>
                      )}
                      {skill.yearsOfExperience > 0 && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Kinh nghiệm: {skill.yearsOfExperience} năm
                        </p>
                      )}
                      {skill.description && (
                        <p className="text-sm text-muted-foreground">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience - Remove since it's already shown in Bio section */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Liên hệ</span>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Liên hệ qua hệ thống</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Thống kê hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Tổng giờ tình nguyện
                </span>
                <span className="text-sm font-medium">
                  {volunteer?.totalHoursVolunteered || 0} giờ
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Trạng thái
                </span>
                <div className="flex items-center gap-1">
                  {volunteer?.isVerified ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-sm text-green-600">
                        Đã xác minh
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Chưa xác minh
                    </span>
                  )}
                </div>
              </div>

              {volunteer?.gender && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Giới tính
                    </span>
                    <span className="text-sm font-medium">
                      {volunteer.gender}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicDetailPageLayout>
  );
};

export default PublicVolunteerDetailPage;
