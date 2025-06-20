import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
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
} from "lucide-react";
import type { User } from "@/types/auth";

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: (updatedUser: User) => void;
}

export function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onUserUpdate,
}: UserDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  React.useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  if (!user || !editedUser) return null;

  const handleSave = async () => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      onUserUpdate(editedUser);
      setIsEditing(false);
      // Mock success notification would go here
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleStatusChange = async (newStatus: "active" | "inactive") => {
    const updatedUser = { ...editedUser, isActive: newStatus === "active" };
    setEditedUser(updatedUser);
    
    // Auto-save status changes
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onUserUpdate(updatedUser);
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const getDisplayName = () => {
    return user.profile?.fullName || user.fullName;
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
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={""} />
                <AvatarFallback>
                  {user.profile?.firstName?.charAt(0) || user.fullName.charAt(0)}
                  {user.profile?.lastName?.charAt(0) || ""}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={editedUser.profile?.firstName || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          profile: {
                            ...editedUser.profile!,
                            firstName: e.target.value,
                            fullName: `${e.target.value} ${
                              editedUser.profile?.lastName || ""
                            }`,
                          },
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={editedUser.profile?.lastName || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          profile: {
                            ...editedUser.profile!,
                            lastName: e.target.value,
                            fullName: `${
                              editedUser.profile?.firstName || ""
                            } ${e.target.value}`,
                          },
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, email: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={editedUser.profile?.phoneNumber || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          profile: {
                            ...editedUser.profile!,
                            phoneNumber: e.target.value,
                          },
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={editedUser.profile?.bio || ""}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        profile: {
                          ...editedUser.profile!,
                          bio: e.target.value,
                        },
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
                </div>
                <div>
                  <Label>Account Activity</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Profile completeness</span>
                      <Badge variant="outline">
                        {editedUser.profile?.isProfileComplete ? "Complete" : "Incomplete"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Email verified</span>
                      <Badge variant="outline">
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
