import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, User } from "lucide-react";
import type { RegistrationDTO, ApproveRegistrationRequestDTO } from "@/types/eventRegistration";

interface ApproveRegistrationModalProps {
  registration: RegistrationDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (registrationId: number, request: ApproveRegistrationRequestDTO) => Promise<void>;
  loading?: boolean;
}

export default function ApproveRegistrationModal({
  registration,
  open,
  onOpenChange,
  onApprove,
  loading = false,
}: ApproveRegistrationModalProps) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!registration) return;

    setIsSubmitting(true);
    try {
      await onApprove(registration.registrationId, {
        notes: notes.trim() || undefined,
      });
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNotes("");
    onOpenChange(false);
  };

  if (!registration) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Phê duyệt đăng ký
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

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ghi chú (tùy chọn)
            </Label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú cho việc duyệt đăng ký..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {notes.length}/500 ký tự
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting || loading}
          >
            Hủy
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? "Đang xử lý..." : "Phê duyệt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}