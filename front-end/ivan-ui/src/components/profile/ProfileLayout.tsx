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

  // Not found state - use the same error component for consistency
  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <ErrorBoundary
          error="Không tìm thấy thông tin hồ sơ"
          onRetry={onRetry}
          variant="page"
        />
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
