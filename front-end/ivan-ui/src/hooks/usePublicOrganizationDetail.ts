import { useState, useEffect } from "react";
import { publicContentService } from "../services/publicContentService";
import type { PublicOrganization } from "../types/publicContent";

interface UsePublicOrganizationDetailReturn {
  organization: PublicOrganization | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePublicOrganizationDetail = (
  id: string | undefined
): UsePublicOrganizationDetailReturn => {
  const [organization, setOrganization] = useState<PublicOrganization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const result = await publicContentService.getPublicOrganization(parseInt(id));
      setOrganization(result);
    } catch (err: any) {
      console.error("Failed to fetch organization:", err);
      setError(err.message || "Failed to load organization");
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [id]);

  return {
    organization,
    loading,
    error,
    refetch: fetchOrganization,
  };
};