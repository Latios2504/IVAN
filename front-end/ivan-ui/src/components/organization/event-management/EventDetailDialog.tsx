import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "../../ui/alert";
import type {
  EventDto,
  EventCategoryDto,
  EventStatusDto,
} from "../../../types/events";
import { eventsService } from "../../../services/eventsService";

interface EventDetailDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventDto | null;
  categories: EventCategoryDto[];
  statuses: EventStatusDto[];
  onEventUpdated?: () => void;
}

export const EventDetailDialog: React.FC<EventDetailDialogProps> = ({
  open,
  onClose,
  event,
  categories,
  statuses,
  onEventUpdated,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  if (!event) return null;

  // Get valid next statuses based on current status
  const getValidNextStatuses = (currentStatusId: number): EventStatusDto[] => {
    const validTransitions: { [key: number]: number[] } = {
      2: [3, 5], // Published -> Ongoing, Cancelled
      3: [4, 5], // Ongoing -> Completed, Cancelled
    };

    const validStatusIds = validTransitions[currentStatusId] || [];
    return statuses.filter(status => validStatusIds.includes(status.statusId));
  };

  const validNextStatuses = getValidNextStatuses(event.statusId);
  const canUpdateStatus = validNextStatuses.length > 0;

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;

    setIsUpdatingStatus(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      await eventsService.updateEventStatus(event.eventId, {
        status: selectedStatus,
      });
      setUpdateSuccess(true);
      setSelectedStatus("");
      onEventUpdated?.();
      
      // Auto close success message after 2 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 2000);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Không thể cập nhật trạng thái sự kiện"
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {event.eventName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Main Information Grid - 3 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Basic Event Info */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Thông tin sự kiện</h3>
              <div className="space-y-3">
                <p>
                  <strong>Danh mục:</strong> {event.categoryName}
                </p>
                <p>
                  <strong className="text-gray-700 dark:text-gray-300">Trạng thái:</strong>{" "}
                  <Badge variant="default">{event.statusName}</Badge>
                </p>
                <p>
                  <strong>Tổ chức:</strong> {event.organizationName}
                </p>
                {event.shortDescription && (
                  <p>
                    <strong>Mô tả ngắn:</strong> {event.shortDescription}
                  </p>
                )}
                {(event.isFeatured || event.isUrgent) && (
                  <div className="mt-4 flex gap-2">
                    {event.isFeatured && (
                      <Badge variant="secondary">
                        Nổi bật
                      </Badge>
                    )}
                    {event.isUrgent && (
                      <Badge variant="destructive">
                        Khẩn cấp
                      </Badge>
                    )}
                  </div>
                )}
                {(event.createdAt || event.updatedAt) && (
                  <div className="mt-4 text-sm text-muted-foreground border-t pt-3">
                    {event.createdAt && (
                      <p>
                        <strong>Tạo lúc:</strong> {new Date(event.createdAt).toLocaleString()}
                      </p>
                    )}
                    {event.updatedAt && (
                      <p>
                        <strong>Cập nhật lần cuối:</strong> {new Date(event.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Dates & Volunteers */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Lịch trình & Tình nguyện viên</h3>
              <div className="space-y-3">
                <div className="border-b pb-3 mb-3">
                    <h4 className="font-medium mb-2">Ngày diễn ra sự kiện</h4>
                  <p>
                    <strong>Ngày bắt đầu:</strong>{" "}
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Ngày kết thúc:</strong>{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>
                </div>
                {(event.registrationStartDate || event.registrationEndDate) && (
                  <div className="border-b pb-3 mb-3">
                    <h4 className="font-medium mb-2">Thời gian đăng ký</h4>
                    {event.registrationStartDate && (
                      <p>
                        <strong>Bắt đầu đăng ký:</strong>{" "}
                        {new Date(event.registrationStartDate).toLocaleDateString()}
                      </p>
                    )}
                    {event.registrationEndDate && (
                      <p>
                        <strong>Kết thúc đăng ký:</strong>{" "}
                        {new Date(event.registrationEndDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <h4 className="font-medium mb-2">Thông tin tình nguyện viên</h4>
                  <p>
                    <strong>Đã đăng ký:</strong> {event.volunteersRegistered || 0}
                  </p>
                  <p>
                    <strong>Tối thiểu:</strong> {event.minVolunteers}
                  </p>
                  <p>
                    <strong>Tối đa:</strong> {event.maxVolunteers || "Không giới hạn"}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Location */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Địa điểm</h3>
              <div className="space-y-3">
                <p>
                  <strong>Địa điểm:</strong> {event.location}
                </p>
                {event.detailedAddress && (
                  <p>
                    <strong>Địa chỉ:</strong> {event.detailedAddress}
                  </p>
                )}
                {event.district && (
                  <p>
                    <strong>Quận/Huyện:</strong> {event.district}
                  </p>
                )}
                {event.province && (
                  <p>
                    <strong>Tỉnh/Thành phố:</strong> {event.province}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Images Section */}
          {(event.bannerImageUrl || event.galleryImages) && (
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Hình ảnh sự kiện</h3>
              <div className="space-y-4">
                {event.bannerImageUrl && (
                  <div>
                    <h4 className="font-medium mb-2">Ảnh banner</h4>
                    <img 
                      src={event.bannerImageUrl} 
                      alt="Event Banner" 
                      className="max-w-full h-auto rounded-lg shadow-md max-h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {event.galleryImages && (
                  <div>
                    <h4 className="font-medium mb-2">Thư viện ảnh</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {event.galleryImages.split(',').map((url, index) => (
                        <img 
                          key={index}
                          src={url.trim()} 
                          alt={`Gallery ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Mô tả</h3>
              <p className="text-foreground leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-muted/50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">Thông tin liên hệ</h3>
            <div className="space-y-3">
              {event.contactPerson && (
                <p>
                  <strong>Người liên hệ:</strong> {event.contactPerson}
                </p>
              )}
              {event.contactPhone && (
                <p>
                  <strong>Số điện thoại:</strong> {event.contactPhone}
                </p>
              )}
              {event.contactEmail && (
                <p>
                  <strong>Email:</strong> {event.contactEmail}
                </p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-muted/50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">
              Thông tin bổ sung
            </h3>
            <div className="space-y-3">
              {event.requiredSkills && (
                <p>
                  <strong>Kỹ năng yêu cầu:</strong> {event.requiredSkills}
                </p>
              )}
              {event.ageRequirement && (
                <p>
                  <strong>Yêu cầu độ tuổi:</strong> {event.ageRequirement}
                </p>
              )}
              {event.genderRequirement && (
                <p>
                  <strong>Yêu cầu giới tính:</strong> {event.genderRequirement}
                </p>
              )}
              {event.requirements && (
                <p>
                  <strong>Yêu cầu:</strong> {event.requirements}
                </p>
              )}
              {event.benefits && (
                <p>
                  <strong>Lợi ích:</strong> {event.benefits}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status Update Messages */}
        {updateError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {updateError}
            </AlertDescription>
          </Alert>
        )}
        
        {updateSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
Cập nhật trạng thái sự kiện thành công!
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center gap-3 pt-6 border-t">
          {/* Status Update Section */}
          {canUpdateStatus && (
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium">Cập nhật trạng thái:</span>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {validNextStatuses.map((status) => (
                    <SelectItem key={status.statusId} value={status.statusName}>
                      {status.statusName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || isUpdatingStatus}
                size="sm"
              >
                {isUpdatingStatus ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
