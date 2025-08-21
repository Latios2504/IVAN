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
import { useModal, useModalWithData } from "@/hooks/useModal";
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

  // Modal hooks for managing dialog states
  const createDialog = useModal();
  const viewModal = useModalWithData<OrganizationReport>();

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
    createDialog.close();
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
    viewModal.openWith(report);
  };

  const handleDownloadReport = (reportId: string) => {
    // Simulate download
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-950/50 min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start p-6 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/80 rounded-lg border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Báo cáo tổ chức</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Quản lý và tạo báo cáo về hoạt động của tổ chức
            </p>
          </div>
          <Button onClick={createDialog.open} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Tạo báo cáo mới
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-white/80 to-green-50/80 dark:from-gray-800/80 dark:to-green-900/80 border border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Tổng báo cáo
              </CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{reports.length}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">+2 từ tháng trước</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/80 border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Đã xuất bản</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {reports.filter((r) => r.status === "published").length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">87% tổng báo cáo</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-gray-800/80 dark:to-purple-900/80 border border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Lượt tải xuống
              </CardTitle>
              <Download className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {reports.reduce((sum, r) => sum + r.downloadCount, 0)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                +12% từ tháng trước
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white/80 to-amber-50/80 dark:from-gray-800/80 dark:to-amber-900/80 border border-amber-200/50 dark:border-amber-800/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Đang soạn thảo
              </CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {reports.filter((r) => r.status === "draft").length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Cần hoàn thiện</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 border border-gray-200/50 dark:border-gray-700/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Tất cả</TabsTrigger>
            <TabsTrigger value="event" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">Sự kiện</TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-orange-600 data-[state=active]:text-white">Tài chính</TabsTrigger>
            <TabsTrigger value="volunteer" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">Tình nguyện viên</TabsTrigger>
            <TabsTrigger value="impact" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white">Tác động</TabsTrigger>
            <TabsTrigger value="annual" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">Thường niên</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            <Card className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-950/50 border-b border-gray-200/30 dark:border-gray-700/30">
                <CardTitle className="bg-gradient-to-r from-gray-700 to-blue-700 dark:from-gray-200 dark:to-blue-200 bg-clip-text text-transparent">Danh sách báo cáo</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {filteredReports.length} báo cáo được tìm thấy
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
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
                              className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/50 dark:hover:to-indigo-800/50 text-blue-700 dark:text-blue-300"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadReport(report.id)}
                              className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50 border-green-200 dark:border-green-800 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/50 dark:hover:to-emerald-800/50 text-green-700 dark:text-green-300"
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
        <Dialog open={createDialog.isOpen} onOpenChange={createDialog.close}>
          <DialogContent className="max-w-2xl bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-gray-900/95 dark:to-blue-950/95 border border-blue-200/50 dark:border-blue-800/50">
            <DialogHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b border-blue-200/30 dark:border-blue-800/30 pb-4">
              <DialogTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Tạo báo cáo mới</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Tạo báo cáo về hoạt động của tổ chức
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-medium">Tên báo cáo</Label>
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
                    className="bg-gradient-to-r from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-700 dark:text-gray-300 font-medium">Loại báo cáo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: OrganizationReport["type"]) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="bg-gradient-to-r from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600">
                      <SelectValue placeholder="Chọn loại báo cáo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950 border-blue-200 dark:border-blue-800">
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
                <Label htmlFor="period" className="text-gray-700 dark:text-gray-300 font-medium">Thời gian báo cáo</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, period: e.target.value }))
                  }
                  placeholder="VD: Q4 2024, Tháng 12/2024"
                  className="bg-gradient-to-r from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-medium">Mô tả</Label>
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
                  className="bg-gradient-to-r from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-700 dark:text-gray-300 font-medium">Nội dung bao gồm:</Label>
                <div className="space-y-2 p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-md border border-blue-200/30 dark:border-blue-800/30">
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
                      className="accent-blue-600 dark:accent-blue-400"
                    />
                    <Label htmlFor="financial" className="text-gray-700 dark:text-gray-300">Dữ liệu tài chính</Label>
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
                      className="accent-blue-600 dark:accent-blue-400"
                    />
                    <Label htmlFor="volunteer" className="text-gray-700 dark:text-gray-300">Dữ liệu tình nguyện viên</Label>
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
                      className="accent-blue-600 dark:accent-blue-400"
                    />
                    <Label htmlFor="events" className="text-gray-700 dark:text-gray-300">Chỉ số sự kiện</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/30 dark:to-indigo-950/30 border-t border-blue-200/30 dark:border-blue-800/30 pt-4">
              <Button 
                variant="outline" 
                onClick={createDialog.close}
                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 text-gray-700 dark:text-gray-300"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleCreateReport}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                Tạo báo cáo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Report Dialog */}
        <Dialog open={viewModal.isOpen} onOpenChange={viewModal.close}>
          <DialogContent className="max-w-2xl bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-gray-900/95 dark:to-blue-950/95 border border-blue-200/50 dark:border-blue-800/50">
            <DialogHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b border-blue-200/30 dark:border-blue-800/30 pb-4">
              <DialogTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{viewModal.data?.title}</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Chi tiết báo cáo của tổ chức
              </DialogDescription>
            </DialogHeader>
            {viewModal.data && (
              <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gradient-to-r from-white/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-950/50 rounded-md border border-blue-200/30 dark:border-blue-800/30">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loại báo cáo</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {getTypeName(viewModal.data.type)}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-white/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-950/50 rounded-md border border-blue-200/30 dark:border-blue-800/30">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Thời gian</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {viewModal.data.period}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-white/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-950/50 rounded-md border border-blue-200/30 dark:border-blue-800/30">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ngày tạo</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {viewModal.data.createdDate}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-white/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-950/50 rounded-md border border-blue-200/30 dark:border-blue-800/30">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</Label>
                    <div className="mt-1">
                      {getStatusBadge(viewModal.data.status)}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-white/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-950/50 rounded-md border border-blue-200/30 dark:border-blue-800/30">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tóm tắt</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {viewModal.data.summary}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gradient-to-r from-white/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-950/50 rounded-md border border-blue-200/30 dark:border-blue-800/30">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Kích thước file
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {viewModal.data.fileSize}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-white/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-950/50 rounded-md border border-blue-200/30 dark:border-blue-800/30">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Lượt tải xuống
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {viewModal.data.downloadCount}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/30 dark:to-indigo-950/30 border-t border-blue-200/30 dark:border-blue-800/30 pt-4">
              <Button 
                variant="outline" 
                onClick={viewModal.close}
                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 text-gray-700 dark:text-gray-300"
              >
                Đóng
              </Button>
              <Button
                onClick={() =>
                  viewModal.data && handleDownloadReport(viewModal.data.id)
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
