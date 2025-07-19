/**
 * Performance Optimization Utilities
 * Debouncing, memoization, and other performance helpers
 */

import React, { useCallback, useRef, useMemo, useEffect } from 'react';

/**
 * Debounce hook for search inputs and API calls
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Throttle hook for scroll events and frequent updates
 */
export const useThrottle = <T>(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

/**
 * Memoized filter function for large datasets
 */
export const useMemoizedFilter = <T>(
  items: T[],
  filterFn: (item: T) => boolean,
  dependencies: any[]
) => {
  return useMemo(() => {
    return items.filter(filterFn);
  }, [items, ...dependencies]);
};

/**
 * Optimized search function with debouncing
 */
export const useOptimizedSearch = <T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  debounceMs = 300
) => {
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  return useMemoizedFilter(
    items,
    (item) => {
      if (!debouncedSearchTerm) return true;
      
      return searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        }
        return false;
      });
    },
    [debouncedSearchTerm]
  );
};

/**
 * Virtual scrolling hook for large lists
 */
export const useVirtualScrolling = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    itemCount
  );

  const visibleItems = useMemo(() => {
    return Array.from({ length: endIndex - startIndex }, (_, index) => startIndex + index);
  }, [startIndex, endIndex]);

  const totalHeight = itemCount * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };
};

/**
 * Intersection Observer hook for lazy loading
 */
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [options]);

  return { targetRef, isIntersecting };
};

/**
 * Optimized table pagination
 */
export const useTablePagination = <T>(
  data: T[],
  pageSize: number = 10
) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

/**
 * Performance monitoring hook
 */
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERF] ${componentName} rendered ${renderCount.current} times`);
      
      const renderTime = Date.now() - startTime.current;
      if (renderTime > 100) {
        console.warn(`[PERF] ${componentName} slow render: ${renderTime}ms`);
      }
    }
  });

  return {
    renderCount: renderCount.current,
    markRenderStart: () => {
      startTime.current = Date.now();
    }
  };
};