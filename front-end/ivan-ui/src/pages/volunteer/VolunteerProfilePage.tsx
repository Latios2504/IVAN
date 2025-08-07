import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import ProfileLayout from "@/components/profile/ProfileLayout";
import VolunteerProfileSection from "@/components/profile/sections/VolunteerProfileSection";

export default function VolunteerProfilePage() {
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
  } = useProfile(targetUserId, "volunteer");

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
          <VolunteerProfileSection
            profile={profile}
            isEditing={isEditing}
            isCurrentUser={isCurrentUser}
            onSave={handleSave}
          />
        );
      case "skills":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Kỹ năng</h3>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
      case "activity":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Hoạt động tình nguyện</h3>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
      case "certificates":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Chứng chỉ</h3>
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
          <VolunteerProfileSection
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
      role="volunteer"
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
