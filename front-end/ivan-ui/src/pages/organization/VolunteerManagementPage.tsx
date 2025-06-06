import { useState } from "react";
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
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Clock,
  UserCheck,
  UserX,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

// Mock data for volunteers in organization
const mockVolunteers = [
  {
    id: "vol_001",
    fullName: "Nguyễn Thị Mai",
    email: "mai.nguyen@email.com",
    phone: "0901234567",
    joinDate: "2024-01-15",
    status: "active",
    location: "Hà Nội",
    skills: ["Giáo dục", "Giao tiếp", "Tổ chức sự kiện"],
    totalHours: 120,
    eventsParticipated: 8,
    certificates: 3,
    lastActivity: "2024-06-10",
    rating: 4.8,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: "vol_002",
    fullName: "Trần Văn Hùng",
    email: "hung.tran@email.com",
    phone: "0912345678",
    joinDate: "2024-02-20",
    status: "active",
    location: "TP.HCM",
    skills: ["Y tế", "Sơ cấp cứu", "Chăm sóc người già"],
    totalHours: 95,
    eventsParticipated: 6,
    certificates: 2,
    lastActivity: "2024-06-08",
    rating: 4.6,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: "vol_003",
    fullName: "Lê Thị Hương",
    email: "huong.le@email.com",
    phone: "0923456789",
    joinDate: "2024-03-10",
    status: "inactive",
    location: "Đà Nẵng",
    skills: ["Môi trường", "Trồng cây", "Bảo vệ thiên nhiên"],
    totalHours: 65,
    eventsParticipated: 4,
    certificates: 1,
    lastActivity: "2024-05-20",
    rating: 4.2,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: "vol_004",
    fullName: "Phạm Minh Tuấn",
    email: "tuan.pham@email.com",
    phone: "0934567890",
    joinDate: "2024-04-05",
    status: "active",
    location: "Hải Phòng",
    skills: ["Công nghệ", "Đào tạo", "Thiết kế"],
    totalHours: 80,
    eventsParticipated: 5,
    certificates: 2,
    lastActivity: "2024-06-12",
    rating: 4.9,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: "vol_005",
    fullName: "Vũ Thị Lan",
    email: "lan.vu@email.com",
    phone: "0945678901",
    joinDate: "2024-01-30",
    status: "pending",
    location: "Cần Thơ",
    skills: ["Nông nghiệp", "Hướng dẫn kỹ thuật", "Tư vấn"],
    totalHours: 0,
    eventsParticipated: 0,
    certificates: 0,
    lastActivity: "2024-06-01",
    rating: 0,
    avatar: "/api/placeholder/40/40",
  },
];

const statusConfig = {
  active: {
    label: "Đang hoạt động",
    variant: "default" as const,
    color: "text-green-600",
  },
  inactive: {
    label: "Tạm nghỉ",
    variant: "secondary" as const,
    color: "text-gray-600",
  },
  pending: {
    label: "Chờ duyệt",
    variant: "outline" as const,
    color: "text-yellow-600",
  },
  suspended: {
    label: "Tạm khóa",
    variant: "destructive" as const,
    color: "text-red-600",
  },
};

export default function VolunteerManagementPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVolunteers = mockVolunteers.filter((volunteer) => {
    const matchesSearch =
      volunteer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && volunteer.status === selectedTab;
  });

  const getVolunteerStats = () => {
    const total = mockVolunteers.length;
    const active = mockVolunteers.filter((v) => v.status === "active").length;
    const pending = mockVolunteers.filter((v) => v.status === "pending").length;
    const totalHours = mockVolunteers.reduce((sum, v) => sum + v.totalHours, 0);

    return { total, active, pending, totalHours };
  };

  const stats = getVolunteerStats();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý Tình nguyện viên
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi tình nguyện viên trong tổ chức
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Lọc
          </Button>
          <Button asChild>
            <Link to="/volunteers">
              <Users className="mr-2 h-4 w-4" />
              Tìm tình nguyện viên mới
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên, email hoặc kỹ năng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng tình nguyện viên
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tất cả thành viên</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground">Tích cực tham gia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Cần xét duyệt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giờ tình nguyện
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalHours}
            </div>
            <p className="text-xs text-muted-foreground">Giờ đóng góp</p>
          </CardContent>
        </Card>
      </div>

      {/* Volunteers Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
          <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
          <TabsTrigger value="inactive">Tạm nghỉ</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedTab === "all"
                  ? "Tất cả tình nguyện viên"
                  : statusConfig[selectedTab as keyof typeof statusConfig]
                      ?.label}
              </CardTitle>
              <CardDescription>
                Danh sách và thông tin chi tiết của tình nguyện viên
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVolunteers.map((volunteer) => (
                  <div
                    key={volunteer.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {volunteer.fullName}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {volunteer.email}
                              </p>
                            </div>
                            <Badge
                              variant={
                                statusConfig[
                                  volunteer.status as keyof typeof statusConfig
                                ].variant
                              }
                            >
                              {
                                statusConfig[
                                  volunteer.status as keyof typeof statusConfig
                                ].label
                              }
                            </Badge>
                          </div>{" "}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {volunteer.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {volunteer.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Tham gia:{" "}
                              {new Date(volunteer.joinDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {volunteer.totalHours} giờ tình nguyện
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {volunteer.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {volunteer.eventsParticipated} sự kiện
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              <span>{volunteer.certificates} chứng chỉ</span>
                            </div>
                            {volunteer.rating > 0 && (
                              <div className="flex items-center gap-1">
                                <span>⭐ {volunteer.rating}/5.0</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/organization/volunteers/${volunteer.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="mr-2 h-4 w-4" />
                          Liên hệ
                        </Button>
                        {volunteer.status === "pending" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Duyệt
                          </Button>
                        )}
                        {volunteer.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Tạm khóa
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredVolunteers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Không tìm thấy tình nguyện viên
                  </h3>
                  <p className="text-gray-600">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
