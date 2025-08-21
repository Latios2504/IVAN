import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
import { toast } from "sonner";
import { userManagementService } from "@/services/userManagementService";
import { UserBasicInfo } from "./user-details/UserBasicInfo";
import { UserProfileTabs } from "./user-details/UserProfileTabs";
import type { UserDetailsDto } from "@/types/userManagement";

interface UserDetailsModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate?: () => void;
}

function UserDetailsModal({
  userId,
  isOpen,
  onClose,
  onUserUpdate,
}: UserDetailsModalProps) {
  const [user, setUser] = useState<UserDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    onClose();
    setUser(null);
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!userId || !isOpen) return;

      try {
        setIsLoading(true);
        const userDetail = await userManagementService.getUserDetails(userId);
        setUser(userDetail);
      } catch (error) {
        console.error("Error fetching user detail:", error);
        toast.error("Không thể tải thông tin người dùng");
        handleClose();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] flex flex-col p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 border-blue-200/50 dark:border-blue-800/50 shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-blue-200/50 dark:border-blue-800/50 flex-shrink-0 bg-gradient-to-r from-blue-100/80 via-indigo-100/80 to-purple-100/80 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30">
          <DialogTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Chi tiết người dùng
          </DialogTitle>
          <DialogDescription className="text-blue-700 dark:text-blue-300">
            Xem thông tin chi tiết và hồ sơ của người dùng trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <ScrollArea
          className="flex-1 px-6 pb-6 bg-gradient-to-b from-transparent to-blue-50/30 dark:to-blue-950/30"
          style={{ height: "calc(90vh - 120px)" }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                <p className="text-blue-600 dark:text-blue-400">Đang tải thông tin...</p>
              </div>
            </div>
          ) : user ? (
            <div className="pt-4 w-full">
              <UserProfileTabs user={user} />
            </div>
          ) : (
            <div className="text-center py-8 text-blue-600 dark:text-blue-400">
              <User className="h-12 w-12 mx-auto mb-4 text-blue-400 dark:text-blue-500" />
              <p>Không tìm thấy thông tin người dùng</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export { UserDetailsModal };
export default UserDetailsModal;
