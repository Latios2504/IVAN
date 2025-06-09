import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  Eye,
  Plus,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrganizationReport {
  id: string;
  title: string;
  type: "event" | "financial" | "volunteer" | "impact" | "annual";
  createdDate: string;
  period: string;
  status: "draft" | "published" | "reviewing";
  downloadCount: number;
  fileSize: string;
  summary: string;
}

interface ReportFormData {
  title: string;
  type: OrganizationReport["type"];
  period: string;
  description: string;
  includeFinancial: boolean;
  includeVolunteerData: boolean;
  includeEventMetrics: boolean;
}

const mockReports: OrganizationReport[] = [
  {
    id: "1",
    title: "Báo cáo tác động cộng đồng Q4 2024",
    type: "impact",
    createdDate: "2024-12-15",
    period: "Q4 2024",
    status: "published",
    downloadCount: 45,
    fileSize: "2.4 MB",
    summary: "Tổng kết hoạt động tác động cộng đồng trong quý 4",
  },
  {
    id: "2",
    title: "Báo cáo tài chính tháng 11/2024",
    type: "financial",
    createdDate: "2024-11-30",
    period: "Tháng 11/2024",
    status: "published",
    downloadCount: 23,
    fileSize: "1.8 MB",
    summary: "Chi tiết thu chi và sử dụng nguồn tài trợ",
  },
  {
    id: "3",
    title: "Báo cáo sự kiện: Trại hè giáo dục 2024",
    type: "event",
    createdDate: "2024-11-25",
    period: "07/2024 - 08/2024",
    status: "published",
    downloadCount: 67,
    fileSize: "3.1 MB",
    summary: "Đánh giá hiệu quả và tác động của chương trình trại hè",
  },
  {
    id: "4",
    title: "Báo cáo tình nguyện viên Q3 2024",
    type: "volunteer",
    createdDate: "2024-10-01",
    period: "Q3 2024",
    status: "draft",
    downloadCount: 12,
    fileSize: "1.5 MB",
    summary: "Thống kê và đánh giá hiệu suất tình nguyện viên",
  },
];

export default function OrganizationReportsPage() {
  const [reports] = useState<OrganizationReport[]>(mockReports);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] =
    useState<OrganizationReport | null>(null);
  const [formData, setFormData] = useState<ReportFormData>({
    title: "",
    type: "event",
    period: "",
    description: "",
    includeFinancial: false,
    includeVolunteerData: true,
    includeEventMetrics: true,
  });

  const getStatusBadge = (status: OrganizationReport["status"]) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-800">Đã xuất bản</Badge>
        );
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Nháp</Badge>;
      case "reviewing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Đang xem xét</Badge>
        );
      default:
        return null;
    }
  };

  const getTypeIcon = (type: OrganizationReport["type"]) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "financial":
        return <DollarSign className="h-4 w-4" />;
      case "volunteer":
        return <Users className="h-4 w-4" />;
      case "impact":
        return <TrendingUp className="h-4 w-4" />;
      case "annual":
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: OrganizationReport["type"]) => {
    switch (type) {
      case "event":
        return "Báo cáo sự kiện";
      case "financial":
        return "Báo cáo tài chính";
      case "volunteer":
        return "Báo cáo tình nguyện viên";
      case "impact":
        return "Báo cáo tác động";
      case "annual":
        return "Báo cáo thường niên";
      default:
        return "Báo cáo khác";
    }
  };

  const filteredReports = reports.filter((report) => {
    if (selectedTab === "all") return true;
    return report.type === selectedTab;
  });

  const handleCreateReport = () => {
    console.log("Tạo báo cáo:", formData);
    setIsCreateDialogOpen(false);
    // Reset form
    setFormData({
      title: "",
      type: "event",
      period: "",
      description: "",
      includeFinancial: false,
      includeVolunteerData: true,
      includeEventMetrics: true,
    });
  };

  const handleViewReport = (report: OrganizationReport) => {
    setSelectedReport(report);
    setIsViewDialogOpen(true);
  };

  const handleDownloadReport = (reportId: string) => {
    console.log("Tải xuống báo cáo:", reportId);
    // Simulate download
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Báo cáo tổ chức</h1>
            <p className="text-gray-600 mt-2">
              Quản lý và tạo báo cáo về hoạt động của tổ chức
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo báo cáo mới
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng báo cáo
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground">+2 từ tháng trước</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã xuất bản</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reports.filter((r) => r.status === "published").length}
              </div>
              <p className="text-xs text-muted-foreground">87% tổng báo cáo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lượt tải xuống
              </CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reports.reduce((sum, r) => sum + r.downloadCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% từ tháng trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đang soạn thảo
              </CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reports.filter((r) => r.status === "draft").length}
              </div>
              <p className="text-xs text-muted-foreground">Cần hoàn thiện</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="event">Sự kiện</TabsTrigger>
            <TabsTrigger value="financial">Tài chính</TabsTrigger>
            <TabsTrigger value="volunteer">Tình nguyện viên</TabsTrigger>
            <TabsTrigger value="impact">Tác động</TabsTrigger>
            <TabsTrigger value="annual">Thường niên</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách báo cáo</CardTitle>
                <CardDescription>
                  {filteredReports.length} báo cáo được tìm thấy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên báo cáo</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Lượt tải</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{report.title}</div>
                            <div className="text-sm text-gray-500">
                              {report.fileSize} • {report.createdDate}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(report.type)}
                            <span className="text-sm">
                              {getTypeName(report.type)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{report.period}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{report.downloadCount}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewReport(report)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadReport(report.id)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Tải
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Report Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo báo cáo mới</DialogTitle>
              <DialogDescription>
                Tạo báo cáo về hoạt động của tổ chức
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên báo cáo</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Nhập tên báo cáo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại báo cáo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: OrganizationReport["type"]) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Báo cáo sự kiện</SelectItem>
                      <SelectItem value="financial">
                        Báo cáo tài chính
                      </SelectItem>
                      <SelectItem value="volunteer">
                        Báo cáo tình nguyện viên
                      </SelectItem>
                      <SelectItem value="impact">Báo cáo tác động</SelectItem>
                      <SelectItem value="annual">
                        Báo cáo thường niên
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Thời gian báo cáo</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, period: e.target.value }))
                  }
                  placeholder="VD: Q4 2024, Tháng 12/2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Mô tả nội dung báo cáo"
                  rows={3}
                />
              </div>
              <div className="space-y-3">
                <Label>Nội dung bao gồm:</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="financial"
                      checked={formData.includeFinancial}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          includeFinancial: e.target.checked,
                        }))
                      }
                    />
                    <Label htmlFor="financial">Dữ liệu tài chính</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="volunteer"
                      checked={formData.includeVolunteerData}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          includeVolunteerData: e.target.checked,
                        }))
                      }
                    />
                    <Label htmlFor="volunteer">Dữ liệu tình nguyện viên</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="events"
                      checked={formData.includeEventMetrics}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          includeEventMetrics: e.target.checked,
                        }))
                      }
                    />
                    <Label htmlFor="events">Chỉ số sự kiện</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreateReport}>Tạo báo cáo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Report Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedReport?.title}</DialogTitle>
              <DialogDescription>
                Chi tiết báo cáo của tổ chức
              </DialogDescription>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Loại báo cáo</Label>
                    <p className="text-sm text-gray-600">
                      {getTypeName(selectedReport.type)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Thời gian</Label>
                    <p className="text-sm text-gray-600">
                      {selectedReport.period}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Ngày tạo</Label>
                    <p className="text-sm text-gray-600">
                      {selectedReport.createdDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Trạng thái</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedReport.status)}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tóm tắt</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedReport.summary}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Kích thước file
                    </Label>
                    <p className="text-sm text-gray-600">
                      {selectedReport.fileSize}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Lượt tải xuống
                    </Label>
                    <p className="text-sm text-gray-600">
                      {selectedReport.downloadCount}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Đóng
              </Button>
              <Button
                onClick={() =>
                  selectedReport && handleDownloadReport(selectedReport.id)
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Tải xuống
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
