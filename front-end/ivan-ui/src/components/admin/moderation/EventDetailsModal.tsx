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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-950 border-emerald-200 dark:border-emerald-800 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700 shadow-md">
          <DialogTitle className="flex items-center gap-2 text-xl bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
            <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Event Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-sm">
          {/* Event Name */}
          <div className="bg-gradient-to-r from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-950 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-emerald-800 dark:text-emerald-200">{event.eventName}</h3>
            <Badge variant="outline" className="mb-4 bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
              ID: {event.eventId}
            </Badge>
          </div>

          <Separator className="bg-emerald-200 dark:bg-emerald-700" />

          {/* Organization */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 p-4 rounded-lg border border-teal-200 dark:border-teal-700 shadow-sm">
            <Building2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <div>
              <p className="text-sm text-teal-600 dark:text-teal-400">Organization</p>
              <p className="font-medium text-teal-800 dark:text-teal-200">{event.organizationName}</p>
            </div>
          </div>

          {/* Event Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 p-4 rounded-lg border border-cyan-200 dark:border-cyan-700 shadow-sm">
              <Calendar className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <div>
                <p className="text-sm text-cyan-600 dark:text-cyan-400">Start Date</p>
                <p className="font-medium text-cyan-800 dark:text-cyan-200">{formatDate(event.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">End Date</p>
                <p className="font-medium text-blue-800 dark:text-blue-200">{formatDate(event.endDate)}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-emerald-200 dark:bg-emerald-700" />

          {/* Description */}
          <div className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-950 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700 shadow-sm">
            <h4 className="font-semibold mb-3 text-emerald-800 dark:text-emerald-200">Description</h4>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-emerald-700 dark:text-emerald-300">
                {event.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700 shadow-md">
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