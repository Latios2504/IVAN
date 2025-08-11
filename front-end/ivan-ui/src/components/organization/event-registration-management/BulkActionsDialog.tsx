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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Users, AlertTriangle } from "lucide-react";

interface BulkActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRegistrationIds: number[];
  selectedRegistrations: Array<{
    registrationId: number;
    volunteer: {
      fullName: string;
      email: string;
    };
  }>;
  onBulkApprove: (registrationIds: number[], notes?: string) => Promise<void>;
  onBulkReject: (registrationIds: number[], reason: string) => Promise<void>;
  loading?: boolean;
}

export const BulkActionsDialog: React.FC<BulkActionsDialogProps> = ({
  open,
  onOpenChange,
  selectedRegistrationIds,
  selectedRegistrations,
  onBulkApprove,
  onBulkReject,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState<"approve" | "reject">("approve");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleBulkApprove = async () => {
    try {
      setError(null);
      await onBulkApprove(
        selectedRegistrationIds,
        approvalNotes.trim() || undefined
      );
      setApprovalNotes("");
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve registrations"
      );
    }
  };

  const handleBulkReject = async () => {
    const trimmedReason = rejectionReason.trim();
    if (!trimmedReason) {
      setError("Please provide a reason for rejection");
      return;
    }

    try {
      setError(null);
      await onBulkReject(selectedRegistrationIds, trimmedReason);
      setRejectionReason("");
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reject registrations"
      );
    }
  };

  const handleCancel = () => {
    setApprovalNotes("");
    setRejectionReason("");
    setError(null);
    onOpenChange(false);
  };

  const selectedCount = selectedRegistrationIds.length;
  const isReasonValid = rejectionReason.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Users className="h-6 w-6" />
            Bulk Actions ({selectedCount} selected)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Registrations Summary */}
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              You have selected {selectedCount} registration
              {selectedCount !== 1 ? "s" : ""} for bulk action.
            </AlertDescription>
          </Alert>

          {/* Selected Registrations List */}
          <div className="max-h-40 overflow-y-auto bg-muted rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">
              Selected Registrations:
            </h4>
            <div className="space-y-1">
              {selectedRegistrations.map((registration, index) => (
                <div
                  key={registration.registrationId}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{registration.volunteer.fullName}</span>
                  <Badge variant="outline">
                    #{registration.registrationId}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Action Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "approve" | "reject")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="approve" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approve All
              </TabsTrigger>
              <TabsTrigger value="reject" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Reject All
              </TabsTrigger>
            </TabsList>

            <TabsContent value="approve" className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  This will approve all {selectedCount} selected registrations.
                  All volunteers will be notified and granted access to the
                  event.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="bulk-approval-notes">Notes (Optional)</Label>
                <Textarea
                  id="bulk-approval-notes"
                  placeholder="Add any additional notes for the bulk approval..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={3}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  These notes will be applied to all approved registrations.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="reject" className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This will reject all {selectedCount} selected registrations.
                  All volunteers will be notified and will not be able to
                  participate in this event.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="bulk-rejection-reason">
                  Reason for Rejection <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="bulk-rejection-reason"
                  placeholder="Please provide a clear reason for rejecting these registrations..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  disabled={loading}
                  className={
                    !isReasonValid && rejectionReason.length > 0
                      ? "border-red-300"
                      : ""
                  }
                />
                <p className="text-xs text-muted-foreground">
                  This reason will be shared with all rejected volunteers, so
                  please be constructive and professional.
                </p>
              </div>
            </TabsContent>
          </Tabs>

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

          {activeTab === "approve" ? (
            <Button
              onClick={handleBulkApprove}
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
                  Approve {selectedCount} Registration
                  {selectedCount !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleBulkReject}
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
                  Reject {selectedCount} Registration
                  {selectedCount !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkActionsDialog;
