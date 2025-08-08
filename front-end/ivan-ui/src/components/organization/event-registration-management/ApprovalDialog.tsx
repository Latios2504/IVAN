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
import { CheckCircle, AlertCircle } from "lucide-react";
import type {
  Registration,
  ApproveRegistrationRequest,
} from "@/types/eventRegistration";

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: Registration | null;
  onConfirm: (
    registrationId: number,
    request: ApproveRegistrationRequest
  ) => Promise<void>;
  loading?: boolean;
}

export const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  open,
  onOpenChange,
  registration,
  onConfirm,
  loading = false,
}) => {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!registration) return;

    try {
      setError(null);
      await onConfirm(registration.registrationId, {
        notes: notes.trim() || undefined,
      });
      setNotes("");
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve registration"
      );
    }
  };

  const handleCancel = () => {
    setNotes("");
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

  const volunteerName =
    registration.volunteer?.fullName || registration.fullName || "Unknown";
  const volunteerEmail = registration.volunteer?.email || "No email";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Approve Registration
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

          {/* Confirmation Message */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Are you sure you want to approve this volunteer registration? This
              action will notify the volunteer and grant them access to the
              event.
            </AlertDescription>
          </Alert>

          {/* Optional Notes */}
          <div className="space-y-2">
            <Label htmlFor="approval-notes">Notes (Optional)</Label>
            <Textarea
              id="approval-notes"
              placeholder="Add any additional notes for the approval..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              These notes will be saved with the approval record for future
              reference.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
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
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Registration
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalDialog;
