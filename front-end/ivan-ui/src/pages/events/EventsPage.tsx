import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types/auth";
import { Calendar, MapPin, Users } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
  skills: string[];
  status: "upcoming" | "ongoing" | "completed";
  imageUrl?: string;
}

// Mock data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Hỗ trợ giáo dục trẻ em vùng cao",
    description:
      "Chương trình giảng dạy và hỗ trợ học tập cho trẻ em ở các vùng núi cao. Tham gia cùng chúng tôi để mang lại cơ hội học tập tốt hơn cho các em.",
    organization: "Quỹ Giáo dục ABC",
    location: "Sapa, Lào Cai",
    startDate: "2024-04-15",
    endDate: "2024-04-22",
    volunteersNeeded: 30,
    volunteersRegistered: 25,
    skills: ["Giảng dạy", "Tiếng Anh", "Toán học"],
    status: "upcoming",
    imageUrl:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500",
  },
  {
    id: "2",
    title: "Chương trình bảo vệ môi trường",
    description:
      "Hoạt động làm sạch bãi biển, trồng cây và tuyên truyền về bảo vệ môi trường. Cùng nhau xây dựng một môi trường xanh, sạch, đẹp.",
    organization: "Tổ chức Môi trường Xanh",
    location: "Bãi biển Nha Trang",
    startDate: "2024-04-01",
    endDate: "2024-04-03",
    volunteersNeeded: 50,
    volunteersRegistered: 40,
    skills: ["Làm việc nhóm", "Sức khỏe tốt"],
    status: "ongoing",
    imageUrl:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500",
  },
  {
    id: "3",
    title: "Hỗ trợ người cao tuổi",
    description:
      "Chăm sóc và đồng hành cùng người cao tuổi tại viện dưỡng lão. Mang lại niềm vui và sự quan tâm đến những người cần được chăm sóc.",
    organization: "Hội Chăm sóc Người cao tuổi",
    location: "Viện dưỡng lão Thành phố",
    startDate: "2024-03-20",
    endDate: "2024-03-20",
    volunteersNeeded: 20,
    volunteersRegistered: 20,
    skills: ["Giao tiếp", "Kiên nhẫn", "Chăm sóc"],
    status: "completed",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500",
  },
  {
    id: "4",
    title: "Xây dựng nhà cho người nghèo",
    description:
      "Tham gia xây dựng và sửa chữa nhà ở cho các gia đình có hoàn cảnh khó khăn. Cùng nhau tạo nên một mái ấm cho mọi người.",
    organization: "Tổ chức Habitat",
    location: "Đồng Nai",
    startDate: "2024-05-01",
    endDate: "2024-05-15",
    volunteersNeeded: 40,
    volunteersRegistered: 15,
    skills: ["Xây dựng", "Thể lực tốt", "Làm việc nhóm"],
    status: "upcoming",
    imageUrl:
      "https://images.unsplash.com/photo-1581578017426-462ea8c114ba?w=500",
  },
];

export default function EventsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;

    const matchesLocation =
      locationFilter === "all" ||
      event.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Sắp diễn ra</Badge>;
      case "ongoing":
        return (
          <Badge className="bg-green-100 text-green-800">Đang diễn ra</Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gray-100 text-gray-800">Đã hoàn thành</Badge>
        );
      default:
        return null;
    }
  };

  const canRegister = (event: Event) => {
    return (
      user?.role === UserRole.VOLUNTEER &&
      event.status === "upcoming" &&
      event.volunteersRegistered < event.volunteersNeeded
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Sự kiện tình nguyện</h1>
          <p className="text-gray-600 mt-2">
            Khám phá và tham gia các hoạt động tình nguyện có ý nghĩa
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tìm kiếm</label>
                <Input
                  placeholder="Tìm sự kiện..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Trạng thái</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                    <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                    <SelectItem value="completed">Đã hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Địa điểm</label>
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="hà nội">Hà Nội</SelectItem>
                    <SelectItem value="hồ chí minh">TP. Hồ Chí Minh</SelectItem>
                    <SelectItem value="đà nẵng">Đà Nẵng</SelectItem>
                    <SelectItem value="khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {user?.role === UserRole.ORGANIZATION && (
                <div className="flex items-end">
                  <Button className="w-full">Tạo sự kiện mới</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {event.imageUrl && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold line-clamp-2">
                      {event.title}
                    </h3>
                    {getStatusBadge(event.status)}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(event.startDate).toLocaleDateString("vi-VN")}
                      </span>
                      {event.startDate !== event.endDate && (
                        <span>
                          {" "}
                          -{" "}
                          {new Date(event.endDate).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.volunteersRegistered}/{event.volunteersNeeded}{" "}
                        tình nguyện viên
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Kỹ năng cần thiết:
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {event.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button className="w-full" variant="outline">
                      Xem chi tiết
                    </Button>
                    {canRegister(event) && (
                      <Button className="w-full">Đăng ký tham gia</Button>
                    )}
                    {user?.role === UserRole.ORGANIZATION && (
                      <Button className="w-full" variant="secondary">
                        Quản lý sự kiện
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy sự kiện nào phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
}
