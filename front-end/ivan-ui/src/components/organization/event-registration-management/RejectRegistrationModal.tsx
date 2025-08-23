import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { XCircle, User } from "lucide-react";
import type { RegistrationDTO, RejectRegistrationRequestDTO } from "@/types/eventRegistration";

interface RejectRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: RegistrationDTO | null;
  onReject: (request: RejectRegistrationRequestDTO) => Promise<void>;
  isLoading?: boolean;
}

export function RejectRegistrationModal({
  isOpen,
  onClose,
  registration,
  onReject,
  isLoading = false,
}: RejectRegistrationModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!registration || !rejectionReason.trim()) return;

    setIsSubmitting(true);
    try {
      const request: RejectRegistrationRequestDTO = {
        reason: rejectionReason.trim(),
      };
      await onReject(request);
      handleClose();
    } catch (error) {
      console.error("Error rejecting registration:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRejectionReason("");
    onClose();
  };

  if (!registration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Từ chối đăng ký
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Volunteer Information */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={registration.fullName} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{registration.fullName}</p>
              <Badge variant="outline" className="text-xs">
                {registration.statusName}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Rejection Reason */}
          <div className="space-y-2">
            <Label htmlFor="rejectionReason" className="text-sm font-medium">
              Lý do từ chối <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              placeholder="Nhập lý do từ chối đăng ký..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Lý do này sẽ được gửi đến tình nguyện viên.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!rejectionReason.trim() || isSubmitting || isLoading}
          >
            {isSubmitting ? "Đang xử lý..." : "Từ chối"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}