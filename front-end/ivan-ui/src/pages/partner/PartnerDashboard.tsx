import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { UserRole } from "@/types/auth";
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  FileText,
  Bell,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface Partnership {
  id: string;
  organizationName: string;
  organizationType: string;
  status: "active" | "pending" | "completed" | "cancelled";
  startDate: string;
  endDate?: string;
  description: string;
  value: number;
  location: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats: partnerStats, loading, error } = useDashboardStats();

  // Mock data
  const partnerships: Partnership[] = [
    {
      id: "1",
      organizationName: "Hội Chữ thập đỏ Việt Nam",
      organizationType: "Tổ chức nhân đạo",
      status: "active",
      startDate: "2024-01-15",
      description: "Hỗ trợ thiết bị y tế cho các hoạt động cứu trợ khẩn cấp",
      value: 500000,
      location: "Hà Nội",
      contact: {
        name: "Nguyễn Văn A",
        email: "contact@redcross.vn",
        phone: "024-3825-3611",
      },
    },
    {
      id: "2",
      organizationName: "Quỹ Bảo vệ Trẻ em Việt Nam",
      organizationType: "Tổ chức bảo vệ trẻ em",
      status: "pending",
      startDate: "2024-02-01",
      description: "Tài trợ chương trình giáo dục cho trẻ em vùng cao",
      value: 300000,
      location: "Lào Cai",
      contact: {
        name: "Trần Thị B",
        email: "info@childprotection.vn",
        phone: "024-3943-5568",
      },
    },
  ];

  const getStatusBadge = (status: Partnership["status"]) => {
    const statusConfig = {
      active: {
        label: "Đang hoạt động",
        variant: "default" as const,
        icon: CheckCircle,
      },
      pending: {
        label: "Chờ duyệt",
        variant: "secondary" as const,
        icon: Clock,
      },
      completed: {
        label: "Hoàn thành",
        variant: "outline" as const,
        icon: CheckCircle,
      },
      cancelled: {
        label: "Đã hủy",
        variant: "destructive" as const,
        icon: XCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bảng điều khiển Đối tác</h1>
          <p className="text-muted-foreground">
            Quản lý các mối quan hệ đối tác và hợp tác
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Tạo đối tác mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <p>Đang tải thống kê...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-8">
            <p className="text-red-500">Lỗi: {error?.message || error?.toString() || 'Đã xảy ra lỗi'}</p>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng hợp tác
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(partnerStats as any)?.totalCollaborations || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +2 so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Dự án đang hoạt động
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(partnerStats as any)?.activeProjects || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +1 so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng đầu tư
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency((partnerStats as any)?.totalInvestment || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +15% so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổ chức đối tác
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(partnerStats as any)?.partneredOrganizations || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +3 so với tháng trước
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="partnerships">Quan hệ đối tác</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Ký kết hợp tác với Hội Chữ thập đỏ
                    </p>
                    <p className="text-xs text-muted-foreground">2 giờ trước</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Cập nhật thông tin đối tác
                    </p>
                    <p className="text-xs text-muted-foreground">
                      1 ngày trước
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Hoàn thành dự án tại Lào Cai
                    </p>
                    <p className="text-xs text-muted-foreground">
                      3 ngày trước
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thống kê theo tháng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Đối tác mới</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Dự án hoàn thành</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tổng giá trị hợp tác</span>
                    <span className="font-medium">
                      {formatCurrency(800000)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partnerships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đối tác</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partnerships.map((partnership) => (
                  <div
                    key={partnership.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold">
                          {partnership.organizationName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {partnership.organizationType}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(partnership.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm">{partnership.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{partnership.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>{formatCurrency(partnership.value)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {new Date(partnership.startDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{partnership.contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{partnership.contact.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo và thống kê</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tính năng báo cáo đang được phát triển...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt đối tác</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tính năng cài đặt đang được phát triển...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
