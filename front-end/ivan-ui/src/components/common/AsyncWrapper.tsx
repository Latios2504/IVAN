import { type ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface AsyncWrapperProps {
  loading: boolean;
  error?: string | null;
  children: ReactNode;
  loadingText?: string;
  errorComponent?: ReactNode;
  emptyState?: ReactNode;
  showEmptyWhen?: boolean;
}

export const AsyncWrapper = ({
  loading,
  error,
  children,
  loadingText = "Đang tải...",
  errorComponent,
  emptyState,
  showEmptyWhen = false,
}: AsyncWrapperProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner size="lg" text={loadingText} />
      </div>
    );
  }

  if (error) {
    return (
      errorComponent || (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 mb-2">
              <svg
                className="h-8 w-8 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-1">
              Đã xảy ra lỗi
            </h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )
    );
  }

  if (showEmptyWhen && emptyState) {
    return <>{emptyState}</>;
  }

  return <>{children}</>;
};
