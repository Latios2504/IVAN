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
    size: 6, // Reduced from 20 to 6 to make pagination more visible
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

      // Handle the PagedResult structure
      const items = result.items || [];

      setEvents(items);
      setPagination({
        page: result.pageNumber || 1,
        size: result.pageSize || 6,
        totalPages: result.totalPages || 0,
        totalItems: result.totalCount || 0,
        hasNextPage: result.hasNextPage || false,
        hasPreviousPage: result.hasPreviousPage || false,
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
