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
import {
  Handshake,
  FileText,
  Building2,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PartnerDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Đối tác
        </h1>
        <p className="text-gray-600">
          Quản lý quan hệ hợp tác và đề xuất dự án
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hợp tác</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Được chấp nhận
            </CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dự án hợp tác</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Đang triển khai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tin nhắn</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 chưa đọc</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Collaboration Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Gửi đơn hợp tác</CardTitle>
            <CardDescription>Tạo và gửi đề xuất hợp tác mới</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link to="/partner/collaborate/admin">
                  <FileText className="mr-2 h-4 w-4" />
                  Gửi đơn đến Admin
                </Link>
              </Button>
              <Button className="w-full justify-start" asChild>
                <Link to="/partner/collaborate/organizations">
                  <Building2 className="mr-2 h-4 w-4" />
                  Gửi đơn đến Tổ chức
                </Link>
              </Button>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Mẫu đề xuất phổ biến:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Tài trợ tài chính cho dự án</p>
                <p>• Cung cấp trang thiết bị</p>
                <p>• Hỗ trợ kỹ thuật và đào tạo</p>
                <p>• Chia sẻ mạng lưới khách hàng</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collaboration Status */}
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái hợp tác</CardTitle>
            <CardDescription>
              Theo dõi tình trạng các đơn đã gửi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Quỹ Tấm Lòng Việt</h4>
                  <p className="text-sm text-gray-600">Tài trợ thiết bị y tế</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Đã chấp nhận
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Tổ chức Giáo dục ABC</h4>
                  <p className="text-sm text-gray-600">Đào tạo kỹ năng</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Đang xem xét
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Admin IVAN</h4>
                  <p className="text-sm text-gray-600">Hợp tác chiến lược</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Mới gửi</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/partner/collaborations">Xem tất cả đơn</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Dự án đang triển khai</CardTitle>
            <CardDescription>Các dự án hợp tác hiện tại</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Chương trình Y tế Cộng đồng</h4>
                  <Badge className="bg-blue-100 text-blue-800">
                    Đang triển khai
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Hợp tác với Quỹ Tấm Lòng Việt
                </p>
                <div className="text-xs text-gray-500">
                  Bắt đầu: 01/06/2024 • Kết thúc: 31/12/2024
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Đào tạo Kỹ năng Số</h4>
                  <Badge className="bg-green-100 text-green-800">
                    Hoàn thành
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Hợp tác với Trung tâm Giáo dục DEF
                </p>
                <div className="text-xs text-gray-500">
                  Hoàn thành: 15/05/2024 • 200 học viên
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/partner/projects">Chi tiết dự án</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
            <CardDescription>Các tác vụ thường dùng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link to="/partner/collaborate/new">
                <FileText className="mr-2 h-4 w-4" />
                Tạo đơn hợp tác mới
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/partner/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                Tin nhắn
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/organizations">
                <Building2 className="mr-2 h-4 w-4" />
                Khám phá tổ chức
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/profile">
                <Settings className="mr-2 h-4 w-4" />
                Cập nhật hồ sơ
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Future Features Notice */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tính năng sắp ra mắt</CardTitle>
          <CardDescription>
            Các chức năng mới đang được phát triển
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                ✨ Quản lý dự án hợp tác
              </h4>
              <p>Theo dõi tiến độ, milestone và báo cáo chi tiết</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                📊 Theo dõi trạng thái đơn
              </h4>
              <p>Cập nhật real-time về tình trạng đề xuất hợp tác</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
