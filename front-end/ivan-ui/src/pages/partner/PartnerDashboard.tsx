import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { PartnerAnalyticsDashboard } from "@/components/partner/PartnerAnalyticsDashboard";

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

  // Mock loading states
  const loading = false;
  const error = null;

  // Mock partner stats
  const partnerStats = {
    totalCollaborations: 12,
    activeProjects: 8,
    totalInvestment: 250000000,
    partneredOrganizations: 15,
  };

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
      <div className="flex justify-between items-center p-6 bg-gradient-to-br from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">Bảng điều khiển Đối tác</h1>
          <p className="bg-gradient-to-r from-emerald-700 to-cyan-700 dark:from-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent font-medium">
            Quản lý các mối quan hệ đối tác và hợp tác
          </p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
            <p className="text-red-500">Lỗi: {error}</p>
          </div>
        ) : (
          <>
            <Card className="bg-gradient-to-br from-white/80 via-emerald-50/30 to-teal-50/30 dark:from-gray-900/80 dark:via-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-t-lg">
                <CardTitle className="text-sm font-medium bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
                  Tổng hợp tác
                </CardTitle>
                <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  {(partnerStats as any)?.totalCollaborations || 0}
                </div>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                  +2 so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/80 via-blue-50/30 to-indigo-50/30 dark:from-gray-900/80 dark:via-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
                <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                  Dự án đang hoạt động
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {(partnerStats as any)?.activeProjects || 0}
                </div>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                  +1 so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/80 via-amber-50/30 to-orange-50/30 dark:from-gray-900/80 dark:via-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-t-lg">
                <CardTitle className="text-sm font-medium bg-gradient-to-r from-amber-700 to-orange-700 dark:from-amber-300 dark:to-orange-300 bg-clip-text text-transparent">
                  Tổng đầu tư
                </CardTitle>
                <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  {formatCurrency((partnerStats as any)?.totalInvestment || 0)}
                </div>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                  +15% so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/80 via-purple-50/30 to-pink-50/30 dark:from-gray-900/80 dark:via-purple-950/30 dark:to-pink-950/30 border border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-t-lg">
                <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                  Tổ chức đối tác
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  {(partnerStats as any)?.partneredOrganizations || 0}
                </div>
                <p className="text-xs text-purple-600/80 dark:text-purple-400/80">
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
        <TabsList className="bg-gradient-to-r from-gray-100/80 to-emerald-100/80 dark:from-gray-800/80 dark:to-emerald-800/80 border border-gray-200/50 dark:border-gray-700/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-teal-50/80 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all duration-200">Tổng quan</TabsTrigger>
          <TabsTrigger value="partnerships" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-teal-50/80 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all duration-200">Quan hệ đối tác</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-teal-50/80 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all duration-200">Phân tích</TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-teal-50/80 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all duration-200">Báo cáo</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-teal-50/80 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all duration-200">Cài đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white/80 via-green-50/30 to-emerald-50/30 dark:from-gray-900/80 dark:via-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-t-lg">
                <CardTitle className="bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">Hoạt động gần đây</CardTitle>
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

            <Card className="bg-gradient-to-br from-white/80 via-blue-50/30 to-cyan-50/30 dark:from-gray-900/80 dark:via-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-t-lg">
                <CardTitle className="bg-gradient-to-r from-blue-700 to-cyan-700 dark:from-blue-300 dark:to-cyan-300 bg-clip-text text-transparent">Thống kê theo tháng</CardTitle>
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
          <Card className="bg-gradient-to-br from-white/80 via-purple-50/30 to-pink-50/30 dark:from-gray-900/80 dark:via-purple-950/30 dark:to-pink-950/30 border border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-t-lg">
              <CardTitle className="bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">Danh sách đối tác</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partnerships.map((partnership) => (
                  <div
                    key={partnership.id}
                    className="border border-gradient-to-r from-emerald-200/50 to-teal-200/50 dark:from-emerald-800/50 dark:to-teal-800/50 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg p-4 space-y-3 hover:shadow-lg transition-all duration-300"
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

        <TabsContent value="analytics" className="space-y-4">
          <PartnerAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-gradient-to-br from-white/80 via-orange-50/30 to-amber-50/30 dark:from-gray-900/80 dark:via-orange-950/30 dark:to-amber-950/30 border border-orange-200/50 dark:border-orange-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/50 dark:to-amber-950/50 rounded-t-lg">
              <CardTitle className="bg-gradient-to-r from-orange-700 to-amber-700 dark:from-orange-300 dark:to-amber-300 bg-clip-text text-transparent">Báo cáo và thống kê</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tính năng báo cáo đang được phát triển...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-gradient-to-br from-white/80 via-slate-50/30 to-gray-50/30 dark:from-gray-900/80 dark:via-slate-950/30 dark:to-gray-950/30 border border-slate-200/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-slate-50/50 to-gray-50/50 dark:from-slate-950/50 dark:to-gray-950/50 rounded-t-lg">
              <CardTitle className="bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">Cài đặt đối tác</CardTitle>
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
