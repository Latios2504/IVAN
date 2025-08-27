import type { ReactNode } from "react";
import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterSection } from "@/components/public/FilterSection";
import { StatsSection } from "@/components/public/StatsSection";
import { Pagination } from "@/components/common/Pagination";
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

interface PublicPageLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  className?: string;

  // Optional: If provided, render as a full page container with all components
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  resultCount?: number;
  stats?: StatCard[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  gridClassName?: string;
  emptyIcon?: LucideIcon;
  emptyDescription?: string;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
}

export function PublicPageLayout({
  children,
  title,
  description,
  className,
  // Container props
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
  gridClassName = "grid gap-6",
  emptyIcon,
  emptyDescription,
  pagination,
  onPageChange,

}: PublicPageLayoutProps) {
  const isFullContainer = searchValue !== undefined || stats !== undefined;

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {isFullContainer ? (
          <>
            {/* Filters */}
            {(searchValue !== undefined || filters.length > 0) && (
              <section className="bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 border border-emerald-200/50 dark:border-emerald-800/50 py-8 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                  <FilterSection
                    searchValue={searchValue!}
                    onSearchChange={onSearchChange!}
                    searchPlaceholder={searchPlaceholder}
                    filters={filters}
                    resultCount={resultCount}
                  />
                </div>
              </section>
            )}

            {/* Stats Cards */}
            {stats && (
              <section className="bg-gradient-to-r from-rose-50/80 via-pink-50/80 to-fuchsia-50/80 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-fuchsia-950/30 border border-rose-200/50 dark:border-rose-800/50 py-8 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                  <StatsSection stats={stats} />
                </div>
              </section>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400">Đang tải...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-red-50/80 to-rose-50/80 dark:from-red-950/30 dark:to-rose-950/30 border border-red-200/50 dark:border-red-800/50 max-w-md mx-auto">
                  <div className="text-red-500 dark:text-red-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Có lỗi xảy ra</h3>
                  <p className="text-slate-600 dark:text-slate-400">{error}</p>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="mt-4 px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md transition-colors"
                    >
                      Thử lại
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && isEmpty && emptyIcon && emptyDescription && (
              <div className="text-center py-20">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-50/80 to-slate-50/80 dark:from-gray-950/50 dark:to-slate-950/50 border border-gray-200/50 dark:border-gray-800/50 max-w-md mx-auto">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                    {React.createElement(emptyIcon, { className: "h-12 w-12 text-slate-400 dark:text-slate-500" })}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Không tìm thấy kết quả
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {emptyDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Content Grid */}
            {!loading && !error && !isEmpty && (
              <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12", gridClassName)}>
                {children}
              </div>
            )}

            {/* Pagination */}
            {pagination && onPageChange && !loading && !error && !isEmpty && (
              <div className="mt-16 flex justify-center">
                <div className="bg-background rounded-lg shadow-sm border border-border p-4">
                  <Pagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                    loading={false}
                    error={null}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
