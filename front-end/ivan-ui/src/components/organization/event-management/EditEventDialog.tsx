import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number | Date | boolean | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (
    field: "startDate" | "endDate" | "registrationStartDate" | "registrationEndDate",
    date: Date | undefined
  ) => {
    if (date) {
      // Use local timezone to avoid date shifting issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const localDateString = `${year}-${month}-${day}`;
      handleInputChange(field, localDateString);
    } else {
      handleInputChange(field, "");
    }
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
          <DialogTitle className="text-xl font-bold">Chỉnh sửa Sự kiện</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin sự kiện tình nguyện
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventName" className="text-sm font-semibold">
                Tên Sự kiện <span className="text-destructive">*</span>
              </Label>
              <Input
                id="eventName"
                value={formData.eventName || ""}
                onChange={(e) => handleInputChange("eventName", e.target.value)}
                placeholder="Nhập tên sự kiện"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold">
                Danh mục <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.categoryId?.toString() || ""}
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Mô tả <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Mô tả chi tiết sự kiện..."
              rows={4}
              className="resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription" className="text-sm font-semibold">Mô tả ngắn</Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription || ""}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value)
              }
              placeholder="Mô tả ngắn gọn (tùy chọn)"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold">
              Địa điểm <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Địa điểm tổ chức sự kiện"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Ngày bắt đầu <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate
                      ? new Date(formData.startDate).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "Chọn ngày bắt đầu"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.startDate
                        ? new Date(formData.startDate)
                        : undefined
                    }
                    onSelect={(date) => handleDateChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>
                Ngày kết thúc <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate
                      ? new Date(formData.endDate).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Chọn ngày kết thúc"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.endDate ? new Date(formData.endDate) : undefined
                    }
                    onSelect={(date) => handleDateChange("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Detailed Address */}
          <div className="space-y-2">
            <Label htmlFor="detailedAddress" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Địa chỉ chi tiết</Label>
            <Input
              id="detailedAddress"
              value={formData.detailedAddress || ""}
              onChange={(e) => handleInputChange("detailedAddress", e.target.value)}
              placeholder="Địa chỉ chi tiết (tùy chọn)"
              className="bg-gradient-to-r from-white to-teal-50 dark:from-gray-800 dark:to-teal-900/20 border-teal-200 dark:border-teal-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          {/* Province and District */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province" className="text-sm font-semibold">Tỉnh/Thành phố</Label>
              <Input
                id="province"
                value={formData.province || ""}
                onChange={(e) => handleInputChange("province", e.target.value)}
                placeholder="Tỉnh/Thành phố (tùy chọn)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district" className="text-sm font-semibold">Quận/Huyện</Label>
              <Input
                id="district"
                value={formData.district || ""}
                onChange={(e) => handleInputChange("district", e.target.value)}
                placeholder="Quận/Huyện (tùy chọn)"
              />
            </div>
          </div>

          {/* Registration Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ngày bắt đầu đăng ký</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.registrationStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.registrationStartDate
                      ? new Date(formData.registrationStartDate).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Chọn ngày bắt đầu đăng ký"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.registrationStartDate ? new Date(formData.registrationStartDate) : undefined}
                    onSelect={(date) => handleDateChange("registrationStartDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Ngày kết thúc đăng ký</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.registrationEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.registrationEndDate
                      ? new Date(formData.registrationEndDate).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Chọn ngày kết thúc đăng ký"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.registrationEndDate ? new Date(formData.registrationEndDate) : undefined}
                    onSelect={(date) => handleDateChange("registrationEndDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Volunteers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minVolunteers" className="text-sm font-semibold">
                Số tình nguyện viên tối thiểu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="minVolunteers"
                type="number"
                min="1"
                value={formData.minVolunteers || 1}
                onChange={(e) => handleInputChange("minVolunteers", parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxVolunteers" className="text-sm font-semibold">
                Số tình nguyện viên tối đa
              </Label>
              <Input
                id="maxVolunteers"
                type="number"
                min="1"
                value={formData.maxVolunteers || ""}
                onChange={(e) => handleInputChange("maxVolunteers", e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Không giới hạn nếu để trống"
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requiredSkills" className="text-sm font-semibold">Kỹ năng yêu cầu</Label>
            <Input
              id="requiredSkills"
              value={formData.requiredSkills || ""}
              onChange={(e) => handleInputChange("requiredSkills", e.target.value)}
              placeholder="Kỹ năng yêu cầu (tùy chọn)"
            />
          </div>

          {/* Age and Gender Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageRequirement" className="text-sm font-semibold">Yêu cầu độ tuổi</Label>
              <Input
                id="ageRequirement"
                value={formData.ageRequirement || ""}
                onChange={(e) => handleInputChange("ageRequirement", e.target.value)}
                placeholder="ví dụ: 18-65 tuổi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genderRequirement" className="text-sm font-semibold">Yêu cầu giới tính</Label>
              <Select
                value={formData.genderRequirement || "any"}
                onValueChange={(value) => handleInputChange("genderRequirement", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Không yêu cầu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Không yêu cầu</SelectItem>
                  <SelectItem value="Male">Nam</SelectItem>
                  <SelectItem value="Female">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Requirements and Benefits */}
          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-sm font-semibold">Yêu cầu</Label>
            <Textarea
              id="requirements"
              value={formData.requirements || ""}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              placeholder="Yêu cầu bổ sung (tùy chọn)"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits" className="text-sm font-semibold">Quyền lợi</Label>
            <Textarea
              id="benefits"
              value={formData.benefits || ""}
              onChange={(e) => handleInputChange("benefits", e.target.value)}
              placeholder="Quyền lợi cho tình nguyện viên (tùy chọn)"
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="text-sm font-semibold">Người liên hệ</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson || ""}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                placeholder="Tên người liên hệ (tùy chọn)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-sm font-semibold">Số điện thoại</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone || ""}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                placeholder="Số điện thoại liên hệ (tùy chọn)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-sm font-semibold">Email liên hệ</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail || ""}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                placeholder="Email liên hệ (tùy chọn)"
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label htmlFor="bannerImageUrl" className="text-sm font-semibold">Hình ảnh banner</Label>
            <Input
              id="bannerImageUrl"
              value={formData.bannerImageUrl || ""}
              onChange={(e) => handleInputChange("bannerImageUrl", e.target.value)}
              placeholder="URL hình ảnh banner (tùy chọn)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="galleryImages" className="text-sm font-semibold">Hình ảnh thư viện (URLs cách nhau bằng dấu phẩy)</Label>
            <Textarea
              id="galleryImages"
              value={formData.galleryImages || ""}
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
        </form>

        <DialogFooter className="flex justify-end gap-3 pt-6">
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
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật Sự kiện"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
