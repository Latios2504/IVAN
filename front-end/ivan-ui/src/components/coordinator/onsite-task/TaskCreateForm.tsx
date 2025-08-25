import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  Shield,
  Wrench,
  Target,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { OnSiteTaskInputDto } from "@/types/onSiteTask";

interface Event {
  eventId: number;
  eventName: string;
  startDate: string;
  endDate: string;
}

interface TaskCreateFormProps {
  events: Event[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (taskData: OnSiteTaskInputDto) => Promise<void>;
  trigger?: React.ReactNode;
}

const TaskCreateForm: React.FC<TaskCreateFormProps> = ({
  events,
  open,
  onOpenChange,
  onSubmit,
  trigger,
}) => {
  const [formData, setFormData] = useState<OnSiteTaskInputDto>({
    eventId: 0,
    categoryId: 1, // Default category
    statusId: 4, // Default to On Hold (backend auto-sets this)
    taskName: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    requiredVolunteers: 1,
    estimatedHours: 1,
    instructions: "",
    requiredSkills: "",
    materials: "",
    safetyRequirements: "",
    completionCriteria: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Update selected event when eventId changes
  useEffect(() => {
    if (formData.eventId) {
      const event = events.find((e) => e.eventId === formData.eventId);
      setSelectedEvent(event || null);
    } else {
      setSelectedEvent(null);
    }
  }, [formData.eventId, events]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventId) {
      newErrors.eventId = "Vui lòng chọn sự kiện";
    }

    if (!formData.taskName.trim()) {
      newErrors.taskName = "Tên nhiệm vụ là bắt buộc";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Mô tả nhiệm vụ là bắt buộc";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Thời gian bắt đầu là bắt buộc";
    }

    if (!formData.endTime) {
      newErrors.endTime = "Thời gian kết thúc là bắt buộc";
    }

    if (formData.startTime && formData.endTime) {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(formData.endTime);

      if (endDate <= startDate) {
        newErrors.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu";
      }

      // Check if task time is within event time
      if (selectedEvent) {
        const eventStart = new Date(selectedEvent.startDate);
        const eventEnd = new Date(selectedEvent.endDate);

        if (startDate < eventStart || endDate > eventEnd) {
          newErrors.startTime =
            "Thời gian nhiệm vụ phải nằm trong thời gian sự kiện";
        }
      }
    }

    if (!formData.location?.trim()) {
      newErrors.location = "Địa điểm là bắt buộc";
    }

    if (!formData.requiredVolunteers || formData.requiredVolunteers < 1) {
      newErrors.requiredVolunteers =
        "Số lượng tình nguyện viên phải ít nhất là 1";
    }

    if (!formData.estimatedHours || formData.estimatedHours < 0.5) {
      newErrors.estimatedHours = "Thời gian dự kiến phải ít nhất là 0.5 giờ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      resetForm();
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      eventId: 0,
      categoryId: 1, // Default category
      statusId: 4, // Default to On Hold (backend auto-sets this)
      taskName: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      requiredVolunteers: 1,
      estimatedHours: 1,
      instructions: "",
      requiredSkills: "",
      materials: "",
      safetyRequirements: "",
      completionCriteria: "",
      notes: "",
    });
    setErrors({});
    setSelectedEvent(null);
  };

  const handleInputChange = (field: keyof OnSiteTaskInputDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formatDateTimeLocal = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Selection */}
      <div className="space-y-2">
        <Label htmlFor="eventId" className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          Sự kiện *
        </Label>
        <Select
          value={formData.eventId > 0 ? formData.eventId.toString() : undefined}
          onValueChange={(value) =>
            handleInputChange("eventId", value ? parseInt(value) : 0)
          }
        >
          <SelectTrigger className={errors.eventId ? "border-red-500" : ""}>
            <SelectValue placeholder="Chọn sự kiện" />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event.eventId} value={event.eventId.toString()}>
                <div>
                  <div className="font-medium">{event.eventName}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString("vi-VN")} -
                    {new Date(event.endDate).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.eventId && (
          <p className="text-sm text-red-500">{errors.eventId}</p>
        )}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taskName" className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-500" />
            Tên nhiệm vụ *
          </Label>
          <Input
            id="taskName"
            value={formData.taskName}
            onChange={(e) => handleInputChange("taskName", e.target.value)}
            placeholder="Nhập tên nhiệm vụ"
            className={errors.taskName ? "border-red-500" : ""}
          />
          {errors.taskName && (
            <p className="text-sm text-red-500">{errors.taskName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            Địa điểm *
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Nhập địa điểm thực hiện"
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Mô tả nhiệm vụ *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Mô tả chi tiết về nhiệm vụ"
          rows={3}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Time and Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime" className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-500" />
            Thời gian bắt đầu *
          </Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formatDateTimeLocal(formData.startTime)}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
            min={
              selectedEvent ? formatDateTimeLocal(selectedEvent.startDate) : ""
            }
            max={
              selectedEvent ? formatDateTimeLocal(selectedEvent.endDate) : ""
            }
            className={errors.startTime ? "border-red-500" : ""}
          />
          {errors.startTime && (
            <p className="text-sm text-red-500">{errors.startTime}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime" className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-500" />
            Thời gian kết thúc *
          </Label>
          <Input
            id="endTime"
            type="datetime-local"
            value={formatDateTimeLocal(formData.endTime)}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
            min={
              formData.startTime ||
              (selectedEvent
                ? formatDateTimeLocal(selectedEvent.startDate)
                : "")
            }
            max={
              selectedEvent ? formatDateTimeLocal(selectedEvent.endDate) : ""
            }
            className={errors.endTime ? "border-red-500" : ""}
          />
          {errors.endTime && (
            <p className="text-sm text-red-500">{errors.endTime}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="requiredVolunteers"
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-blue-500" />
            Số tình nguyện viên *
          </Label>
          <Input
            id="requiredVolunteers"
            type="number"
            min="1"
            value={formData.requiredVolunteers}
            onChange={(e) =>
              handleInputChange(
                "requiredVolunteers",
                parseInt(e.target.value) || 1
              )
            }
            className={errors.requiredVolunteers ? "border-red-500" : ""}
          />
          {errors.requiredVolunteers && (
            <p className="text-sm text-red-500">{errors.requiredVolunteers}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedHours" className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            Thời gian dự kiến (giờ) *
          </Label>
          <Input
            id="estimatedHours"
            type="number"
            step="0.5"
            min="0.5"
            value={formData.estimatedHours}
            onChange={(e) =>
              handleInputChange(
                "estimatedHours",
                parseFloat(e.target.value) || 1
              )
            }
            className={errors.estimatedHours ? "border-red-500" : ""}
          />
          {errors.estimatedHours && (
            <p className="text-sm text-red-500">{errors.estimatedHours}</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Thông tin bổ sung</h3>

        <div className="space-y-2">
          <Label htmlFor="instructions" className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Hướng dẫn thực hiện
          </Label>
          <Textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) => handleInputChange("instructions", e.target.value)}
            placeholder="Hướng dẫn chi tiết cách thực hiện nhiệm vụ"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="requiredSkills" className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              Kỹ năng yêu cầu
            </Label>
            <Textarea
              id="requiredSkills"
              value={formData.requiredSkills}
              onChange={(e) =>
                handleInputChange("requiredSkills", e.target.value)
              }
              placeholder="Các kỹ năng cần thiết để thực hiện nhiệm vụ"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materials" className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-green-500" />
              Vật liệu cần thiết
            </Label>
            <Textarea
              id="materials"
              value={formData.materials}
              onChange={(e) => handleInputChange("materials", e.target.value)}
              placeholder="Danh sách vật liệu, dụng cụ cần thiết"
              rows={2}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="safetyRequirements"
            className="flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-red-500" />
            Yêu cầu an toàn
          </Label>
          <Textarea
            id="safetyRequirements"
            value={formData.safetyRequirements}
            onChange={(e) =>
              handleInputChange("safetyRequirements", e.target.value)
            }
            placeholder="Các yêu cầu về an toàn lao động"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="completionCriteria">Tiêu chí hoàn thành</Label>
          <Textarea
            id="completionCriteria"
            value={formData.completionCriteria}
            onChange={(e) =>
              handleInputChange("completionCriteria", e.target.value)
            }
            placeholder="Tiêu chí để đánh giá nhiệm vụ hoàn thành"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Ghi chú</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Ghi chú thêm về nhiệm vụ"
            rows={2}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm();
            if (onOpenChange) onOpenChange(false);
          }}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          {isSubmitting ? "Đang tạo..." : "Tạo nhiệm vụ"}
        </Button>
      </div>
    </form>
  );

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-orange-700 dark:text-orange-300">
              Tạo nhiệm vụ mới
            </DialogTitle>
            <DialogDescription className="text-orange-600 dark:text-orange-400">
              Tạo nhiệm vụ tại chỗ cho sự kiện
            </DialogDescription>
          </DialogHeader>
          <FormContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-300">
          Tạo nhiệm vụ mới
        </h2>
        <p className="text-orange-600 dark:text-orange-400">
          Tạo nhiệm vụ tại chỗ cho sự kiện
        </p>
      </div>
      <FormContent />
    </div>
  );
};

export default TaskCreateForm;
