import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  User,
  MapPin,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { useModal, useModalWithData } from "@/hooks/useModal";
import { volunteerScheduleService } from "@/services/volunteerScheduleService";
import type {
  VolunteerScheduleDto,
  VolunteerScheduleFilterDto,
  VolunteerScheduleRequestDto,
  UpdateVolunteerScheduleStatusDto,
} from "@/types/volunteerSchedule";
import { eventsService } from "@/services/eventsService";
import type { EventDto } from "@/types/events";

interface VolunteerOption {
  volunteerId: number;
  firstName: string;
  lastName: string;
}

interface ScheduleFormData {
  volunteerId: number | null;
  eventId: number | null;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  scheduleType: string;
  priority: string;
  status: string;
  isAllDay: boolean;
  reminderMinutes: number;
  notes: string;
}

const initialFormData: ScheduleFormData = {
  volunteerId: null,
  eventId: null,
  title: "",
  description: "",
  startDateTime: "",
  endDateTime: "",
  location: "",
  scheduleType: "Event",
  priority: "Medium",
  status: "Scheduled",
  isAllDay: false,
  reminderMinutes: 60,
  notes: "",
};

export default function VolunteerScheduleManagementPage() {
  // State management
  const [schedules, setSchedules] = useState<VolunteerScheduleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [events, setEvents] = useState<EventDto[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<VolunteerScheduleFilterDto>({
    page: 1,
    size: 20,
    sortBy: "startDateTime",
    sortDirection: "asc",
  });

  // Modal states
  const createModal = useModal();
  const editModal = useModalWithData<VolunteerScheduleDto>();
  const deleteModal = useModalWithData<VolunteerScheduleDto>();

  // Form state
  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData);

  // Load data on component mount and filter changes
  useEffect(() => {
    loadSchedules();
  }, [filters]);

  useEffect(() => {
    loadOptionsData();
  }, []);

  // Reload options data when schedules change (after create/update/delete)
  const reloadOptionsData = () => {
    loadOptionsData();
  };

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const result =
        await volunteerScheduleService.getCoordinatorVolunteerSchedules(
          filters
        );
      setSchedules(result.items);
      setTotalItems(result.totalCount);
    } catch (error) {
      console.error("Failed to load schedules:", error);
      toast.error("Failed to load volunteer schedules");
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      setLoadingOptions(true);
      // Get all volunteer schedules to extract unique events
      const allSchedulesResult = await volunteerScheduleService.getCoordinatorVolunteerSchedules({
        page: 1,
        size: 1000, // Get a large number to capture all events
        sortBy: "startDateTime",
        sortDirection: "asc",
      });
      
      // Extract unique events from schedules
      const uniqueEventsMap = new Map<number, EventDto>();
      
      allSchedulesResult.items.forEach(schedule => {
        if (schedule.eventId && schedule.eventName && !uniqueEventsMap.has(schedule.eventId)) {
          uniqueEventsMap.set(schedule.eventId, {
            eventId: schedule.eventId,
            eventName: schedule.eventName,
            eventLocation: schedule.eventLocation || '',
            startDate: schedule.startDateTime,
            endDate: schedule.endDateTime,
            // Add other required EventDto fields with default values
            description: '',
            maxVolunteers: 0,
            currentVolunteers: 0,
            status: 'Active',
            createdAt: schedule.createdAt || new Date().toISOString(),
            updatedAt: schedule.updatedAt || new Date().toISOString()
          });
        }
      });
      
      // Convert map to array
      const uniqueEvents = Array.from(uniqueEventsMap.values());
      setEvents(uniqueEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
      // Fallback to empty array if loading fails
      setEvents([]);
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadVolunteers = async () => {
    try {
      // Get all volunteer schedules to extract unique volunteers
      const allSchedulesResult = await volunteerScheduleService.getCoordinatorVolunteerSchedules({
        page: 1,
        size: 1000, // Get a large number to capture all volunteers
        sortBy: "startDateTime",
        sortDirection: "asc",
      });
      
      // Extract unique volunteers from schedules
      const uniqueVolunteersMap = new Map<number, VolunteerOption>();
      
      allSchedulesResult.items.forEach(schedule => {
        if (!uniqueVolunteersMap.has(schedule.volunteerId)) {
          // Split volunteer name into first and last name
          const nameParts = schedule.volunteerName.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          uniqueVolunteersMap.set(schedule.volunteerId, {
            volunteerId: schedule.volunteerId,
            firstName: firstName,
            lastName: lastName
          });
        }
      });
      
      // Convert map to array
      const uniqueVolunteers = Array.from(uniqueVolunteersMap.values());
      setVolunteers(uniqueVolunteers);
    } catch (error) {
      console.error("Failed to load volunteers:", error);
      // Fallback to empty array if loading fails
      setVolunteers([]);
    }
  };

  // Load both events and volunteers from the same data source
  const loadOptionsData = async () => {
    try {
      setLoadingOptions(true);
      // Get all volunteer schedules to extract unique events and volunteers
      const allSchedulesResult = await volunteerScheduleService.getCoordinatorVolunteerSchedules({
        page: 1,
        size: 1000, // Get a large number to capture all data
        sortBy: "startDateTime",
        sortDirection: "asc",
      });
      
      // Extract unique events from schedules
      const uniqueEventsMap = new Map<number, EventDto>();
      const uniqueVolunteersMap = new Map<number, VolunteerOption>();
      
      allSchedulesResult.items.forEach(schedule => {
        // Extract events
        if (schedule.eventId && schedule.eventName && !uniqueEventsMap.has(schedule.eventId)) {
          uniqueEventsMap.set(schedule.eventId, {
            eventId: schedule.eventId,
            eventName: schedule.eventName,
            eventLocation: schedule.eventLocation || '',
            startDate: schedule.startDateTime,
            endDate: schedule.endDateTime,
            // Add other required EventDto fields with default values
            description: '',
            maxVolunteers: 0,
            currentVolunteers: 0,
            status: 'Active',
            createdAt: schedule.createdAt || new Date().toISOString(),
            updatedAt: schedule.updatedAt || new Date().toISOString()
          });
        }
        
        // Extract volunteers
        if (!uniqueVolunteersMap.has(schedule.volunteerId)) {
          // Split volunteer name into first and last name
          const nameParts = schedule.volunteerName.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          uniqueVolunteersMap.set(schedule.volunteerId, {
            volunteerId: schedule.volunteerId,
            firstName: firstName,
            lastName: lastName
          });
        }
      });
      
      // Convert maps to arrays
      const uniqueEvents = Array.from(uniqueEventsMap.values());
      const uniqueVolunteers = Array.from(uniqueVolunteersMap.values());
      
      console.log("=== LOAD OPTIONS DEBUG ===");
      console.log("Total schedules loaded:", allSchedulesResult.items.length);
      console.log("Unique volunteers found:", uniqueVolunteers.length);
      console.log("Volunteers data:", uniqueVolunteers);
      console.log("Unique events found:", uniqueEvents.length);
      console.log("Events data:", uniqueEvents);
      console.log("===========================");
      
      setEvents(uniqueEvents);
      setVolunteers(uniqueVolunteers);
    } catch (error) {
      console.error("Failed to load options data:", error);
      // Fallback to empty arrays if loading fails
      setEvents([]);
      setVolunteers([]);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleCreateSchedule = async () => {
    try {
      if (
        !formData.volunteerId ||
        !formData.title ||
        !formData.startDateTime ||
        !formData.endDateTime
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const request: VolunteerScheduleRequestDto = {
        volunteerId: formData.volunteerId,
        eventId: formData.eventId || undefined,
        title: formData.title,
        description: formData.description,
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime,
        location: formData.location,
        scheduleType: formData.scheduleType,
        priority: formData.priority,
        status: formData.status,
        isAllDay: formData.isAllDay,
        reminderMinutes: formData.reminderMinutes,
        notes: formData.notes,
      };

      console.log("=== CREATE SCHEDULE DEBUG ===");
      console.log("Form Data:", formData);
      console.log("Request Payload:", request);
      console.log("Available Volunteers:", volunteers);
      console.log("Selected Volunteer ID:", formData.volunteerId);
      console.log("Selected Volunteer:", volunteers.find(v => v.volunteerId === formData.volunteerId));
      console.log("==============================");

      await volunteerScheduleService.createVolunteerSchedule(request);
      toast.success("Volunteer schedule created successfully!");
      createModal.close();
      resetForm();
      loadSchedules();
      reloadOptionsData(); // Reload dropdown options
    } catch (error) {
      console.error("Failed to create schedule:", error);
      toast.error("Failed to create volunteer schedule");
    }
  };

  const handleEditSchedule = async () => {
    try {
      const schedule = editModal.data;
      if (
        !schedule ||
        !formData.volunteerId ||
        !formData.title ||
        !formData.startDateTime ||
        !formData.endDateTime
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const request: VolunteerScheduleRequestDto = {
        volunteerId: formData.volunteerId,
        eventId: formData.eventId || undefined,
        title: formData.title,
        description: formData.description,
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime,
        location: formData.location,
        scheduleType: formData.scheduleType,
        priority: formData.priority,
        status: formData.status,
        isAllDay: formData.isAllDay,
        reminderMinutes: formData.reminderMinutes,
        notes: formData.notes,
      };

      console.log("=== EDIT SCHEDULE DEBUG ===");
      console.log("Schedule ID:", schedule.scheduleId);
      console.log("Form Data:", formData);
      console.log("Request Payload:", request);
      console.log("Available Volunteers:", volunteers);
      console.log("Selected Volunteer ID:", formData.volunteerId);
      console.log("Selected Volunteer:", volunteers.find(v => v.volunteerId === formData.volunteerId));
      console.log("=============================");

      await volunteerScheduleService.updateVolunteerSchedule(
        schedule.scheduleId,
        request
      );
      toast.success("Volunteer schedule updated successfully!");
      editModal.close();
      resetForm();
      loadSchedules();
      reloadOptionsData(); // Reload dropdown options
    } catch (error) {
      console.error("Failed to update schedule:", error);
      toast.error("Failed to update volunteer schedule");
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      const schedule = deleteModal.data;
      if (!schedule) return;

      await volunteerScheduleService.deleteVolunteerSchedule(
        schedule.scheduleId
      );
      toast.success("Volunteer schedule deleted successfully!");
      deleteModal.close();
      loadSchedules();
      reloadOptionsData(); // Reload dropdown options
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      toast.error("Failed to delete volunteer schedule");
    }
  };

  // Status update handler
  const handleUpdateStatus = async (scheduleId: number, status: string) => {
    try {
      const updateData: UpdateVolunteerScheduleStatusDto = { status };
      await volunteerScheduleService.updateVolunteerScheduleStatus(
        scheduleId,
        updateData
      );
      toast.success("Cập nhật trạng thái thành công");
      loadSchedules(); // Refresh the list
    } catch (error) {
      console.error("Error updating status:", error);
      if (error instanceof Error) {
        toast.error(`Không thể cập nhật trạng thái: ${error.message}`);
      } else {
        toast.error("Không thể cập nhật trạng thái");
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const openEditModal = (schedule: VolunteerScheduleDto) => {
    setFormData({
      volunteerId: schedule.volunteerId,
      eventId: schedule.eventId || null,
      title: schedule.title,
      description: schedule.description || "",
      startDateTime: schedule.startDateTime.slice(0, 16), // Format for datetime-local input
      endDateTime: schedule.endDateTime.slice(0, 16),
      location: schedule.location || "",
      scheduleType: schedule.scheduleType || "Event",
      priority: schedule.priority || "Medium",
      status: schedule.status || "Scheduled",
      isAllDay: schedule.isAllDay || false,
      reminderMinutes: schedule.reminderMinutes || 60,
      notes: schedule.notes || "",
    });
    editModal.openWith(schedule);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Scheduled":
        return "blue";
      case "InProgress":
        return "yellow";
      case "Completed":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "yellow";
      case "Low":
        return "green";
      default:
        return "gray";
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("vi-VN");
  };

  const handleFilterChange = (
    key: keyof VolunteerScheduleFilterDto,
    value: any
  ) => {
    setFilters((prev: VolunteerScheduleFilterDto) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev: VolunteerScheduleFilterDto) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400">
            Quản lý lịch trình tình nguyện viên
          </h1>
          <p className="text-gray-600 dark:text-gray-300 bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-400">
            Phân công và quản lý lịch trình làm việc của tình nguyện viên
          </p>
        </div>
        <Button onClick={createModal.open}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo lịch trình
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-gradient-to-r border-blue-200/50 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 dark:border-blue-800/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-t-lg border-b border-blue-100 dark:border-blue-800/50">
          <CardTitle className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-300">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent className="bg-gradient-to-br from-white/80 to-blue-50/50 dark:from-gray-900/80 dark:to-blue-950/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Sự kiện</Label>
              <Select
                value={filters.eventId?.toString() || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "eventId",
                    value === "all"
                      ? undefined
                      : value
                      ? parseInt(value)
                      : undefined
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả sự kiện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả sự kiện</SelectItem>
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

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "status",
                    value === "all" ? undefined : value || undefined
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Scheduled">Đã lên lịch</SelectItem>
                  <SelectItem value="InProgress">Đang thực hiện</SelectItem>
                  <SelectItem value="Completed">Hoàn thành</SelectItem>
                  <SelectItem value="Cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Loại lịch trình</Label>
              <Select
                value={filters.scheduleType || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "scheduleType",
                    value === "all" ? undefined : value || undefined
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="Event">Sự kiện</SelectItem>
                  <SelectItem value="Training">Đào tạo</SelectItem>
                  <SelectItem value="Meeting">Họp</SelectItem>
                  <SelectItem value="Task">Nhiệm vụ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <Input
                placeholder="Tìm theo tên, tình nguyện viên..."
                value={filters.search || ""}
                onChange={(e) =>
                  handleFilterChange("search", e.target.value || undefined)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedules Table */}
      <Card className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-gradient-to-r border-blue-200/50 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 dark:border-blue-800/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-t-lg border-b border-blue-100 dark:border-blue-800/50">
          <CardTitle className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-300">Danh sách lịch trình</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">Tổng cộng {totalItems} lịch trình</CardDescription>
        </CardHeader>
        <CardContent className="bg-gradient-to-br from-white/80 to-blue-50/50 dark:from-gray-900/80 dark:to-blue-950/50">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tình nguyện viên</TableHead>
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
                {schedules.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Không có lịch trình nào
                    </TableCell>
                  </TableRow>
                ) : (
                  schedules.map((schedule) => (
                    <TableRow key={schedule.scheduleId} className="bg-gradient-to-r from-white via-blue-50/20 to-purple-50/20 hover:from-blue-50/40 hover:via-purple-50/30 hover:to-indigo-50/40 dark:from-gray-900/50 dark:via-blue-950/20 dark:to-purple-950/20 dark:hover:from-blue-950/40 dark:hover:via-purple-950/30 dark:hover:to-indigo-950/40 transition-all duration-300 border-b border-blue-100/50 dark:border-blue-800/30">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {schedule.volunteerName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {schedule.volunteerEmail}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{schedule.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {schedule.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {schedule.eventName ? (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{schedule.eventName}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm">
                              {formatDateTime(schedule.startDateTime)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              đến {formatDateTime(schedule.endDateTime)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {schedule.location ? (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{schedule.location}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(schedule.status) as any}>
                          {schedule.status === "Draft" && "Nháp"}
                          {schedule.status === "Scheduled" && "Đã lên lịch"}
                          {schedule.status === "In Progress" && "Đang thực hiện"}
                          {schedule.status === "Completed" && "Hoàn thành"}
                          {schedule.status === "Cancelled" && "Đã hủy"}
                          {schedule.status === "No Show" && "Vắng mặt"}
                          {schedule.status === "Checked In" && "Đã check-in"}
                          {!["Draft", "Scheduled", "In Progress", "Completed", "Cancelled", "No Show", "Checked In"].includes(
                            schedule.status || ""
                          ) &&
                            (schedule.status || "Không xác định")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getPriorityColor(schedule.priority) as any}
                        >
                          {schedule.priority === "High" && "Cao"}
                          {schedule.priority === "Medium" && "Trung bình"}
                          {schedule.priority === "Low" && "Thấp"}
                          {!["High", "Medium", "Low"].includes(
                            schedule.priority || ""
                          ) &&
                            (schedule.priority || "Không xác định")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {/* Status transition buttons based on current status */}
                          {schedule.status === "Scheduled" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(schedule.scheduleId, "Checked In")}
                                className="text-xs px-2 py-1 h-7"
                              >
                                Check-in
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(schedule.scheduleId, "Cancelled")}
                                className="text-xs px-2 py-1 h-7"
                              >
                                Hủy
                              </Button>
                            </>
                          )}
                          {schedule.status === "Checked In" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(schedule.scheduleId, "In Progress")}
                                className="text-xs px-2 py-1 h-7"
                              >
                                Bắt đầu
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(schedule.scheduleId, "No Show")}
                                className="text-xs px-2 py-1 h-7"
                              >
                                Vắng mặt
                              </Button>
                            </>
                          )}
                          {schedule.status === "In Progress" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(schedule.scheduleId, "Completed")}
                              className="text-xs px-2 py-1 h-7"
                            >
                              Hoàn thành
                            </Button>
                          )}
                          
                          {/* Always show edit and delete buttons */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(schedule)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteModal.openWith(schedule)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalItems > (filters.size || 20) && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === 1}
              onClick={() => handlePageChange((filters.page || 1) - 1)}
            >
              Trước
            </Button>
            <span className="text-sm text-muted-foreground">
              Trang {filters.page} /{" "}
              {Math.ceil(totalItems / (filters.size || 20))}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={
                filters.page === Math.ceil(totalItems / (filters.size || 20))
              }
              onClick={() => handlePageChange((filters.page || 1) + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Create Schedule Modal */}
      <Dialog open={createModal.isOpen} onOpenChange={createModal.close}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
          <DialogHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-t-lg p-6 -m-6 mb-4">
            <DialogTitle className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-300">Tạo lịch trình mới</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Tạo lịch trình mới cho tình nguyện viên
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tình nguyện viên *</Label>
              <Select
                value={formData.volunteerId?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, volunteerId: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tình nguyện viên" />
                </SelectTrigger>
                <SelectContent>
                  {loadingOptions ? (
                    <SelectItem value="loading" disabled>
                      Đang tải danh sách tình nguyện viên...
                    </SelectItem>
                  ) : volunteers.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Không có tình nguyện viên nào
                    </SelectItem>
                  ) : (
                    volunteers.map((volunteer) => (
                      <SelectItem
                        key={volunteer.volunteerId}
                        value={volunteer.volunteerId.toString()}
                      >
                        {volunteer.firstName} {volunteer.lastName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sự kiện</Label>
              <Select
                value={formData.eventId?.toString() || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    eventId: value === "none" ? null : value ? parseInt(value) : null,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn sự kiện (tùy chọn)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không chọn sự kiện</SelectItem>
                  {loadingOptions ? (
                    <SelectItem value="loading" disabled>
                      Đang tải danh sách sự kiện...
                    </SelectItem>
                  ) : events.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Không có sự kiện nào
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

            <div className="md:col-span-2 space-y-2">
              <Label>Tiêu đề *</Label>
              <Input
                placeholder="Nhập tiêu đề lịch trình"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                placeholder="Mô tả chi tiết về lịch trình"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Thời gian bắt đầu *</Label>
              <Input
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) =>
                  setFormData({ ...formData, startDateTime: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Thời gian kết thúc *</Label>
              <Input
                type="datetime-local"
                value={formData.endDateTime}
                onChange={(e) =>
                  setFormData({ ...formData, endDateTime: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Địa điểm</Label>
              <Input
                placeholder="Địa điểm thực hiện"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Loại lịch trình</Label>
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
                  <SelectItem value="Training">Đào tạo</SelectItem>
                  <SelectItem value="Meeting">Họp</SelectItem>
                  <SelectItem value="Task">Nhiệm vụ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mức độ ưu tiên</Label>
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

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Đã lên lịch</SelectItem>
                  <SelectItem value="InProgress">Đang thực hiện</SelectItem>
                  <SelectItem value="Completed">Hoàn thành</SelectItem>
                  <SelectItem value="Cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nhắc nhở (phút)</Label>
              <Input
                type="number"
                min="0"
                value={formData.reminderMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reminderMinutes: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                placeholder="Ghi chú thêm về lịch trình"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={createModal.close}>
              Hủy
            </Button>
            <Button onClick={handleCreateSchedule}>Tạo lịch trình</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Modal */}
      <Dialog open={editModal.isOpen} onOpenChange={editModal.close}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
          <DialogHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-t-lg p-6 -m-6 mb-4">
            <DialogTitle className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-300">Chỉnh sửa lịch trình</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Cập nhật thông tin lịch trình tình nguyện viên
            </DialogDescription>
          </DialogHeader>

          {/* Same form structure as create modal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tình nguyện viên *</Label>
              <Select
                value={formData.volunteerId?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, volunteerId: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tình nguyện viên" />
                </SelectTrigger>
                <SelectContent>
                  {loadingOptions ? (
                    <SelectItem value="loading" disabled>
                      Đang tải danh sách tình nguyện viên...
                    </SelectItem>
                  ) : volunteers.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Không có tình nguyện viên nào
                    </SelectItem>
                  ) : (
                    volunteers.map((volunteer) => (
                      <SelectItem
                        key={volunteer.volunteerId}
                        value={volunteer.volunteerId.toString()}
                      >
                        {volunteer.firstName} {volunteer.lastName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sự kiện</Label>
              <Select
                value={formData.eventId?.toString() || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    eventId: value === "none" ? null : value ? parseInt(value) : null,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn sự kiện (tùy chọn)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không chọn sự kiện</SelectItem>
                  {loadingOptions ? (
                    <SelectItem value="loading" disabled>
                      Đang tải danh sách sự kiện...
                    </SelectItem>
                  ) : events.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Không có sự kiện nào
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

            <div className="md:col-span-2 space-y-2">
              <Label>Tiêu đề *</Label>
              <Input
                placeholder="Nhập tiêu đề lịch trình"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                placeholder="Mô tả chi tiết về lịch trình"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Thời gian bắt đầu *</Label>
              <Input
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) =>
                  setFormData({ ...formData, startDateTime: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Thời gian kết thúc *</Label>
              <Input
                type="datetime-local"
                value={formData.endDateTime}
                onChange={(e) =>
                  setFormData({ ...formData, endDateTime: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Địa điểm</Label>
              <Input
                placeholder="Địa điểm thực hiện"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Loại lịch trình</Label>
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
                  <SelectItem value="Training">Đào tạo</SelectItem>
                  <SelectItem value="Meeting">Họp</SelectItem>
                  <SelectItem value="Task">Nhiệm vụ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mức độ ưu tiên</Label>
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

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Đã lên lịch</SelectItem>
                  <SelectItem value="InProgress">Đang thực hiện</SelectItem>
                  <SelectItem value="Completed">Hoàn thành</SelectItem>
                  <SelectItem value="Cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nhắc nhở (phút)</Label>
              <Input
                type="number"
                min="0"
                value={formData.reminderMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reminderMinutes: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                placeholder="Ghi chú thêm về lịch trình"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={editModal.close}>
              Hủy
            </Button>
            <Button onClick={handleEditSchedule}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.isOpen} onOpenChange={deleteModal.close}>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
          <DialogHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 rounded-t-lg p-6 -m-6 mb-4">
            <DialogTitle className="bg-gradient-to-r from-red-700 to-orange-700 bg-clip-text text-transparent dark:from-red-300 dark:to-orange-300">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Bạn có chắc chắn muốn xóa lịch trình "{deleteModal.data?.title}"?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={deleteModal.close}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteSchedule}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
