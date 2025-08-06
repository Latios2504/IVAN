import { useState, useEffect, useCallback } from "react";
import apiClient from "@/services/apiClient";
import type { ApiResponse } from "@/types/common";
import { toast } from "sonner";

interface UseApiOptions<T = unknown> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  transformData?: (data: any) => T;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

/**
 * Unified API hook that replaces both useApi and useAsyncData
 * Provides comprehensive API interaction with loading states, error handling, and toast notifications
 */
export function useApiRequest<T = unknown>(options: UseApiOptions<T> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    onSuccess,
    onError,
    transformData,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage = "Operation successful",
  } = options;

  const execute = useCallback(
    async (
      method: "get" | "post" | "put" | "patch" | "delete",
      endpoint: string,
      payload?: unknown,
      params?: Record<string, string | number | boolean | undefined | null>
    ) => {
      try {
        setLoading(true);
        setError(null);

        let response: ApiResponse<T>;

        switch (method) {
          case "get":
            response = await apiClient.get<T>(endpoint, params);
            break;
          case "post":
            response = await apiClient.post<T>(endpoint, payload);
            break;
          case "put":
            response = await apiClient.put<T>(endpoint, payload);
            break;
          case "patch":
            response = await apiClient.patch<T>(endpoint, payload);
            break;
          case "delete":
            response = await apiClient.delete<T>(endpoint);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        if (response.success && response.data) {
          const finalData = transformData
            ? transformData(response.data)
            : response.data;

          setData(finalData);

          if (showSuccessToast && successMessage) {
            toast.success(successMessage);
          }

          onSuccess?.(finalData);
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";

        setError(errorMessage);

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [
      onSuccess,
      onError,
      transformData,
      showErrorToast,
      showSuccessToast,
      successMessage,
    ]
  );

  // Convenience methods for each HTTP method
  const get = useCallback(
    (
      endpoint: string,
      params?: Record<string, string | number | boolean | undefined | null>
    ) => execute("get", endpoint, undefined, params),
    [execute]
  );

  const post = useCallback(
    (endpoint: string, payload?: unknown) => execute("post", endpoint, payload),
    [execute]
  );

  const put = useCallback(
    (endpoint: string, payload?: unknown) => execute("put", endpoint, payload),
    [execute]
  );

  const patch = useCallback(
    (endpoint: string, payload?: unknown) =>
      execute("patch", endpoint, payload),
    [execute]
  );

  const del = useCallback(
    (endpoint: string) => execute("delete", endpoint),
    [execute]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    get,
    post,
    put,
    patch,
    delete: del,
    reset,
  };
}

/**
 * Hook for automatic data fetching (GET requests)
 */
export function useFetchData<T>(
  endpoint: string,
  options: UseApiOptions<T> & {
    immediate?: boolean;
    params?: Record<string, string | number | boolean | undefined | null>;
  } = {}
) {
  const { immediate = true, params, ...apiOptions } = options;
  const [initialLoading, setInitialLoading] = useState(immediate);

  const api = useApiRequest<T>(apiOptions);

  const refetch = useCallback(() => {
    return api.get(endpoint, params);
  }, [api, endpoint, params]);

  useEffect(() => {
    if (immediate) {
      api.get(endpoint, params).finally(() => setInitialLoading(false));
    } else {
      setInitialLoading(false);
    }
  }, [api, endpoint, params, immediate]);

  return {
    ...api,
    loading: initialLoading || api.loading,
    refetch,
    // For backward compatibility
    mutate: refetch,
  };
}

/**
 * Hook for mutations (POST, PUT, PATCH, DELETE)
 */
export function useMutation<T = any>(
  method: "post" | "put" | "patch" | "delete",
  endpoint: string,
  options?: UseApiOptions<T>
) {
  const api = useApiRequest<T>(options);

  const mutate = useCallback(
    (payload?: unknown) => api.execute(method, endpoint, payload),
    [api, method, endpoint]
  );

  return {
    ...api,
    mutate,
  };
}
