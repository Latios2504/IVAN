import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import type { CoordinatorProfile } from "@/types/profile";

interface CoordinatorCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCoordinator: CoordinatorData) => void;
  organizationId?: number;
}

export interface CoordinatorData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  organizationId: number;
  responsibilities: string[];
  departments: string[];
  permissions: {
    canCreateEvents: boolean;
    canManageVolunteers: boolean;
    canViewReports: boolean;
    canManagePartners: boolean;
  };
}

const AVAILABLE_RESPONSIBILITIES = [
  "Event Planning",
  "Volunteer Coordination",
  "Partner Relations",
  "Fundraising",
  "Community Outreach",
  "Program Management",
  "Data Management",
  "Communications",
];

const AVAILABLE_DEPARTMENTS = [
  "Operations",
  "Programs",
  "Development",
  "Communications",
  "Finance",
  "Human Resources",
  "Volunteer Services",
  "Community Relations",
];

export function CoordinatorCreationDialog({
  isOpen,
  onClose,
  onSuccess,
  organizationId,
}: CoordinatorCreationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<CoordinatorData>({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    organizationId: organizationId || 0,
    responsibilities: [],
    departments: [],
    permissions: {
      canCreateEvents: false,
      canManageVolunteers: false,
      canViewReports: false,
      canManagePartners: false,
    },
  });

  const resetForm = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      organizationId: organizationId || 0,
      responsibilities: [],
      departments: [],
      permissions: {
        canCreateEvents: false,
        canManageVolunteers: false,
        canViewReports: false,
        canManagePartners: false,
      },
    });
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError("Please fill in all required fields");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.responsibilities.length === 0) {
      setError("Please select at least one responsibility");
      return false;
    }

    if (formData.departments.length === 0) {
      setError("Please select at least one department");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - simulate coordinator creation
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional failures for demo
          if (Math.random() > 0.8) {
            reject(new Error("Email already exists in the system"));
          } else {
            resolve(true);
          }
        }, 2000);
      });

      // Success - call the success callback
      onSuccess(formData);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create coordinator");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponsibilityChange = (responsibility: string, checked: boolean) => {
    const updated = checked
      ? [...formData.responsibilities, responsibility]
      : formData.responsibilities.filter((r) => r !== responsibility);
    
    setFormData({ ...formData, responsibilities: updated });
  };

  const handleDepartmentChange = (department: string, checked: boolean) => {
    const updated = checked
      ? [...formData.departments, department]
      : formData.departments.filter((d) => d !== department);
    
    setFormData({ ...formData, departments: updated });
  };

  const handlePermissionChange = (
    permission: keyof CoordinatorData["permissions"],
    checked: boolean
  ) => {
    setFormData({
      ...formData,
      permissions: { ...formData.permissions, [permission]: checked },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Coordinator</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error?.message || error?.toString() || 'Đã xảy ra lỗi'}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="coordinator@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Responsibilities */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Responsibilities <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_RESPONSIBILITIES.map((responsibility) => (
                <div key={responsibility} className="flex items-center space-x-2">
                  <Checkbox
                    id={responsibility}
                    checked={formData.responsibilities.includes(responsibility)}
                    onCheckedChange={(checked) =>
                      handleResponsibilityChange(responsibility, checked as boolean)
                    }
                  />
                  <Label htmlFor={responsibility} className="text-sm">
                    {responsibility}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Departments <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_DEPARTMENTS.map((department) => (
                <div key={department} className="flex items-center space-x-2">
                  <Checkbox
                    id={department}
                    checked={formData.departments.includes(department)}
                    onCheckedChange={(checked) =>
                      handleDepartmentChange(department, checked as boolean)
                    }
                  />
                  <Label htmlFor={department} className="text-sm">
                    {department}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Permissions</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canCreateEvents"
                  checked={formData.permissions.canCreateEvents}
                  onCheckedChange={(checked) =>
                    handlePermissionChange("canCreateEvents", checked as boolean)
                  }
                />
                <Label htmlFor="canCreateEvents">Can Create Events</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canManageVolunteers"
                  checked={formData.permissions.canManageVolunteers}
                  onCheckedChange={(checked) =>
                    handlePermissionChange("canManageVolunteers", checked as boolean)
                  }
                />
                <Label htmlFor="canManageVolunteers">Can Manage Volunteers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canViewReports"
                  checked={formData.permissions.canViewReports}
                  onCheckedChange={(checked) =>
                    handlePermissionChange("canViewReports", checked as boolean)
                  }
                />
                <Label htmlFor="canViewReports">Can View Reports</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canManagePartners"
                  checked={formData.permissions.canManagePartners}
                  onCheckedChange={(checked) =>
                    handlePermissionChange("canManagePartners", checked as boolean)
                  }
                />
                <Label htmlFor="canManagePartners">Can Manage Partners</Label>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Create Coordinator
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
