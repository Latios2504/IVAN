import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, AlertTriangle } from "lucide-react";
import type {
  Registration,
  RejectRegistrationRequest,
} from "@/types/eventRegistration";

interface RejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: Registration | null;
  onConfirm: (
    registrationId: number,
    request: RejectRegistrationRequest
  ) => Promise<void>;
  loading?: boolean;
}

export const RejectionDialog: React.FC<RejectionDialogProps> = ({
  open,
  onOpenChange,
  registration,
  onConfirm,
  loading = false,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!registration) return;

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setError("Please provide a reason for rejection");
      return;
    }

    try {
      setError(null);
      await onConfirm(registration.registrationId, { reason: trimmedReason });
      setReason("");
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reject registration"
      );
    }
  };

  const handleCancel = () => {
    setReason("");
    setError(null);
    onOpenChange(false);
  };

  const getVolunteerInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!registration) return null;

  const isReasonValid = reason.trim().length > 0;
  const volunteerName =
    registration.volunteer?.fullName || registration.fullName || "Unknown";
  const volunteerEmail = registration.volunteer?.email || "No email";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <XCircle className="h-6 w-6 text-red-600" />
            Reject Registration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Volunteer Info */}
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={registration.volunteer?.profileImage} />
              <AvatarFallback>
                {getVolunteerInitials(volunteerName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium">{volunteerName}</h4>
              <p className="text-sm text-muted-foreground">{volunteerEmail}</p>
            </div>
            <Badge variant="outline">#{registration.registrationId}</Badge>
          </div>

          {/* Warning Message */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Are you sure you want to reject this volunteer registration? This
              action will notify the volunteer and they will not be able to
              participate in this event.
            </AlertDescription>
          </Alert>

          {/* Required Reason */}
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">
              Reason for Rejection <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please provide a clear reason for rejecting this registration..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              disabled={loading}
              className={
                !isReasonValid && reason.length > 0 ? "border-red-300" : ""
              }
            />
            <p className="text-xs text-muted-foreground">
              This reason will be shared with the volunteer, so please be
              constructive and professional.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || !isReasonValid}
            variant="destructive"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Reject Registration
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionDialog;
