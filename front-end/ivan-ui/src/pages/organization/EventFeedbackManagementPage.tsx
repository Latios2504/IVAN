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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Chọn sự kiện đã hoàn thành để xem phản hồi
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Chỉ hiển thị các sự kiện đã hoàn thành vì chỉ có thể quản lý phản hồi
          từ những sự kiện đã kết thúc.
        </p>
      </CardHeader>
      <CardContent>
        {eventsError ? (
          <div className="text-center py-4">
            <p className="text-red-600 text-sm">{eventsError}</p>
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
                    <div className="flex items-center gap-2">
                      <span>{event.eventName}</span>
                      <Badge variant="outline">{event.statusName}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {selectedEvent && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium">{selectedEvent.eventName}</h4>
            <p className="text-sm text-muted-foreground">
              {selectedEvent.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
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
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                {selectedEvent.statusName}
              </Badge>
            </div>
            {selectedEvent.location && (
              <p className="text-sm text-muted-foreground mt-1">
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý phản hồi sự kiện
          </h1>
          <p className="text-muted-foreground">
            Xem và quản lý phản hồi từ người tham gia sự kiện của tổ chức bạn
          </p>
        </div>
      </div>

      {/* Information about filtering */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <MessageSquare className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
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
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chọn sự kiện đã hoàn thành để xem phản hồi
            </h3>
            <p className="text-muted-foreground">
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
