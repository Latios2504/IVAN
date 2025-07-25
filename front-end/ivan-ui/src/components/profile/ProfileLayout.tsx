import type { ReactNode } from "react";
import { LoadingWithRetry } from "@/components/ui/skeletons";
import { ErrorBoundary } from "@/components/common/ErrorDisplay";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";

interface ProfileLayoutProps {
  // Data states
  loading: boolean;
  error: string | null;
  profile: any;

  // Profile configuration
  role: string;
  isCurrentUser?: boolean;
  isEditing?: boolean;

  // Content
  children: ReactNode;

  // Actions
  onEdit?: () => void;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  onImageUpload?: (file: File, imageType: "avatar" | "banner" | "logo") => void;

  // Layout customization
  className?: string;
  showTabs?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;

  // Loading states
  loadingText?: string;
  onRetry?: () => void;
}

export default function ProfileLayout({
  loading,
  error,
  profile,
  role,
  isCurrentUser = false,
  isEditing = false,
  children,
  onEdit,
  onSave,
  onCancel,
  onImageUpload,
  className,
  showTabs = true,
  activeTab,
  onTabChange,
  loadingText = "Đang tải thông tin hồ sơ...",
  onRetry,
}: ProfileLayoutProps) {
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

  // Not found state - this shouldn't happen with auto profile creation
  // but keep as fallback for error handling
  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Không thể tải hồ sơ
            </h3>
            <p className="text-gray-600">
              Có lỗi xảy ra khi tải thông tin hồ sơ. Vui lòng thử lại.
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => onRetry?.()}
            >
              Thử lại
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50",
        className
      )}
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          role={role}
          isCurrentUser={isCurrentUser}
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onImageUpload={onImageUpload}
        />

        {/* Main Content */}
        <div className="mt-8">
          <Card className="shadow-lg border-0">
            {/* Tab Navigation */}
            {showTabs && (
              <ProfileTabs
                role={role}
                activeTab={activeTab}
                onTabChange={onTabChange}
                isCurrentUser={isCurrentUser}
              />
            )}

            {/* Tab Content */}
            <div className="p-6">{children}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
