import { useState, useEffect } from "react";
import { coordinatorScheduleService } from "@/services/coordinatorScheduleService";
import { eventsService } from "@/services/eventsService";
import { volunteerCoordinatorService } from "@/services/volunteerCoordinatorService";
import type { EventDto } from "@/types/events";
import type { VolunteerCoordinatorDto } from "@/types/volunteerCoordinator";
import { toast } from "sonner";
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

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organizationId?: number;
}

export default function AddScheduleModal({
  isOpen,
  onClose,
  onSuccess,
  organizationId,
}: AddScheduleModalProps) {
  const [loading, setLoading] = useState(false);
  const [coordinatorsLoading, setCoordinatorsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [coordinators, setCoordinators] = useState<VolunteerCoordinatorDto[]>([]);
  const [events, setEvents] = useState<EventDto[]>([]);

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

  // Load coordinators for dropdown
  const loadCoordinators = async () => {
    if (!organizationId) return;
    
    try {
      setCoordinatorsLoading(true);
      const result = await volunteerCoordinatorService.getOrganizationCoordinators(
        { page: 1, size: 100 },
        organizationId
      );
      setCoordinators(result.items);
    } catch (error) {
      console.error("Error loading coordinators:", error);
      toast.error("Không thể tải danh sách điều phối viên");
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
        organizationId: organizationId || undefined,
      });
      setEvents(result.items);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Không thể tải danh sách sự kiện");
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCoordinators();
      loadEvents();
    }
  }, [isOpen, organizationId]);

  const handleSubmit = async () => {
    if (!formData.coordinatorId || !formData.title || !formData.startDateTime || !formData.endDateTime) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

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
      toast.success("Tạo lịch trình thành công");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Không thể tạo lịch trình");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 -m-6 mb-6 p-6 rounded-t-lg border-b border-indigo-200/50 dark:border-indigo-800/50">
          <DialogTitle className="text-indigo-900 dark:text-indigo-100 text-xl font-bold">
            Tạo lịch trình mới
          </DialogTitle>
          <DialogDescription className="text-indigo-700 dark:text-indigo-300">
            Tạo lịch trình mới cho điều phối viên
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
              className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coordinator" className="text-slate-900 dark:text-slate-100 font-semibold">
              Điều phối viên *
            </Label>
            <Select
              value={formData.coordinatorId.toString()}
              onValueChange={(value) => setFormData({ ...formData, coordinatorId: parseInt(value) })}
            >
              <SelectTrigger className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400">
                <SelectValue placeholder="Chọn điều phối viên" />
              </SelectTrigger>
              <SelectContent>
                {coordinatorsLoading ? (
                  <SelectItem value="loading" disabled>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang tải...
                  </SelectItem>
                ) : (
                  coordinators.map((coordinator) => (
                    <SelectItem
                      key={coordinator.coordinatorId}
                      value={coordinator.coordinatorId.toString()}
                    >
                      {coordinator.user?.fullName || coordinator.user?.email || 'Unknown'}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
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
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Tạo lịch trình
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}