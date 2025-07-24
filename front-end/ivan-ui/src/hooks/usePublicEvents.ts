import { useState, useEffect } from "react";
import { publicContentService } from "../services/publicContentService";
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

      const result = await publicContentService.getPublicEvents(currentFilters);
      
      // Handle both $values format and direct array format
      const items = result.items?.$values || result.items || [];
      
      setEvents(items);
      setPagination({
        page: result.page || 1,
        size: result.size || 20,
        totalPages: result.totalPages || 0,
        totalItems: result.totalItems || 0,
        hasNextPage: (result.page || 1) < (result.totalPages || 0),
        hasPreviousPage: (result.page || 1) > 1,
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
