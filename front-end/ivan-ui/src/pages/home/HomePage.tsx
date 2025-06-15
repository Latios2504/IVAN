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
import { Heart, Users, Calendar, Award } from "lucide-react";

export default function HomePage() {
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      label: "Tình nguyện viên",
      count: "1,234+",
      description: "Đã tham gia",
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-600" />,
      label: "Sự kiện",
      count: "567+",
      description: "Đã tổ chức",
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      label: "Giờ tình nguyện",
      count: "10,000+",
      description: "Đã đóng góp",
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      label: "Tổ chức",
      count: "89+",
      description: "Đối tác",
    },
  ];

  const features = [
    {
      title: "Quản lý sự kiện",
      description: "Tạo và quản lý các hoạt động tình nguyện một cách dễ dàng",
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Kết nối tình nguyện viên",
      description: "Tìm kiếm và kết nối với những người có cùng sở thích",
      color: "bg-green-50 border-green-200",
    },
    {
      title: "Theo dõi hoạt động",
      description: "Ghi nhận và theo dõi các hoạt động tình nguyện của bạn",
      color: "bg-purple-50 border-purple-200",
    },
    {
      title: "Cộng đồng",
      description: "Tham gia cộng đồng tình nguyện viên tích cực",
      color: "bg-orange-50 border-orange-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
            🎉 Chào mừng đến với IVAN
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Nền tảng quản lý
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              {" "}
              tình nguyện viên{" "}
            </span>
            hàng đầu
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Kết nối tình nguyện viên, tổ chức và cộng đồng để tạo ra những tác
            động tích cực. Tham gia ngay để bắt đầu hành trình tình nguyện của
            bạn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Đăng ký ngay
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
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
                <p className="font-semibold text-gray-900">{stat.label}</p>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tại sao chọn IVAN?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                <CardDescription className="text-gray-700">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bắt đầu hành trình tình nguyện của bạn
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Tham gia cộng đồng hàng nghìn tình nguyện viên đang tạo ra những
              thay đổi tích cực cho xã hội
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/volunteers">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Khám phá tình nguyện viên
                </Button>
              </Link>
              <Link to="/organizations">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Xem các tổ chức
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
