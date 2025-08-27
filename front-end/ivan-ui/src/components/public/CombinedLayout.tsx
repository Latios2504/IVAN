import type { ReactNode } from "react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FilterSection } from "@/components/public/FilterSection";
import { StatsSection } from "@/components/public/StatsSection";
import { Pagination } from "@/components/common/Pagination";
import { LoadingWithRetry } from "@/components/ui/skeletons";
import { ErrorBoundary } from "@/components/common/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import type { StatCard } from "@/components/public/StatsSection";
import type { PaginationInfo } from "@/components/common/Pagination";

interface FilterOption {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  icon?: ReactNode;
}

export interface CombinedLayoutProps {
  // Page metadata
  title: string;
  description: string;
  className?: string;

  // List data and controls
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  resultCount?: number;
  stats?: StatCard[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;


  // List items
  listItems: ReactNode[];
  onItemSelect?: (itemId: string) => void;
  selectedItemId?: string;

  // Detail content
  detailContent?: ReactNode;
  detailLoading?: boolean;
  detailError?: string | null;
  onDetailRetry?: () => void;

  // Layout customization
  listClassName?: string;
  detailClassName?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function CombinedLayout({
  title,
  description,
  className,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  filters = [],
  resultCount,
  stats,
  loading,
  error,
  onRetry,
  isEmpty,
  pagination,
  onPageChange,
  listItems,
  onItemSelect,
  selectedItemId,
  detailContent,
  detailLoading,
  detailError,
  onDetailRetry,
  listClassName,
  detailClassName,
  showBackButton = false,
  onBack,
}: CombinedLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [listHeight, setListHeight] = useState<number>(600);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const listPanelRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Smart height matching function
  const updateListHeight = useCallback(() => {
    if (!detailPanelRef.current || !listPanelRef.current || isMobile) {
      return;
    }

    const detailPanel = detailPanelRef.current;
    const listPanel = listPanelRef.current;
    
    // Get the detail panel's content height
    const detailRect = detailPanel.getBoundingClientRect();
    const listPanelRect = listPanel.getBoundingClientRect();
    
    // Calculate available height for list content (excluding header and pagination)
    const listHeader = listPanel.querySelector('[data-list-header]');
    const listPagination = listPanel.querySelector('[data-list-pagination]');
    
    const headerHeight = listHeader?.getBoundingClientRect().height || 0;
    const paginationHeight = listPagination?.getBoundingClientRect().height || 0;
    
    // Set list height to match detail panel height minus header and pagination
    const availableHeight = Math.max(400, detailRect.height - headerHeight - paginationHeight - 32); // 32px for margins
    setListHeight(availableHeight);
  }, [isMobile]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        // Trigger height update when switching to desktop
        setTimeout(updateListHeight, 100);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [updateListHeight]);

  useEffect(() => {
    setShowDetail(!!selectedItemId && !!detailContent);
  }, [selectedItemId, detailContent]);

  // Setup ResizeObserver to watch detail panel height changes
  useEffect(() => {
    if (!detailPanelRef.current || isMobile) {
      return;
    }

    resizeObserverRef.current = new ResizeObserver(() => {
      updateListHeight();
    });

    resizeObserverRef.current.observe(detailPanelRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [updateListHeight, isMobile]);

  // Update height when detail content changes
  useEffect(() => {
    if (detailContent && !isMobile) {
      // Small delay to ensure content is rendered
      setTimeout(updateListHeight, 100);
    }
  }, [detailContent, updateListHeight, isMobile]);

  // Auto-scroll to top of page when item is selected to show detail panel
  useEffect(() => {
    if (selectedItemId) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [selectedItemId]);

  const handleItemClick = (itemId: string) => {
    onItemSelect?.(itemId);
    if (isMobile) {
      setShowDetail(true);
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      setShowDetail(false);
    }
    onBack?.();
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 py-20 -mx-4 sm:-mx-6 lg:-mx-8 mb-12 border-b border-violet-200/50 dark:border-violet-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
              {title}
            </h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 border border-emerald-200/50 dark:border-emerald-800/50 py-8 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <FilterSection
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
            filters={filters}
            resultCount={resultCount}
          />
        </div>
      </section>

      {/* Stats Cards */}
      {stats && (
        <section className="bg-gradient-to-r from-rose-50/80 via-pink-50/80 to-fuchsia-50/80 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-fuchsia-950/30 border border-rose-200/50 dark:border-rose-800/50 py-8 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <StatsSection stats={stats} />
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
          {/* List Panel */}
          <div 
            ref={listPanelRef}
            className={cn(
              "lg:w-1/3 xl:w-2/5 flex flex-col",
              isMobile && showDetail && "hidden",
              listClassName
            )}
          >
            {/* List Header */}
            <div data-list-header className="flex items-center justify-between mb-4 flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200/50 dark:border-indigo-700/50">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {resultCount !== undefined ? `${resultCount} kết quả` : 'Danh sách'}
              </h2>
            </div>

            {/* List Content */}
            <div 
              className="flex flex-col min-h-0"
              style={{
                height: isMobile ? 'auto' : `${listHeight}px`
              }}
            >
              {loading && (
                <div className="flex justify-center items-center flex-1">
                  <LoadingWithRetry text="Đang tải dữ liệu..." />
                </div>
              )}

              {error && (
                <div className="text-center flex-1 flex items-center justify-center">
                  <ErrorBoundary error={error} onRetry={onRetry} variant="page" />
                </div>
              )}

              {!loading && !error && isEmpty && (
                <div className="text-center flex-1 flex items-center justify-center">
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-50/80 to-slate-50/80 dark:from-gray-900/80 dark:to-slate-900/80 border border-gray-200/50 dark:border-gray-700/50">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-400 to-slate-500 flex items-center justify-center">
                      <SearchIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Không tìm thấy kết quả</h3>
                    <p className="text-gray-600 dark:text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                  </div>
                </div>
              )}

              {!loading && !error && !isEmpty && (
                <div 
                  ref={listContainerRef} 
                  className="flex-1 overflow-y-auto pr-2 space-y-2 min-h-0"
                  style={{
                    maxHeight: isMobile ? 'none' : `${listHeight - 80}px` // Reserve space for potential margins
                  }}
                >
                  {listItems.map((item, index) => (
                    <div key={index} className="cursor-pointer">
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination && onPageChange && !loading && !error && !isEmpty && (
              <div data-list-pagination className="mt-4 pt-4 border-t flex-shrink-0">
                <Pagination
                  pagination={pagination}
                  onPageChange={onPageChange}
                  loading={false}
                  error={null}
                />
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div 
            ref={detailPanelRef}
            className={cn(
              "lg:w-2/3 xl:w-3/5 flex flex-col",
              isMobile && !showDetail && "hidden",
              detailClassName
            )}
          >
            {/* Detail Header */}
            {(showBackButton || (isMobile && showDetail)) && (
              <div className="flex items-center mb-4 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {isMobile ? "Quay lại danh sách" : "Quay lại"}
                </Button>
              </div>
            )}

            {/* Detail Content */}
            <div className="flex-1 overflow-hidden min-h-0">
              {!selectedItemId && !detailContent && (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:from-blue-900/60 dark:via-purple-900/60 dark:to-pink-900/60 border border-blue-200/50 dark:border-blue-700/50">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <SearchIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Chọn một mục để xem chi tiết</h3>
                    <p className="text-slate-600 dark:text-slate-400">Nhấp vào một mục trong danh sách để xem thông tin chi tiết</p>
                  </div>
                </div>
              )}

              {detailLoading && (
                <div className="flex justify-center items-center h-full">
                  <LoadingWithRetry text="Đang tải chi tiết..." />
                </div>
              )}

              {detailError && (
                <div className="flex items-center justify-center h-full">
                  <ErrorBoundary error={detailError} onRetry={onDetailRetry} variant="page" />
                </div>
              )}

              {!detailLoading && !detailError && detailContent && (
                <div className="h-full overflow-y-auto">
                  {detailContent}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}