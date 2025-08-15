import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface RejectEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  eventName?: string;
  isLoading?: boolean;
}

export const RejectEventDialog: React.FC<RejectEventDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  eventName,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection.');
      return;
    }
    
    if (reason.trim().length < 10) {
      setError('Reason must be at least 10 characters long.');
      return;
    }

    setError('');
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
    if (error) {
      setError('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Reject Event
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {eventName && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Event:</p>
              <p className="font-medium">{eventName}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please provide a detailed reason for rejecting this event..."
              value={reason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className={error ? 'border-destructive' : ''}
              rows={4}
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters required. This reason will be sent to the organization.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? 'Rejecting...' : 'Reject Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectEventDialog;