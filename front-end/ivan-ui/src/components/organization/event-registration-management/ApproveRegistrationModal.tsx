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
      <DialogContent className="max-w-md bg-gradient-to-br from-white/95 via-green-50/50 to-emerald-50/70 dark:from-slate-800/95 dark:via-slate-700/50 dark:to-slate-600/70 border-green-200/30 dark:border-slate-600/30 backdrop-blur-sm">
        <DialogHeader className="bg-gradient-to-r from-transparent via-green-50/30 to-emerald-50/50 dark:from-transparent dark:via-slate-700/30 dark:to-slate-600/50 p-6 -m-6 mb-4 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-xl text-green-700 dark:text-green-300">
            <CheckCircle className="h-6 w-6" />
            Duyệt đăng ký
          </DialogTitle>
          <DialogDescription className="text-left text-gray-600 dark:text-gray-400">
            Xác nhận duyệt đăng ký tham gia sự kiện
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Volunteer Info */}
          <div className="bg-gradient-to-br from-white/80 via-green-50/40 to-emerald-50/60 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 p-4 rounded-lg border border-green-200/30 dark:border-slate-600/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={registration.fullName || "User"} />
                <AvatarFallback className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 text-green-700 dark:text-green-300">
                  {registration.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-green-700 dark:text-green-300">
                  {registration.fullName || "Unknown User"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ID: #{registration.registrationId}
                </p>
              </div>
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
              className="min-h-[100px] bg-white/80 dark:bg-slate-700/80 border-green-200/50 dark:border-slate-600/50 focus:border-green-400 dark:focus:border-green-500 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {notes.length}/500 ký tự
            </p>
          </div>
        </div>

        <DialogFooter className="bg-gradient-to-r from-transparent via-green-50/20 to-emerald-50/30 dark:from-transparent dark:via-slate-700/20 dark:to-slate-600/30 p-6 -m-6 mt-4 rounded-b-lg">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting || loading}
            className="bg-white/80 hover:bg-gray-50 dark:bg-slate-700/80 dark:hover:bg-slate-600 border-gray-300 dark:border-slate-600"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || loading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Đang duyệt...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Duyệt đăng ký
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}