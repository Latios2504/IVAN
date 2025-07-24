import { useState, useEffect } from "react";
import { publicContentService } from "../services/publicContentService";
import type { 
  PublicVolunteer, 
  PublicVolunteerFilters,
  PagedResult 
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
    size: 20,
    totalPages: 0,
    totalItems: 0,
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

      // Handle the $values wrapper from backend with better error checking
      let volunteersData: PublicVolunteer[] = [];
      
      if (result && typeof result === 'object') {
        if (result.items && typeof result.items === 'object') {
          // Handle $values wrapper
          if (Array.isArray(result.items.$values)) {
            volunteersData = result.items.$values;
          } 
          // Handle direct array
          else if (Array.isArray(result.items)) {
            volunteersData = result.items;
          }
        }
        // Handle case where result.items is directly an array
        else if (Array.isArray(result.items)) {
          volunteersData = result.items;
        }
      }
      
      console.log('Fetched volunteers data:', volunteersData);
      setVolunteers(volunteersData);
      
      setPagination(prev => ({
        ...prev,
        totalPages: result?.totalPages || 0,
        totalItems: result?.totalItems || 0,
      }));
    } catch (err: any) {
      console.error("Failed to fetch volunteers:", err);
      setError(err?.message || "Failed to load volunteers");
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
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