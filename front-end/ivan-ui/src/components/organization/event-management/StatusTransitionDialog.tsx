import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Badge } from "../../ui/badge";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import type { EventDto, EventStatusDto } from "../../../types/event";
import { useEvent } from "../../../context/EventContext";
import { eventService } from "../../../services/eventService";

interface StatusTransitionDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventDto;
  statuses: EventStatusDto[];
  onSuccess?: () => void;
}

export const StatusTransitionDialog: React.FC<StatusTransitionDialogProps> = ({
  open,
  onClose,
  event,
  statuses,
  onSuccess,
}) => {
  const { loading } = useEvent();
  const [selectedStatusId, setSelectedStatusId] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [availableTransitions, setAvailableTransitions] = useState<number[]>(
    []
  );
  const [loadingTransitions, setLoadingTransitions] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (open && event) {
      loadAvailableTransitions();
    }
  }, [open, event]);

  const loadAvailableTransitions = async () => {
    try {
      setLoadingTransitions(true);
      const transitions = await eventService.getAvailableStatusTransitions(
        event.eventId
      );
      setAvailableTransitions(transitions);
    } catch (error) {
      console.error("Failed to load available transitions:", error);
      setError("Failed to load available status transitions");
    } finally {
      setLoadingTransitions(false);
    }
  };

  const getStatusIcon = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case "planning":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case "active":
        return "default";
      case "planning":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusDescription = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case "planning":
        return "Event is being planned and prepared";
      case "active":
        return "Event is accepting registrations";
      case "in-progress":
        return "Event is currently happening";
      case "completed":
        return "Event has finished successfully";
      case "cancelled":
        return "Event has been cancelled";
      case "postponed":
        return "Event has been postponed to a later date";
      default:
        return "Event status";
    }
  };

  const validateTransition = (
    fromStatus: string,
    toStatusId: number
  ): string | null => {
    const toStatus = statuses.find((s) => s.statusId === toStatusId);
    if (!toStatus) return "Invalid status selected";

    const toStatusName = toStatus.statusName.toLowerCase();
    const fromStatusName = fromStatus.toLowerCase();

    // Basic validation rules
    if (fromStatusName === "completed" && toStatusName !== "completed") {
      return "Cannot change status of a completed event";
    }

    if (fromStatusName === "cancelled" && toStatusName !== "cancelled") {
      return "Cannot reactivate a cancelled event";
    }

    if (toStatusName === "cancelled" && !reason.trim()) {
      return "Reason is required when cancelling an event";
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!selectedStatusId) {
      setError("Please select a status");
      return;
    }

    const validationError = validateTransition(
      event.statusName,
      selectedStatusId
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError("");
      await eventService.updateEventStatus(event.eventId, {
        statusId: selectedStatusId,
        reason: reason || undefined,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update event status:", error);
      setError("Failed to update event status. Please try again.");
    }
  };

  const handleClose = () => {
    setSelectedStatusId(0);
    setReason("");
    setError("");
    onClose();
  };

  const availableStatuses = statuses.filter(
    (status) =>
      availableTransitions.includes(status.statusId) &&
      status.statusId !== event.statusId
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Event Status</DialogTitle>
          <DialogDescription>
            Change the status of "{event.eventName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Status</Label>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              {getStatusIcon(event.statusName)}
              <Badge variant={getStatusVariant(event.statusName)}>
                {event.statusName}
              </Badge>
              <span className="text-sm text-gray-600">
                {getStatusDescription(event.statusName)}
              </span>
            </div>
          </div>

          {/* New Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="newStatus">New Status</Label>
            {loadingTransitions ? (
              <div className="p-2 text-sm text-gray-500">
                Loading available status transitions...
              </div>
            ) : availableStatuses.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 bg-yellow-50 rounded border border-yellow-200">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                No status transitions available for this event
              </div>
            ) : (
              <Select
                value={selectedStatusId.toString()}
                onValueChange={(value) => setSelectedStatusId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem
                      key={status.statusId}
                      value={status.statusId.toString()}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status.statusName)}
                        <span>{status.statusName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Status Preview */}
          {selectedStatusId > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center gap-2">
                  {getStatusIcon(
                    statuses.find((s) => s.statusId === selectedStatusId)
                      ?.statusName || ""
                  )}
                  <Badge
                    variant={getStatusVariant(
                      statuses.find((s) => s.statusId === selectedStatusId)
                        ?.statusName || ""
                    )}
                  >
                    {
                      statuses.find((s) => s.statusId === selectedStatusId)
                        ?.statusName
                    }
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {getStatusDescription(
                    statuses.find((s) => s.statusId === selectedStatusId)
                      ?.statusName || ""
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Reason (required for certain transitions) */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Status Change
              {selectedStatusId > 0 &&
                statuses
                  .find((s) => s.statusId === selectedStatusId)
                  ?.statusName.toLowerCase() === "cancelled" && (
                  <span className="text-red-500 ml-1">*</span>
                )}
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this status change is being made..."
              rows={3}
            />
            <p className="text-xs text-gray-500">
              This will be logged in the event history
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded border border-red-200">
              {error?.message || error?.toString() || 'Đã xảy ra lỗi'}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || selectedStatusId === 0 || loadingTransitions}
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
