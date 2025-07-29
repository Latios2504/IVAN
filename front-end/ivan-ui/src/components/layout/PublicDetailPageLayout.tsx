import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { PublicPageLayout } from "./PublicPageLayout";
import { LoadingWithRetry } from "@/components/ui/skeletons";
import { ErrorBoundary } from "@/components/common/ErrorDisplay";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface PublicDetailPageLayoutProps {
  // Data states
  loading: boolean;
  error: string | null;
  data: any;

  // Page content
  title: string;
  description?: string;
  children: ReactNode;

  // Breadcrumb navigation
  breadcrumbs: BreadcrumbItem[];

  // Loading/error states
  loadingText?: string;
  onRetry?: () => void;
  notFoundMessage?: string;

  // Layout customization
  containerClassName?: string;
  showBreadcrumb?: boolean;
}

export function PublicDetailPageLayout({
  loading,
  error,
  data,
  title,
  description,
  children,
  breadcrumbs,
  loadingText = "Đang tải thông tin...",
  onRetry,
  notFoundMessage = "Không tìm thấy thông tin yêu cầu",
  containerClassName = "container mx-auto px-4 py-8",
  showBreadcrumb = true,
}: PublicDetailPageLayoutProps) {
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <LoadingWithRetry text={loadingText} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <ErrorBoundary error={error} onRetry={onRetry} variant="page" />
      </div>
    );
  }

  // Not found state
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <ErrorBoundary error={notFoundMessage} variant="page" />
      </div>
    );
  }

  return (
    <PublicPageLayout
      title={title}
      description={description || `Chi tiết thông tin về ${title}`}
    >
      <div className={containerClassName}>
        {/* Breadcrumb Navigation */}
        {showBreadcrumb && breadcrumbs.length > 0 && (
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {breadcrumb.isActive || !breadcrumb.href ? (
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={breadcrumb.href}>
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Main Content */}
        {children}
      </div>
    </PublicPageLayout>
  );
}
