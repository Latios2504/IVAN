import { useState, useEffect } from "react";
import { publicContentService } from "../services/api/publicContentService";
import type {
  PublicEvent,
  PublicEventFilters,
  PagedResult,
} from "../types/publicContent";

interface UsePublicEventsReturn {
  events: PublicEvent[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  refetch: () => void;
  setPage: (page: number) => void;
}

export const usePublicEvents = (
  filters: PublicEventFilters = {}
): UsePublicEventsReturn => {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = {
        ...filters,
        page: pagination.page,
        size: pagination.size,
      };

      const result: PagedResult<PublicEvent> =
        await publicContentService.getPublicEvents(currentFilters);

      setEvents(result.items.$values);
      setPagination({
        page: result.page,
        size: result.size,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        hasNextPage: result.page < result.totalPages,
        hasPreviousPage: result.page > 1,
      });
    } catch (err: any) {
      console.error("Failed to fetch events:", err);
      setError(err.message || "Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  useEffect(() => {
    fetchEvents();
  }, [
    filters.search,
    filters.categoryId,
    filters.organizationId,
    filters.province,
    filters.startDate,
    filters.endDate,
    pagination.page,
  ]);

  return {
    events,
    loading,
    error,
    pagination,
    refetch: fetchEvents,
    setPage,
  };
};
