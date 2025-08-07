import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ApiError } from "@/services/errorHandler";

/**
 * Generic API Management Hook
 * Replaces complex Context patterns with simple, reusable hook
 *
 * @template T - The data type (e.g., AiCustomInstructionDTO, EventDto)
 * @template CreateType - The creation DTO type
 * @template UpdateType - The update DTO type
 */

interface UseApiService<T, CreateType, UpdateType> {
  getAll?: () => Promise<T[]>;
  getById?: (id: number | string) => Promise<T>;
  create?: (data: CreateType) => Promise<T>;
  update?: (id: number | string, data: UpdateType) => Promise<T>;
  delete?: (id: number | string) => Promise<void>;
}

interface UseApiOptions {
  // Auto-toast messages
  successMessages?: {
    create?: string;
    update?: string;
    delete?: string;
  };

  // Error handling
  throwOnError?: boolean;

  // Loading states
  globalLoading?: boolean;
}

interface UseApiReturn<T, CreateType, UpdateType> {
  // State
  data: T[];
  loading: boolean;
  error: string | null;

  // Actions
  loadAll: () => Promise<void>;
  loadById: (id: number | string) => Promise<T | null>;
  create: (createData: CreateType) => Promise<T | null>;
  update: (id: number | string, updateData: UpdateType) => Promise<T | null>;
  remove: (id: number | string) => Promise<boolean>;

  // Utilities
  refetch: () => Promise<void>;
  clearError: () => void;
  setData: (data: T[]) => void;

  // Helpers
  findById: (id: number | string) => T | undefined;
  isEmpty: boolean;
  hasError: boolean;
}

/**
 * Generic hook for API data management - replaces complex Context patterns
 */
export function useApi<
  T extends { id?: number | string; [key: string]: any },
  CreateType = Partial<T>,
  UpdateType = Partial<T>
>(
  service: UseApiService<T, CreateType, UpdateType>,
  options: UseApiOptions = {}
): UseApiReturn<T, CreateType, UpdateType> {
  const {
    successMessages = {
      create: "Tạo thành công",
      update: "Cập nhật thành công",
      delete: "Xóa thành công",
    },
    throwOnError = false,
    globalLoading = true,
  } = options;

  // State
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to extract ID from item
  const getItemId = useCallback((item: T): number | string => {
    return (
      item.id ||
      (item as any).instructionId ||
      (item as any).eventId ||
      (item as any).userId ||
      0
    );
  }, []);

  // Error handler
  const handleError = useCallback(
    (error: unknown, action: string) => {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
          ? error.message
          : `Lỗi khi ${action}`;

      setError(errorMessage);
      toast.error(errorMessage);

      if (throwOnError) {
        throw error;
      }

      console.error(`useApi.${action} error:`, error);
    },
    [throwOnError]
  );

  // Load all data
  const loadAll = useCallback(async () => {
    if (!service.getAll) {
      console.warn("useApi: getAll method not provided in service");
      return;
    }

    if (globalLoading) setLoading(true);
    setError(null);

    try {
      const result = await service.getAll();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      handleError(error, "tải dữ liệu");
    } finally {
      if (globalLoading) setLoading(false);
    }
  }, [service.getAll, globalLoading, handleError]);

  // Load by ID
  const loadById = useCallback(
    async (id: number | string): Promise<T | null> => {
      if (!service.getById) {
        console.warn("useApi: getById method not provided in service");
        return null;
      }

      setError(null);

      try {
        const result = await service.getById(id);
        return result;
      } catch (error) {
        handleError(error, "tải dữ liệu");
        return null;
      }
    },
    [service.getById, handleError]
  );

  // Create new item
  const create = useCallback(
    async (createData: CreateType): Promise<T | null> => {
      if (!service.create) {
        console.warn("useApi: create method not provided in service");
        return null;
      }

      setError(null);

      try {
        const result = await service.create(createData);

        // Add to beginning of list
        setData((prev) => [result, ...prev]);

        if (successMessages.create) {
          toast.success(successMessages.create);
        }

        return result;
      } catch (error) {
        handleError(error, "tạo mới");
        return null;
      }
    },
    [service.create, successMessages.create, handleError]
  );

  // Update existing item
  const update = useCallback(
    async (id: number | string, updateData: UpdateType): Promise<T | null> => {
      if (!service.update) {
        console.warn("useApi: update method not provided in service");
        return null;
      }

      setError(null);

      try {
        const result = await service.update(id, updateData);

        // Update in list
        setData((prev) =>
          prev.map((item) => {
            const itemId = getItemId(item);
            return itemId === id ? result : item;
          })
        );

        if (successMessages.update) {
          toast.success(successMessages.update);
        }

        return result;
      } catch (error) {
        handleError(error, "cập nhật");
        return null;
      }
    },
    [service.update, successMessages.update, handleError, getItemId]
  );

  // Delete item
  const remove = useCallback(
    async (id: number | string): Promise<boolean> => {
      if (!service.delete) {
        console.warn("useApi: delete method not provided in service");
        return false;
      }

      setError(null);

      try {
        await service.delete(id);

        // Remove from list
        setData((prev) =>
          prev.filter((item) => {
            const itemId = getItemId(item);
            return itemId !== id;
          })
        );

        if (successMessages.delete) {
          toast.success(successMessages.delete);
        }

        return true;
      } catch (error) {
        handleError(error, "xóa");
        return false;
      }
    },
    [service.delete, successMessages.delete, handleError, getItemId]
  );

  // Utility functions
  const refetch = useCallback(() => loadAll(), [loadAll]);

  const clearError = useCallback(() => setError(null), []);

  const findById = useCallback(
    (id: number | string): T | undefined => {
      return data.find((item) => getItemId(item) === id);
    },
    [data, getItemId]
  );

  // Computed properties
  const isEmpty = data.length === 0;
  const hasError = error !== null;

  return {
    // State
    data,
    loading,
    error,

    // Actions
    loadAll,
    loadById,
    create,
    update,
    remove,

    // Utilities
    refetch,
    clearError,
    setData,

    // Helpers
    findById,
    isEmpty,
    hasError,
  };
}

export default useApi;
