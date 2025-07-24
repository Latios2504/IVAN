import { useParams, Link } from "react-router-dom";
import { usePublicOrganizationDetail } from "@/hooks/usePublicOrganizationDetail";
import { LoadingWithRetry } from "@/components/ui/skeletons";
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
  Mail
} from "lucide-react";

export default function PublicOrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { organization, loading, error, refetch } = usePublicOrganizationDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <LoadingWithRetry text="Đang tải thông tin tổ chức..." />
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

  if (!organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <ErrorBoundary error="Không tìm thấy tổ chức" variant="page" />
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
                  <Link to="/organizations">Tổ chức</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{organization.organizationName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-xl">
                {organization.logoUrl ? (
                  <img 
                    src={organization.logoUrl} 
                    alt={organization.organizationName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  organization.organizationName.slice(0, 2).toUpperCase()
                )}
              </div>
              
              {organization.isVerified && (
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
                    {organization.organizationName}
                  </h1>
                  
                  {organization.shortName && (
                    <p className="text-xl text-slate-600 mb-4">
                      ({organization.shortName})
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge variant="outline" className="text-sm">
                      {organization.typeName}
                    </Badge>
                    
                    {organization.establishedYear && (
                      <Badge variant="outline" className="text-sm">
                        Thành lập {organization.establishedYear}
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  {organization.rating > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-lg font-semibold">{organization.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-slate-600">
                        ({organization.ratingCount} đánh giá)
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <MapPin className="h-5 w-5 text-red-500" />
                    <span>{organization.province}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {organization.website && (
                    <Button asChild variant="outline">
                      <a href={organization.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                  
                  {organization.facebookPage && (
                    <Button asChild variant="outline">
                      <a href={organization.facebookPage} target="_blank" rel="noopener noreferrer">
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                  
                  {organization.linkedInPage && (
                    <Button asChild variant="outline">
                      <a href={organization.linkedInPage} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{organization.totalEvents}</div>
                  <div className="text-sm text-slate-600">Sự kiện</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{organization.totalVolunteers}</div>
                  <div className="text-sm text-slate-600">Tình nguyện viên</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{organization.rating.toFixed(1)}</div>
                  <div className="text-sm text-slate-600">Đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {organization.establishedYear ? new Date().getFullYear() - organization.establishedYear : 0}
                  </div>
                  <div className="text-sm text-slate-600">Năm hoạt động</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">Giới thiệu</TabsTrigger>
            <TabsTrigger value="mission">Sứ mệnh & Tầm nhìn</TabsTrigger>
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
                  {organization.description || "Chưa có mô tả"}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mission" className="mt-8">
            <div className="grid md:grid-cols-2 gap-6">
              {organization.mission && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      Sứ mệnh
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed">
                      {organization.mission}
                    </p>
                  </CardContent>
                </Card>
              )}

              {organization.vision && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-green-500" />
                      Tầm nhìn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed">
                      {organization.vision}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
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
                {organization.address && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Địa chỉ</h4>
                    <p className="text-slate-700">
                      {organization.address}
                      {organization.wardCommune && `, ${organization.wardCommune}`}
                      {organization.district && `, ${organization.district}`}
                      {organization.province && `, ${organization.province}`}
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {organization.website && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Website</h4>
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        {organization.website}
                      </a>
                    </div>
                  )}

                  {organization.facebookPage && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Facebook</h4>
                      <a
                        href={organization.facebookPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-2"
                      >
                        <Facebook className="h-4 w-4" />
                        Facebook Page
                      </a>
                    </div>
                  )}
                </div>

                {organization.linkedInPage && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">LinkedIn</h4>
                    <a
                      href={organization.linkedInPage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn Page
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back to Organizations */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/organizations">
              ← Quay lại danh sách tổ chức
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}