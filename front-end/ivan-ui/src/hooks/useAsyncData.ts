import { useState, useEffect, useCallback } from "react";
import { useApi } from "./useApi";
import { toast } from "sonner";

interface UseAsyncDataOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  transformData?: (data: any) => T;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

export function useAsyncData<T = any>(
  method: "get" | "post" | "put" | "patch" | "delete",
  endpoint: string,
  options: UseAsyncDataOptions<T> = {}
) {
  // Remove useToast hook since we're using sonner directly
  const [data, setData] = useState<T | null>(null);
  const [initialLoading, setInitialLoading] = useState(
    options.immediate !== false
  );

  const {
    immediate = true,
    onSuccess,
    onError,
    transformData,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage = "Thao tác thành công",
  } = options;

  const api = useApi<T>({
    onSuccess: (responseData: unknown) => {
      const finalData = transformData
        ? transformData(responseData)
        : (responseData as T);
      setData(finalData);

      if (showSuccessToast && successMessage) {
        toast.success(successMessage);
      }

      onSuccess?.(finalData);
    },
    onError: (error: string) => {
      if (showErrorToast) {
        toast.error(error);
      }
      onError?.(error);
    },
  });

  const execute = useCallback(
    (payload?: unknown, params?: Record<string, any>) => {
      switch (method) {
        case "get":
          return api.get(endpoint, params);
        case "post":
          return api.post(endpoint, payload);
        case "put":
          return api.put(endpoint, payload);
        case "patch":
          return api.patch(endpoint, payload);
        case "delete":
          return api.delete(endpoint);
        default:
          return Promise.reject(new Error(`Unsupported method: ${method}`));
      }
    },
    [api, method, endpoint]
  );

  const refetch = useCallback(() => {
    if (method === "get") {
      return execute();
    }
    return Promise.resolve();
  }, [execute, method]);

  useEffect(() => {
    if (immediate && method === "get") {
      execute().finally(() => setInitialLoading(false));
    } else {
      setInitialLoading(false);
    }
  }, [execute, immediate, method]);

  return {
    data,
    loading: initialLoading || api.loading,
    error: api.error,
    execute,
    refetch,
    // For compatibility
    mutate: execute,
  };
}

// Specialized hooks for common patterns
export function useFetchData<T>(
  endpoint: string,
  options?: Omit<UseAsyncDataOptions<T>, "immediate">
) {
  return useAsyncData<T>("get", endpoint, { ...options, immediate: true });
}

export function useMutation<T = any>(
  method: "post" | "put" | "patch" | "delete",
  endpoint: string,
  options?: UseAsyncDataOptions<T>
) {
  return useAsyncData<T>(method, endpoint, { ...options, immediate: false });
}
