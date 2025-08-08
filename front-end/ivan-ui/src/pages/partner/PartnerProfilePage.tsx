import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import ProfileLayout from "@/components/profile/ProfileLayout";
import PartnerProfileSection from "@/components/profile/sections/PartnerProfileSection";

export default function PartnerProfilePage() {
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
  } = useProfile(targetUserId, "partner");

  const handleSave = async (data: any) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
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
          <PartnerProfileSection
            profile={profile}
            isEditing={isEditing}
            isCurrentUser={isCurrentUser}
            onSave={handleSave}
          />
        );
      case "collaborations":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Dự án hợp tác</h3>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Phân tích</h3>
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
          <PartnerProfileSection
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
      role="partner"
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
