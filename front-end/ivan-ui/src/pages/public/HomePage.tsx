import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Users, Calendar, Award, LayoutDashboard, Star, MapPin, Building2, Handshake, Sparkles, TrendingUp, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { analyticsService } from "@/services/analyticsService";
import { eventsService } from "@/services/eventsService";
import { volunteerProfileService } from "@/services/volunteerProfileService";
import { organizationProfileService } from "@/services/organizationProfileService";
import { partnerProfileService } from "@/services/partnerProfileService";
import { TimePeriod } from "@/types/analytics";
import type {
  AdminDashboardDto,
  OrganizationDashboardDto,
  VolunteerDashboardDto,
  PartnerDashboardDto,
  CoordinatorDashboardDto,
} from "@/types/analytics";
import type { EventDto } from "@/types/events";
import type { PublicVolunteerDto } from "@/types/volunteerProfile";
import type { PublicOrganizationDto } from "@/types/organizationProfile";
import type { PublicPartnerDto } from "@/types/partnerProfile";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  // State for analytics data
  const [stats, setStats] = useState<any>(null);
  const [featuredEvents, setFeaturedEvents] = useState<EventDto[]>([]);
  const [featuredVolunteers, setFeaturedVolunteers] = useState<PublicVolunteerDto[]>([]);
  const [featuredOrganizations, setFeaturedOrganizations] = useState<PublicOrganizationDto[]>([]);
  const [featuredPartners, setFeaturedPartners] = useState<PublicPartnerDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch role-based analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!isAuthenticated || !user) {
        // For non-authenticated users, don't show any stats
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let dashboardData;

        switch (user.role) {
          case "admin":
            dashboardData = await analyticsService.getAdminDashboard(
              TimePeriod.Last30Days
            );
            setStats({
              totalVolunteers: dashboardData.totalVolunteers || 0,
              totalOrganizations: dashboardData.totalOrganizations || 0,
              totalEvents: dashboardData.totalEvents || 0,
              totalHours: dashboardData.totalRegistrations
                ? dashboardData.totalRegistrations * 4
                : 0,
            });
            break;

          case "organization":
            if (user.organizationId) {
              dashboardData = await analyticsService.getOrganizationDashboard(
                TimePeriod.Last30Days
              );
              setStats({
                totalVolunteers: dashboardData.totalVolunteersReached || 0,
                totalOrganizations: 1, // Current organization
                totalEvents: dashboardData.myTotalEvents || 0,
                totalHours: dashboardData.totalVolunteerHours || 0,
              });
            }
            break;

          case "volunteer":
            if (user.volunteerId) {
              dashboardData = await analyticsService.getVolunteerDashboard(
                TimePeriod.Last30Days
              );
              setStats({
                totalVolunteers: 1, // Current volunteer
                totalOrganizations: 0, // Not available in volunteer dashboard
                totalEvents: dashboardData.eventsParticipated || 0,
                totalHours: dashboardData.totalVolunteerHours || 0,
              });
            }
            break;

          case "partner":
            if (user.partnerId) {
              dashboardData = await analyticsService.getPartnerDashboard(
                TimePeriod.Last30Days
              );
              setStats({
                totalVolunteers: 0, // Not available in partner dashboard
                totalOrganizations: 0, // Not available in partner dashboard
                totalEvents: dashboardData.sponsoredEvents || 0,
                totalHours: 0, // Not available in partner dashboard
              });
            }
            break;

          case "coordinator":
            if (user.coordinatorId) {
              dashboardData = await analyticsService.getCoordinatorDashboard(
                TimePeriod.Last30Days
              );
              setStats({
                totalVolunteers: dashboardData.volunteersManaged || 0,
                totalOrganizations: 1, // Current organization
                totalEvents: dashboardData.eventsManaged || 0,
                totalHours: 0, // Not available in coordinator dashboard
              });
            }
            break;

          default:
            // Fallback to public stats
            const adminData = await analyticsService.getAdminDashboard(
              TimePeriod.Last30Days
            );
            setStats({
              totalVolunteers: adminData.totalUsers || 0,
              totalOrganizations: adminData.totalOrganizations || 0,
              totalEvents: adminData.totalEvents || 0,
              totalHours: adminData.totalRegistrations
                ? adminData.totalRegistrations * 4
                : 0,
            });
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Không thể tải thông tin thống kê");
        // Fallback to mock data
        setStats({
          totalVolunteers: 1250,
          totalOrganizations: 89,
          totalEvents: 342,
          totalHours: 15640,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAuthenticated, user]);

  // Fetch featured events
  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const events = await eventsService.getEvents({
          page: 1,
          size: 3,
          sortBy: "createdAt",
          sortDirection: "desc",
        });
        setFeaturedEvents(events.items || []);
      } catch (err) {
        console.error("Error fetching featured events:", err);
      }
    };

    fetchFeaturedEvents();
  }, []);

  // Fetch featured volunteers
  useEffect(() => {
    const fetchFeaturedVolunteers = async () => {
      try {
        const volunteers = await volunteerProfileService.getPublicVolunteers({
          page: 1,
          size: 3,
          isVerified: true,
        });
        setFeaturedVolunteers(volunteers.items || []);
      } catch (err) {
        console.error("Error fetching featured volunteers:", err);
      }
    };

    fetchFeaturedVolunteers();
  }, []);

  // Fetch featured organizations
  useEffect(() => {
    const fetchFeaturedOrganizations = async () => {
      try {
        const organizations = await organizationProfileService.getPublicOrganizations({
          page: 1,
          size: 3,
          isVerified: true,
        });
        setFeaturedOrganizations(organizations.items || []);
      } catch (err) {
        console.error("Error fetching featured organizations:", err);
      }
    };

    fetchFeaturedOrganizations();
  }, []);

  // Fetch featured partners
  useEffect(() => {
    const fetchFeaturedPartners = async () => {
      try {
        const partners = await partnerProfileService.getPublicPartners({
          page: 1,
          size: 3,
          isVerified: true,
        });
        setFeaturedPartners(partners.items || []);
      } catch (err) {
        console.error("Error fetching featured partners:", err);
      }
    };

    fetchFeaturedPartners();
  }, []);

  // Get role-specific dashboard URL
  const getDashboardUrl = () => {
    if (!user) return "/";

    switch (user.role) {
      case "admin":
        return "/admin";
      case "organization":
        return "/organization";
      case "volunteer":
        return "/volunteer";
      case "partner":
        return "/partner";
      case "coordinator":
        return "/coordinator";
      default:
        return "/";
    }
  };

  // Helper function to get Vietnamese status name
  const getVietnameseStatusName = (statusId: number, statusName: string) => {
    // Map status IDs to Vietnamese names based on database data
    const statusMap: { [key: number]: string } = {
      1: "Chờ xác nhận",
      2: "Đã lên lịch", 
      3: "Đang diễn ra",
      4: "Đã hoàn thành",
      5: "Đã hủy"
    };
    
    return statusMap[statusId] || statusName;
  };

  // Get role-specific stats labels with colorful icons
  const getStatsConfig = () => {
    const baseConfig = [
      {
        icon: <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"><Users className="h-6 w-6 text-white" /></div>,
        label: user?.role === "volunteer" ? "Bạn" : "Tình nguyện viên",
        count: loading
          ? "..."
          : `${stats?.totalVolunteers || 0}${
              user?.role === "volunteer" ? "" : "+"
            }`,
        description:
          user?.role === "volunteer" ? "Tình nguyện viên" : "Đã tham gia",
        gradient: "from-blue-500/10 to-purple-600/10",
      },
      {
        icon: <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600"><Calendar className="h-6 w-6 text-white" /></div>,
        label: "Sự kiện",
        count: loading ? "..." : `${stats?.totalEvents || 0}+`,
        description:
          user?.role === "volunteer"
            ? "Đã tham gia"
            : user?.role === "organization" || user?.role === "coordinator"
            ? "Đã tổ chức"
            : "Đã diễn ra",
        gradient: "from-green-500/10 to-emerald-600/10",
      },
      {
        icon: <div className="p-3 rounded-full bg-gradient-to-br from-red-500 to-pink-600"><Heart className="h-6 w-6 text-white" /></div>,
        label: "Giờ tình nguyện",
        count: loading ? "..." : `${stats?.totalHours?.toLocaleString() || 0}+`,
        description: user?.role === "volunteer" ? "Đã đóng góp" : "Tổng cộng",
        gradient: "from-red-500/10 to-pink-600/10",
      },
      {
        icon: <div className="p-3 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600"><Award className="h-6 w-6 text-white" /></div>,
        label:
          user?.role === "volunteer"
            ? "Tổ chức"
            : user?.role === "organization" || user?.role === "coordinator"
            ? "Tổ chức"
            : "Tổ chức",
        count: loading
          ? "..."
          : `${stats?.totalOrganizations || 0}${
              user?.role === "organization" || user?.role === "coordinator"
                ? ""
                : "+"
            }`,
        description:
          user?.role === "volunteer"
            ? "Đã làm việc"
            : user?.role === "organization" || user?.role === "coordinator"
            ? "Của bạn"
            : "Đối tác",
        gradient: "from-orange-500/10 to-yellow-600/10",
      },
    ];

    return baseConfig;
  };

  const statsConfig = getStatsConfig();

  const features = [
    {
      title: "Quản lý sự kiện",
      description: "Tạo và quản lý các hoạt động tình nguyện một cách dễ dàng",
      icon: <Calendar className="h-8 w-8 text-white" />,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Kết nối tình nguyện viên",
      description: "Tìm kiếm và kết nối với những người có cùng sở thích",
      icon: <Users className="h-8 w-8 text-white" />,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Theo dõi hoạt động",
      description: "Ghi nhận và theo dõi các hoạt động tình nguyện của bạn",
      icon: <TrendingUp className="h-8 w-8 text-white" />,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
    },
    {
      title: "Cộng đồng",
      description: "Tham gia cộng đồng tình nguyện viên tích cực",
      icon: <Heart className="h-8 w-8 text-white" />,
      gradient: "from-red-500 to-orange-500",
      bgGradient: "from-red-500/10 to-orange-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
            🎉 Chào mừng đến với IVAN
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 whitespace-nowrap">
            {isAuthenticated ? (
              <>
                Chào mừng trở lại,
                <span className="text-primary">
                  {" "}
                  {user?.fullName || user?.email}{" "}
                </span>
              </>
            ) : (
              <>
                Nền tảng quản lý
                <span className="text-primary"> tình nguyện viên </span>hàng đầu
              </>
            )}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {isAuthenticated ? (
              <>
                Tiếp tục hành trình tình nguyện của bạn
                <br />
                và tạo ra những tác động tích cực cho cộng đồng.
              </>
            ) : (
              "Kết nối tình nguyện viên, tổ chức và cộng đồng để tạo ra những tác động tích cực. Tham gia ngay để bắt đầu hành trình tình nguyện của bạn."
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardUrl()}>
                  <Button size="lg" className="w-full sm:w-auto">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Đi tới Dashboard
                  </Button>
                </Link>
                <Link to="/events">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Xem sự kiện
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Đăng ký ngay
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Đăng nhập
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section - Only show for authenticated users */}
      {isAuthenticated && user && (
        <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
              Không thể tải thông tin thống kê. Hiển thị dữ liệu mẫu.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsConfig.map((stat, index) => (
              <Card
                key={index}
                className={`text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br ${stat.gradient} border-0 shadow-lg`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-3">{stat.icon}</div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {stat.count}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-foreground text-lg">{stat.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tại sao chọn IVAN?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chúng tôi cung cấp những công cụ tốt nhất để quản lý và tham gia
            hoạt động tình nguyện
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${feature.bgGradient} border-0 hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg`}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sự kiện nổi bật
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Khám phá những hoạt động tình nguyện mới nhất và tham gia ngay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <Card
                key={event.eventId}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">
                      {new Date(event.startDate).toLocaleDateString("vi-VN")}
                    </Badge>
                    <Badge
                      variant={event.statusId === 2 ? "default" : "secondary"}
                    >
                      {getVietnameseStatusName(event.statusId, event.statusName)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {event.eventName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-4 line-clamp-3">
                    {event.description ||
                      "Tham gia hoạt động tình nguyện ý nghĩa này cùng chúng tôi."}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      <span>
                        {event.maxVolunteers || "Không giới hạn"} người
                      </span>
                    </div>
                    <Link to={`/events/${event.eventId}`}>
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/events">
              <Button variant="outline" size="lg">
                <Calendar className="w-4 h-4 mr-2" />
                Xem tất cả sự kiện
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Featured Volunteers Section */}
      {featuredVolunteers.length > 0 && (
        <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                <Users className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Sparkles className="w-4 h-4 mr-1" />
                Tình nguyện viên nổi bật
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tình nguyện viên xuất sắc
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gặp gỡ những tình nguyện viên tận tâm và có kinh nghiệm trong cộng đồng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVolunteers.map((volunteer) => (
              <Card
                key={volunteer.volunteerId}
                className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg"
              >
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-blue-500/20">
                    <AvatarImage src={volunteer.avatar} alt={volunteer.fullName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                      {volunteer.firstName.charAt(0)}{volunteer.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CardTitle className="text-lg">{volunteer.fullName}</CardTitle>
                    {volunteer.isVerified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Star className="w-3 h-3 mr-1" />
                        Xác thực
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-4 text-sm text-muted-foreground">
                    {volunteer.province && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{volunteer.province}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{volunteer.totalHoursVolunteered}h</span>
                    </div>
                  </div>
                  {volunteer.motivation && (
                    <CardDescription className="text-muted-foreground mb-4 line-clamp-2">
                      {volunteer.motivation}
                    </CardDescription>
                  )}
                  <Link to={`/volunteers/${volunteer.volunteerId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Xem hồ sơ
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/volunteers">
              <Button variant="outline" size="lg">
                <Users className="w-4 h-4 mr-2" />
                Xem tất cả tình nguyện viên
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Featured Organizations Section */}
      {featuredOrganizations.length > 0 && (
        <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Sparkles className="w-4 h-4 mr-1" />
                Tổ chức uy tín
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tổ chức đối tác
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Khám phá các tổ chức uy tín đang tạo ra tác động tích cực trong cộng đồng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOrganizations.map((organization) => (
              <Card
                key={organization.organizationId}
                className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-green-50/30 border-0 shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    {organization.logoUrl ? (
                      <Avatar className="w-12 h-12 ring-2 ring-green-500/20">
                        <AvatarImage src={organization.logoUrl} alt={organization.organizationName} />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold">
                          {organization.organizationName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg line-clamp-1">{organization.organizationName}</CardTitle>
                        {organization.isVerified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Star className="w-3 h-3 mr-1" />
                            Xác thực
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{organization.typeName}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{organization.province || 'Việt Nam'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{organization.totalVolunteers} TNV</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{organization.totalEvents} sự kiện</span>
                    </div>
                  </div>
                  {organization.description && (
                    <CardDescription className="text-muted-foreground mb-4 line-clamp-2">
                      {organization.description}
                    </CardDescription>
                  )}
                  <Link to={`/organizations/${organization.organizationId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Xem chi tiết
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/organizations">
              <Button variant="outline" size="lg">
                <Building2 className="w-4 h-4 mr-2" />
                Xem tất cả tổ chức
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Featured Partners Section */}
      {featuredPartners.length > 0 && (
        <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50/50 to-yellow-50/50">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600">
                <Handshake className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Sparkles className="w-4 h-4 mr-1" />
                Đối tác tin cậy
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Đối tác doanh nghiệp
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Những doanh nghiệp cam kết hỗ trợ và phát triển hoạt động tình nguyện
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPartners.map((partner) => (
              <Card
                key={partner.partnerId}
                className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-orange-50/30 border-0 shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    {partner.logoUrl ? (
                      <Avatar className="w-12 h-12 ring-2 ring-orange-500/20">
                        <AvatarImage src={partner.logoUrl} alt={partner.companyName} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white font-bold">
                          {partner.companyName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center">
                        <Handshake className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg line-clamp-1">{partner.companyName}</CardTitle>
                        {partner.isVerified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Star className="w-3 h-3 mr-1" />
                            Xác thực
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{partner.industryName}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{partner.province || 'Việt Nam'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Handshake className="w-4 h-4" />
                      <span>{partner.totalCollaborations} hợp tác</span>
                    </div>
                    {partner.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                      </div>
                    )}
                  </div>
                  {partner.description && (
                    <CardDescription className="text-muted-foreground mb-4 line-clamp-2">
                      {partner.description}
                    </CardDescription>
                  )}
                  <Link to={`/partners/${partner.partnerId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Xem chi tiết
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/partners">
              <Button variant="outline" size="lg">
                <Handshake className="w-4 h-4 mr-2" />
                Xem tất cả đối tác
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative overflow-hidden text-center bg-gradient-to-br from-primary via-primary/90 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                Tham gia ngay
              </Badge>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {isAuthenticated
                ? "Tiếp tục tạo tác động tích cực"
                : "Bắt đầu hành trình tình nguyện của bạn"}
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
              {isAuthenticated
                ? "Khám phá thêm cơ hội tình nguyện và kết nối với cộng đồng rộng lớn hơn"
                : "Tham gia cộng đồng hàng nghìn tình nguyện viên đang tạo ra những thay đổi tích cực cho xã hội"}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <>
                  <Link to="/events">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto bg-white text-primary font-semibold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Tham gia sự kiện
                    </Button>
                  </Link>
                  <Link to="/volunteers">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Kết nối tình nguyện viên
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/volunteers">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto bg-white text-primary font-semibold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Khám phá tình nguyện viên
                    </Button>
                  </Link>
                  <Link to="/organizations">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                    >
                      <Building2 className="w-5 h-5 mr-2" />
                      Xem các tổ chức
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            <div className="mt-8 flex justify-center items-center gap-8 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm">Tình nguyện viên</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm">Sự kiện</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm">Tổ chức</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
