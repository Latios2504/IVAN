import { useState, useEffect } from "react";
import { publicContentService } from "../../services/publicContentService";
import type {
  PublicPartner,
  PublicPartnerFilters,
  PagedResult,
} from "../../types/publicContent";

interface UsePublicPartnersReturn {
  partners: PublicPartner[];
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

export const usePublicPartners = (
  filters: PublicPartnerFilters = {}
): UsePublicPartnersReturn => {
  const [partners, setPartners] = useState<PublicPartner[]>([]);
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

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = {
        ...filters,
        page: pagination.page,
        size: pagination.size,
      };

      const result = await publicContentService.getPublicPartners(
        currentFilters
      );

      // Handle the PagedResult structure
      const items = result.items || [];

      setPartners(items);
      setPagination({
        page: result.pageNumber || 1,
        size: result.pageSize || 6,
        totalPages: result.totalPages || 0,
        totalItems: result.totalCount || 0,
        hasNextPage: result.hasNextPage || false,
        hasPreviousPage: result.hasPreviousPage || false,
      });
    } catch (err: any) {
      console.error("Failed to fetch partners:", err);
      setError(err.message || "Failed to load partners");
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  useEffect(() => {
    fetchPartners();
  }, [
    filters.search,
    filters.industryId,
    filters.province,
    filters.isVerified,
    pagination.page,
  ]);

  return {
    partners,
    loading,
    error,
    pagination,
    refetch: fetchPartners,
    setPage,
  };
};
