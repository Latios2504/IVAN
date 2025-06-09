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
  Calendar,
  MapPin,
  Users,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for events
const mockEvents = [
  {
    id: "event_001",
    title: "Chương trình giáo dục trẻ em vùng cao",
    description: "Tổ chức hoạt động giáo dục và tặng quà cho trẻ em vùng cao",
    date: "2024-06-20",
    time: "08:00 - 17:00",
    location: "Sapa, Lào Cai",
    status: "upcoming",
    volunteers: {
      registered: 25,
      confirmed: 20,
      max: 30,
    },
    coordinator: "Nguyễn Văn A",
    category: "Giáo dục",
    createdDate: "2024-05-15",
  },
  {
    id: "event_002",
    title: "Khám sức khỏe miễn phí cộng đồng",
    description: "Khám sức khỏe và tư vấn y tế miễn phí cho người dân",
    date: "2024-06-25",
    time: "07:00 - 14:00",
    location: "Trung tâm Y tế Quận 1, TP.HCM",
    status: "in_progress",
    volunteers: {
      registered: 40,
      confirmed: 35,
      max: 45,
    },
    coordinator: "Lê Thị B",
    category: "Y tế",
    createdDate: "2024-05-20",
  },
  {
    id: "event_003",
    title: "Tặng quà Tết cho gia đình khó khăn",
    description:
      "Tổ chức tặng quà Tết và thăm hỏi các gia đình có hoàn cảnh khó khăn",
    date: "2024-02-05",
    time: "09:00 - 16:00",
    location: "Huyện Đông Anh, Hà Nội",
    status: "completed",
    volunteers: {
      registered: 60,
      confirmed: 55,
      max: 60,
    },
    coordinator: "Trần Văn C",
    category: "Cộng đồng",
    createdDate: "2024-01-10",
  },
  {
    id: "event_004",
    title: "Dọn dẹp môi trường bờ biển",
    description: "Hoạt động thu gom rác thải và bảo vệ môi trường biển",
    date: "2024-07-10",
    time: "06:00 - 11:00",
    location: "Bãi biển Cửa Lò, Nghệ An",
    status: "planning",
    volunteers: {
      registered: 8,
      confirmed: 5,
      max: 25,
    },
    coordinator: "Phạm Thị D",
    category: "Môi trường",
    createdDate: "2024-06-01",
  },
];

const statusConfig = {
  planning: {
    label: "Đang lên kế hoạch",
    variant: "outline" as const,
    color: "text-gray-600",
  },
  upcoming: {
    label: "Sắp diễn ra",
    variant: "default" as const,
    color: "text-blue-600",
  },
  in_progress: {
    label: "Đang diễn ra",
    variant: "default" as const,
    color: "text-green-600",
  },
  completed: {
    label: "Đã hoàn thành",
    variant: "secondary" as const,
    color: "text-green-700",
  },
  cancelled: {
    label: "Đã hủy",
    variant: "destructive" as const,
    color: "text-red-600",
  },
};

export default function EventManagementPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredEvents = mockEvents.filter((event) => {
    if (selectedTab === "all") return true;
    return event.status === selectedTab;
  });

  const getEventStats = () => {
    const total = mockEvents.length;
    const upcoming = mockEvents.filter((e) => e.status === "upcoming").length;
    const inProgress = mockEvents.filter(
      (e) => e.status === "in_progress"
    ).length;
    const completed = mockEvents.filter((e) => e.status === "completed").length;

    return { total, upcoming, inProgress, completed };
  };

  const stats = getEventStats();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý Sự kiện
          </h1>
          <p className="text-gray-600">
            Tạo, chỉnh sửa và quản lý các sự kiện tình nguyện
          </p>
        </div>
        <Button className="mt-4 md:mt-0" asChild>
          <Link to="/organization/events/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo sự kiện mới
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sự kiện</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tất cả sự kiện</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp diễn ra</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.upcoming}
            </div>
            <p className="text-xs text-muted-foreground">Sự kiện sắp tới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang diễn ra</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.inProgress}
            </div>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.completed}
            </div>
            <p className="text-xs text-muted-foreground">Hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      {/* Events Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="planning">Lên kế hoạch</TabsTrigger>
          <TabsTrigger value="upcoming">Sắp diễn ra</TabsTrigger>
          <TabsTrigger value="in_progress">Đang diễn ra</TabsTrigger>
          <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedTab === "all"
                      ? "Tất cả sự kiện"
                      : statusConfig[selectedTab as keyof typeof statusConfig]
                          ?.label}
                  </CardTitle>
                  <CardDescription>
                    Quản lý và theo dõi các sự kiện tình nguyện
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Lọc
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">
                              {event.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {event.description}
                            </p>
                          </div>
                          <Badge
                            variant={
                              statusConfig[
                                event.status as keyof typeof statusConfig
                              ].variant
                            }
                          >
                            {
                              statusConfig[
                                event.status as keyof typeof statusConfig
                              ].label
                            }
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
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
                            {event.volunteers.confirmed}/{event.volunteers.max}{" "}
                            tình nguyện viên
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{event.category}</Badge>
                          <Badge variant="outline">
                            Coordinator: {event.coordinator}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/organization/events/${event.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/organization/events/${event.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </Button>
                      </div>
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
