import { useParams, Link } from "react-router-dom";
import {
  usePublicEventDetail,
  usePublicContent,
} from "@/context/PublicContentContext";
import { useEffect } from "react";
import { PublicDetailPageLayout } from "@/components/layout/PublicDetailPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  User,
  Building2,
  Heart,
  Info,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  Target,
  Eye,
} from "lucide-react";

export default function PublicEventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { event, loading, loadEvent } = usePublicEventDetail();
  const { eventsError } = usePublicContent();

  useEffect(() => {
    if (id) {
      loadEvent(parseInt(id));
    }
  }, [id, loadEvent]);

  const handleRetry = () => {
    if (id) {
      loadEvent(parseInt(id));
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Sự kiện", href: "/events" },
    { label: event?.eventName || "Loading...", isActive: true },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case "active":
      case "đang hoạt động":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đang hoạt động
          </Badge>
        );
      case "pending":
      case "chờ duyệt":
        return (
          <Badge className="bg-yellow-500 text-white">
            <AlertCircle className="w-3 h-3 mr-1" />
            Chờ duyệt
          </Badge>
        );
      case "completed":
      case "đã hoàn thành":
        return (
          <Badge className="bg-blue-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã hoàn thành
          </Badge>
        );
      case "cancelled":
      case "đã hủy":
        return (
          <Badge className="bg-red-500 text-white">
            <XCircle className="w-3 h-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="secondary">{statusName}</Badge>;
    }
  };

  return (
    <PublicDetailPageLayout
      loading={loading}
      error={eventsError}
      data={event}
      title={event?.eventName || "Event"}
      description={event?.description}
      breadcrumbs={breadcrumbs}
      loadingText="Đang tải thông tin sự kiện..."
      notFoundMessage="Không tìm thấy sự kiện"
      onRetry={handleRetry}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">{event?.eventName}</h1>
                  {event?.statusName && getStatusBadge(event.statusName)}
                </div>

                {event?.organizationName && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>Tổ chức bởi: {event.organizationName}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {event?.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Ngày bắt đầu
                        </p>
                        <p className="font-medium">
                          {formatDate(event.startDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {event?.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Ngày kết thúc
                        </p>
                        <p className="font-medium">
                          {formatDate(event.endDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {event?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Địa điểm
                        </p>
                        <p className="font-medium">{event.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Description */}
          {event?.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Mô tả sự kiện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          <Tabs defaultValue="requirements" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="requirements">Yêu cầu</TabsTrigger>
              <TabsTrigger value="benefits">Quyền lợi</TabsTrigger>
            </TabsList>
            {event?.requirements && (
              <TabsContent value="requirements">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Yêu cầu tham gia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {event.requirements}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            {event?.benefits && (
              <TabsContent value="benefits">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Quyền lợi tham gia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {event.benefits}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đăng ký</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event?.maxVolunteers && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Số lượng tối đa
                  </span>
                  <span className="font-medium">
                    {event.maxVolunteers} người
                  </span>
                </div>
              )}

              {event?.currentVolunteers !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Đã đăng ký
                  </span>
                  <span className="font-medium text-blue-600">
                    {event.currentVolunteers} người
                  </span>
                </div>
              )}

              {event?.registrationEndDate && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">
                    Hạn đăng ký
                  </span>
                  <p className="font-medium text-orange-600">
                    {formatDate(event.registrationEndDate)}
                  </p>
                </div>
              )}

              {/* Registration Status */}
              <div className="pt-4 border-t">
                {event?.statusName === "active" ? (
                  <Button className="w-full" size="lg">
                    Đăng ký tham gia
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" disabled>
                    Không thể đăng ký
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event?.rating && event.rating > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Đánh giá
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {event.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}

              {event?.registrationCount !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Tổng đăng ký
                  </span>
                  <span className="font-medium text-green-600">
                    {event.registrationCount}
                  </span>
                </div>
              )}

              {event?.createdAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Ngày tạo
                  </span>
                  <span className="text-sm">{formatDate(event.createdAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicDetailPageLayout>
  );
}
