import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Award,
  AlertTriangle,
  Edit,
  Save,
  X,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { userManagementService } from "@/services/api/userManagementService";
import type { UserAccountDetailDto } from "@/services/api/userManagementService";
import { UserRole } from "@/types/auth";
import { RoleDisplayNames } from "@/constants/roles";

interface UserDetailsModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate?: () => void;
}

export function UserDetailsModal({
  userId,
  isOpen,
  onClose,
  onUserUpdate,
}: UserDetailsModalProps) {
  const { user: currentUser } = useAuth();
  const { showNotification } = useToast();
  const [user, setUser] = useState<UserAccountDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserAccountDetailDto | null>(null);

  useEffect(() => {
    if (userId && isOpen) {
      loadUserDetails();
    }
  }, [userId, isOpen]);

  const loadUserDetails = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      console.log("Debug - Loading user details for userId:", userId);
      const userDetail = await userManagementService.getUserDetail(userId);
      console.log("Debug - Received user detail:", userDetail);
      setUser(userDetail);
      setEditedUser({ ...userDetail });
    } catch (error) {
      console.error("Failed to load user details:", error);
      showNotification("Không thể tải thông tin người dùng", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !editedUser) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            {isLoading ? "Loading..." : "User not found"}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleSave = async () => {
    if (!currentUser?.id) {
      console.error("Current user ID not available");
      showNotification("Không thể xác định người dùng hiện tại", "error");
      return;
    }

    if (!editedUser || !user) {
      console.error("No user data to save");
      showNotification("Không có dữ liệu để lưu", "error");
      return;
    }

    // Check if profile information has been changed
    const profileFieldsChanged = 
      editedUser.firstName !== user.firstName ||
      editedUser.lastName !== user.lastName ||
      editedUser.email !== user.email ||
      editedUser.phoneNumber !== user.phoneNumber ||
      editedUser.dateOfBirth !== user.dateOfBirth ||
      editedUser.gender !== user.gender ||
      editedUser.province !== user.province ||
      editedUser.district !== user.district ||
      editedUser.emergencyContactName !== user.emergencyContactName ||
      editedUser.emergencyContactPhone !== user.emergencyContactPhone;

    // Check if only account-level information has been changed
    const accountFieldsChanged = 
      editedUser.roleId !== user.roleId ||
      editedUser.isActive !== user.isActive ||
      editedUser.isEmailVerified !== user.isEmailVerified;

    if (profileFieldsChanged && !accountFieldsChanged) {
      showNotification("Hiện tại chỉ có thể cập nhật thông tin tài khoản (vai trò, trạng thái, xác thực email). Cập nhật thông tin cá nhân sẽ được hỗ trợ trong phiên bản tương lai.", "warning");
      return;
    }

    if (profileFieldsChanged && accountFieldsChanged) {
      showNotification("Hiện tại chỉ có thể cập nhật thông tin tài khoản (vai trò, trạng thái, xác thực email). Thông tin cá nhân sẽ không được lưu.", "warning");
    }

    if (!accountFieldsChanged) {
      showNotification("Không có thay đổi nào để lưu", "info");
      setIsEditing(false);
      return;
    }

    console.log("Debug - handleSave values:", {
      editedUserId: editedUser.userId,
      currentUserId: currentUser.id,
      editedUser: editedUser
    });

    try {
      setIsLoading(true);
      
      // Update user account via API (only account-level fields)
      const updatedUser = await userManagementService.updateUserAccount(
        editedUser.userId,
        currentUser.id,
        {
          roleId: editedUser.roleId,
          isActive: editedUser.isActive,
          isEmailVerified: editedUser.isEmailVerified,
        }
      );
      
      console.log("Debug - Update successful:", updatedUser);
      
      // Update local state with the response from server
      setUser(updatedUser);
      setEditedUser(updatedUser);
      setIsEditing(false);
      onUserUpdate?.();
      
      // Show success message
      showNotification("Cập nhật thông tin tài khoản thành công", "success");
    } catch (error) {
      console.error("Failed to update user:", error);
      // Reset to original values on error
      if (user) {
        setEditedUser({ ...user });
      }
      // Show error message
      showNotification("Không thể cập nhật thông tin người dùng. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleStatusChange = async (newStatus: "active" | "inactive") => {
    if (!currentUser?.id) {
      console.error("Current user ID not available");
      showNotification("Không thể xác định người dùng hiện tại", "error");
      return;
    }

    if (!editedUser) {
      console.error("No user data available");
      showNotification("Không có dữ liệu người dùng", "error");
      return;
    }

    const updatedUser = { ...editedUser, isActive: newStatus === "active" };
    setEditedUser(updatedUser);
    
    console.log("Debug - handleStatusChange:", {
      userId: updatedUser.userId,
      newStatus: newStatus,
      isActive: updatedUser.isActive
    });
    
    // Auto-save status changes
    try {
      const result = await userManagementService.updateUserAccount(
        updatedUser.userId,
        currentUser.id,
        {
          roleId: updatedUser.roleId,
          isActive: updatedUser.isActive,
          isEmailVerified: updatedUser.isEmailVerified,
        }
      );
      
      console.log("Debug - Status update successful:", result);
      
      setUser(result);
      setEditedUser(result);
      onUserUpdate?.();
      
      showNotification(`Trạng thái người dùng đã được thay đổi thành ${newStatus === "active" ? "hoạt động" : "không hoạt động"}`, "success");
    } catch (error) {
      console.error("Failed to update user status:", error);
      // Reset on error
      if (user) {
        setEditedUser({ ...user });
      }
      showNotification("Không thể cập nhật trạng thái người dùng. Vui lòng thử lại.", "error");
    }
  };

  const handleRoleChange = async (newRoleId: number) => {
    if (!currentUser?.id) {
      console.error("Current user ID not available");
      showNotification("Không thể xác định người dùng hiện tại", "error");
      return;
    }

    if (!editedUser) {
      console.error("No user data available");
      showNotification("Không có dữ liệu người dùng", "error");
      return;
    }

    const updatedUser = { ...editedUser, roleId: newRoleId };
    setEditedUser(updatedUser);
    
    console.log("Debug - handleRoleChange:", {
      userId: updatedUser.userId,
      newRoleId: newRoleId
    });
    
    // Auto-save role changes
    try {
      const result = await userManagementService.updateUserAccount(
        updatedUser.userId,
        currentUser.id,
        {
          roleId: updatedUser.roleId,
          isActive: updatedUser.isActive,
          isEmailVerified: updatedUser.isEmailVerified,
        }
      );
      
      console.log("Debug - Role update successful:", result);
      
      setUser(result);
      setEditedUser(result);
      onUserUpdate?.();
      
      showNotification("Vai trò người dùng đã được cập nhật thành công", "success");
    } catch (error) {
      console.error("Failed to update user role:", error);
      // Reset on error
      if (user) {
        setEditedUser({ ...user });
      }
      showNotification("Không thể cập nhật vai trò người dùng. Vui lòng thử lại.", "error");
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const getDisplayName = () => {
    return editedUser.fullName || `${editedUser.firstName || ''} ${editedUser.lastName || ''}`.trim();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>User Details</span>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            View and manage user account information, profile details, and administrative settings.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={editedUser.avatarUrl || ""} />
                <AvatarFallback>
                  {editedUser.firstName?.charAt(0) || editedUser.fullName?.charAt(0) || "U"}
                  {editedUser.lastName?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">
                  {getDisplayName()}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {editedUser.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusColor(editedUser.isActive)}>
                    {editedUser.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{editedUser.role}</Badge>
                  {editedUser.isEmailVerified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <UserCheck className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                {isEditing && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium">Lưu ý về chỉnh sửa thông tin</p>
                        <p className="mt-1">
                          Hiện tại chỉ có thể cập nhật thông tin tài khoản (vai trò, trạng thái, xác thực email) thông qua tab "Admin". 
                          Cập nhật thông tin cá nhân sẽ được hỗ trợ trong phiên bản tương lai.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={editedUser.firstName || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          firstName: e.target.value,
                          fullName: `${e.target.value} ${editedUser.lastName || ""}`.trim(),
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={editedUser.lastName || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          lastName: e.target.value,
                          fullName: `${editedUser.firstName || ""} ${e.target.value}`.trim(),
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={editedUser.email || ""}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, email: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={editedUser.phoneNumber || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          phoneNumber: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={editedUser.dateOfBirth ? new Date(editedUser.dateOfBirth).toISOString().split('T')[0] : ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          dateOfBirth: e.target.value ? new Date(e.target.value).toISOString() : null,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select
                      value={editedUser.gender || ""}
                      onValueChange={(value) =>
                        setEditedUser({ ...editedUser, gender: value })
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Province</Label>
                    <Input
                      value={editedUser.province || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          province: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>District</Label>
                    <Input
                      value={editedUser.district || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          district: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label>Emergency Contact Name</Label>
                  <Input
                    value={editedUser.emergencyContactName || ""}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        emergencyContactName: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Emergency Contact Phone</Label>
                  <Input
                    value={editedUser.emergencyContactPhone || ""}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        emergencyContactPhone: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Joined Date</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(editedUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label>Last Login</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {editedUser.lastLoginAt
                          ? new Date(editedUser.lastLoginAt).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label>Age</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm">
                        {editedUser.age ? `${editedUser.age} years old` : "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {[editedUser.district, editedUser.province].filter(Boolean).join(", ") || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>User Statistics</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <div>
                        <span className="text-sm font-medium text-blue-900">Events Joined</span>
                        <div className="text-2xl font-bold text-blue-700">
                          {editedUser.totalEventsJoined || 0}
                        </div>
                      </div>
                      <Award className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div>
                        <span className="text-sm font-medium text-green-900">Events Completed</span>
                        <div className="text-2xl font-bold text-green-700">
                          {editedUser.totalEventsCompleted || 0}
                        </div>
                      </div>
                      <UserCheck className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                      <div>
                        <span className="text-sm font-medium text-purple-900">Collaborations</span>
                        <div className="text-2xl font-bold text-purple-700">
                          {editedUser.totalCollaborations || 0}
                        </div>
                      </div>
                      <Users className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Account Status</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Account Status</span>
                      <Badge variant="outline" className={getStatusColor(editedUser.isActive)}>
                        {editedUser.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Email verified</span>
                      <Badge variant="outline" className={editedUser.isEmailVerified ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                        {editedUser.isEmailVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-4">
                <div>
                  <Label>Account Status</Label>
                  <Select
                    value={editedUser.isActive ? "active" : "inactive"}
                    onValueChange={(value) => handleStatusChange(value as "active" | "inactive")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                   <Label>User Role</Label>
                   <Select
                     value={editedUser.roleId.toString()}
                     onValueChange={(value) => handleRoleChange(parseInt(value))}
                   >
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="1">{RoleDisplayNames[UserRole.ADMIN]}</SelectItem>
                       <SelectItem value="2">{RoleDisplayNames[UserRole.ORGANIZATION]}</SelectItem>
                       <SelectItem value="3">{RoleDisplayNames[UserRole.VOLUNTEER]}</SelectItem>
                       <SelectItem value="4">{RoleDisplayNames[UserRole.PARTNER]}</SelectItem>
                       <SelectItem value="5">{RoleDisplayNames[UserRole.COORDINATOR]}</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                <div className="space-y-2">
                  <Label>Admin Actions</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Mock password reset
                        console.log("Password reset sent to", editedUser.email);
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Password Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Mock email verification
                        console.log("Verification email sent to", editedUser.email);
                      }}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Resend Verification
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
