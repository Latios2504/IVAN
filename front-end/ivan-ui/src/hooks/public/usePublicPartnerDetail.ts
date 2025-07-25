import { useState, useEffect } from "react";
import { publicContentService } from "../../services/publicContentService";
import type { PublicPartner } from "../../types/publicContent";

interface UsePublicPartnerDetailReturn {
  partner: PublicPartner | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePublicPartnerDetail = (
  id: string | undefined
): UsePublicPartnerDetailReturn => {
  const [partner, setPartner] = useState<PublicPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartner = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await publicContentService.getPublicPartner(parseInt(id));
      setPartner(result);
    } catch (err: any) {
      console.error("Failed to fetch partner:", err);
      setError(err.message || "Failed to load partner");
      setPartner(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartner();
  }, [id]);

  return {
    partner,
    loading,
    error,
    refetch: fetchPartner,
  };
};
