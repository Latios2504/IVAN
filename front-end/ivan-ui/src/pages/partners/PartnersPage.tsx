import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Search,
  Filter,
  HandHeart,
  Users,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for partners
const mockPartners = [
  {
    id: "partner_001",
    name: "Tập đoàn Vingroup",
    description:
      "Tập đoàn kinh tế tư nhân đa ngành hàng đầu Việt Nam, tích cực tham gia các hoạt động xã hội và từ thiện.",
    type: "corporate",
    contactInfo: {
      email: "partnership@vingroup.net",
      phone: "024 3974 9999",
      address: "Số 7 Bằng Lăng 1, Vinhomes Riverside, Long Biên, Hà Nội",
      website: "https://vingroup.net",
      contactPerson: "Nguyễn Thị Lan Anh",
      position: "Giám đốc Quan hệ Đối tác",
    },
    collaborationHistory: [
      {
        title: "Chương trình Học bổng Vingroup",
        description: "Tài trợ học bổng cho học sinh nghèo vượt khó",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: "ongoing",
      },
    ],
    donationHistory: [
      {
        amount: 500000000,
        currency: "VND",
        type: "monetary",
        description: "Tài trợ chương trình giáo dục",
        date: "2024-03-15",
        status: "received",
      },
    ],
    status: "active",
    stats: {
      totalDonations: 500000000,
      activeCollaborations: 3,
      beneficiaries: 1200,
    },
  },
  {
    id: "partner_002",
    name: "Ngân hàng Vietcombank",
    description:
      "Ngân hàng thương mại cổ phần hàng đầu Việt Nam, cam kết phát triển bền vững và trách nhiệm xã hội.",
    type: "corporate",
    contactInfo: {
      email: "csr@vietcombank.com.vn",
      phone: "024 3936 6666",
      address: "198 Trần Quang Khải, Hoàn Kiếm, Hà Nội",
      website: "https://vietcombank.com.vn",
      contactPerson: "Trần Minh Đức",
      position: "Trưởng phòng CSR",
    },
    collaborationHistory: [
      {
        title: "Vietcombank vì cộng đồng",
        description: "Chương trình hỗ trợ cộng đồng địa phương",
        startDate: "2024-02-01",
        endDate: "2024-11-30",
        status: "ongoing",
      },
    ],
    donationHistory: [
      {
        amount: 300000000,
        currency: "VND",
        type: "monetary",
        description: "Hỗ trợ hoạt động từ thiện",
        date: "2024-02-28",
        status: "received",
      },
    ],
    status: "active",
    stats: {
      totalDonations: 300000000,
      activeCollaborations: 2,
      beneficiaries: 800,
    },
  },
  {
    id: "partner_003",
    name: "Quỹ Ford",
    description:
      "Tổ chức từ thiện quốc tế hỗ trợ các dự án phát triển xã hội và giáo dục tại Việt Nam.",
    type: "foundation",
    contactInfo: {
      email: "vietnam@fordfoundation.org",
      phone: "024 3831 5368",
      address: "Tầng 8, Tòa nhà CIC, 219 Trung Kính, Cầu Giấy, Hà Nội",
      website: "https://fordfoundation.org",
      contactPerson: "Sarah Johnson",
      position: "Country Director",
    },
    collaborationHistory: [
      {
        title: "Dự án Giáo dục Công dân",
        description: "Hỗ trợ giáo dục công dân cho thanh niên",
        startDate: "2024-01-15",
        endDate: "2024-12-15",
        status: "ongoing",
      },
    ],
    donationHistory: [
      {
        amount: 150000,
        currency: "USD",
        type: "monetary",
        description: "Tài trợ dự án giáo dục",
        date: "2024-01-20",
        status: "received",
      },
    ],
    status: "active",
    stats: {
      totalDonations: 3600000000,
      activeCollaborations: 1,
      beneficiaries: 500,
    },
  },
];

export default function PartnersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filteredPartners, setFilteredPartners] = useState(mockPartners);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPartners(query, filterType);
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    filterPartners(searchQuery, type);
  };

  const filterPartners = (query: string, type: string) => {
    let filtered = mockPartners;

    if (query) {
      filtered = filtered.filter(
        (partner) =>
          partner.name.toLowerCase().includes(query.toLowerCase()) ||
          partner.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (type !== "all") {
      filtered = filtered.filter((partner) => partner.type === type);
    }

    setFilteredPartners(filtered);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "corporate":
        return "Doanh nghiệp";
      case "government":
        return "Chính phủ";
      case "ngo":
        return "Tổ chức phi lợi nhuận";
      case "foundation":
        return "Quỹ từ thiện";
      case "individual":
        return "Cá nhân";
      default:
        return type;
    }
  };

  const formatCurrency = (amount: number, currency: string = "VND") => {
    if (currency === "VND") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đối tác</h1>
        <p className="text-gray-600">
          Khám phá các đối tác đang hỗ trợ và hợp tác với hệ thống IVAN
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Tìm kiếm đối tác..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={handleFilterChange}>
          <SelectTrigger className="md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Loại đối tác" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="corporate">Doanh nghiệp</SelectItem>
            <SelectItem value="foundation">Quỹ từ thiện</SelectItem>
            <SelectItem value="government">Chính phủ</SelectItem>
            <SelectItem value="ngo">Tổ chức phi lợi nhuận</SelectItem>
            <SelectItem value="individual">Cá nhân</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Partner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đối tác</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPartners.length}</div>
            <p className="text-xs text-muted-foreground">
              Đối tác đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dự án hợp tác</CardTitle>
            <HandHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPartners.reduce(
                (total, partner) => total + partner.stats.activeCollaborations,
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Dự án đang triển khai
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Người được hỗ trợ
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPartners
                .reduce(
                  (total, partner) => total + partner.stats.beneficiaries,
                  0
                )
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Người đã được hỗ trợ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{partner.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {getTypeLabel(partner.type)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {partner.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {partner.stats.totalDonations >= 1000000
                      ? `${(partner.stats.totalDonations / 1000000).toFixed(
                          0
                        )}M`
                      : partner.stats.totalDonations.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Tổng tài trợ</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-600">
                    {partner.stats.activeCollaborations}
                  </div>
                  <div className="text-xs text-gray-500">Dự án</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-purple-600">
                    {partner.stats.beneficiaries.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Người được hỗ trợ</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="text-sm text-gray-600 mb-4">
                <div>📧 {partner.contactInfo.email}</div>
                <div>📞 {partner.contactInfo.phone}</div>
                <div>
                  👤 {partner.contactInfo.contactPerson} -{" "}
                  {partner.contactInfo.position}
                </div>
              </div>

              {/* Recent Collaboration */}
              {partner.collaborationHistory.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h4 className="font-medium text-sm mb-1">Dự án gần đây:</h4>
                  <p className="text-sm text-gray-600">
                    {partner.collaborationHistory[0].title}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link to={`/partners/${partner.id}`}>Xem chi tiết</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/partners/${partner.id}/collaborate`}>
                    Hợp tác
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy đối tác
          </h3>
          <p className="text-gray-600">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}
    </div>
  );
}
