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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import type { OnSiteTaskDto, OnSiteTaskUpdateDto } from "@/types/onSiteTask";

interface Event {
  eventId: number;
  eventName: string;
  startDate: string;
  endDate: string;
}

interface TaskEditFormProps {
  events: Event[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (taskData: OnSiteTaskUpdateDto) => Promise<void>;
  task: OnSiteTaskDto;
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({
  events,
  open,
  onOpenChange,
  onSubmit,
  task,
}) => {
  const [formData, setFormData] = useState<OnSiteTaskUpdateDto>({
    eventId: task.eventId,
    categoryId: task.categoryId,
    statusId: task.statusId,
    taskName: task.taskName,
    description: task.description || "",
    startTime: task.startTime || "",
    endTime: task.endTime || "",
    location: task.location || "",
    requiredVolunteers: task.requiredVolunteers || 1,
    estimatedHours: task.estimatedHours || 1,
    actualHours: task.actualHours || 0,
    assignedVolunteers: task.assignedVolunteers || 0,
    instructions: task.instructions || "",
    requiredSkills: task.requiredSkills || "",
    materials: task.materials || "",
    safetyRequirements: task.safetyRequirements || "",
    completionCriteria: task.completionCriteria || "",
    notes: task.notes || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when task changes
  useEffect(() => {
    setFormData({
      eventId: task.eventId,
      categoryId: task.categoryId,
      statusId: task.statusId,
      taskName: task.taskName,
      description: task.description || "",
      startTime: task.startTime || "",
      endTime: task.endTime || "",
      location: task.location || "",
      requiredVolunteers: task.requiredVolunteers || 1,
      estimatedHours: task.estimatedHours || 1,
      actualHours: task.actualHours || 0,
      assignedVolunteers: task.assignedVolunteers || 0,
      instructions: task.instructions || "",
      requiredSkills: task.requiredSkills || "",
      materials: task.materials || "",
      safetyRequirements: task.safetyRequirements || "",
      completionCriteria: task.completionCriteria || "",
      notes: task.notes || "",
    });
  }, [task]);

  const handleInputChange = (field: keyof OnSiteTaskUpdateDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.taskName.trim()) {
      newErrors.taskName = "Tên nhiệm vụ là bắt buộc";
    }

    if (!formData.eventId) {
      newErrors.eventId = "Vui lòng chọn sự kiện";
    }

    if (!formData.location?.trim()) {
      newErrors.location = "Địa điểm là bắt buộc";
    }

    if ((formData.requiredVolunteers ?? 0) < 1) {
      newErrors.requiredVolunteers = "Số lượng tình nguyện viên phải lớn hơn 0";
    }

    if ((formData.estimatedHours ?? 0) < 0.5) {
      newErrors.estimatedHours = "Thời gian ước tính phải ít nhất 0.5 giờ";
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
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-orange-700 dark:text-orange-300">
            Chỉnh sửa nhiệm vụ
          </DialogTitle>
          <DialogDescription className="text-orange-600 dark:text-orange-400">
            Cập nhật thông tin nhiệm vụ tại chỗ
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Tên nhiệm vụ *</Label>
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
              <Label htmlFor="eventId">Sự kiện *</Label>
              <Select
                value={formData.eventId.toString()}
                onValueChange={(value) => handleInputChange("eventId", parseInt(value))}
              >
                <SelectTrigger className={errors.eventId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn sự kiện" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.eventId} value={event.eventId.toString()}>
                      {event.eventName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.eventId && (
                <p className="text-sm text-red-500">{errors.eventId}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Mô tả chi tiết về nhiệm vụ"
              rows={3}
            />
          </div>

          {/* Time and Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Thời gian bắt đầu
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-500" />
                Thời gian kết thúc
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                Địa điểm *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Địa điểm thực hiện nhiệm vụ"
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Volunteers and Hours */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requiredVolunteers" className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                Số TNV cần thiết *
              </Label>
              <Input
                id="requiredVolunteers"
                type="number"
                min="1"
                value={formData.requiredVolunteers}
                onChange={(e) => handleInputChange("requiredVolunteers", parseInt(e.target.value) || 1)}
                className={errors.requiredVolunteers ? "border-red-500" : ""}
              />
              {errors.requiredVolunteers && (
                <p className="text-sm text-red-500">{errors.requiredVolunteers}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedHours" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                Thời gian ước tính (giờ) *
              </Label>
              <Input
                id="estimatedHours"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) => handleInputChange("estimatedHours", parseFloat(e.target.value) || 1)}
                className={errors.estimatedHours ? "border-red-500" : ""}
              />
              {errors.estimatedHours && (
                <p className="text-sm text-red-500">{errors.estimatedHours}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="actualHours" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                Thời gian thực tế (giờ)
              </Label>
              <Input
                id="actualHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.actualHours}
                onChange={(e) => handleInputChange("actualHours", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
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
                  onChange={(e) => handleInputChange("requiredSkills", e.target.value)}
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
              <Label htmlFor="safetyRequirements" className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                Yêu cầu an toàn
              </Label>
              <Textarea
                id="safetyRequirements"
                value={formData.safetyRequirements}
                onChange={(e) => handleInputChange("safetyRequirements", e.target.value)}
                placeholder="Các yêu cầu về an toàn lao động"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="completionCriteria">Tiêu chí hoàn thành</Label>
              <Textarea
                id="completionCriteria"
                value={formData.completionCriteria}
                onChange={(e) => handleInputChange("completionCriteria", e.target.value)}
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
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật nhiệm vụ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditForm;