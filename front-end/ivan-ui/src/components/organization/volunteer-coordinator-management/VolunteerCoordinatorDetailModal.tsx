import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  User,
  Building,
  Briefcase,
  DollarSign,
  FileText,
  Clock,
} from "lucide-react";
import type { VolunteerCoordinatorDto } from "@/types/volunteerCoordinator";

interface VolunteerCoordinatorDetailModalProps {
  coordinator: VolunteerCoordinatorDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (isActive?: boolean) => {
  if (isActive === true) {
    return "bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-800 dark:to-green-800 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-600";
  } else if (isActive === false) {
    return "bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-800 dark:to-rose-800 text-red-800 dark:text-red-200 border-red-300 dark:border-red-600";
  } else {
    return "bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600";
  }
};

export const VolunteerCoordinatorDetailModal: React.FC<
  VolunteerCoordinatorDetailModalProps
> = ({ coordinator, open, onOpenChange }) => {
  if (!coordinator) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            Chi tiết Volunteer Coordinator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 rounded-lg border border-blue-200 dark:border-blue-800">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={coordinator.user?.avatar}
                alt={coordinator.user?.fullName}
              />
              <AvatarFallback className="text-lg">
                {coordinator.user?.fullName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase() || "UC"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                    {coordinator.user?.fullName || "N/A"}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    {coordinator.position || "Điều phối viên tình nguyện"}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    ID: {coordinator.employeeId || coordinator.coordinatorId}
                  </p>
                </div>
                <Badge className={getStatusColor(coordinator.isActive)}>
                  {coordinator.isActive ? "Đang hoạt động" : "Không hoạt động"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Thông tin liên hệ
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm text-emerald-800 dark:text-emerald-200">
                    {coordinator.user?.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm text-emerald-800 dark:text-emerald-200">
                    {coordinator.user?.phoneNumber || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Organization Information */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Thông tin tổ chức
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-purple-800 dark:text-purple-200">
                    {coordinator.organizationName || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-purple-800 dark:text-purple-200">
                    {coordinator.department || "Chung"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800" />

          {/* Employment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-100 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Thông tin công việc
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-700 dark:text-orange-300">
                    Ngày bắt đầu:
                  </span>
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    {formatDate(coordinator.hireDate)}
                  </span>
                </div>
                {coordinator.endDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-700 dark:text-orange-300">
                      Ngày kết thúc:
                    </span>
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      {formatDate(coordinator.endDate)}
                    </span>
                  </div>
                )}
                {coordinator.salary && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-700 dark:text-orange-300 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Lương:
                    </span>
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      {formatCurrency(coordinator.salary)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Manager Information */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 rounded-lg border border-teal-200 dark:border-teal-800">
              <h4 className="text-lg font-semibold text-teal-900 dark:text-teal-100 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Quản lý trực tiếp
              </h4>
              {coordinator.manager ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={coordinator.manager.avatar}
                        alt={coordinator.manager.fullName}
                      />
                      <AvatarFallback>
                        {coordinator.manager.fullName
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase() || "M"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-teal-800 dark:text-teal-200">
                        {coordinator.manager.fullName || "N/A"}
                      </div>
                      <div className="text-xs text-teal-600 dark:text-teal-400">
                        {coordinator.manager.email}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-teal-600 dark:text-teal-400">
                  Chưa có quản lý được chỉ định
                </p>
              )}
            </div>
          </div>

          {/* Responsibilities and Notes */}
          {(coordinator.responsibilities || coordinator.notes) && (
            <>
              <Separator className="bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800" />
              <div className="space-y-4">
                {coordinator.responsibilities && (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center mb-3">
                      <FileText className="w-5 h-5 mr-2" />
                      Trách nhiệm
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                      {coordinator.responsibilities}
                    </p>
                  </div>
                )}
                {coordinator.notes && (
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950 rounded-lg border border-gray-200 dark:border-gray-800">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-3">
                      <FileText className="w-5 h-5 mr-2" />
                      Ghi chú
                    </h4>
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {coordinator.notes}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Audit Information */}
          <Separator className="bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Thông tin tạo
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Ngày tạo:
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {formatDate(coordinator.createdAt)}
                  </span>
                </div>
                {coordinator.createdByUser && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Tạo bởi:
                    </span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {coordinator.createdByUser.fullName ||
                        coordinator.createdByUser.email}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Cập nhật cuối
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Ngày cập nhật:
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {formatDate(coordinator.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
