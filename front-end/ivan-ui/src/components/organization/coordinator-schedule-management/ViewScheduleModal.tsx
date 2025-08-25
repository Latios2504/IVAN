import type { CoordinatorScheduleDto } from "@/types/coordinatorSchedule";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, User, Tag, AlertCircle, FileText, Zap } from "lucide-react";

interface ViewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: CoordinatorScheduleDto | null;
}

export default function ViewScheduleModal({
  isOpen,
  onClose,
  schedule,
}: ViewScheduleModalProps) {
  if (!schedule) return null;

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", label: "Chờ xử lý" },
      Confirmed: { color: "bg-green-100 text-green-800 border-green-300", label: "Đã xác nhận" },
      Cancelled: { color: "bg-red-100 text-red-800 border-red-300", label: "Đã hủy" },
      Completed: { color: "bg-blue-100 text-blue-800 border-blue-300", label: "Hoàn thành" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
    return (
      <Badge className={`${config.color} border font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      Low: { color: "bg-gray-100 text-gray-800 border-gray-300", label: "Thấp" },
      Medium: { color: "bg-blue-100 text-blue-800 border-blue-300", label: "Trung bình" },
      High: { color: "bg-red-100 text-red-800 border-red-300", label: "Cao" },
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.Medium;
    return (
      <Badge className={`${config.color} border font-medium`}>
        <Zap className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getScheduleTypeLabel = (type: string) => {
    const typeLabels = {
      Meeting: "Họp",
      Event: "Sự kiện",
      Training: "Đào tạo",
      Other: "Khác",
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 -m-6 mb-6 p-6 rounded-t-lg border-b border-blue-200/50 dark:border-blue-800/50">
          <DialogTitle className="text-blue-900 dark:text-blue-100 text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Chi tiết lịch trình
          </DialogTitle>
          <DialogDescription className="text-blue-700 dark:text-blue-300">
            Thông tin chi tiết về lịch trình của điều phối viên
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Title and Status */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {schedule.title}
              </h3>
              <div className="flex gap-2 flex-shrink-0">
                {getStatusBadge(schedule.status || 'Pending')}
                {getPriorityBadge(schedule.priority || 'Medium')}
              </div>
            </div>
            {schedule.description && (
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {schedule.description}
              </p>
            )}
          </div>

          {/* Coordinator Info */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <User className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Điều phối viên:</span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold">
                {schedule.coordinatorName || schedule.coordinatorEmail || 'Không xác định'}
              </span>
            </div>
          </div>

          {/* Event Info */}
          {schedule.eventName && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Tag className="h-4 w-4 text-green-500" />
                <span className="font-medium">Sự kiện:</span>
                <span className="text-green-900 dark:text-green-100 font-semibold">
                  {schedule.eventName}
                </span>
              </div>
            </div>
          )}

          {/* Time and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Thời gian</span>
                </div>
                <div className="text-sm text-purple-900 dark:text-purple-100">
                  <div><strong>Bắt đầu:</strong> {formatDateTime(schedule.startDateTime)}</div>
                  <div><strong>Kết thúc:</strong> {formatDateTime(schedule.endDateTime)}</div>
                  {schedule.isAllDay && (
                    <div className="text-purple-600 dark:text-purple-400 font-medium mt-1">
                      Cả ngày
                    </div>
                  )}
                </div>
              </div>
            </div>

            {schedule.location && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Địa điểm</span>
                </div>
                <div className="text-sm text-orange-900 dark:text-orange-100 mt-2">
                  {schedule.location}
                </div>
              </div>
            )}
          </div>

          {/* Schedule Type and Reminder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 rounded-lg p-4 border border-cyan-200 dark:border-cyan-800">
              <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                <Tag className="h-4 w-4 text-cyan-500" />
                <span className="font-medium">Loại lịch trình</span>
              </div>
              <div className="text-sm text-cyan-900 dark:text-cyan-100 mt-2">
                {getScheduleTypeLabel(schedule.scheduleType || 'Other')}
              </div>
            </div>

            {schedule.reminderMinutes && schedule.reminderMinutes > 0 && (
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
                <div className="flex items-center gap-2 text-pink-700 dark:text-pink-300">
                  <AlertCircle className="h-4 w-4 text-pink-500" />
                  <span className="font-medium">Nhắc nhở</span>
                </div>
                <div className="text-sm text-pink-900 dark:text-pink-100 mt-2">
                  {schedule.reminderMinutes} phút trước
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {schedule.notes && (
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 mb-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="font-medium">Ghi chú</span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {schedule.notes}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <strong>Tạo lúc:</strong> {schedule.createdAt ? formatDateTime(schedule.createdAt) : 'N/A'}
              </div>
              {schedule.updatedAt && schedule.updatedAt !== schedule.createdAt && (
                <div>
                  <strong>Cập nhật lúc:</strong> {formatDateTime(schedule.updatedAt)}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 -m-6 mt-6 p-6 rounded-b-lg border-t border-slate-200 dark:border-slate-800">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}