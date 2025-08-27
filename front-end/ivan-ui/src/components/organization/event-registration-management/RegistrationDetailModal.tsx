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

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" alt={registration.fullName || "User"} />
              <AvatarFallback>
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
                variant={getStatusVariant(registration.statusName || "pending")}
                className="text-sm mt-1"
              >
                {registration.statusName || "Pending"}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-left text-muted-foreground">
            Chi tiết đăng ký tham gia sự kiện
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-muted/50 p-4 rounded-lg border">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    ID Đăng ký:
                  </span>
                  <span className="text-muted-foreground">
                    #{registration.registrationId}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    ID Sự kiện:
                  </span>
                  <span className="text-muted-foreground">
                    #{registration.eventId}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    ID Tình nguyện viên:
                  </span>
                  <span className="text-muted-foreground">
                    #{registration.volunteerId}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    Ngày đăng ký:
                  </span>
                  <span className="text-muted-foreground">
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
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Thông tin bổ sung
              </h3>
              <div className="bg-background p-3 rounded-md border">
                <p className="whitespace-pre-wrap">
                  {registration.additionalInfo}
                </p>
              </div>
            </div>
          )}

          {/* Motivation Letter */}
          {registration.motivationLetter && (
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Thư động lực
              </h3>
              <div className="bg-background p-3 rounded-md border">
                <p className="whitespace-pre-wrap">
                  {registration.motivationLetter}
                </p>
              </div>
            </div>
          )}

          {/* Empty state if no additional info */}
          {!registration.additionalInfo && !registration.motivationLetter && (
            <div className="bg-muted/50 p-6 rounded-lg border text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Tình nguyện viên chưa cung cấp thông tin bổ sung hoặc thư động lực.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}