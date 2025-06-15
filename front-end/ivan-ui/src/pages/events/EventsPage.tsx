import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Users, Clock, Search, Filter } from "lucide-react";

// Mock data for events
const mockEvents = [
  {
    id: "event_001",
    title: "Chương trình giáo dục trẻ em vùng cao",
    description: "Tổ chức hoạt động giáo dục và tặng quà cho trẻ em vùng cao",
    organization: "Quỹ Tấm Lòng Việt",
    date: "2024-06-20",
    time: "08:00 - 17:00",
    location: "Lai Châu, Việt Nam",
    volunteersNeeded: 20,
    volunteersRegistered: 15,
    status: "open",
    category: "education",
    image: "/api/placeholder/400/200",
  },
  {
    id: "event_002",
    title: "Dọn dẹp bãi biển Vũng Tàu",
    description: "Hoạt động bảo vệ môi trường biển và thu gom rác thải",
    organization: "Green Environment",
    date: "2024-06-25",
    time: "06:00 - 11:00",
    location: "Bãi biển Vũng Tàu",
    volunteersNeeded: 50,
    volunteersRegistered: 32,
    status: "open",
    category: "environment",
    image: "/api/placeholder/400/200",
  },
  {
    id: "event_003",
    title: "Thăm viện dưỡng lão",
    description: "Thăm hỏi, trò chuyện và tặng quà cho các cụ già",
    organization: "Hội Chữ thập đỏ",
    date: "2024-06-30",
    time: "14:00 - 17:00",
    location: "Viện dưỡng lão Thành phố",
    volunteersNeeded: 15,
    volunteersRegistered: 12,
    status: "open",
    category: "social",
    image: "/api/placeholder/400/200",
  },
  {
    id: "event_004",
    title: "Xây nhà tình thương",
    description: "Hỗ trợ xây dựng nhà cho gia đình có hoàn cảnh khó khăn",
    organization: "Habitat for Humanity",
    date: "2024-07-05",
    time: "07:00 - 16:00",
    location: "Đồng Nai, Việt Nam",
    volunteersNeeded: 30,
    volunteersRegistered: 30,
    status: "full",
    category: "construction",
    image: "/api/placeholder/400/200",
  },
];

const categories = [
  { value: "all", label: "Tất cả danh mục" },
  { value: "education", label: "Giáo dục" },
  { value: "environment", label: "Môi trường" },
  { value: "social", label: "Xã hội" },
  { value: "construction", label: "Xây dựng" },
  { value: "healthcare", label: "Y tế" },
];

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "open", label: "Đang mở đăng ký" },
  { value: "full", label: "Đã đủ người" },
  { value: "closed", label: "Đã đóng" },
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || event.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Đang mở
          </Badge>
        );
      case "full":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Đã đủ
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Đã đóng
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat ? cat.label : category;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sự kiện tình nguyện
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá và tham gia các hoạt động tình nguyện có ý nghĩa trong cộng
            đồng
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm sự kiện..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(event.category)}
                  </Badge>
                  {getStatusBadge(event.status)}
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <div className="font-medium text-blue-600 mb-2">
                    {event.organization}
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.volunteersRegistered}/{event.volunteersNeeded} tình
                      nguyện viên
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/events/${event.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      Xem chi tiết
                    </Button>
                  </Link>

                  {event.status === "open" && (
                    <Button className="flex-1" size="sm">
                      Đăng ký
                    </Button>
                  )}

                  {event.status === "full" && (
                    <Button
                      variant="secondary"
                      disabled
                      className="flex-1"
                      size="sm"
                    >
                      Đã đủ người
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy sự kiện nào
            </h3>
            <p className="text-gray-600">
              Thử điều chỉnh bộ lọc hoặc tìm kiếm để xem thêm sự kiện.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
