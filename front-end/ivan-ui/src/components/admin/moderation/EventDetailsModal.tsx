import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Building2, FileText, Clock } from 'lucide-react';
import type { ModerationEventDetailDto } from '@/types/moderation';

interface EventDetailsModalProps {
  event: ModerationEventDetailDto | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (eventId: number) => void;
  onReject: (eventId: number) => void;
  isLoading?: boolean;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isLoading = false,
}) => {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleApprove = () => {
    onApprove(event.eventId);
  };

  const handleReject = () => {
    onReject(event.eventId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Event Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Name */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{event.eventName}</h3>
            <Badge variant="outline" className="mb-4">
              ID: {event.eventId}
            </Badge>
          </div>

          <Separator />

          {/* Organization */}
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Organization</p>
              <p className="font-medium">{event.organizationName}</p>
            </div>
          </div>

          {/* Event Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{formatDate(event.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">{formatDate(event.endDate)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h4 className="font-semibold mb-3">Description</h4>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {event.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
          >
            Reject Event
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;