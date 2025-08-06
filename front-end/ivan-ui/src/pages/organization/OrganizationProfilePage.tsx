import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import ProfileLayout from "@/components/profile/ProfileLayout";
import OrganizationProfileSection from "@/components/profile/sections/OrganizationProfileSection";

export default function OrganizationProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("info");

  // Determine if viewing current user's profile or someone else's
  const targetUserId = id ? parseInt(id, 10) : user?.id;
  const isCurrentUser = !id || user?.id === targetUserId;

  const {
    profile,
    loading,
    error,
    isEditing,
    updateProfile,
    uploadImage,
    toggleEdit,
    setIsEditing,
    refetch,
  } = useProfile(targetUserId, "organization");

  const handleSave = async (data: any) => {
    try {
      
      await updateProfile(data);
      setIsEditing(false);
      
      // Don't automatically refetch as useProfile hook handles this
    } catch (error) {
      console.error("Error saving profile:", error);
      // Don't try to refetch on error to avoid redirect issues
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    refetch();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <OrganizationProfileSection
            profile={profile}
            isEditing={isEditing}
            isCurrentUser={isCurrentUser}
            onSave={handleSave}
          />
        );
      case "events":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Sự kiện</h3>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
      case "volunteers":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Tình nguyện viên</h3>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
      case "stats":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Thống kê</h3>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
      case "verification":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Xác minh</h3>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
      case "settings":
        return isCurrentUser ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Cài đặt tài khoản</h3>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        ) : null;
      default:
        return (
          <OrganizationProfileSection
            profile={profile}
            isEditing={isEditing}
            isCurrentUser={isCurrentUser}
            onSave={handleSave}
          />
        );
    }
  };

  return (
    <ProfileLayout
      loading={loading}
      error={error}
      profile={profile}
      role="organization"
      isCurrentUser={isCurrentUser}
      isEditing={isEditing}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onEdit={toggleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onImageUpload={uploadImage}
      onRetry={refetch}
    >
      {renderTabContent()}
    </ProfileLayout>
  );
}
