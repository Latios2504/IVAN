import { useParams, Link } from "react-router-dom";
import { publicContentService } from "@/services/publicContentService";
import { useEffect, useState } from "react";
import { PublicDetailPageLayout } from "@/components/public/PublicDetailPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicPartner } from "@/types/publicContent";
import {
  MapPin,
  Globe,
  Star,
  Shield,
  ExternalLink,
  Heart,
  Building2,
  Mail,
  Target,
} from "lucide-react";

export default function PublicPartnerDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [partner, setPartner] = useState<PublicPartner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const loadPartner = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await publicContentService.getPublicPartner(
            Number(id)
          );
          setPartner(result);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load partner"
          );
        } finally {
          setLoading(false);
        }
      };

      loadPartner();
    }
  }, [id]);

  const handleRetry = () => {
    if (id) {
      const loadPartner = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await publicContentService.getPublicPartner(
            Number(id)
          );
          setPartner(result);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load partner"
          );
        } finally {
          setLoading(false);
        }
      };

      loadPartner();
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Đối tác", href: "/partners" },
    { label: partner?.companyName || "Loading...", isActive: true },
  ];

  return (
    <PublicDetailPageLayout
      loading={loading}
      error={error}
      data={partner}
      title={partner?.companyName || "Partner"}
      description={partner?.description}
      breadcrumbs={breadcrumbs}
      loadingText="Đang tải thông tin đối tác..."
      notFoundMessage="Không tìm thấy đối tác"
      onRetry={handleRetry}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-6">
                <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {partner?.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.companyName}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    partner?.companyName.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">
                      {partner?.companyName}
                    </h1>
                    {partner?.isVerified && (
                      <Badge className="bg-green-500 text-white">
                        <Shield className="w-4 h-4 mr-1" />
                        Đã xác minh
                      </Badge>
                    )}
                  </div>

                  {partner?.industryName && (
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Building2 className="h-4 w-4" />
                      <span>{partner.industryName}</span>
                    </div>
                  )}

                  {partner?.address && (
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {[
                          partner.address,
                          partner.wardCommune,
                          partner.district,
                          partner.province,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {partner?.rating && partner.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {partner.rating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({partner?.ratingCount || 0} đánh giá)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Description */}
          {partner?.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Về đối tác
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {partner.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Industry Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Thông tin ngành nghề
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {partner?.industryName}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {partner?.address && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Địa chỉ</span>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">
                      {[
                        partner.address,
                        partner.wardCommune,
                        partner.district,
                        partner.province,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                </div>
              )}

              {partner?.website && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Website</span>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {partner.website}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Partnership Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hợp tác</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {partner?.website && (
                <Button asChild variant="outline" className="w-full">
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Truy cập Website
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </a>
                </Button>
              )}

              <Button className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Liên hệ hợp tác
              </Button>
            </CardContent>
          </Card>

          {/* Partner Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Hợp tác</span>
                <span className="text-lg font-semibold text-green-600">
                  {partner?.totalCollaborations || 0}
                </span>
              </div>

              {partner?.rating && partner.rating > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Đánh giá
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">
                      {partner.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Trạng thái
                </span>
                <Badge variant={partner?.isActive ? "default" : "secondary"}>
                  {partner?.isActive ? "Hoạt động" : "Tạm dừng"}
                </Badge>
              </div>

              {partner?.createdAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Ngày tham gia
                  </span>
                  <span className="text-sm">
                    {new Date(partner.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Industry */}
          <Card>
            <CardHeader>
              <CardTitle>Ngành nghề</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-sm">
                {partner?.industryName}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicDetailPageLayout>
  );
}
