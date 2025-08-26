import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Save, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type {
  CoordinatorTaskDto,
  CreateCoordinatorTaskDto,
  UpdateCoordinatorTaskDto,
} from "@/types/coordinatorTask";
import { TASK_STATUS, TASK_PRIORITY } from "@/types/coordinatorTask";
import type { VolunteerCoordinatorDto } from "@/types/volunteerCoordinator";
import type { EventDto } from "@/types/events";
import { volunteerCoordinatorService } from "@/services/volunteerCoordinatorService";
import { eventsService } from "@/services/eventsService";
import { useAuth } from "@/hooks/useAuth";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskStatusBadge from "./TaskStatusBadge";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: CoordinatorTaskDto | null;
  onSubmit: (
    data: CreateCoordinatorTaskDto | UpdateCoordinatorTaskDto
  ) => Promise<void>;
  isLoading?: boolean;
  organizationId?: number;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  task,
  onSubmit,
  isLoading = false,
  organizationId,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    coordinatorId: "",
    eventId: "",
    category: "",
    priority: TASK_PRIORITY.MEDIUM,
    status: TASK_STATUS.ASSIGNED,
    dueDate: undefined as Date | undefined,
    estimatedHours: 0,
    actualHours: 0,
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [coordinators, setCoordinators] = useState<VolunteerCoordinatorDto[]>(
    []
  );
  const [events, setEvents] = useState<EventDto[]>([]);
  const [coordinatorsLoading, setCoordinatorsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);

  const isEditMode = !!task;
  const currentOrganizationId = organizationId || user?.organizationId;

  // Load coordinators and events when modal opens
  useEffect(() => {
    if (isOpen && currentOrganizationId) {
      loadCoordinators();
      loadEvents();
    }
  }, [isOpen, currentOrganizationId]);

  const loadCoordinators = async () => {
    if (!currentOrganizationId) return;

    setCoordinatorsLoading(true);
    try {
      const result =
        await volunteerCoordinatorService.getCoordinatorsByOrganization(
          currentOrganizationId,
          { size: 100 } // Get all coordinators
        );
      setCoordinators(result.items || []);
    } catch (error) {
      console.error("Error loading coordinators:", error);
      setCoordinators([]);
    } finally {
      setCoordinatorsLoading(false);
    }
  };

  const loadEvents = async () => {
    if (!currentOrganizationId) return;

    setEventsLoading(true);
    try {
      const result = await eventsService.getEvents({
        organizationId: currentOrganizationId,
        size: 100, // Get all events
        page: 1,
        sortBy: "CreatedAt",
        sortDirection: "desc",
      });
      setEvents(result.items || []);
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    if (task) {
      setFormData({
        taskName: task.taskName || "",
        description: task.description || "",
        coordinatorId: task.coordinatorId?.toString() || "",
        eventId: task.eventId?.toString() || "",
        category: task.category || "",
        priority:
          task.priority &&
          Object.values(TASK_PRIORITY).includes(task.priority as any)
            ? (task.priority as any)
            : TASK_PRIORITY.MEDIUM,
        status:
          task.status && Object.values(TASK_STATUS).includes(task.status as any)
            ? (task.status as any)
            : TASK_STATUS.ASSIGNED,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        estimatedHours: task.estimatedHours || 0,
        actualHours: task.actualHours || 0,
        notes: task.notes || "",
      });
    } else {
      setFormData({
        taskName: "",
        description: "",
        coordinatorId: "",
        eventId: "",
        category: "",
        priority: TASK_PRIORITY.MEDIUM,
        status: TASK_STATUS.ASSIGNED,
        dueDate: undefined,
        estimatedHours: 0,
        actualHours: 0,
        notes: "",
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.taskName.trim()) {
      newErrors.taskName = "Tên nhiệm vụ là bắt buộc";
    }

    if (!formData.coordinatorId.trim()) {
      newErrors.coordinatorId = "Điều phối viên là bắt buộc";
    }

    if (!formData.eventId.trim()) {
      newErrors.eventId = "Sự kiện là bắt buộc";
    }

    if (formData.estimatedHours < 0) {
      newErrors.estimatedHours = "Thời gian ước tính không thể âm";
    }

    if (formData.actualHours < 0) {
      newErrors.actualHours = "Thời gian thực tế không thể âm";
    }

    if (formData.dueDate && formData.dueDate < new Date() && !isEditMode) {
      newErrors.dueDate = "Ngày đến hạn không thể trong quá khứ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        taskName: formData.taskName.trim(),
        description: formData.description.trim() || undefined,
        coordinatorId: Number(formData.coordinatorId),
        eventId: Number(formData.eventId),
        category: formData.category.trim() || undefined,
        priority: formData.priority,
        ...(isEditMode && { status: formData.status }), // Only include status when editing
        dueDate: formData.dueDate?.toISOString(),
        estimatedHours: formData.estimatedHours || undefined,
        actualHours: formData.actualHours || undefined,
        notes: formData.notes.trim() || undefined,
      };

      if (isEditMode && task) {
        await onSubmit({
          taskId: task.taskId,
          ...submitData,
        } as UpdateCoordinatorTaskDto);
      } else {
        await onSubmit(submitData as CreateCoordinatorTaskDto);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const priorityOptions = [
    { value: TASK_PRIORITY.LOW, label: "Thấp" },
    { value: TASK_PRIORITY.MEDIUM, label: "Trung bình" },
    { value: TASK_PRIORITY.HIGH, label: "Cao" },
    { value: TASK_PRIORITY.URGENT, label: "Khẩn cấp" },
  ];

  const statusOptions = [
    { value: TASK_STATUS.ASSIGNED, label: "Đã giao" },
    { value: TASK_STATUS.IN_PROGRESS, label: "Đang thực hiện" },
    { value: TASK_STATUS.COMPLETED, label: "Hoàn thành" },
    { value: TASK_STATUS.CANCELLED, label: "Đã hủy" },
    { value: TASK_STATUS.ON_HOLD, label: "Tạm dừng" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 -m-6 mb-6 p-6 border-b">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {isEditMode ? "Chỉnh sửa nhiệm vụ" : "Tạo nhiệm vụ mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
              Thông tin cơ bản
            </h3>
            <div
              className={`grid grid-cols-1 gap-4 ${
                isEditMode ? "md:grid-cols-2" : ""
              }`}
            >
              <div className="md:col-span-2">
                <Label
                  htmlFor="taskName"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Tên nhiệm vụ *
                </Label>
                <Input
                  id="taskName"
                  value={formData.taskName}
                  onChange={(e) =>
                    handleInputChange("taskName", e.target.value)
                  }
                  placeholder="Nhập tên nhiệm vụ..."
                  className={`mt-1 ${errors.taskName ? "border-red-500" : ""}`}
                />
                {errors.taskName && (
                  <p className="text-red-500 text-sm mt-1">{errors.taskName}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label
                  htmlFor="description"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Nhập mô tả nhiệm vụ..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="coordinatorId"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Điều phối viên *
                </Label>
                <Select
                  value={formData.coordinatorId}
                  onValueChange={(value) =>
                    handleInputChange("coordinatorId", value)
                  }
                >
                  <SelectTrigger
                    className={`mt-1 ${
                      errors.coordinatorId ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Chọn điều phối viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {coordinatorsLoading ? (
                      <SelectItem value="loading" disabled>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Đang tải...
                      </SelectItem>
                    ) : coordinators.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Không có điều phối viên nào
                      </SelectItem>
                    ) : (
                      coordinators.map((coordinator) => (
                        <SelectItem
                          key={coordinator.coordinatorId}
                          value={coordinator.coordinatorId.toString()}
                        >
                          {coordinator.user?.fullName ||
                            coordinator.user?.email ||
                            "Unknown"}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.coordinatorId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.coordinatorId}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="eventId"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Sự kiện *
                </Label>
                <Select
                  value={formData.eventId}
                  onValueChange={(value) => handleInputChange("eventId", value)}
                >
                  <SelectTrigger
                    className={`mt-1 ${errors.eventId ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Chọn sự kiện" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventsLoading ? (
                      <SelectItem value="loading" disabled>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Đang tải...
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
                {errors.eventId && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventId}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="category"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Danh mục
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  placeholder="Nhập danh mục..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Ngày đến hạn
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full mt-1 justify-start text-left font-normal ${
                        !formData.dueDate && "text-muted-foreground"
                      } ${errors.dueDate ? "border-red-500" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? (
                        format(formData.dueDate, "PPP", { locale: vi })
                      ) : (
                        <span>Chọn ngày đến hạn</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={(date) => {
                        handleInputChange("dueDate", date);
                        setIsCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status and Priority */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100">
              Trạng thái và Độ ưu tiên
            </h3>
            <div
              className={`grid grid-cols-1 gap-4 ${
                isEditMode ? "md:grid-cols-2" : ""
              }`}
            >
              <div>
                <Label className="text-blue-700 dark:text-blue-300">
                  Độ ưu tiên
                </Label>
                <div className="flex items-center gap-3 mt-2">
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      handleInputChange("priority", value)
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Chọn độ ưu tiên" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.priority && (
                    <TaskPriorityBadge priority={formData.priority} />
                  )}
                </div>
              </div>

              {isEditMode && (
                <div>
                  <Label className="text-blue-700 dark:text-blue-300">
                    Trạng thái
                  </Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.status && (
                      <TaskStatusBadge status={formData.status} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Time Tracking */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100">
              Theo dõi thời gian
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="estimatedHours"
                  className="text-green-700 dark:text-green-300"
                >
                  Thời gian ước tính (giờ)
                </Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimatedHours}
                  onChange={(e) =>
                    handleInputChange("estimatedHours", Number(e.target.value))
                  }
                  placeholder="0"
                  className={`mt-1 ${
                    errors.estimatedHours ? "border-red-500" : ""
                  }`}
                />
                {errors.estimatedHours && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.estimatedHours}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="actualHours"
                  className="text-green-700 dark:text-green-300"
                >
                  Thời gian thực tế (giờ)
                </Label>
                <Input
                  id="actualHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.actualHours}
                  onChange={(e) =>
                    handleInputChange("actualHours", Number(e.target.value))
                  }
                  placeholder="0"
                  className={`mt-1 ${
                    errors.actualHours ? "border-red-500" : ""
                  }`}
                />
                {errors.actualHours && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.actualHours}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 text-amber-900 dark:text-amber-100">
              Ghi chú
            </h3>
            <div>
              <Label
                htmlFor="notes"
                className="text-amber-700 dark:text-amber-300"
              >
                Ghi chú bổ sung
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Nhập ghi chú bổ sung..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300"
            >
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading
                ? "Đang xử lý..."
                : isEditMode
                ? "Cập nhật"
                : "Tạo mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormModal;
