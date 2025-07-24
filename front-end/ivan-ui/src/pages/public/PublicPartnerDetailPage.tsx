import { useParams, Link } from "react-router-dom";
import { usePublicPartnerDetail } from "@/hooks/usePublicPartnerDetail";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Globe, 
  Star, 
  Shield,
  ExternalLink,
  Heart
} from "lucide-react";

export default function PublicPartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { partner, loading, error, refetch } = usePublicPartnerDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Đang tải thông tin đối tác..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <ErrorBoundary error={error} onRetry={refetch} variant="page" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <ErrorBoundary error="Không tìm thấy đối tác" variant="page" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 py-12">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/partners">Đối tác</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{partner.companyName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Logo and Basic Info */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-xl">
                {partner.logoUrl ? (
                  <img 
                    src={partner.logoUrl} 
                    alt={partner.companyName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  partner.companyName.slice(0, 2).toUpperCase()
                )}
              </div>
              
              {partner.isVerified && (
                <Badge className="mt-4 bg-green-500 text-white">
                  <Shield className="w-4 h-4 mr-1" />
                  Đã xác minh
                </Badge>
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    {partner.companyName}
                  </h1>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge variant="outline" className="text-sm">
                      {partner.industryName}
                    </Badge>
                    

                  </div>

                  {/* Rating */}
                  {partner.rating > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-lg font-semibold">{partner.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-slate-600">
                        ({partner.ratingCount} đánh giá)
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <MapPin className="h-5 w-5 text-red-500" />
                    <span>{partner.province}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {partner.website && (
                    <Button asChild variant="outline">
                      <a href={partner.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{partner.totalCollaborations}</div>
                  <div className="text-sm text-slate-600">Hợp tác</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{partner.rating.toFixed(1)}</div>
                  <div className="text-sm text-slate-600">Đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{partner.ratingCount}</div>
                  <div className="text-sm text-slate-600">Lượt đánh giá</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">Giới thiệu</TabsTrigger>
            <TabsTrigger value="contact">Liên hệ</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Về chúng tôi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed text-lg">
                  {partner.description || "Chưa có mô tả"}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {partner.address && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Địa chỉ</h4>
                    <p className="text-slate-700">
                      {partner.address}
                      {partner.wardCommune && `, ${partner.wardCommune}`}
                      {partner.district && `, ${partner.district}`}
                      {partner.province && `, ${partner.province}`}
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-1 gap-6">
                  {partner.website && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Website</h4>
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        {partner.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back to Partners */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/partners">
              ← Quay lại danh sách đối tác
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}