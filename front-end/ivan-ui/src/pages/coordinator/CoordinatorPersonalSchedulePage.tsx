import { useState, useEffect } from "react";
import { useModal, useModalWithData } from "@/hooks/useModal";
import { useAuth } from "@/hooks/useAuth";
import { coordinatorScheduleService } from "@/services/coordinatorScheduleService";
import { eventsService } from "@/services/eventsService";
import type {
  CoordinatorScheduleDto,
  CoordinatorScheduleFilterDto,
  CreateCoordinatorScheduleDto,
  UpdateCoordinatorScheduleDto,
  SCHEDULE_TYPE,
  SCHEDULE_PRIORITY,
  SCHEDULE_STATUS,
} from "@/types/coordinatorSchedule";
import type { EventDto } from "@/types/events";
import { toast } from "sonner";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
  CalendarDays,
  Loader2,
  Filter,
  RefreshCw,
} from "lucide-react";

interface ScheduleFormData {
  eventId?: number;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  scheduleType: string;
  priority: string;
  isAllDay: boolean;
  reminderMinutes: number;
  notes?: string;
}

export default function CoordinatorPersonalSchedulePage() {
  // Auth hook
  const { user } = useAuth();

  // State management
  const [schedules, setSchedules] = useState<CoordinatorScheduleDto[]>([]);
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const pageSize = 20;

  // Modal hooks for managing dialog states
  const createDialog = useModal();
  const editDialog = useModalWithData<CoordinatorScheduleDto>();
  const viewModal = useModalWithData<CoordinatorScheduleDto>();

  const [formData, setFormData] = useState<ScheduleFormData>({
    eventId: undefined,
    title: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    location: "",
    scheduleType: "Event",
    priority: "Medium",
    isAllDay: false,
    reminderMinutes: 60,
    notes: "",
  });

  // Load personal schedules from API
  const loadPersonalSchedules = async () => {
    try {
      setLoading(true);
      const filters: CoordinatorScheduleFilterDto = {
        pageNumber: currentPage,
        pageSize: pageSize,
        search: searchTerm || undefined,
        status: selectedTab !== "all" ? selectedTab : undefined,
      };

      const result = await coordinatorScheduleService.getPersonalSchedules(
        filters
      );
      setSchedules(result.items);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error("Error loading personal schedules:", error);
      toast.error("Không thể tải lịch trình cá nhân");
    } finally {
      setLoading(false);
    }
  };

  // Load events for dropdown
  const loadEvents = async () => {
    try {
      setEventsLoading(true);
      const result = await eventsService.getEvents({
        page: 1,
        size: 100,
        sortBy: "eventName",
        sortDirection: "asc",
        organizationId: user?.organizationId || undefined,
      });
      setEvents(result.items);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Không thể tải danh sách sự kiện");
    } finally {
      setEventsLoading(false);
    }
  };

  // Load schedules on component mount and when filters change
  useEffect(() => {
    loadPersonalSchedules();
  }, [currentPage, searchTerm, selectedTab]);

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  const getStatusBadge = (status?: string | null) => {
    switch (status) {
      case "Scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Calendar className="h-3 w-3 mr-1" />
            Đã lên lịch
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Đang thực hiện
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Hoàn thành
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Không xác định
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority?: string | null) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">Cao</Badge>;
      case "Medium":
        return <Badge variant="secondary">Trung bình</Badge>;
      case "Low":
        return <Badge variant="outline">Thấp</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return (
      date.toLocaleDateString("vi-VN") +
      " " +
      date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const handleCreateSchedule = async () => {
    if (!user?.coordinatorId) {
      toast.error("Không tìm thấy thông tin điều phối viên");
      return;
    }

    try {
      setLoading(true);
      const scheduleData: CreateCoordinatorScheduleDto = {
        coordinatorId: user.coordinatorId,
        eventId: formData.eventId,
        title: formData.title,
        description: formData.description,
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime,
        location: formData.location,
        scheduleType: formData.scheduleType,
        priority: formData.priority,
        isAllDay: formData.isAllDay,
        reminderMinutes: formData.reminderMinutes,
        notes: formData.notes,
      };

      await coordinatorScheduleService.createSchedule(scheduleData);
      toast.success("Tạo lịch trình thành công");
      createDialog.close();
      loadPersonalSchedules(); // Refresh the list
      resetForm();
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Không thể tạo lịch trình");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSchedule = async () => {
    if (!editDialog.data) return;

    try {
      setLoading(true);
      const updateData: UpdateCoordinatorScheduleDto = {
        eventId: formData.eventId,
        title: formData.title,
        description: formData.description,
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime,
        location: formData.location,
        scheduleType: formData.scheduleType,
        priority: formData.priority,
        isAllDay: formData.isAllDay,
        reminderMinutes: formData.reminderMinutes,
        notes: formData.notes,
      };

      await coordinatorScheduleService.updateSchedule(
        editDialog.data.scheduleId,
        updateData
      );
      toast.success("Cập nhật lịch trình thành công");
      editDialog.close();
      loadPersonalSchedules(); // Refresh the list
      resetForm();
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Không thể cập nhật lịch trình");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lịch trình này?")) return;

    try {
      setLoading(true);
      await coordinatorScheduleService.deleteSchedule(scheduleId);
      toast.success("Xóa lịch trình thành công");
      loadPersonalSchedules(); // Refresh the list
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Không thể xóa lịch trình");
    } finally {
      setLoading(false);
    }
  };

  const handleViewSchedule = (schedule: CoordinatorScheduleDto) => {
    viewModal.openWith(schedule);
  };

  const handleEditSchedule = (schedule: CoordinatorScheduleDto) => {
    setFormData({
      eventId: schedule.eventId || undefined,
      title: schedule.title,
      description: schedule.description || "",
      startDateTime: schedule.startDateTime,
      endDateTime: schedule.endDateTime,
      location: schedule.location || "",
      scheduleType: schedule.scheduleType || "Event",
      priority: schedule.priority || "Medium",
      isAllDay: schedule.isAllDay || false,
      reminderMinutes: schedule.reminderMinutes || 60,
      notes: schedule.notes || "",
    });
    editDialog.openWith(schedule);
  };

  const resetForm = () => {
    setFormData({
      eventId: undefined,
      title: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      location: "",
      scheduleType: "Event",
      priority: "Medium",
      isAllDay: false,
      reminderMinutes: 60,
      notes: "",
    });
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      !searchTerm ||
      schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.eventName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = selectedTab === "all" || schedule.status === selectedTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Lịch trình cá nhân
          </h1>
          <p className="text-muted-foreground">
            Quản lý lịch trình cá nhân của bạn với tư cách điều phối viên
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
            className="flex items-center gap-2"
          >
            <CalendarDays className="h-4 w-4" />
            {viewMode === "list" ? "Xem lịch" : "Xem danh sách"}
          </Button>
          <Button onClick={createDialog.open} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tạo lịch trình mới
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Input
              placeholder="Tìm kiếm lịch trình..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadPersonalSchedules}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="Scheduled">Đã lên lịch</TabsTrigger>
          <TabsTrigger value="In Progress">Đang thực hiện</TabsTrigger>
          <TabsTrigger value="Completed">Hoàn thành</TabsTrigger>
          <TabsTrigger value="Cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch trình cá nhân</CardTitle>
              <CardDescription>
                Tổng cộng {totalCount} lịch trình
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Sự kiện</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Địa điểm</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ưu tiên</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedules.map((schedule) => (
                      <TableRow key={schedule.scheduleId}>
                        <TableCell className="font-medium">
                          {schedule.title}
                        </TableCell>
                        <TableCell>{schedule.eventName || "N/A"}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDateTime(schedule.startDateTime)}</div>
                            <div className="text-muted-foreground">
                              đến {formatDateTime(schedule.endDateTime)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {schedule.location || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                        <TableCell>
                          {getPriorityBadge(schedule.priority)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewSchedule(schedule)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditSchedule(schedule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteSchedule(schedule.scheduleId)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Schedule Dialog */}
      <Dialog open={createDialog.isOpen} onOpenChange={createDialog.close}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo lịch trình mới</DialogTitle>
            <DialogDescription>
              Tạo lịch trình cá nhân mới cho bạn
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề lịch trình"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event">Sự kiện</Label>
                <Select
                  value={formData.eventId?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      eventId: value ? parseInt(value) : undefined,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn sự kiện (tùy chọn)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không có sự kiện</SelectItem>
                    {events.map((event) => (
                      <SelectItem
                        key={event.eventId}
                        value={event.eventId.toString()}
                      >
                        {event.eventName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Nhập mô tả lịch trình"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDateTime">Thời gian bắt đầu *</Label>
                <Input
                  id="startDateTime"
                  type="datetime-local"
                  value={formData.startDateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startDateTime: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDateTime">Thời gian kết thúc *</Label>
                <Input
                  id="endDateTime"
                  type="datetime-local"
                  value={formData.endDateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endDateTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Địa điểm</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Nhập địa điểm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scheduleType">Loại lịch trình</Label>
                <Select
                  value={formData.scheduleType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, scheduleType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Event">Sự kiện</SelectItem>
                    <SelectItem value="Meeting">Cuộc họp</SelectItem>
                    <SelectItem value="Training">Đào tạo</SelectItem>
                    <SelectItem value="Other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Ưu tiên</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">Cao</SelectItem>
                    <SelectItem value="Medium">Trung bình</SelectItem>
                    <SelectItem value="Low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reminderMinutes">Nhắc nhở (phút)</Label>
                <Input
                  id="reminderMinutes"
                  type="number"
                  value={formData.reminderMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reminderMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="60"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="isAllDay"
                  checked={formData.isAllDay}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isAllDay: checked as boolean })
                  }
                />
                <Label htmlFor="isAllDay">Cả ngày</Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Nhập ghi chú thêm"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={createDialog.close}>
              Hủy
            </Button>
            <Button
              onClick={handleCreateSchedule}
              disabled={loading || !formData.title || !formData.startDateTime || !formData.endDateTime}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tạo lịch trình
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={editDialog.isOpen} onOpenChange={editDialog.close}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa lịch trình</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin lịch trình của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Same form fields as create dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Tiêu đề *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề lịch trình"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-event">Sự kiện</Label>
                <Select
                  value={formData.eventId?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      eventId: value ? parseInt(value) : undefined,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn sự kiện (tùy chọn)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không có sự kiện</SelectItem>
                    {events.map((event) => (
                      <SelectItem
                        key={event.eventId}
                        value={event.eventId.toString()}
                      >
                        {event.eventName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Nhập mô tả lịch trình"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startDateTime">Thời gian bắt đầu *</Label>
                <Input
                  id="edit-startDateTime"
                  type="datetime-local"
                  value={formData.startDateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startDateTime: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endDateTime">Thời gian kết thúc *</Label>
                <Input
                  id="edit-endDateTime"
                  type="datetime-local"
                  value={formData.endDateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endDateTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Địa điểm</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Nhập địa điểm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-scheduleType">Loại lịch trình</Label>
                <Select
                  value={formData.scheduleType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, scheduleType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Event">Sự kiện</SelectItem>
                    <SelectItem value="Meeting">Cuộc họp</SelectItem>
                    <SelectItem value="Training">Đào tạo</SelectItem>
                    <SelectItem value="Other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Ưu tiên</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">Cao</SelectItem>
                    <SelectItem value="Medium">Trung bình</SelectItem>
                    <SelectItem value="Low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-reminderMinutes">Nhắc nhở (phút)</Label>
                <Input
                  id="edit-reminderMinutes"
                  type="number"
                  value={formData.reminderMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reminderMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="60"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="edit-isAllDay"
                  checked={formData.isAllDay}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isAllDay: checked as boolean })
                  }
                />
                <Label htmlFor="edit-isAllDay">Cả ngày</Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Ghi chú</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Nhập ghi chú thêm"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={editDialog.close}>
              Hủy
            </Button>
            <Button
              onClick={handleUpdateSchedule}
              disabled={loading || !formData.title || !formData.startDateTime || !formData.endDateTime}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Schedule Dialog */}
      <Dialog open={viewModal.isOpen} onOpenChange={viewModal.close}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch trình</DialogTitle>
          </DialogHeader>
          {viewModal.data && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tiêu đề
                  </Label>
                  <p className="mt-1">{viewModal.data.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Sự kiện
                  </Label>
                  <p className="mt-1">{viewModal.data.eventName || "N/A"}</p>
                </div>
              </div>

              {viewModal.data.description && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Mô tả
                  </Label>
                  <p className="mt-1">{viewModal.data.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Thời gian bắt đầu
                  </Label>
                  <p className="mt-1">
                    {formatDateTime(viewModal.data.startDateTime)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Thời gian kết thúc
                  </Label>
                  <p className="mt-1">
                    {formatDateTime(viewModal.data.endDateTime)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Địa điểm
                  </Label>
                  <p className="mt-1">{viewModal.data.location || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Loại lịch trình
                  </Label>
                  <p className="mt-1">{viewModal.data.scheduleType || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Trạng thái
                  </Label>
                  <div className="mt-1">{getStatusBadge(viewModal.data.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Ưu tiên
                  </Label>
                  <div className="mt-1">
                    {getPriorityBadge(viewModal.data.priority)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Cả ngày
                  </Label>
                  <p className="mt-1">{viewModal.data.isAllDay ? "Có" : "Không"}</p>
                </div>
              </div>

              {viewModal.data.notes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Ghi chú
                  </Label>
                  <p className="mt-1">{viewModal.data.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tạo lúc
                  </Label>
                  <p className="mt-1">
                    {viewModal.data.createdAt
                      ? formatDateTime(viewModal.data.createdAt)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Cập nhật lúc
                  </Label>
                  <p className="mt-1">
                    {viewModal.data.updatedAt
                      ? formatDateTime(viewModal.data.updatedAt)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={viewModal.close}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}