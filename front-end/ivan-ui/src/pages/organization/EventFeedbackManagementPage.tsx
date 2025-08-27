import React, { useState, useEffect } from "react";
import { eventsService } from "@/services/eventsService";
import type { EventDto } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Import feedback management components
import FeedbackList from "@/components/organization/event-feedback-management/FeedbackList";
import FeedbackFilters from "@/components/organization/event-feedback-management/FeedbackFilters";

// Simple event summary interface for internal use
interface EventSummary {
  eventId: number;
  eventName: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  statusName?: string;
}

interface FeedbackFilters {
  page: number;
  size: number;
  categoryId?: number;
  rating?: number;
}

interface EventSelectorProps {
  onEventSelect: (event: EventSummary | null) => void;
  selectedEvent: EventSummary | null;
}

const EventSelector: React.FC<EventSelectorProps> = ({
  onEventSelect,
  selectedEvent,
}) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventDto[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      // Only load events if user is authenticated and has organizationId
      if (!user?.organizationId) {
        setEventsError("Organization ID not found");
        return;
      }

      setEventsLoading(true);
      setEventsError(null);
      try {
        const filters = {
          page: 1,
          size: 100,
          sortBy: "startDate",
          sortDirection: "desc" as const,
          organizationId: user.organizationId, // Filter by organization's own events only
        };
        const result = await eventsService.getEvents(filters);

        // Filter to only show completed events (since we can only manage feedback for completed events)
        const completedEvents = result.items.filter((event: EventDto) => {
          const status = event.statusName?.toLowerCase();
          return status === "completed" || status === "hoàn thành";
        });

        setEvents(completedEvents);
      } catch (err) {
        setEventsError(
          err instanceof Error ? err.message : "Failed to load events"
        );
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, [user?.organizationId]);

  const handleEventChange = (eventId: string) => {
    if (eventId === "none") {
      onEventSelect(null);
    } else {
      const event = events.find(
        (e: EventDto) => e.eventId.toString() === eventId
      );
      if (event) {
        const eventSummary: EventSummary = {
          eventId: event.eventId,
          eventName: event.eventName,
          description: event.description || "",
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location || "",
          statusName: event.statusName || "",
        };
        onEventSelect(eventSummary);
      } else {
        onEventSelect(null);
      }
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 border border-green-200 dark:border-green-800 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-t-lg border-b border-green-200 dark:border-green-800">
        <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
          <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
          Chọn sự kiện đã hoàn thành để xem phản hồi
        </CardTitle>
        <p className="text-sm text-green-700 dark:text-green-300">
          Chỉ hiển thị các sự kiện đã hoàn thành vì chỉ có thể quản lý phản hồi
          từ những sự kiện đã kết thúc.
        </p>
      </CardHeader>
      <CardContent>
        {eventsError ? (
          <div className="text-center py-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-sm">{eventsError}</p>
          </div>
        ) : (
          <>
            <Select
              value={selectedEvent?.eventId.toString() || "none"}
              onValueChange={handleEventChange}
              disabled={eventsLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    eventsLoading
                      ? "Đang tải danh sách sự kiện đã hoàn thành..."
                      : events.length === 0
                      ? "Không có sự kiện nào đã hoàn thành cho tổ chức của bạn"
                      : "Chọn sự kiện đã hoàn thành để xem phản hồi"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {events.length === 0
                    ? "Không có sự kiện nào đã hoàn thành"
                    : "Chọn một sự kiện đã hoàn thành..."}
                </SelectItem>
                {events?.map((event: EventDto) => (
                  <SelectItem
                    key={event.eventId}
                    value={event.eventId.toString()}
                  >
                    <span>{event.eventName}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {selectedEvent && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950 dark:via-amber-950 dark:to-orange-950 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-md">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100">{selectedEvent.eventName}</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {selectedEvent.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1 text-yellow-700 dark:text-yellow-300">
                <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                {new Date(selectedEvent.startDate).toLocaleDateString("vi-VN")}
                {selectedEvent.endDate !== selectedEvent.startDate && (
                  <>
                    {" - "}
                    {new Date(selectedEvent.endDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </>
                )}
              </span>

            </div>
            {selectedEvent.location && (
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                📍 {selectedEvent.location}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Event Feedback Management Page
const EventFeedbackManagementPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventSummary | null>(null);
  const [filters, setFilters] = useState<FeedbackFilters>({
    page: 1,
    size: 10,
  });

  // Handle filter changes
  const handleFiltersChange = (newFilters: Partial<FeedbackFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Reset filters when event changes
  useEffect(() => {
    if (selectedEvent) {
      setFilters({
        page: 1,
        size: 10,
      });
    }
  }, [selectedEvent]);

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 rounded-xl border border-blue-200 dark:border-blue-800 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800 shadow-md">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100">
            Quản lý phản hồi sự kiện
          </h1>
          <p className="text-blue-700 dark:text-blue-300">
            Xem và quản lý phản hồi từ người tham gia sự kiện của tổ chức bạn
          </p>
        </div>
      </div>

      {/* Information about filtering */}
      <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950 dark:via-blue-950 dark:to-indigo-950 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4 shadow-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <MessageSquare className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-cyan-800 dark:text-cyan-200">
              <strong>Lưu ý:</strong> Chỉ hiển thị các sự kiện đã hoàn thành.
              Phản hồi chỉ có thể được thu thập và quản lý từ những sự kiện đã
              kết thúc.
            </p>
          </div>
        </div>
      </div>

      <EventSelector
        selectedEvent={selectedEvent}
        onEventSelect={setSelectedEvent}
      />

      {selectedEvent ? (
        <div className="space-y-4">
          <FeedbackFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
          <FeedbackList
            eventId={selectedEvent.eventId}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-950 dark:via-slate-950 dark:to-zinc-950 border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardContent className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Chọn sự kiện đã hoàn thành để xem phản hồi
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Vui lòng chọn một sự kiện đã hoàn thành từ danh sách trên để xem
              các phản hồi từ người tham gia. Chỉ có thể quản lý phản hồi cho
              những sự kiện đã kết thúc.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventFeedbackManagementPage;
