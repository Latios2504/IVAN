import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Loader2, Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import {
  volunteerScheduleService,
  type VolunteerScheduleDTO,
  type VolunteerScheduleFilterDTO,
} from "@/services/volunteerScheduleService";

export default function VolunteerSchedulePage() {
  // State management
  const [schedules, setSchedules] = useState<VolunteerScheduleDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // Filter states
  const [filters, setFilters] = useState<VolunteerScheduleFilterDTO>({
    page: 1,
    size: 20,
    sortBy: "StartDateTime",
    sortDirection: "desc",
  });

  // Load data on component mount and filter changes
  useEffect(() => {
    loadPersonalSchedules();
  }, [filters]);

  const loadPersonalSchedules = async () => {
    try {
      setLoading(true);
      const result = await volunteerScheduleService.getPersonalSchedules(
        filters
      );
      setSchedules(result.items);
      setTotalItems(result.totalCount);
    } catch (error) {
      console.error("Failed to load personal schedules:", error);
      toast.error("Không thể tải lịch trình cá nhân");
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("vi-VN");
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFilterChange = (
    key: keyof VolunteerScheduleFilterDTO,
    value: any
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const getUpcomingSchedules = () => {
    const now = new Date();
    return schedules.filter(
      (schedule) => new Date(schedule.startDateTime) > now
    ).length;
  };

  const getTodaySchedules = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.startDateTime);
      return scheduleDate >= today && scheduleDate < tomorrow;
    }).length;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lịch trình của tôi
          </h1>
          <p className="text-gray-600">
            Xem và quản lý lịch trình tình nguyện của bạn
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng lịch trình
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {getTodaySchedules()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp tới</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {getUpcomingSchedules()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {schedules.filter((s) => s.status === "Completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={filters.status || ""}
                onValueChange={(value) =>
                  handleFilterChange("status", value || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
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
                value={filters.scheduleType || ""}
                onValueChange={(value) =>
                  handleFilterChange("scheduleType", value || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả loại</SelectItem>
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
                value={filters.priority || ""}
                onValueChange={(value) =>
                  handleFilterChange("priority", value || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả mức độ</SelectItem>
                  <SelectItem value="High">Cao</SelectItem>
                  <SelectItem value="Medium">Trung bình</SelectItem>
                  <SelectItem value="Low">Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tiêu đề, mô tả..."
                  className="pl-10"
                  value={filters.search || ""}
                  onChange={(e) =>
                    handleFilterChange("search", e.target.value || undefined)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch trình của tôi</CardTitle>
          <CardDescription>Tổng cộng {totalItems} lịch trình</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">Đang tải...</span>
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
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Calendar className="h-12 w-12 text-muted-foreground/50" />
                        <p className="text-lg">Không có lịch trình nào</p>
                        <p className="text-sm">
                          Lịch trình của bạn sẽ hiển thị ở đây khi được tạo
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  schedules.map((schedule) => (
                    <TableRow key={schedule.scheduleId}>
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
                            <span className="text-sm">
                              {schedule.eventName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Không có sự kiện
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {formatDate(schedule.startDateTime)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(schedule.startDateTime)} -{" "}
                            {formatTime(schedule.endDateTime)}
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
                          <span className="text-muted-foreground text-sm">
                            Chưa xác định
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(schedule.status) as any}>
                          {schedule.status === "Scheduled" && "Đã lên lịch"}
                          {schedule.status === "InProgress" && "Đang thực hiện"}
                          {schedule.status === "Completed" && "Hoàn thành"}
                          {schedule.status === "Cancelled" && "Đã hủy"}
                          {![
                            "Scheduled",
                            "InProgress",
                            "Completed",
                            "Cancelled",
                          ].includes(schedule.status || "") &&
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
                        {schedule.notes ? (
                          <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {schedule.notes}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
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
    </div>
  );
}
