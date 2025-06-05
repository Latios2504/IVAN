import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Award,
  Clock,
  MapPin,
  Users,
  Building,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for company information
const companyData = {
  id: "org_001",
  name: "Quỹ Tấm Lòng Việt",
  description:
    "Tổ chức từ thiện hoạt động trong lĩnh vực giáo dục và y tế, mang lại cơ hội học tập và chăm sóc sức khỏe cho trẻ em có hoàn cảnh khó khăn tại Việt Nam.",
  category: "Giáo dục & Y tế",
  location: "Hà Nội, Việt Nam",
  established: "2010",
  website: "https://tamlong.vn",
  logo: "/api/placeholder/100/100",
  stats: {
    volunteers: 150,
    events: 48,
    beneficiaries: 2500,
  },
};

// Mock schedule data
const scheduleData = [
  {
    id: "sch_001",
    date: "2024-06-15",
    time: "08:00 - 12:00",
    activity: "Dạy máy tính cho trẻ em",
    location: "Trường Tiểu học Đống Đa",
    status: "confirmed",
  },
  {
    id: "sch_002",
    date: "2024-06-16",
    time: "07:00 - 11:00",
    activity: "Khám sức khỏe miễn phí",
    location: "Bệnh viện Đa khoa Hà Nội",
    status: "pending",
  },
  {
    id: "sch_003",
    date: "2024-06-22",
    time: "14:00 - 18:00",
    activity: "Tặng quà trẻ em khuyết tật",
    location: "Trung tâm Bảo trợ Xã hội",
    status: "confirmed",
  },
];

// Mock available events
const availableEvents = [
  {
    id: "event_001",
    title: "Xây dựng thư viện cho trẻ em vùng cao",
    date: "2024-06-25",
    time: "08:00 - 17:00",
    location: "Sapa, Lào Cai",
    volunteers: 12,
    maxVolunteers: 20,
    description:
      "Giúp xây dựng thư viện và tổ chức hoạt động đọc sách cho trẻ em vùng cao.",
  },
  {
    id: "event_002",
    title: "Chương trình dinh dưỡng trẻ em",
    date: "2024-07-01",
    time: "09:00 - 15:00",
    location: "Hà Giang",
    volunteers: 8,
    maxVolunteers: 15,
    description: "Cung cấp bữa ăn bổ dưỡng và giáo dục dinh dưỡng cho trẻ em.",
  },
];

// Mock certificates
const certificates = [
  {
    id: "cert_001",
    title: "Tình nguyện viên xuất sắc 2024",
    issuedDate: "2024-06-10",
    description: "Hoàn thành xuất sắc 50 giờ hoạt động tình nguyện",
    verified: true,
  },
  {
    id: "cert_002",
    title: "Chứng chỉ đào tạo kỹ năng giao tiếp",
    issuedDate: "2024-06-05",
    description: "Hoàn thành khóa đào tạo kỹ năng giao tiếp với trẻ em",
    verified: true,
  },
  {
    id: "cert_003",
    title: "Chứng chỉ sơ cấp cứu cơ bản",
    issuedDate: "2024-05-20",
    description: "Hoàn thành khóa đào tạo sơ cấp cứu y tế cơ bản",
    verified: false,
  },
];

export default function CompanyPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Company Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building className="h-10 w-10 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {companyData.name}
            </h1>
            <p className="text-gray-600 mb-4">{companyData.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{companyData.category}</Badge>
              <Badge variant="outline" className="gap-1">
                <MapPin className="h-3 w-3" />
                {companyData.location}
              </Badge>
              <Badge variant="outline">
                Thành lập {companyData.established}
              </Badge>
            </div>
          </div>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {companyData.stats.volunteers}
                  </div>
                  <p className="text-sm text-gray-600">Tình nguyện viên</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {companyData.stats.events}
                  </div>
                  <p className="text-sm text-gray-600">Sự kiện đã tổ chức</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {companyData.stats.beneficiaries}
                  </div>
                  <p className="text-sm text-gray-600">Người được hỗ trợ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Lịch trình của tôi</TabsTrigger>
          <TabsTrigger value="events">Sự kiện có thể tham gia</TabsTrigger>
          <TabsTrigger value="certificates">Chứng chỉ của tôi</TabsTrigger>
        </TabsList>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch trình hoạt động của tôi</CardTitle>
              <CardDescription>
                Các hoạt động tình nguyện bạn đã đăng ký với {companyData.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduleData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {new Date(item.date).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="text-xs text-gray-600">{item.time}</div>
                      </div>
                      <div>
                        <h4 className="font-medium">{item.activity}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        item.status === "confirmed" ? "default" : "outline"
                      }
                    >
                      {item.status === "confirmed"
                        ? "Đã xác nhận"
                        : "Chờ xác nhận"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sự kiện có thể tham gia</CardTitle>
              <CardDescription>
                Các sự kiện sắp tới mà bạn có thể đăng ký tham gia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {availableEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString("vi-VN")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.volunteers}/{event.maxVolunteers} tình nguyện
                            viên
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button className="w-full md:w-auto">
                          Đăng ký tham gia
                        </Button>
                        <Button variant="outline" className="w-full md:w-auto">
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chứng chỉ của tôi</CardTitle>
              <CardDescription>
                Các chứng chỉ và giấy chứng nhận bạn đã nhận được từ{" "}
                {companyData.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-full ${
                          cert.verified ? "bg-green-100" : "bg-yellow-100"
                        }`}
                      >
                        <Award
                          className={`h-6 w-6 ${
                            cert.verified ? "text-green-600" : "text-yellow-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{cert.title}</h4>
                        <p className="text-sm text-gray-600">
                          {cert.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Cấp ngày:{" "}
                          {new Date(cert.issuedDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {cert.verified && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      <Badge variant={cert.verified ? "default" : "outline"}>
                        {cert.verified ? "Đã xác thực" : "Chờ xác thực"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
