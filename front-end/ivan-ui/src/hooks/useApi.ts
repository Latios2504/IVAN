import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Unified API hook for state management with any service
 * Replaces useApiRequest with simpler, more flexible approach
 */
export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async (serviceCall: () => Promise<T>): Promise<T> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await serviceCall();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));

      // Show error toast for better UX
      toast.error(errorMessage);

      throw error; // Re-throw for component handling if needed
    }
  };

  const reset = () => {
    setState({ data: null, loading: false, error: null });
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return {
    ...state,
    execute,
    reset,
    clearError,
  };
}

// Convenience hook for immediate execution
export function useApiCall<T>(serviceCall: () => Promise<T>, immediate = true) {
  const api = useApi<T>();

  useEffect(() => {
    if (immediate) {
      api.execute(serviceCall);
    }
  }, [immediate]);

  return api;
}
