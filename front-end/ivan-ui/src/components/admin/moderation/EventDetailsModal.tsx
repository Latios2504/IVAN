import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Building2, 
  FileText, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Phone, 
  Mail, 
  User,
  CheckCircle,
  Gift
} from 'lucide-react';
import type { EventDto } from '@/types/events';

interface EventDetailsModalProps {
  event: EventDto | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (eventId: number) => void;
  onReject: (eventId: number) => void;
  isLoading?: boolean;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isLoading = false,
}) => {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleApprove = () => {
    onApprove(event.eventId);
  };

  const handleReject = () => {
    onReject(event.eventId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-950 border-emerald-200 dark:border-emerald-800 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700 shadow-md">
          <DialogTitle className="flex items-center gap-2 text-xl bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
            <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Chi tiết sự kiện
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Main Information Grid - 3 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Basic Event Info */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
              <h3 className="text-lg font-semibold mb-3 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Thông tin sự kiện
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">{event.eventName}</h4>
                  <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                    ID: {event.eventId}
                  </Badge>
                </div>
                <p className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-600" />
                  <strong>Danh mục:</strong> {event.categoryName}
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <strong>Trạng thái:</strong>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">{event.statusName}</Badge>
                </p>
                <p className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  <strong>Tổ chức:</strong> {event.organizationName || 'Không có'}
                </p>
                {event.shortDescription && (
                  <p>
                    <strong>Mô tả ngắn:</strong> {event.shortDescription}
                  </p>
                )}
                {(event.isFeatured || event.isUrgent) && (
                  <div className="mt-4 flex gap-2">
                    {event.isFeatured && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Nổi bật
                      </Badge>
                    )}
                    {event.isUrgent && (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Khẩn cấp
                      </Badge>
                    )}
                  </div>
                )}
                {(event.createdAt || event.updatedAt) && (
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 border-t pt-3">
                    {event.createdAt && (
                      <p>
                        <strong>Ngày tạo:</strong> {formatDate(event.createdAt)}
                      </p>
                    )}
                    {event.updatedAt && (
                      <p>
                        <strong>Cập nhật lần cuối:</strong> {formatDate(event.updatedAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Dates & Volunteers */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Lịch trình & Tình nguyện viên
              </h3>
              <div className="space-y-3">
                <div className="border-b pb-3 mb-3">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Thời gian sự kiện</h4>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <strong>Bắt đầu:</strong> {formatDate(event.startDate)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <strong>Kết thúc:</strong> {formatDate(event.endDate)}
                  </p>
                </div>
                {(event.registrationStartDate || event.registrationEndDate) && (
                  <div className="border-b pb-3 mb-3">
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Thời gian đăng ký</h4>
                    {event.registrationStartDate && (
                      <p>
                        <strong>Bắt đầu đăng ký:</strong> {formatDate(event.registrationStartDate)}
                      </p>
                    )}
                    {event.registrationEndDate && (
                      <p>
                        <strong>Kết thúc đăng ký:</strong> {formatDate(event.registrationEndDate)}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Thông tin tình nguyện viên
                  </h4>
                  <p>
                    <strong>Đã đăng ký:</strong> {event.volunteersRegistered || 0}
                  </p>
                  <p>
                    <strong>Tối thiểu yêu cầu:</strong> {event.minVolunteers}
                  </p>
                  <p>
                    <strong>Tối đa cho phép:</strong> {event.maxVolunteers || "Không giới hạn"}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Location */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <h3 className="text-lg font-semibold mb-3 text-purple-800 dark:text-purple-300 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Địa điểm
              </h3>
              <div className="space-y-3">
                <p>
                  <strong>Địa điểm:</strong> {event.location || 'Không có'}
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
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
              <h3 className="text-lg font-semibold mb-3 text-amber-800 dark:text-amber-300">Hình ảnh sự kiện</h3>
              <div className="space-y-4">
                {event.bannerImageUrl && (
                  <div>
                    <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-2">Hình banner</h4>
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
                    <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-2">Thư viện hình ảnh</h4>
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
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <h3 className="text-lg font-semibold mb-3 text-indigo-800 dark:text-indigo-300">Mô tả</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
            <h3 className="text-lg font-semibold mb-3 text-orange-800 dark:text-orange-300 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Thông tin liên hệ
            </h3>
            <div className="space-y-3">
              {event.contactPerson && (
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-orange-600" />
                  <strong>Người liên hệ:</strong> {event.contactPerson}
                </p>
              )}
              {event.contactPhone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-orange-600" />
                  <strong>Điện thoại:</strong> {event.contactPhone}
                </p>
              )}
              {event.contactEmail && (
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-orange-600" />
                  <strong>Email:</strong> {event.contactEmail}
                </p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-700">
            <h3 className="text-lg font-semibold mb-3 text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
              <Gift className="h-5 w-5" />
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
                  <strong>Quyền lợi:</strong> {event.benefits}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700 shadow-md">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Đóng
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
          >
            Từ chối sự kiện
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            Phê duyệt sự kiện
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;