import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  User,
  FileText,
  MessageSquare,
  Hash,
  Building,
} from "lucide-react";
import type { RegistrationDTO } from "@/types/eventRegistration";

interface RegistrationDetailModalProps {
  registration: RegistrationDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RegistrationDetailModal({
  registration,
  open,
  onOpenChange,
}: RegistrationDetailModalProps) {
  if (!registration) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-800 dark:to-amber-800 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600";
      case "approved":
        return "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600";
      case "rejected":
        return "bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-800 dark:to-rose-800 text-red-800 dark:text-red-200 border-red-300 dark:border-red-600";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white/95 via-blue-50/50 to-indigo-50/70 dark:from-slate-800/95 dark:via-slate-700/50 dark:to-slate-600/70 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
        <DialogHeader className="bg-gradient-to-r from-transparent via-blue-50/30 to-indigo-50/50 dark:from-transparent dark:via-slate-700/30 dark:to-slate-600/50 p-6 -m-6 mb-4 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" alt={registration.fullName || "User"} />
              <AvatarFallback className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-blue-700 dark:text-blue-300">
                {registration.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-left">
                {registration.fullName || "Unknown User"}
              </div>
              <Badge
                variant="outline"
                className={`text-sm mt-1 ${getStatusColor(
                  registration.statusName || "pending"
                )}`}
              >
                {registration.statusName || "Pending"}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-left text-gray-600 dark:text-gray-400">
            Chi tiết đăng ký tham gia sự kiện
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gradient-to-br from-white/80 via-blue-50/40 to-indigo-50/60 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 p-4 rounded-lg border border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <User className="h-5 w-5" />
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    ID Đăng ký:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    #{registration.registrationId}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    ID Sự kiện:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    #{registration.eventId}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    ID Tình nguyện viên:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    #{registration.volunteerId}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Ngày đăng ký:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {registration.applicationDate
                      ? new Date(registration.applicationDate).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Không có thông tin"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {registration.additionalInfo && (
            <div className="bg-gradient-to-br from-white/80 via-green-50/40 to-emerald-50/60 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 p-4 rounded-lg border border-green-200/30 dark:border-slate-600/30 backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-700 dark:text-green-300">
                <FileText className="h-5 w-5" />
                Thông tin bổ sung
              </h3>
              <div className="bg-white/60 dark:bg-slate-700/60 p-3 rounded-md border border-green-200/20 dark:border-slate-600/20">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {registration.additionalInfo}
                </p>
              </div>
            </div>
          )}

          {/* Motivation Letter */}
          {registration.motivationLetter && (
            <div className="bg-gradient-to-br from-white/80 via-purple-50/40 to-pink-50/60 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 p-4 rounded-lg border border-purple-200/30 dark:border-slate-600/30 backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <MessageSquare className="h-5 w-5" />
                Thư động lực
              </h3>
              <div className="bg-white/60 dark:bg-slate-700/60 p-3 rounded-md border border-purple-200/20 dark:border-slate-600/20">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {registration.motivationLetter}
                </p>
              </div>
            </div>
          )}

          {/* Empty state if no additional info */}
          {!registration.additionalInfo && !registration.motivationLetter && (
            <div className="bg-gradient-to-br from-gray-50/80 via-slate-50/60 to-blue-50/80 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 p-6 rounded-lg border border-gray-200/30 dark:border-slate-600/30 backdrop-blur-sm text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                Tình nguyện viên chưa cung cấp thông tin bổ sung hoặc thư động lực.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}