import { useState, useEffect } from "react";
import { publicContentService } from "../services/publicContentService";
import type {
  PublicVolunteer,
  PublicVolunteerFilters,
  PagedResult,
} from "../types/publicContent";

interface UsePublicVolunteersReturn {
  volunteers: PublicVolunteer[] | null;
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

export const usePublicVolunteers = (
  filters: PublicVolunteerFilters = {}
): UsePublicVolunteersReturn => {
  const [volunteers, setVolunteers] = useState<PublicVolunteer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 6,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await publicContentService.getPublicVolunteers({
        ...filters,
        page: pagination.page,
        size: pagination.size,
      });

      console.log("Raw API response received");

      // Extract volunteers data
      let volunteersData: PublicVolunteer[] = [];
      if (result && result.items) {
        if (Array.isArray(result.items)) {
          volunteersData = result.items;
        }
      }

      console.log("Processed volunteers count:", volunteersData.length);

      setVolunteers(volunteersData);

      setPagination((prev) => ({
        ...prev,
        totalPages: result?.totalPages || 0,
        totalItems: result?.totalCount || 0,
        hasNextPage: result?.hasNextPage || false,
        hasPreviousPage: result?.hasPreviousPage || false,
      }));
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Failed to fetch volunteers:", errorMessage);
      setError(errorMessage || "Failed to load volunteers");
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  useEffect(() => {
    fetchVolunteers();
  }, [filters, pagination.page]);

  return {
    volunteers,
    loading,
    error,
    pagination,
    refetch: fetchVolunteers,
    setPage,
  };
};
