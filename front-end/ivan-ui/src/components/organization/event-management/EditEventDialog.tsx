import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Switch } from "../../ui/switch";
import { eventsService } from "../../../services/eventsService";
import type {
  EventDto,
  EventCategoryDto,
  UpdateEventDto,
} from "../../../types/events";

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventDto | null;
  categories: EventCategoryDto[];
  onSuccess?: () => void;
}

export const EditEventDialog: React.FC<EditEventDialogProps> = ({
  open,
  onClose,
  event,
  categories,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    categoryId: 0,
    description: "",
    shortDescription: "",
    startDate: "",
    endDate: "",
    registrationStartDate: "",
    registrationEndDate: "",
    location: "",
    detailedAddress: "",
    province: "",
    district: "",
    maxVolunteers: 1,
    minVolunteers: 1,
    requiredSkills: "",
    ageRequirement: "",
    genderRequirement: "",
    requirements: "",
    benefits: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    bannerImageUrl: "",
    galleryImages: "",
    isFeatured: false,
    isUrgent: false,
  });

  // Initialize form with event data
  useEffect(() => {
    if (event) {
      setFormData({
        eventName: event.eventName || "",
        categoryId: event.categoryId || 0,
        description: event.description || "",
        shortDescription: event.shortDescription || "",
        startDate: event.startDate ? event.startDate.split("T")[0] : "",
        endDate: event.endDate ? event.endDate.split("T")[0] : "",
        registrationStartDate: event.registrationStartDate ? event.registrationStartDate.split("T")[0] : "",
        registrationEndDate: event.registrationEndDate ? event.registrationEndDate.split("T")[0] : "",
        location: event.location || "",
        detailedAddress: event.detailedAddress || "",
        province: event.province || "",
        district: event.district || "",
        maxVolunteers: event.maxVolunteers || 1,
        minVolunteers: event.minVolunteers || 1,
        requiredSkills: event.requiredSkills || "",
        ageRequirement: event.ageRequirement || "",
        genderRequirement: event.genderRequirement || "",
        requirements: event.requirements || "",
        benefits: event.benefits || "",
        contactPerson: event.contactPerson || "",
        contactPhone: event.contactPhone || "",
        contactEmail: event.contactEmail || "",
        bannerImageUrl: event.bannerImageUrl || "",
        galleryImages: event.galleryImages || "",
        isFeatured: event.isFeatured || false,
        isUrgent: event.isUrgent || false,
      });
    }
  }, [event]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event || !formData.eventName.trim() || !formData.location.trim()) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    try {
      setLoading(true);

      const updatePayload: UpdateEventDto = {
        eventName: formData.eventName,
        categoryId: formData.categoryId,
        description: formData.description || undefined,
        shortDescription: formData.shortDescription || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        registrationStartDate: formData.registrationStartDate || undefined,
        registrationEndDate: formData.registrationEndDate || undefined,
        location: formData.location,
        detailedAddress: formData.detailedAddress || undefined,
        province: formData.province || undefined,
        district: formData.district || undefined,
        maxVolunteers: formData.maxVolunteers,
        minVolunteers: formData.minVolunteers,
        requiredSkills: formData.requiredSkills || undefined,
        ageRequirement: formData.ageRequirement || undefined,
        genderRequirement: formData.genderRequirement || undefined,
        requirements: formData.requirements || undefined,
        benefits: formData.benefits || undefined,
        contactPerson: formData.contactPerson || undefined,
        contactPhone: formData.contactPhone || undefined,
        contactEmail: formData.contactEmail || undefined,
        bannerImageUrl: formData.bannerImageUrl || undefined,
        galleryImages: formData.galleryImages || undefined,
        isFeatured: formData.isFeatured,
        isUrgent: formData.isUrgent,
      };

      await eventsService.updateEvent(event.eventId, updatePayload);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Không thể cập nhật sự kiện:", error);
      alert("Không thể cập nhật sự kiện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Chỉnh sửa Sự kiện: {event.eventName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventName" className="text-sm font-semibold">Tên Sự kiện <span className="text-destructive">*</span></Label>
              <Input
                id="eventName"
                value={formData.eventName}
                onChange={(e) => handleInputChange("eventName", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="categoryId" className="text-sm font-semibold">Danh mục <span className="text-destructive">*</span></Label>
              <Select
                value={formData.categoryId.toString()}
                onValueChange={(value) =>
                  handleInputChange("categoryId", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.categoryId}
                      value={category.categoryId.toString()}
                    >
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription" className="text-sm font-semibold">Mô tả ngắn</Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value)
              }
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-semibold">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-sm font-semibold">Ngày bắt đầu <span className="text-destructive">*</span></Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate" className="text-sm font-semibold">Ngày kết thúc <span className="text-destructive">*</span></Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="registrationStartDate" className="text-sm font-semibold">Ngày bắt đầu đăng ký</Label>
              <Input
                id="registrationStartDate"
                type="date"
                value={formData.registrationStartDate}
                onChange={(e) => handleInputChange("registrationStartDate", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="registrationEndDate" className="text-sm font-semibold">Ngày kết thúc đăng ký</Label>
              <Input
                id="registrationEndDate"
                type="date"
                value={formData.registrationEndDate}
                onChange={(e) => handleInputChange("registrationEndDate", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="text-sm font-semibold">Địa điểm <span className="text-destructive">*</span></Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minVolunteers" className="text-sm font-semibold">Số tình nguyện viên tối thiểu</Label>
              <Input
                id="minVolunteers"
                type="number"
                min="1"
                value={formData.minVolunteers}
                onChange={(e) =>
                  handleInputChange(
                    "minVolunteers",
                    parseInt(e.target.value) || 1
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="maxVolunteers" className="text-sm font-semibold">Số tình nguyện viên tối đa</Label>
              <Input
                id="maxVolunteers"
                type="number"
                min="1"
                value={formData.maxVolunteers}
                onChange={(e) =>
                  handleInputChange(
                    "maxVolunteers",
                    parseInt(e.target.value) || 1
                  )
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="galleryImages" className="text-sm font-semibold">Hình ảnh thư viện (URLs cách nhau bằng dấu phẩy)</Label>
            <Textarea
              id="galleryImages"
              value={formData.galleryImages}
              onChange={(e) => handleInputChange("galleryImages", e.target.value)}
              rows={3}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              className="resize-none"
            />
          </div>

          <div className="flex gap-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center space-x-3">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  handleInputChange("isFeatured", checked)
                }
              />
              <Label htmlFor="isFeatured" className="text-sm font-semibold cursor-pointer">Sự kiện nổi bật</Label>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="isUrgent"
                checked={formData.isUrgent}
                onCheckedChange={(checked) =>
                  handleInputChange("isUrgent", checked)
                }
              />
              <Label htmlFor="isUrgent" className="text-sm font-semibold cursor-pointer">Sự kiện khẩn cấp</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật Sự kiện"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
