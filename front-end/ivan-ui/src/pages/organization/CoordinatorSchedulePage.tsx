import { useState } from "react";
import { useModal, useModalWithData } from "@/hooks/useModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
} from "lucide-react";

interface CoordinatorSchedule {
  id: string;
  coordinatorId: string;
  coordinatorName: string;
  eventId: string;
  eventTitle: string;
  startDate: string;
  endDate: string;
  location: string;
  status: "assigned" | "in_progress" | "completed" | "cancelled";
  tasks: string[];
  notes?: string;
  volunteersAssigned: number;
  estimatedHours: number;
  actualHours?: number;
  priority: "low" | "medium" | "high";
}

interface ScheduleFormData {
  coordinatorId: string;
  eventId: string;
  startDate: string;
  endDate: string;
  location: string;
  tasks: string;
  notes: string;
  estimatedHours: number;
  priority: CoordinatorSchedule["priority"];
}

const mockCoordinators = [
  { id: "coord_001", name: "Nguyễn Minh Hạnh" },
  { id: "coord_002", name: "Trần Văn Đức" },
  { id: "coord_003", name: "Lê Thị Mai" },
];

const mockEvents = [
  { id: "event_001", title: "Chương trình giáo dục trẻ em vùng cao" },
  { id: "event_002", title: "Dọn dẹp bãi biển Hạ Long" },
  { id: "event_003", title: "Khám sức khỏe miễn phí cộng đồng" },
];

const mockSchedules: CoordinatorSchedule[] = [
  {
    id: "schedule_001",
    coordinatorId: "coord_001",
    coordinatorName: "Nguyễn Minh Hạnh",
    eventId: "event_001",
    eventTitle: "Chương trình giáo dục trẻ em vùng cao",
    startDate: "2025-07-20",
    endDate: "2025-07-22",
    location: "Sapa, Lào Cai",
    status: "assigned",
    tasks: [
      "Điều phối 25 tình nguyện viên",
      "Quản lý lịch trình giảng dạy",
      "Liên hệ với trường địa phương",
      "Báo cáo tiến độ hàng ngày",
    ],
    notes: "Cần chuẩn bị tài liệu giảng dạy và quà tặng cho trẻ em",
    volunteersAssigned: 25,
    estimatedHours: 24,
    priority: "high",
  },
  {
    id: "schedule_002",
    coordinatorId: "coord_002",
    coordinatorName: "Trần Văn Đức",
    eventId: "event_002",
    eventTitle: "Dọn dẹp bãi biển Hạ Long",
    startDate: "2025-08-05",
    endDate: "2025-08-05",
    location: "Bãi Cháy, Hạ Long, Quảng Ninh",
    status: "in_progress",
    tasks: [
      "Quản lý 40 tình nguyện viên",
      "Phân chia khu vực dọn dẹp",
      "Báo cáo kết quả thu gom rác",
      "Đảm bảo an toàn",
    ],
    volunteersAssigned: 40,
    estimatedHours: 4,
    actualHours: 4,
    priority: "medium",
  },
  {
    id: "schedule_003",
    coordinatorId: "coord_001",
    coordinatorName: "Nguyễn Minh Hạnh",
    eventId: "event_003",
    eventTitle: "Khám sức khỏe miễn phí cộng đồng",
    startDate: "2025-06-15",
    endDate: "2025-06-15",
    location: "Quận Hai Bà Trưng, Hà Nội",
    status: "completed",
    tasks: [
      "Điều phối bác sĩ và y tá tình nguyện",
      "Quản lý hàng đợi khám bệnh",
      "Phát thuốc và tư vấn",
      "Báo cáo số liệu khám",
    ],
    volunteersAssigned: 30,
    estimatedHours: 8,
    actualHours: 9,
    priority: "high",
  },
];

export default function CoordinatorSchedulePage() {
  const [schedules, setSchedules] =
    useState<CoordinatorSchedule[]>(mockSchedules);
  const [selectedTab, setSelectedTab] = useState("all");

  // Modal hooks for managing dialog states
  const createDialog = useModal();
  const viewModal = useModalWithData<CoordinatorSchedule>();

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<ScheduleFormData>({
    coordinatorId: "",
    eventId: "",
    startDate: "",
    endDate: "",
    location: "",
    tasks: "",
    notes: "",
    estimatedHours: 8,
    priority: "medium",
  });

  const getStatusBadge = (status: CoordinatorSchedule["status"]) => {
    switch (status) {
      case "assigned":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Calendar className="h-3 w-3 mr-1" />
            Đã phân công
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Đang thực hiện
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Hoàn thành
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: CoordinatorSchedule["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Cao</Badge>;
      case "medium":
        return <Badge variant="outline">Trung bình</Badge>;
      case "low":
        return <Badge variant="secondary">Thấp</Badge>;
      default:
        return null;
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesTab = selectedTab === "all" || schedule.status === selectedTab;
    const matchesSearch =
      schedule.coordinatorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      schedule.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleInputChange =
    (field: keyof ScheduleFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSelectChange =
    (field: keyof ScheduleFormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleCreateSchedule = () => {
    const coordinatorName =
      mockCoordinators.find((c) => c.id === formData.coordinatorId)?.name || "";
    const eventTitle =
      mockEvents.find((e) => e.id === formData.eventId)?.title || "";

    const newSchedule: CoordinatorSchedule = {
      id: `schedule_${Date.now()}`,
      coordinatorId: formData.coordinatorId,
      coordinatorName,
      eventId: formData.eventId,
      eventTitle,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location,
      status: "assigned",
      tasks: formData.tasks
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      notes: formData.notes,
      volunteersAssigned: 0,
      estimatedHours: formData.estimatedHours,
      priority: formData.priority,
    };

    setSchedules((prev) => [newSchedule, ...prev]);
    createDialog.close();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      coordinatorId: "",
      eventId: "",
      startDate: "",
      endDate: "",
      location: "",
      tasks: "",
      notes: "",
      estimatedHours: 8,
      priority: "medium",
    });
  };

  const handleViewSchedule = (schedule: CoordinatorSchedule) => {
    viewModal.openWith(schedule);
  };

  const getScheduleStats = () => {
    return {
      total: schedules.length,
      assigned: schedules.filter((s) => s.status === "assigned").length,
      inProgress: schedules.filter((s) => s.status === "in_progress").length,
      completed: schedules.filter((s) => s.status === "completed").length,
      totalHours: schedules.reduce(
        (sum, s) => sum + (s.actualHours || s.estimatedHours),
        0
      ),
    };
  };

  const stats = getScheduleStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Lịch trình Coordinators</h1>
            <p className="text-gray-600 mt-2">
              Quản lý lịch trình và phân công nhiệm vụ cho các Coordinator
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
            <Button onClick={() => createDialog.open()}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm lịch trình
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng lịch trình
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Tất cả lịch trình</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đã phân công
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.assigned}</div>
              <p className="text-xs text-muted-foreground">Chờ thực hiện</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đang thực hiện
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Đang diễn ra</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Đã kết thúc</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng giờ</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHours}</div>
              <p className="text-xs text-muted-foreground">Giờ điều phối</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo tên coordinator, sự kiện, địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Schedule Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">Tất cả ({stats.total})</TabsTrigger>
            <TabsTrigger value="assigned">
              Đã phân công ({stats.assigned})
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              Đang thực hiện ({stats.inProgress})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Hoàn thành ({stats.completed})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab}>
            <Card>
              <CardHeader>
                <CardTitle>Danh sách lịch trình</CardTitle>
                <CardDescription>
                  Quản lý lịch trình của các Coordinator trong tổ chức
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Coordinator</TableHead>
                      <TableHead>Sự kiện</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Địa điểm</TableHead>
                      <TableHead>Tình nguyện viên</TableHead>
                      <TableHead>Ưu tiên</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          <div className="font-medium">
                            {schedule.coordinatorName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium truncate max-w-xs">
                              {schedule.eventTitle}
                            </div>
                            <div className="text-sm text-gray-500">
                              {schedule.tasks.length} nhiệm vụ
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{schedule.startDate}</div>
                            {schedule.endDate !== schedule.startDate && (
                              <div className="text-sm text-gray-500">
                                đến {schedule.endDate}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm truncate max-w-xs">
                              {schedule.location}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">
                              {schedule.volunteersAssigned}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(schedule.priority)}
                        </TableCell>
                        <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewSchedule(schedule)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Sửa
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

        {/* Create Schedule Dialog */}
        <Dialog open={createDialog.isOpen} onOpenChange={createDialog.close}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm lịch trình mới</DialogTitle>
              <DialogDescription>
                Tạo lịch trình và phân công nhiệm vụ cho Coordinator
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coordinator">Coordinator</Label>
                  <Select
                    value={formData.coordinatorId}
                    onValueChange={handleSelectChange("coordinatorId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn Coordinator" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCoordinators.map((coordinator) => (
                        <SelectItem key={coordinator.id} value={coordinator.id}>
                          {coordinator.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event">Sự kiện</Label>
                  <Select
                    value={formData.eventId}
                    onValueChange={handleSelectChange("eventId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn sự kiện" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange("startDate")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange("endDate")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Địa điểm</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={handleInputChange("location")}
                  placeholder="Nhập địa điểm tổ chức"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedHours">Số giờ dự kiến</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={formData.estimatedHours}
                    onChange={handleInputChange("estimatedHours")}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Độ ưu tiên</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={handleSelectChange("priority")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mức ưu tiên" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tasks">
                  Nhiệm vụ (phân cách bằng dấu phẩy)
                </Label>
                <Textarea
                  id="tasks"
                  value={formData.tasks}
                  onChange={handleInputChange("tasks")}
                  placeholder="Điều phối tình nguyện viên, Quản lý lịch trình, Báo cáo..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={handleInputChange("notes")}
                  placeholder="Ghi chú thêm về lịch trình..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={createDialog.open}>
                Hủy
              </Button>
              <Button onClick={handleCreateSchedule}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo lịch trình
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Schedule Dialog */}
        <Dialog open={viewModal.isOpen} onOpenChange={viewModal.close}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết lịch trình</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về lịch trình Coordinator
              </DialogDescription>
            </DialogHeader>
            {viewModal.data && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Coordinator</Label>
                    <p className="text-sm text-gray-600">
                      {viewModal.data.coordinatorName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Trạng thái</Label>
                    <div className="mt-1">
                      {getStatusBadge(viewModal.data.status)}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Sự kiện</Label>
                  <p className="text-sm text-gray-600">
                    {viewModal.data.eventTitle}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Ngày bắt đầu</Label>
                    <p className="text-sm text-gray-600">
                      {viewModal.data.startDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Ngày kết thúc</Label>
                    <p className="text-sm text-gray-600">
                      {viewModal.data.endDate}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Địa điểm</Label>
                  <p className="text-sm text-gray-600">
                    {viewModal.data.location}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Tình nguyện viên phân công
                    </Label>
                    <p className="text-sm text-gray-600">
                      {viewModal.data.volunteersAssigned} người
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Độ ưu tiên</Label>
                    <div className="mt-1">
                      {getPriorityBadge(viewModal.data.priority)}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nhiệm vụ</Label>
                  <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                    {viewModal.data.tasks.map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                  </ul>
                </div>
                {viewModal.data.notes && (
                  <div>
                    <Label className="text-sm font-medium">Ghi chú</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {viewModal.data.notes}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Số giờ dự kiến
                    </Label>
                    <p className="text-sm text-gray-600">
                      {viewModal.data.estimatedHours} giờ
                    </p>
                  </div>
                  {viewModal.data.actualHours && (
                    <div>
                      <Label className="text-sm font-medium">
                        Số giờ thực tế
                      </Label>
                      <p className="text-sm text-gray-600">
                        {viewModal.data.actualHours} giờ
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => viewModal.close()}>
                Đóng
              </Button>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
