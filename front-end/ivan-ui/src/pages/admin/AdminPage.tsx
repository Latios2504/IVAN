import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types/auth";
import {
  Users,
  Building,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalVolunteers: number;
  totalOrganizations: number;
  totalEvents: number;
  pendingVerifications: number;
  activeEvents: number;
}

interface UserManagement {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "suspended" | "pending";
  joinDate: string;
}

interface OrganizationVerification {
  id: string;
  name: string;
  type: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  documents: string[];
}

// Mock data
const mockStats: AdminStats = {
  totalUsers: 1250,
  totalVolunteers: 980,
  totalOrganizations: 270,
  totalEvents: 156,
  pendingVerifications: 12,
  activeEvents: 23,
};

const mockUsers: UserManagement[] = [
  {
    id: "1",
    email: "nguyen.van.a@email.com",
    name: "Nguyễn Văn A",
    role: UserRole.VOLUNTEER,
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    email: "contact@ngo-abc.org",
    name: "Tổ chức ABC",
    role: UserRole.ORGANIZATION,
    status: "active",
    joinDate: "2024-02-01",
  },
  {
    id: "3",
    email: "tran.thi.b@email.com",
    name: "Trần Thị B",
    role: UserRole.VOLUNTEER,
    status: "suspended",
    joinDate: "2024-01-20",
  },
];

const mockVerifications: OrganizationVerification[] = [
  {
    id: "1",
    name: "Quỹ Giáo dục XYZ",
    type: "Tổ chức từ thiện",
    submittedDate: "2024-03-15",
    status: "pending",
    documents: ["Giấy phép hoạt động", "Bảng cân đối kế toán"],
  },
  {
    id: "2",
    name: "Hội Bảo vệ Môi trường",
    type: "Tổ chức phi chính phủ",
    submittedDate: "2024-03-10",
    status: "pending",
    documents: ["Giấy đăng ký hoạt động", "CV lãnh đạo"],
  },
];

export default function AdminPage() {
  const { user } = useAuth();
  const [userFilter, setUserFilter] = useState<string>("all");
  const [userSearch, setUserSearch] = useState("");

  // Redirect if not admin
  if (user?.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Không có quyền truy cập
        </h1>
        <p className="text-gray-600">
          Chỉ quản trị viên mới có thể truy cập trang này.
        </p>
      </div>
    );
  }

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesFilter =
      userFilter === "all" ||
      user.role === userFilter ||
      user.status === userFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Tạm ngưng</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>
        );
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Từ chối</Badge>;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.VOLUNTEER:
        return <Badge variant="outline">Tình nguyện viên</Badge>;
      case UserRole.ORGANIZATION:
        return <Badge variant="outline">Tổ chức</Badge>;
      case UserRole.ADMIN:
        return <Badge variant="outline">Quản trị viên</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Bảng điều khiển quản trị</h1>
          <p className="text-gray-600 mt-2">
            Quản lý hệ thống tình nguyện viên
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{mockStats.totalUsers}</p>
                  <p className="text-sm text-gray-600">Tổng người dùng</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {mockStats.totalVolunteers}
                  </p>
                  <p className="text-sm text-gray-600">Tình nguyện viên</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {mockStats.totalOrganizations}
                  </p>
                  <p className="text-sm text-gray-600">Tổ chức</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{mockStats.totalEvents}</p>
                  <p className="text-sm text-gray-600">Sự kiện</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {mockStats.pendingVerifications}
                  </p>
                  <p className="text-sm text-gray-600">Chờ xác thực</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{mockStats.activeEvents}</p>
                  <p className="text-sm text-gray-600">Đang diễn ra</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Quản lý người dùng</TabsTrigger>
            <TabsTrigger value="verifications">Xác thực tổ chức</TabsTrigger>
            <TabsTrigger value="events">Quản lý sự kiện</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>

          {/* User Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý người dùng</CardTitle>
                <CardDescription>
                  Xem và quản lý tất cả người dùng trong hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <Input
                      placeholder="Tìm kiếm người dùng..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="md:w-1/3"
                    />
                    <Select value={userFilter} onValueChange={setUserFilter}>
                      <SelectTrigger className="md:w-1/4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value={UserRole.VOLUNTEER}>
                          Tình nguyện viên
                        </SelectItem>
                        <SelectItem value={UserRole.ORGANIZATION}>
                          Tổ chức
                        </SelectItem>
                        <SelectItem value="active">Đang hoạt động</SelectItem>
                        <SelectItem value="suspended">Tạm ngưng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* User Table */}
                  <div className="border rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="text-left p-4">Người dùng</th>
                            <th className="text-left p-4">Vai trò</th>
                            <th className="text-left p-4">Trạng thái</th>
                            <th className="text-left p-4">Ngày tham gia</th>
                            <th className="text-left p-4">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b">
                              <td className="p-4">
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-gray-600">
                                    {user.email}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">{getRoleBadge(user.role)}</td>
                              <td className="p-4">
                                {getStatusBadge(user.status)}
                              </td>
                              <td className="p-4 text-sm text-gray-600">
                                {new Date(user.joinDate).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    Xem
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    {user.status === "active"
                                      ? "Tạm ngưng"
                                      : "Kích hoạt"}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organization Verifications */}
          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <CardTitle>Xác thực tổ chức</CardTitle>
                <CardDescription>
                  Xem xét và phê duyệt các yêu cầu xác thực từ tổ chức
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVerifications.map((verification) => (
                    <div
                      key={verification.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{verification.name}</h3>
                          <p className="text-sm text-gray-600">
                            {verification.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            Gửi yêu cầu:{" "}
                            {new Date(
                              verification.submittedDate
                            ).toLocaleDateString("vi-VN")}
                          </p>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Tài liệu đính kèm:
                            </p>
                            {verification.documents.map((doc, index) => (
                              <p
                                key={index}
                                className="text-sm text-blue-600 cursor-pointer hover:underline"
                              >
                                • {doc}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {getStatusBadge(verification.status)}
                          {verification.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Phê duyệt
                              </Button>
                              <Button size="sm" variant="destructive">
                                <XCircle className="h-4 w-4 mr-1" />
                                Từ chối
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Event Management */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý sự kiện</CardTitle>
                <CardDescription>
                  Theo dõi và quản lý tất cả sự kiện trong hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Chức năng quản lý sự kiện đang được phát triển
                  </p>
                  <Button className="mt-4">Xem tất cả sự kiện</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo thống kê</CardTitle>
                <CardDescription>
                  Xem các báo cáo và thống kê về hoạt động của hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Chức năng báo cáo đang được phát triển
                  </p>
                  <Button className="mt-4">Tải báo cáo</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
