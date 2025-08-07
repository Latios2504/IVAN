import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterSection } from "@/components/public/FilterSection";
import { StatsSection } from "@/components/public/StatsSection";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { EmptyState } from "@/components/common/EmptyState";
import { ContentGrid } from "@/components/public/ContentGrid";
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
  emptyTitle?: string;
  emptyDescription?: string;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  itemName?: string;
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
  emptyTitle,
  emptyDescription,
  pagination,
  onPageChange,
  itemName = "mục",
}: PublicPageLayoutProps) {
  const isFullContainer = searchValue !== undefined || stats !== undefined;

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {isFullContainer ? (
          <>
            {/* Filters */}
            {(searchValue !== undefined || filters.length > 0) && (
              <FilterSection
                searchValue={searchValue!}
                onSearchChange={onSearchChange!}
                searchPlaceholder={searchPlaceholder}
                filters={filters}
                resultCount={resultCount}
              />
            )}

            {/* Stats Cards */}
            {stats && <StatsSection stats={stats} />}

            {/* Loading State */}
            <LoadingState loading={loading || false} />

            {/* Error State */}
            <ErrorDisplay
              error={error || null}
              onRetry={onRetry}
              variant="alert"
            />

            {/* Empty State */}
            {emptyIcon && emptyTitle && emptyDescription && (
              <EmptyState
                icon={emptyIcon}
                title={emptyTitle}
                description={emptyDescription}
                show={!loading && !error && (isEmpty || false)}
              />
            )}

            {/* Content Grid */}
            <ContentGrid
              loading={loading || false}
              error={error || null}
              isEmpty={isEmpty || false}
              gridClassName={gridClassName}
            >
              {children}
            </ContentGrid>

            {/* Pagination */}
            {pagination && onPageChange && (
              <Pagination
                pagination={pagination}
                onPageChange={onPageChange}
                loading={loading || false}
                error={error || null}
                itemName={itemName}
              />
            )}
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
