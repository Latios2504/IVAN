import { useState, useEffect } from "react";
import { coordinatorScheduleService } from "@/services/coordinatorScheduleService";
import { eventsService } from "@/services/eventsService";
import type { CoordinatorScheduleDto, UpdateCoordinatorScheduleDto } from "@/types/coordinatorSchedule";
import type { EventDto } from "@/types/events";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ScheduleFormData {
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

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  schedule: CoordinatorScheduleDto | null;
  organizationId?: number;
}

export default function EditScheduleModal({
  isOpen,
  onClose,
  onSuccess,
  schedule,
  organizationId,
}: EditScheduleModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [events, setEvents] = useState<EventDto[]>([]);

  const currentOrganizationId = organizationId || user?.organizationId;

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

  // Load events for dropdown
  const loadEvents = async () => {
    if (!currentOrganizationId) return;
    
    try {
      setEventsLoading(true);
      const result = await eventsService.getEvents({
        page: 1,
        size: 100,
        sortBy: "eventName",
        sortDirection: "asc",
        organizationId: currentOrganizationId,
      });
      setEvents(result.items || []);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Không thể tải danh sách sự kiện");
    } finally {
      setEventsLoading(false);
    }
  };

  // Populate form when schedule changes
  useEffect(() => {
    if (schedule && isOpen) {
      setFormData({
        eventId: schedule.eventId || undefined,
        title: schedule.title,
        description: schedule.description || "",
        startDateTime: schedule.startDateTime,
        endDateTime: schedule.endDateTime,
        location: schedule.location || "",
        scheduleType: (schedule.scheduleType as "Meeting" | "Event" | "Training" | "Other") || "Event",
        priority: (schedule.priority as "Low" | "Medium" | "High") || "Medium",
        isAllDay: schedule.isAllDay || false,
        reminderMinutes: schedule.reminderMinutes || 60,
        notes: schedule.notes || "",
      });
    }
  }, [schedule, isOpen]);

  useEffect(() => {
    if (isOpen && currentOrganizationId) {
      loadEvents();
    }
  }, [isOpen, currentOrganizationId]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.startDateTime || !formData.endDateTime) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Validate end time is after start time
    const startDate = new Date(formData.startDateTime);
    const endDate = new Date(formData.endDateTime);
    
    if (endDate <= startDate) {
      toast.error("Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    try {
      setLoading(true);
      const updateData: UpdateCoordinatorScheduleDto = {
        eventId: formData.eventId,
        title: formData.title,
        description: formData.description,
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        location: formData.location,
        scheduleType: formData.scheduleType,
        priority: formData.priority,
        isAllDay: formData.isAllDay,
        reminderMinutes: formData.reminderMinutes,
        notes: formData.notes,
      };

      if (!schedule) {
        toast.error("Không tìm thấy thông tin lịch trình");
        return;
      }
      
      console.log("Updating schedule with data:", updateData);
      console.log("Schedule ID:", schedule.scheduleId);
      console.log("Current organization ID:", currentOrganizationId);
      console.log("User info:", user);
      
      await coordinatorScheduleService.updateSchedule(schedule.scheduleId, updateData);
      toast.success("Cập nhật lịch trình thành công");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating schedule:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          response: (error as any).response?.data,
          status: (error as any).response?.status,
          statusText: (error as any).response?.statusText
        });
      }
      toast.error("Không thể cập nhật lịch trình");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 -m-6 mb-6 p-6 rounded-t-lg border-b border-amber-200/50 dark:border-amber-800/50">
          <DialogTitle className="text-amber-900 dark:text-amber-100 text-xl font-bold">
            Chỉnh sửa lịch trình
          </DialogTitle>
          <DialogDescription className="text-amber-700 dark:text-amber-300">
            Cập nhật thông tin lịch trình cho điều phối viên
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-slate-900 dark:text-slate-100 font-semibold">
              Tiêu đề *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề lịch trình"
              className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400"
            />
          </div>



          <div className="grid gap-2">
            <Label htmlFor="event" className="text-slate-900 dark:text-slate-100 font-semibold">
              Sự kiện (tùy chọn)
            </Label>
            <Select
              value={formData.eventId?.toString() || "none"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  eventId: value === "none" ? undefined : parseInt(value),
                })
              }
            >
              <SelectTrigger className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400">
                <SelectValue placeholder="Chọn sự kiện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có sự kiện</SelectItem>
                {eventsLoading ? (
                  <SelectItem value="loading" disabled>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang tải...
                  </SelectItem>
                ) : (
                  events.map((event) => (
                    <SelectItem key={event.eventId} value={event.eventId.toString()}>
                      {event.eventName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="startDateTime" className="text-slate-900 dark:text-slate-100 font-semibold">
                Thời gian bắt đầu *
              </Label>
              <Input
                id="startDateTime"
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDateTime" className="text-slate-900 dark:text-slate-100 font-semibold">
                Thời gian kết thúc *
              </Label>
              <Input
                id="endDateTime"
                type="datetime-local"
                value={formData.endDateTime}
                onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location" className="text-slate-900 dark:text-slate-100 font-semibold">
              Địa điểm
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Nhập địa điểm"
              className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-orange-500 dark:focus:border-orange-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="scheduleType" className="text-slate-900 dark:text-slate-100 font-semibold">
                Loại lịch trình
              </Label>
              <Select
                value={formData.scheduleType}
                onValueChange={(value: "Meeting" | "Event" | "Training" | "Other") =>
                  setFormData({ ...formData, scheduleType: value })
                }
              >
                <SelectTrigger className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400">
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
              <Label htmlFor="priority" className="text-slate-900 dark:text-slate-100 font-semibold">
                Mức độ ưu tiên
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "Low" | "Medium" | "High") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-pink-500 dark:focus:border-pink-400">
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
            <Label htmlFor="notes" className="text-slate-900 dark:text-slate-100 font-semibold">
              Ghi chú
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Nhập ghi chú"
              rows={3}
              className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-400 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 -m-6 mt-6 p-6 rounded-b-lg border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            onClick={handleClose}
            className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Cập nhật lịch trình
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}