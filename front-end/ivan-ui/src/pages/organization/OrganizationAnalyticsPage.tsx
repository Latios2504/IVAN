import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Award,
  DollarSign,
  MapPin,
  Clock,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AnalyticsData {
  period: string;
  totalEvents: number;
  totalVolunteers: number;
  completedEvents: number;
  averageRating: number;
  totalHours: number;
  participationRate: number;
  retentionRate: number;
  impactScore: number;
}

interface EventMetrics {
  id: string;
  name: string;
  date: string;
  volunteers: {
    registered: number;
    attended: number;
    completed: number;
  };
  rating: number;
  hours: number;
  budget: number;
  impactScore: number;
  category: string;
}

interface VolunteerStats {
  id: string;
  name: string;
  eventsParticipated: number;
  totalHours: number;
  rating: number;
  lastActivity: string;
  skills: string[];
  status: "active" | "inactive" | "new";
}

const mockAnalyticsData: AnalyticsData[] = [
  {
    period: "2024-12",
    totalEvents: 8,
    totalVolunteers: 45,
    completedEvents: 6,
    averageRating: 4.6,
    totalHours: 320,
    participationRate: 87,
    retentionRate: 73,
    impactScore: 92,
  },
  {
    period: "2024-11",
    totalEvents: 12,
    totalVolunteers: 52,
    completedEvents: 11,
    averageRating: 4.4,
    totalHours: 480,
    participationRate: 82,
    retentionRate: 68,
    impactScore: 88,
  },
  {
    period: "2024-10",
    totalEvents: 10,
    totalVolunteers: 38,
    completedEvents: 9,
    averageRating: 4.3,
    totalHours: 360,
    participationRate: 79,
    retentionRate: 65,
    impactScore: 85,
  },
];

const mockEventMetrics: EventMetrics[] = [
  {
    id: "1",
    name: "Trại hè giáo dục 2024",
    date: "2024-12-15",
    volunteers: { registered: 25, attended: 23, completed: 22 },
    rating: 4.8,
    hours: 160,
    budget: 15000000,
    impactScore: 95,
    category: "Giáo dục",
  },
  {
    id: "2",
    name: "Hỗ trợ y tế miền núi",
    date: "2024-12-08",
    volunteers: { registered: 15, attended: 14, completed: 14 },
    rating: 4.6,
    hours: 120,
    budget: 8000000,
    impactScore: 92,
    category: "Y tế",
  },
  {
    id: "3",
    name: "Làm sạch bãi biển",
    date: "2024-11-30",
    volunteers: { registered: 30, attended: 28, completed: 26 },
    rating: 4.4,
    hours: 80,
    budget: 3000000,
    impactScore: 88,
    category: "Môi trường",
  },
];

const mockVolunteerStats: VolunteerStats[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    eventsParticipated: 8,
    totalHours: 64,
    rating: 4.9,
    lastActivity: "2024-12-15",
    skills: ["Lập trình", "Giảng dạy"],
    status: "active",
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    eventsParticipated: 6,
    totalHours: 48,
    rating: 4.7,
    lastActivity: "2024-12-10",
    skills: ["Y tế", "Chăm sóc trẻ em"],
    status: "active",
  },
  {
    id: "3",
    name: "Lê Văn Cường",
    eventsParticipated: 3,
    totalHours: 24,
    rating: 4.5,
    lastActivity: "2024-12-01",
    skills: ["Nấu ăn", "Tổ chức sự kiện"],
    status: "new",
  },
];

export default function OrganizationAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-12");
  const [selectedTab, setSelectedTab] = useState("overview");

  const currentData =
    mockAnalyticsData.find((data) => data.period === selectedPeriod) ||
    mockAnalyticsData[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: VolunteerStats["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800">Không hoạt động</Badge>
        );
      case "new":
        return <Badge className="bg-blue-100 text-blue-800">Mới</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      "Giáo dục": "bg-blue-100 text-blue-800",
      "Y tế": "bg-red-100 text-red-800",
      "Môi trường": "bg-green-100 text-green-800",
      "Cộng đồng": "bg-purple-100 text-purple-800",
    };
    return (
      <Badge
        className={
          colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }
      >
        {category}
      </Badge>
    );
  };

  const handleExportReport = () => {
    console.log("Xuất báo cáo analytics");
    // Simulate export
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Phân tích & Báo cáo</h1>
            <p className="text-gray-600 mt-2">
              Theo dõi hiệu suất và tác động của tổ chức
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-12">Tháng 12/2024</SelectItem>
                <SelectItem value="2024-11">Tháng 11/2024</SelectItem>
                <SelectItem value="2024-10">Tháng 10/2024</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="events">Sự kiện</TabsTrigger>
            <TabsTrigger value="volunteers">Tình nguyện viên</TabsTrigger>
            <TabsTrigger value="impact">Tác động</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng sự kiện
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentData.totalEvents}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentData.completedEvents} đã hoàn thành
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tình nguyện viên
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentData.totalVolunteers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentData.retentionRate}% tỷ lệ giữ chân
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Giờ tình nguyện
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentData.totalHours}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(
                      currentData.totalHours / currentData.totalVolunteers
                    )}{" "}
                    giờ/người
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Đánh giá trung bình
                  </CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentData.averageRating}
                  </div>
                  <p className="text-xs text-muted-foreground">/5.0 điểm</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tỷ lệ tham gia</CardTitle>
                  <CardDescription>
                    Tỷ lệ tình nguyện viên tham gia so với đăng ký
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tỷ lệ tham gia</span>
                      <span className="text-2xl font-bold">
                        {currentData.participationRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${currentData.participationRate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Điểm tác động</CardTitle>
                  <CardDescription>
                    Đánh giá tác động cộng đồng của các hoạt động
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Điểm tác động</span>
                      <span className="text-2xl font-bold">
                        {currentData.impactScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${currentData.impactScore}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Dựa trên phản hồi cộng đồng và đánh giá chuyên gia
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hiệu suất sự kiện</CardTitle>
                <CardDescription>
                  Chi tiết về các sự kiện gần đây
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên sự kiện</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Tình nguyện viên</TableHead>
                      <TableHead>Đánh giá</TableHead>
                      <TableHead>Giờ</TableHead>
                      <TableHead>Ngân sách</TableHead>
                      <TableHead>Tác động</TableHead>
                      <TableHead>Danh mục</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEventMetrics.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          {event.name}
                        </TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {event.volunteers.completed}/
                              {event.volunteers.registered}
                            </div>
                            <div className="text-gray-500">
                              Hoàn thành/Đăng ký
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span>{event.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>{event.hours}h</TableCell>
                        <TableCell>{formatCurrency(event.budget)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span>{event.impactScore}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getCategoryBadge(event.category)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Volunteers Tab */}
          <TabsContent value="volunteers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê tình nguyện viên</CardTitle>
                <CardDescription>
                  Hiệu suất và hoạt động của tình nguyện viên
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>Sự kiện tham gia</TableHead>
                      <TableHead>Tổng giờ</TableHead>
                      <TableHead>Đánh giá</TableHead>
                      <TableHead>Hoạt động cuối</TableHead>
                      <TableHead>Kỹ năng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVolunteerStats.map((volunteer) => (
                      <TableRow key={volunteer.id}>
                        <TableCell className="font-medium">
                          {volunteer.name}
                        </TableCell>
                        <TableCell>{volunteer.eventsParticipated}</TableCell>
                        <TableCell>{volunteer.totalHours}h</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span>{volunteer.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>{volunteer.lastActivity}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {volunteer.skills
                              .slice(0, 2)
                              .map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            {volunteer.skills.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{volunteer.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(volunteer.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng giờ tình nguyện
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,160h</div>
                  <p className="text-xs text-muted-foreground">
                    Từ đầu năm 2024
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Người hưởng lợi
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,450</div>
                  <p className="text-xs text-muted-foreground">
                    Người được hỗ trợ trực tiếp
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Vùng phủ sóng
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">
                    Tỉnh/thành phố
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tác động theo lĩnh vực</CardTitle>
                <CardDescription>
                  Phân bố tác động theo các lĩnh vực hoạt động
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-sm">Giáo dục</span>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-sm">Y tế</span>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-sm">Môi trường</span>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
