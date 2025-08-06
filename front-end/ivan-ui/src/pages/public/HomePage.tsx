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
import { Heart, Users, Calendar, Award, LayoutDashboard } from "lucide-react";
import { useSystemStats } from "@/hooks/useDashboardStats";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { stats, loading, error } = useSystemStats();
  const { isAuthenticated, user } = useAuth();

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

  // Stats configuration with real data
  const statsConfig = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      label: "Tình nguyện viên",
      count: loading ? "..." : `${stats?.totalVolunteers || 0}+`,
      description: "Đã tham gia",
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      label: "Sự kiện",
      count: loading ? "..." : `${stats?.totalEvents || 0}+`,
      description: "Đã tổ chức",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      label: "Giờ tình nguyện",
      count: loading ? "..." : `${stats?.totalHours?.toLocaleString() || 0}+`,
      description: "Đã đóng góp",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      label: "Tổ chức",
      count: loading ? "..." : `${stats?.totalOrganizations || 0}+`,
      description: "Đối tác",
    },
  ];

  const features = [
    {
      title: "Quản lý sự kiện",
      description: "Tạo và quản lý các hoạt động tình nguyện một cách dễ dàng",
      color: "bg-muted/50 border-border",
    },
    {
      title: "Kết nối tình nguyện viên",
      description: "Tìm kiếm và kết nối với những người có cùng sở thích",
      color: "bg-muted/50 border-border",
    },
    {
      title: "Theo dõi hoạt động",
      description: "Ghi nhận và theo dõi các hoạt động tình nguyện của bạn",
      color: "bg-muted/50 border-border",
    },
    {
      title: "Cộng đồng",
      description: "Tham gia cộng đồng tình nguyện viên tích cực",
      color: "bg-muted/50 border-border",
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
                Nền tảng quản lý<span className="text-primary"> tình nguyện viên </span>hàng đầu
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

      {/* Stats Section */}
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
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <CardTitle className="text-2xl font-bold">
                  {stat.count}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-foreground">{stat.label}</p>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

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
              className={`${feature.color} border-2 hover:shadow-lg transition-shadow`}
            >
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isAuthenticated
                ? "Tiếp tục tạo tác động tích cực"
                : "Bắt đầu hành trình tình nguyện của bạn"}
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              {isAuthenticated
                ? "Khám phá thêm cơ hội tình nguyện và kết nối với cộng đồng rộng lớn hơn"
                : "Tham gia cộng đồng hàng nghìn tình nguyện viên đang tạo ra những thay đổi tích cực cho xã hội"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link to="/events">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto bg-background text-foreground hover:bg-background/90"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Tham gia sự kiện
                    </Button>
                  </Link>
                  <Link to="/volunteers">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                    >
                      <Users className="w-4 h-4 mr-2" />
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
                      className="w-full sm:w-auto bg-background text-foreground hover:bg-background/90"
                    >
                      Khám phá tình nguyện viên
                    </Button>
                  </Link>
                  <Link to="/organizations">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                    >
                      Xem các tổ chức
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
