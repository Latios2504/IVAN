import { useState, useEffect } from "react";
import { useModal, useModalWithData } from "@/hooks/useModal";
import { useAuth } from "@/hooks/useAuth";
import { coordinatorScheduleService } from "@/services/coordinatorScheduleService";
import { eventsService } from "@/services/eventsService";
import type {
  CoordinatorScheduleDto,
  CoordinatorScheduleFilterDto,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
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
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Eye,
  CalendarDays,
  Loader2,
  RefreshCw,
  LogIn,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const viewModal = useModalWithData<CoordinatorScheduleDto>();

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
      case "Checked In":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <LogIn className="h-3 w-3 mr-1" />
            Đã check-in
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
      case "No Show":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Vắng mặt
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

  const handleViewSchedule = (schedule: CoordinatorScheduleDto) => {
    viewModal.openWith(schedule);
  };

  // Handle check-in/check-out actions
  const handleCheckIn = async (schedule: CoordinatorScheduleDto) => {
    try {
      await coordinatorScheduleService.updateScheduleStatus(schedule.scheduleId, {
        status: "Checked In"
      });
      toast.success("Check-in thành công!");
      loadPersonalSchedules(); // Reload to get updated status
    } catch (error) {
      console.error("Error checking in:", error);
      toast.error("Không thể check-in. Vui lòng thử lại.");
    }
  };

  const handleCheckOut = async (schedule: CoordinatorScheduleDto) => {
    try {
      await coordinatorScheduleService.updateScheduleStatus(schedule.scheduleId, {
        status: "Completed"
      });
      toast.success("Check-out thành công!");
      loadPersonalSchedules(); // Reload to get updated status
    } catch (error) {
      console.error("Error checking out:", error);
      toast.error("Không thể check-out. Vui lòng thử lại.");
    }
  };

  // Check if schedule can be checked in (must be Scheduled and within time range)
  const canCheckIn = (schedule: CoordinatorScheduleDto) => {
    if (schedule.status !== "Scheduled") return false;
    
    const now = new Date();
    const startTime = new Date(schedule.startDateTime);
    const endTime = new Date(schedule.endDateTime);
    
    // Allow check-in 30 minutes before start time and until end time
    const checkInWindow = new Date(startTime.getTime() - 30 * 60 * 1000);
    
    return now >= checkInWindow && now <= endTime;
  };

  // Check if schedule can be checked out (must be Checked In)
  const canCheckOut = (schedule: CoordinatorScheduleDto) => {
    return schedule.status === "Checked In";
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
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800/30">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lịch trình cá nhân
            </h1>
            <p className="text-indigo-600 dark:text-indigo-300 mt-2">
              Xem lịch trình cá nhân được tổ chức giao cho bạn
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setViewMode(viewMode === "list" ? "calendar" : "list")
              }
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-200 dark:border-indigo-800/50 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 text-indigo-700 dark:text-indigo-300"
            >
              <CalendarDays className="h-4 w-4" />
              {viewMode === "list" ? "Xem lịch" : "Xem danh sách"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Input
              placeholder="Tìm kiếm lịch trình..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-gradient-to-r from-white to-indigo-50/50 dark:from-gray-900 dark:to-indigo-950/30 border-indigo-200 dark:border-indigo-800/50 focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-indigo-200 dark:focus:ring-indigo-800/30"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadPersonalSchedules}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-200 dark:border-indigo-800/50 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 text-indigo-700 dark:text-indigo-300"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200 dark:border-indigo-800/50">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 text-indigo-700 dark:text-indigo-300"
          >
            Tất cả
          </TabsTrigger>
          <TabsTrigger
            value="Scheduled"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 text-indigo-700 dark:text-indigo-300"
          >
            Đã lên lịch
          </TabsTrigger>
          <TabsTrigger
            value="Checked In"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 text-indigo-700 dark:text-indigo-300"
          >
            Đã check-in
          </TabsTrigger>
          <TabsTrigger
            value="Completed"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 text-indigo-700 dark:text-indigo-300"
          >
            Hoàn thành
          </TabsTrigger>
          <TabsTrigger
            value="Cancelled"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 text-indigo-700 dark:text-indigo-300"
          >
            Đã hủy
          </TabsTrigger>
          <TabsTrigger
            value="No Show"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 text-indigo-700 dark:text-indigo-300"
          >
            Vắng mặt
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800/50">
            <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 border-b border-indigo-100 dark:border-indigo-800/30">
              <CardTitle className="text-indigo-900 dark:text-indigo-100">
                Lịch trình cá nhân
              </CardTitle>
              <CardDescription className="text-indigo-600 dark:text-indigo-300">
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
                            {canCheckIn(schedule) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCheckIn(schedule)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <LogIn className="h-4 w-4" />
                              </Button>
                            )}
                            {canCheckOut(schedule) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCheckOut(schedule)}
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                              >
                                <LogOut className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewSchedule(schedule)}
                            >
                              <Eye className="h-4 w-4" />
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

      {/* Note: Coordinators can only view schedules assigned by organization */}
      {/* Create/Edit functionality is not available for coordinators */}

      {/* View Schedule Dialog */}
      <Dialog open={viewModal.isOpen} onOpenChange={viewModal.close}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800/50">
          <DialogHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-t-lg p-6 -m-6 mb-4 border-b border-indigo-100 dark:border-indigo-800/30">
            <DialogTitle className="text-indigo-900 dark:text-indigo-100">
              Chi tiết lịch trình
            </DialogTitle>
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
                  <div className="mt-1">
                    {getStatusBadge(viewModal.data.status)}
                  </div>
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
                  <p className="mt-1">
                    {viewModal.data.isAllDay ? "Có" : "Không"}
                  </p>
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
          <DialogFooter className="bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-b-lg p-6 -m-6 mt-4 border-t border-indigo-100 dark:border-indigo-800/30">
            <Button
              variant="outline"
              onClick={viewModal.close}
              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
