import { useState, useEffect } from "react";
import { publicContentService } from "../services/publicContentService";
import type {
  PublicOrganization,
  PublicOrganizationFilters,
  PagedResult,
} from "../types/publicContent";

interface UsePublicOrganizationsReturn {
  organizations: PublicOrganization[];
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

export const usePublicOrganizations = (
  filters: PublicOrganizationFilters = {}
): UsePublicOrganizationsReturn => {
  const [organizations, setOrganizations] = useState<PublicOrganization[]>([]);
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

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = {
        ...filters,
        page: pagination.page,
        size: pagination.size,
      };

      const result = await publicContentService.getPublicOrganizations(currentFilters);
      
      // Handle both $values format and direct array format
      const items = result.items?.$values || result.items || [];
      
      setOrganizations(items);
      setPagination({
        page: result.page || 1,
        size: result.size || 20,
        totalPages: result.totalPages || 0,
        totalItems: result.totalItems || 0,
        hasNextPage: (result.page || 1) < (result.totalPages || 0),
        hasPreviousPage: (result.page || 1) > 1,
      });
    } catch (err: any) {
      console.error("Failed to fetch organizations:", err);
      setError(err.message || "Failed to load organizations");
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  useEffect(() => {
    fetchOrganizations();
  }, [
    filters.search,
    filters.typeId,
    filters.province,
    filters.isVerified,
    pagination.page,
  ]);

  return {
    organizations,
    loading,
    error,
    pagination,
    refetch: fetchOrganizations,
    setPage,
  };
};
