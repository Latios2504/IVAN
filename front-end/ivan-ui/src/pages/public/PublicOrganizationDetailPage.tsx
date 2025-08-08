import { useParams, Link } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { publicContentService } from "@/services/publicContentService";
import { useEffect, useState } from "react";
import { PublicDetailPageLayout } from "@/components/public/PublicDetailPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PublicOrganization } from "@/types/publicContent";
import {
  MapPin,
  Globe,
  Facebook,
  Linkedin,
  Star,
  Shield,
  Calendar,
  Users,
  ExternalLink,
  Heart,
  Target,
  Eye,
  Phone,
  Mail,
} from "lucide-react";

export default function PublicOrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Service adapter for public organizations
  const publicOrganizationsService = {
    getById: async (orgId: string | number): Promise<PublicOrganization> => {
      return await publicContentService.getPublicOrganization(Number(orgId));
    },
  };

  // Use the new useApi hook
  const organizationsApi = useApi(publicOrganizationsService, {
    autoLoad: true,
  });

  // Extract organization data
  const [organization, setOrganization] = useState<PublicOrganization | null>(
    null
  );
  const loading = organizationsApi.loading;
  const error = organizationsApi.error;

  useEffect(() => {
    if (id) {
      organizationsApi.loadById(id).then(setOrganization);
    }
  }, [id]);

  const handleRetry = () => {
    if (id) {
      organizationsApi.loadById(id).then(setOrganization);
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Tổ chức", href: "/organizations" },
    { label: organization?.organizationName || "Loading...", isActive: true },
  ];

  return (
    <PublicDetailPageLayout
      loading={loading}
      error={error}
      data={organization}
      title={organization?.organizationName || "Organization"}
      description={organization?.description}
      breadcrumbs={breadcrumbs}
      loadingText="Đang tải thông tin tổ chức..."
      notFoundMessage="Không tìm thấy tổ chức"
      onRetry={handleRetry}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-6">
                <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {organization?.logoUrl ? (
                    <img
                      src={organization.logoUrl}
                      alt={organization.organizationName}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    organization?.organizationName.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">
                      {organization?.organizationName}
                    </h1>
                    {organization?.isVerified && (
                      <Badge className="bg-green-500 text-white">
                        <Shield className="w-4 h-4 mr-1" />
                        Đã xác minh
                      </Badge>
                    )}
                  </div>

                  {organization?.shortName && (
                    <p className="text-lg text-muted-foreground mb-2">
                      ({organization.shortName})
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{organization?.typeName}</Badge>
                    {organization?.establishedYear && (
                      <Badge variant="outline">
                        <Calendar className="w-3 h-3 mr-1" />
                        Thành lập {organization.establishedYear}
                      </Badge>
                    )}
                  </div>

                  {organization?.rating && organization.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {organization.rating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({organization.ratingCount} đánh giá)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Description */}
          {organization?.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Về chúng tôi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {organization.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Mission and Vision */}
          <Tabs defaultValue="mission" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mission">Sứ mệnh</TabsTrigger>
              <TabsTrigger value="vision">Tầm nhìn</TabsTrigger>
            </TabsList>
            {organization?.mission && (
              <TabsContent value="mission">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Sứ mệnh
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {organization.mission}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            {organization?.vision && (
              <TabsContent value="vision">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Tầm nhìn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {organization.vision}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {organization?.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {[
                      organization.address,
                      organization.wardCommune,
                      organization.district,
                      organization.province,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}

              {organization?.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Media */}
          {(organization?.facebookPage || organization?.linkedInPage) && (
            <Card>
              <CardHeader>
                <CardTitle>Mạng xã hội</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {organization.facebookPage && (
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href={organization.facebookPage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                  </Button>
                )}

                {organization.linkedInPage && (
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href={organization.linkedInPage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sự kiện</span>
                <span className="text-lg font-semibold text-blue-600">
                  {organization?.totalEvents || 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Tình nguyện viên
                </span>
                <span className="text-lg font-semibold text-green-600">
                  {organization?.totalVolunteers || 0}
                </span>
              </div>

              {organization?.rating && organization.rating > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Đánh giá
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">
                      {organization.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}

              {organization?.establishedYear && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Năm hoạt động
                  </span>
                  <span className="text-lg font-semibold text-orange-600">
                    {new Date().getFullYear() - organization.establishedYear}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicDetailPageLayout>
  );
}
