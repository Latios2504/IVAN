import { useState, useCallback } from "react";
import apiClient from "@/services/api/apiClient";
import type { ApiResponse } from "@/types/common";

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

export function useApi<T = unknown>(options: UseApiOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          setData(response.data);
          options.onSuccess?.(response.data);
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        options.onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

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
    get,
    post,
    put,
    patch,
    delete: del,
    reset,
  };
}
