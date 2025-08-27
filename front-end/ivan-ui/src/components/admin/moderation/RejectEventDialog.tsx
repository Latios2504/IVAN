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
      setError('Vui lòng cung cấp lý do từ chối.');
      return;
    }
    
    if (reason.trim().length < 10) {
      setError('Lý do phải có ít nhất 10 ký tự.');
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
      <DialogContent className="max-w-md bg-background border-border shadow-2xl rounded-2xl">
        <DialogHeader className="bg-muted/30 p-4 rounded-xl border border-border shadow-md">
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Từ chối sự kiện
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border shadow-sm">
          {eventName && (
            <div className="p-3 bg-background rounded-xl border border-border shadow-sm">
              <p className="text-sm text-destructive mb-1">Sự kiện:</p>
              <p className="font-medium text-foreground">{eventName}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="rejection-reason" className="text-foreground">Lý do từ chối *</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Vui lòng cung cấp lý do chi tiết để từ chối sự kiện này..."
              value={reason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className={`bg-background border-border rounded-xl ${error ? 'border-destructive' : ''}`}
              rows={4}
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Yêu cầu tối thiểu 10 ký tự. Lý do này sẽ được gửi đến tổ chức.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 bg-muted/30 p-4 rounded-xl border border-border shadow-md">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-xl"
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
            className="rounded-xl shadow-md"
          >
            {isLoading ? 'Đang từ chối...' : 'Từ chối sự kiện'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectEventDialog;