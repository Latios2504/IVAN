import { useState, useEffect } from "react";
import { publicContentService } from "../services/publicContentService";
import type { PublicEvent } from "../types/publicContent";

interface UsePublicEventDetailReturn {
  event: PublicEvent | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePublicEventDetail = (
  id: string | undefined
): UsePublicEventDetailReturn => {
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const result = await publicContentService.getPublicEvent(parseInt(id));
      setEvent(result);
    } catch (err: any) {
      console.error("Failed to fetch event:", err);
      setError(err.message || "Failed to load event");
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  return {
    event,
    loading,
    error,
    refetch: fetchEvent,
  };
};