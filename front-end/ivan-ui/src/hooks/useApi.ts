import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ApiError } from "@/services/apiClient";

/**
 * Simple Generic API Hook
 * Works with any service that has CRUD operations
 */
interface ApiService<T> {
  getAll?: () => Promise<T[]>;
  getById?: (id: string | number) => Promise<T>;
  create?: (data: any) => Promise<T>;
  update?: (id: string | number, data: any) => Promise<T>;
  delete?: (id: string | number) => Promise<void>;
  [key: string]: any; // Custom methods
}

interface UseApiOptions {
  autoLoad?: boolean;
  showToast?: boolean;
}

export function useApi<T extends Record<string, any>>(
  service: ApiService<T>,
  options: UseApiOptions = {}
) {
  const { autoLoad = false, showToast = true } = options;

  // State
  const [data, setData] = useState<T[]>([]);
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper functions
  const handleError = useCallback(
    (error: any, action: string) => {
      const message =
        error instanceof ApiError ? error.message : `Error ${action}`;
      setError(message);
      if (showToast) toast.error(message);
    },
    [showToast]
  );

  const getId = useCallback(
    (item: T) =>
      item.id ||
      (item as any).instructionId ||
      (item as any).eventId ||
      (item as any).userId,
    []
  );

  // API Methods
  const loadAll = useCallback(async () => {
    if (!service.getAll) return;

    setLoading(true);
    setError(null);
    try {
      const result = await service.getAll();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      handleError(error, "loading data");
    } finally {
      setLoading(false);
    }
  }, [service.getAll, handleError]);

  const loadById = useCallback(
    async (id: string | number) => {
      if (!service.getById) return null;

      setError(null);
      try {
        const result = await service.getById(id);
        setItem(result);
        return result;
      } catch (error) {
        handleError(error, "loading item");
        return null;
      }
    },
    [service.getById, handleError]
  );

  const create = useCallback(
    async (createData: any) => {
      if (!service.create) return null;

      setError(null);
      try {
        const result = await service.create(createData);
        setData((prev) => [result, ...prev]);
        if (showToast) toast.success("Created successfully");
        return result;
      } catch (error) {
        handleError(error, "creating");
        return null;
      }
    },
    [service.create, handleError, showToast]
  );

  const update = useCallback(
    async (id: string | number, updateData: any) => {
      if (!service.update) return null;

      setError(null);
      try {
        const result = await service.update(id, updateData);
        setData((prev) =>
          prev.map((item) => (getId(item) === id ? result : item))
        );
        if (item && getId(item) === id) setItem(result);
        if (showToast) toast.success("Updated successfully");
        return result;
      } catch (error) {
        handleError(error, "updating");
        return null;
      }
    },
    [service.update, handleError, showToast, getId, item]
  );

  const remove = useCallback(
    async (id: string | number) => {
      if (!service.delete) return false;

      setError(null);
      try {
        await service.delete(id);
        setData((prev) => prev.filter((item) => getId(item) !== id));
        if (item && getId(item) === id) setItem(null);
        if (showToast) toast.success("Deleted successfully");
        return true;
      } catch (error) {
        handleError(error, "deleting");
        return false;
      }
    },
    [service.delete, handleError, showToast, getId, item]
  );

  // Execute any custom method
  const execute = useCallback(
    async (methodName: string, ...args: any[]) => {
      const method = service[methodName];
      if (!method || typeof method !== "function") return null;

      setError(null);
      try {
        return await method.apply(service, args);
      } catch (error) {
        handleError(error, methodName);
        return null;
      }
    },
    [service, handleError]
  );

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) loadAll();
  }, [autoLoad, loadAll]);

  return {
    // State
    data,
    item,
    loading,
    error,

    // Actions
    loadAll,
    loadById,
    create,
    update,
    remove,
    execute,

    // Utilities
    setData,
    setItem,
    clearError: () => setError(null),
    refetch: loadAll,
  };
}

export default useApi;
