import { useState, useEffect } from "react";
import { publicContentService } from "../services/publicContentService";
import type { PublicVolunteer } from "../types/publicContent";

interface UsePublicVolunteerDetailReturn {
  volunteer: PublicVolunteer | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePublicVolunteerDetail = (
  id: number
): UsePublicVolunteerDetailReturn => {
  const [volunteer, setVolunteer] = useState<PublicVolunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVolunteer = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await publicContentService.getPublicVolunteer(id);
      setVolunteer(result);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Failed to fetch volunteer:", errorMessage);
      setError(errorMessage || "Failed to load volunteer");
      setVolunteer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVolunteer();
    }
  }, [id]);

  return {
    volunteer,
    loading,
    error,
    refetch: fetchVolunteer,
  };
};