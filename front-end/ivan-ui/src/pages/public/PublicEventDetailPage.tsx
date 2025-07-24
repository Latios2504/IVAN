import { useParams, Link } from "react-router-dom";
import { usePublicEventDetail } from "@/hooks/usePublicEventDetail";
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
  Calendar,
  Clock,
  Users,
  User,
  Building2,
  Heart,
  Info,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";

export default function PublicEventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { event, loading, error, refetch } = usePublicEventDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Đang tải thông tin sự kiện..." />
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

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <ErrorBoundary error="Không tìm thấy sự kiện" variant="page" />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
      case 'mở':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'full':
      case 'đầy':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'closed':
      case 'đóng':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
      case 'mở':
        return 'bg-green-500';
      case 'full':
      case 'đầy':
        return 'bg-yellow-500';
      case 'closed':
      case 'đóng':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 py-12">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/events">Sự kiện</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{event.eventName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Event Image */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="h-64 w-full lg:w-80 rounded-lg overflow-hidden shadow-xl">
                {event.bannerImageUrl ? (
                  <img 
                    src={event.bannerImageUrl} 
                    alt={event.eventName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-2xl font-bold">
                    {event.eventName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    {event.eventName}
                  </h1>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mb-6">
                    <Badge className={`${getStatusColor(event.statusName)} text-white`}>
                      {getStatusIcon(event.statusName)}
                      {event.statusName}
                    </Badge>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">
                          {new Date(event.startDate).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        {event.endDate && (
                          <div className="text-sm text-slate-600">
                            đến {new Date(event.endDate).toLocaleDateString('vi-VN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-700">
                      <Clock className="h-5 w-5 text-green-500" />
                      <span>
                        {new Date(event.startDate).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {event.endDate && (
                          <> - {new Date(event.endDate).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-700">
                      <MapPin className="h-5 w-5 text-red-500" />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-700">
                      <Building2 className="h-5 w-5 text-purple-500" />
                      <Link 
                        to={`/organizations/${event.organizationId}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {event.organizationName}
                      </Link>
                    </div>

                    <div className="flex items-center gap-3 text-slate-700">
                      <Users className="h-5 w-5 text-orange-500" />
                      <span>
                        {event.currentVolunteers}/{event.maxVolunteers || 'Không giới hạn'} tình nguyện viên
                      </span>
                    </div>
                  </div>
                </div>

                {/* Registration Section */}
                <div className="bg-white rounded-lg p-6 shadow-lg border">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Tham gia sự kiện</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Đã đăng ký:</span>
                      <span className="font-semibold">{event.currentVolunteers}/{event.maxVolunteers || 'Không giới hạn'}</span>
                    </div>
                    
                    {event.maxVolunteers && (
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((event.currentVolunteers / event.maxVolunteers) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    )}

                    <div className="text-center">
                      {event.statusName.toLowerCase() === 'open' || event.statusName.toLowerCase() === 'mở' ? (
                        <Button size="lg" className="w-full">
                          <User className="w-4 h-4 mr-2" />
                          Đăng ký tham gia
                        </Button>
                      ) : event.statusName.toLowerCase() === 'full' || event.statusName.toLowerCase() === 'đầy' ? (
                        <Button size="lg" className="w-full" disabled>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Đã đầy
                        </Button>
                      ) : (
                        <Button size="lg" className="w-full" disabled>
                          <XCircle className="w-4 h-4 mr-2" />
                          Đã đóng đăng ký
                        </Button>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 text-center">
                      Bạn cần đăng nhập để đăng ký tham gia sự kiện
                    </p>
                  </div>
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
            <TabsTrigger value="about">Thông tin chi tiết</TabsTrigger>
            <TabsTrigger value="organization">Về tổ chức</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Mô tả sự kiện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {event.description || "Chưa có mô tả chi tiết"}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organization" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-500" />
                  Tổ chức thực hiện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {event.organizationName}
                    </h3>
                    <p className="text-slate-600">
                      Tìm hiểu thêm về tổ chức thực hiện sự kiện này
                    </p>
                  </div>
                  <Button asChild>
                    <Link to={`/organizations/${event.organizationId}`}>
                      Xem chi tiết tổ chức
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back to Events */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/events">
              ← Quay lại danh sách sự kiện
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}