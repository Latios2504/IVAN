import { useState, useEffect } from "react";
import { useModal, useModalWithData } from "@/hooks/useModal";
import { useAuth } from "@/hooks/useAuth";
import {
  coordinatorScheduleService,
  type CoordinatorScheduleDto,
  type CoordinatorScheduleFilterDto,
} from "@/services/coordinatorScheduleService";
import { eventService } from "@/services/eventService";
import { volunteerCoordinatorService } from "@/services/volunteerCoordinatorService";
import type { EventDto } from "@/types/event";
import type { VolunteerCoordinatorDto } from "@/types/volunteer-coordinator";
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
  Loader2,
} from "lucide-react";

interface ScheduleFormData {
  coordinatorId: number;
  eventId?: number;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  scheduleType: "Meeting" | "Event" | "Training" | "Other";
  priority: "Low" | "Medium" | "High";
  isAllDay: boolean;
  reminderMinutes: number;
  notes?: string;
}

export default function CoordinatorSchedulePage() {
  // Auth hook
  const { user } = useAuth();

  // State management
  const [schedules, setSchedules] = useState<CoordinatorScheduleDto[]>([]);
  const [coordinators, setCoordinators] = useState<VolunteerCoordinatorDto[]>(
    []
  );
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [coordinatorsLoading, setCoordinatorsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  // Modal hooks for managing dialog states
  const createDialog = useModal();
  const viewModal = useModalWithData<CoordinatorScheduleDto>();

  const [formData, setFormData] = useState<ScheduleFormData>({
    coordinatorId: 0,
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

  // Load schedules from API
  const loadSchedules = async () => {
    try {
      setLoading(true);
      const filters: CoordinatorScheduleFilterDto = {
        page: currentPage,
        size: pageSize,
        search: searchTerm || undefined,
        status: selectedTab !== "all" ? selectedTab : undefined,
      };

      const result = await coordinatorScheduleService.getOrganizationSchedules(
        filters
      );
      setSchedules(result.items);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error("Error loading schedules:", error);
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  // Load coordinators for dropdown
  const loadCoordinators = async () => {
    try {
      setCoordinatorsLoading(true);
      // Use user from useAuth hook instead of making API call
      if (!user?.organizationId) {
        console.warn("No organization ID found for user");
        return;
      }

      const result =
        await volunteerCoordinatorService.getOrganizationCoordinators(
          { page: 1, size: 100 }, // Get all coordinators for dropdown
          user.organizationId
        );
      setCoordinators(result.items);
    } catch (error) {
      console.error("Error loading coordinators:", error);
      toast.error("Failed to load coordinators");
    } finally {
      setCoordinatorsLoading(false);
    }
  };

  // Load events for dropdown
  const loadEvents = async () => {
    try {
      setEventsLoading(true);
      const result = await eventService.getOrganizationEvents({
        page: 1,
        size: 100,
        sortBy: "eventName",
        sortDirection: "asc",
      });
      setEvents(result.items);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Failed to load events");
    } finally {
      setEventsLoading(false);
    }
  };

  // Load schedules on component mount and when filters change
  useEffect(() => {
    loadSchedules();
  }, [currentPage, searchTerm, selectedTab]);

  // Load coordinators and events on component mount
  useEffect(() => {
    loadCoordinators();
    loadEvents();
  }, []);

  const getStatusBadge = (status?: string) => {
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

  const getPriorityBadge = (priority?: string) => {
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
    try {
      setLoading(true);
      const scheduleData = {
        coordinatorId: formData.coordinatorId,
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
      toast.success("Schedule created successfully");
      createDialog.close();
      loadSchedules(); // Refresh the list

      // Reset form
      setFormData({
        coordinatorId: 0,
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
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      setLoading(true);
      await coordinatorScheduleService.deleteSchedule(scheduleId);
      toast.success("Schedule deleted successfully");
      loadSchedules(); // Refresh the list
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Failed to delete schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleViewSchedule = (schedule: CoordinatorScheduleDto) => {
    viewModal.openWith(schedule);
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      !searchTerm ||
      schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.coordinatorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      schedule.eventName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = selectedTab === "all" || schedule.status === selectedTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý lịch trình Điều phối viên
          </h1>
          <p className="text-muted-foreground">
            Tạo và quản lý lịch trình cho các điều phối viên tình nguyện
          </p>
        </div>
        <Button onClick={createDialog.open} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tạo lịch trình mới
        </Button>
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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
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
              <CardTitle>Danh sách lịch trình</CardTitle>
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
                      <TableHead>Điều phối viên</TableHead>
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
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {schedule.coordinatorName}
                          </div>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo lịch trình mới</DialogTitle>
            <DialogDescription>
              Tạo lịch trình mới cho điều phối viên
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Tiêu đề</Label>
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
              <Label htmlFor="coordinator">Điều phối viên</Label>
              <Select
                value={formData.coordinatorId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, coordinatorId: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn điều phối viên" />
                </SelectTrigger>
                <SelectContent>
                  {coordinatorsLoading ? (
                    <SelectItem value="" disabled>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Đang tải...
                    </SelectItem>
                  ) : (
                    coordinators.map((coordinator) => (
                      <SelectItem
                        key={coordinator.coordinatorId}
                        value={coordinator.coordinatorId.toString()}
                      >
                        {coordinator.fullName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event">Sự kiện (tùy chọn)</Label>
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
                  <SelectValue placeholder="Chọn sự kiện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Không có sự kiện</SelectItem>
                  {eventsLoading ? (
                    <SelectItem value="" disabled>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Đang tải...
                    </SelectItem>
                  ) : (
                    events.map((event) => (
                      <SelectItem
                        key={event.eventId}
                        value={event.eventId.toString()}
                      >
                        {event.eventName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="startDateTime">Thời gian bắt đầu</Label>
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
                <Label htmlFor="endDateTime">Thời gian kết thúc</Label>
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
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="scheduleType">Loại lịch trình</Label>
                <Select
                  value={formData.scheduleType}
                  onValueChange={(
                    value: "Meeting" | "Event" | "Training" | "Other"
                  ) => setFormData({ ...formData, scheduleType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Meeting">Họp</SelectItem>
                    <SelectItem value="Event">Sự kiện</SelectItem>
                    <SelectItem value="Training">Đào tạo</SelectItem>
                    <SelectItem value="Other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Mức độ ưu tiên</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "Low" | "Medium" | "High") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Thấp</SelectItem>
                    <SelectItem value="Medium">Trung bình</SelectItem>
                    <SelectItem value="High">Cao</SelectItem>
                  </SelectContent>
                </Select>
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
                placeholder="Nhập ghi chú"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={createDialog.close}>
              Hủy
            </Button>
            <Button onClick={handleCreateSchedule} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Tạo lịch trình
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Schedule Dialog */}
      <Dialog open={viewModal.isOpen} onOpenChange={viewModal.close}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch trình</DialogTitle>
          </DialogHeader>
          {viewModal.data && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Tiêu đề</Label>
                <div className="font-medium">{viewModal.data.title}</div>
              </div>
              <div className="grid gap-2">
                <Label>Điều phối viên</Label>
                <div>{viewModal.data.coordinatorName}</div>
              </div>
              <div className="grid gap-2">
                <Label>Sự kiện</Label>
                <div>{viewModal.data.eventName || "Không có"}</div>
              </div>
              <div className="grid gap-2">
                <Label>Thời gian</Label>
                <div>
                  {formatDateTime(viewModal.data.startDateTime)} -{" "}
                  {formatDateTime(viewModal.data.endDateTime)}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Địa điểm</Label>
                <div>{viewModal.data.location || "Không có"}</div>
              </div>
              <div className="grid gap-2">
                <Label>Trạng thái</Label>
                <div>{getStatusBadge(viewModal.data.status)}</div>
              </div>
              <div className="grid gap-2">
                <Label>Ưu tiên</Label>
                <div>{getPriorityBadge(viewModal.data.priority)}</div>
              </div>
              {viewModal.data.notes && (
                <div className="grid gap-2">
                  <Label>Ghi chú</Label>
                  <div className="text-sm text-muted-foreground">
                    {viewModal.data.notes}
                  </div>
                </div>
              )}
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
