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
      <DialogContent className="max-w-md bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-950 border-red-200 dark:border-red-800 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900 dark:to-orange-900 p-4 rounded-lg border border-red-200 dark:border-red-700 shadow-md">
          <DialogTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <AlertTriangle className="h-5 w-5" />
            Reject Event
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 p-4 rounded-lg border border-red-200 dark:border-red-800 shadow-sm">
          {eventName && (
            <div className="p-3 bg-gradient-to-r from-white to-red-50 dark:from-gray-800 dark:to-red-950 rounded-lg border border-red-200 dark:border-red-700 shadow-sm">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">Event:</p>
              <p className="font-medium text-red-800 dark:text-red-200">{eventName}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="rejection-reason" className="text-red-700 dark:text-red-300">Reason for Rejection *</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please provide a detailed reason for rejecting this event..."
              value={reason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className={`bg-white dark:bg-gray-800 border-red-200 dark:border-red-700 focus:border-red-400 dark:focus:border-red-500 ${error ? 'border-red-500 dark:border-red-400' : ''}`}
              rows={4}
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <p className="text-xs text-red-600 dark:text-red-400">
              Minimum 10 characters required. This reason will be sent to the organization.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900 dark:to-orange-900 p-4 rounded-lg border border-red-200 dark:border-red-700 shadow-md">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-md"
          >
            {isLoading ? 'Rejecting...' : 'Reject Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectEventDialog;