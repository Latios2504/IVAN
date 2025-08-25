import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { coordinatorScheduleService } from "@/services/coordinatorScheduleService";
import type {
  CoordinatorScheduleDto,
  CoordinatorScheduleFilterDto,
} from "@/types/coordinatorSchedule";
import { eventsService } from "@/services/eventsService";
import { volunteerCoordinatorService } from "@/services/volunteerCoordinatorService";
import type { EventDto } from "@/types/events";
import type { VolunteerCoordinatorDto } from "@/types/volunteerCoordinator";
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import AddScheduleModal from "@/components/organization/coordinator-schedule-management/AddScheduleModal";
import EditScheduleModal from "@/components/organization/coordinator-schedule-management/EditScheduleModal";
import ViewScheduleModal from "@/components/organization/coordinator-schedule-management/ViewScheduleModal";



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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<CoordinatorScheduleDto | null>(null);



  // Load schedules from API
  const loadSchedules = async () => {
    try {
      setLoading(true);
      const filters: CoordinatorScheduleFilterDto = {
        pageNumber: currentPage,
        pageSize: pageSize,
        search: searchTerm || undefined,
        status: selectedTab !== "all" ? selectedTab : undefined,
      };

      const result = await coordinatorScheduleService.listSchedules(
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

  const getStatusBadge = (status?: string | null) => {
    switch (status) {
      case "Scheduled":
        return (
          <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
            <Calendar className="h-3 w-3 mr-1" />
            Đã lên lịch
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/50 dark:to-amber-900/50 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Đang thực hiện
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Hoàn thành
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-900/50 dark:to-slate-900/50 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Không xác định
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority?: string | null) => {
    switch (priority) {
      case "High":
        return <Badge className="bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700">Cao</Badge>;
      case "Medium":
        return <Badge className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/50 dark:to-amber-900/50 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700">Trung bình</Badge>;
      case "Low":
        return <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700">Thấp</Badge>;
      default:
        return <Badge className="bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-900/50 dark:to-slate-900/50 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700">Không xác định</Badge>;
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

  // Modal handlers
  const handleAddSchedule = () => {
    setIsAddModalOpen(true);
  };

  const handleEditSchedule = (schedule: CoordinatorScheduleDto) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleViewSchedule = (schedule: CoordinatorScheduleDto) => {
    setSelectedSchedule(schedule);
    setIsViewModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadSchedules(); // Refresh the list
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedSchedule(null);
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
    <div className="space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 min-h-screen p-6 rounded-lg">
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/50 dark:via-purple-900/50 dark:to-pink-900/50 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100">
            Quản lý lịch trình Điều phối viên
          </h1>
          <p className="text-indigo-600 dark:text-indigo-400">
            Tạo và quản lý lịch trình cho các điều phối viên tình nguyện
          </p>
        </div>
        <Button onClick={handleAddSchedule} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="h-4 w-4" />
          Tạo lịch trình mới
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
        <div className="flex gap-4">
          <div className="relative">
            <Input
              placeholder="Tìm kiếm lịch trình..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-white dark:bg-slate-800 border-cyan-300 dark:border-cyan-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500 dark:focus:ring-cyan-400"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50">
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
        <TabsList className="bg-gradient-to-r from-purple-100 via-violet-100 to-indigo-100 dark:from-purple-900/50 dark:via-violet-900/50 dark:to-indigo-900/50 border border-purple-200 dark:border-purple-800 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-200 data-[state=active]:to-gray-200 dark:data-[state=active]:from-slate-700 dark:data-[state=active]:to-gray-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">Tất cả</TabsTrigger>
          <TabsTrigger value="Scheduled" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-200 data-[state=active]:to-indigo-200 dark:data-[state=active]:from-blue-800 dark:data-[state=active]:to-indigo-800 data-[state=active]:text-blue-900 dark:data-[state=active]:text-blue-100">Đã lên lịch</TabsTrigger>
          <TabsTrigger value="In Progress" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-200 data-[state=active]:to-amber-200 dark:data-[state=active]:from-yellow-800 dark:data-[state=active]:to-amber-800 data-[state=active]:text-yellow-900 dark:data-[state=active]:text-yellow-100">Đang thực hiện</TabsTrigger>
          <TabsTrigger value="Completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-200 data-[state=active]:to-emerald-200 dark:data-[state=active]:from-green-800 dark:data-[state=active]:to-emerald-800 data-[state=active]:text-green-900 dark:data-[state=active]:text-green-100">Hoàn thành</TabsTrigger>
          <TabsTrigger value="Cancelled" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-200 data-[state=active]:to-rose-200 dark:data-[state=active]:from-red-800 dark:data-[state=active]:to-rose-800 data-[state=active]:text-red-900 dark:data-[state=active]:text-red-100">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900/50 dark:via-gray-900/50 dark:to-zinc-900/50 border border-slate-200 dark:border-slate-700 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-slate-900 dark:text-slate-100">Danh sách lịch trình</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Tổng cộng {totalCount} lịch trình
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                  <span className="ml-3 text-blue-700 dark:text-blue-300">Đang tải...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 border-b border-slate-200 dark:border-slate-700">
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Tiêu đề</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Điều phối viên</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Sự kiện</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Thời gian</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Địa điểm</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Trạng thái</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Ưu tiên</TableHead>
                      <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedules.map((schedule) => (
                      <TableRow key={schedule.scheduleId} className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 dark:hover:from-slate-900/30 dark:hover:to-gray-900/30 border-b border-slate-200 dark:border-slate-700">
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                          {schedule.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-2 py-1 rounded border border-blue-200/50 dark:border-blue-800/50">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-blue-700 dark:text-blue-300">{schedule.coordinatorName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{schedule.eventName || "N/A"}</TableCell>
                        <TableCell>
                          <div className="text-sm bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 px-2 py-1 rounded border border-purple-200/50 dark:border-purple-800/50">
                            <div className="text-purple-700 dark:text-purple-300">{formatDateTime(schedule.startDateTime)}</div>
                            <div className="text-purple-600 dark:text-purple-400 text-xs">
                              đến {formatDateTime(schedule.endDateTime)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 px-2 py-1 rounded border border-green-200/50 dark:border-green-800/50">
                            <MapPin className="h-3 w-3 text-green-600 dark:text-green-400" />
                            <span className="text-green-700 dark:text-green-300">{schedule.location || "N/A"}</span>
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
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditSchedule(schedule)}
                              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-950/30 dark:hover:to-emerald-950/30 border border-transparent hover:border-green-200 dark:hover:border-green-800 transition-all duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteSchedule(schedule.scheduleId)
                              }
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-950/30 dark:hover:to-rose-950/30 border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all duration-200"
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

      {/* Modals */}
      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
        onSuccess={handleModalSuccess}
      />
      
      <EditScheduleModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSuccess={handleModalSuccess}
        schedule={selectedSchedule}
      />
      
      <ViewScheduleModal
        isOpen={isViewModalOpen}
        onClose={handleCloseModals}
        schedule={selectedSchedule}
      />
    </div>
  );
}
