import { useState, useEffect } from "react";
import { publicContentService } from "../services/api/publicContentService";
import type {
  PublicPartner,
  PublicPartnerFilters,
  PagedResult,
} from "../types/publicContent";

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
    size: 20,
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

      const result: PagedResult<PublicPartner> =
        await publicContentService.getPublicPartners(currentFilters);

      setPartners(result.items.$values);
      setPagination({
        page: result.page,
        size: result.size,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        hasNextPage: result.page < result.totalPages,
        hasPreviousPage: result.page > 1,
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
