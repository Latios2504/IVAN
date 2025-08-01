import React from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Loader2, UserPlus } from "lucide-react";
import type {
  CreateVolunteerCoordinatorDto,
  ManagementLevelDto,
  SpecializationDto,
} from "../../../types/volunteer-coordinator";
import { useVolunteerCoordinator } from "../../../context/VolunteerCoordinatorContext";

interface CreateVolunteerCoordinatorDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  managementLevels: ManagementLevelDto[];
  specializations: SpecializationDto[];
}

export const CreateVolunteerCoordinatorDialog: React.FC<
  CreateVolunteerCoordinatorDialogProps
> = ({ open, onClose, onSuccess, managementLevels, specializations }) => {
  const { createCoordinator, availableManagers } = useVolunteerCoordinator();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<
    Partial<CreateVolunteerCoordinatorDto>
  >({
    userId: undefined,
    managementLevel: "",
    specialization: "",
    maxVolunteersManaged: 10,
    notes: "",
    emergencyContact: "",
    emergencyPhone: "",
    workSchedule: "",
    managerCoordinatorId: undefined,
    skills: "",
    certifications: "",
    languagesSpoken: "",
    availabilityHours: "",
    preferredEventTypes: "",
    experience: "",
    education: "",
    profileImageUrl: "",
    socialMediaLinks: "",
    personalNotes: "",
  });

  const handleInputChange = (
    field: keyof CreateVolunteerCoordinatorDto,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId || !formData.managementLevel) {
      alert(
        "Please fill in all required fields (User ID and Management Level)"
      );
      return;
    }

    try {
      setLoading(true);
      await createCoordinator(formData as CreateVolunteerCoordinatorDto);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Failed to create coordinator:", error);
      alert("Failed to create coordinator. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      userId: undefined,
      managementLevel: "",
      specialization: "",
      maxVolunteersManaged: 10,
      notes: "",
      emergencyContact: "",
      emergencyPhone: "",
      workSchedule: "",
      managerCoordinatorId: undefined,
      skills: "",
      certifications: "",
      languagesSpoken: "",
      availabilityHours: "",
      preferredEventTypes: "",
      experience: "",
      education: "",
      profileImageUrl: "",
      socialMediaLinks: "",
      personalNotes: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create New Volunteer Coordinator
          </DialogTitle>
          <DialogDescription>
            Add a new volunteer coordinator to your organization.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User ID - Required */}
            <div className="space-y-2">
              <Label htmlFor="userId">
                User ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="userId"
                type="number"
                placeholder="Enter user ID"
                value={formData.userId || ""}
                onChange={(e) =>
                  handleInputChange(
                    "userId",
                    parseInt(e.target.value) || undefined
                  )
                }
                required
              />
            </div>

            {/* Management Level - Required */}
            <div className="space-y-2">
              <Label htmlFor="managementLevel">
                Management Level <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.managementLevel}
                onValueChange={(value) =>
                  handleInputChange("managementLevel", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select management level" />
                </SelectTrigger>
                <SelectContent>
                  {managementLevels.map((level) => (
                    <SelectItem key={level.levelId} value={level.levelName}>
                      {level.levelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specialization */}
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Select
                value={formData.specialization}
                onValueChange={(value) =>
                  handleInputChange("specialization", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem
                      key={spec.specializationId}
                      value={spec.specializationName}
                    >
                      {spec.specializationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Max Volunteers Managed */}
            <div className="space-y-2">
              <Label htmlFor="maxVolunteersManaged">
                Max Volunteers Managed
              </Label>
              <Input
                id="maxVolunteersManaged"
                type="number"
                placeholder="10"
                value={formData.maxVolunteersManaged || ""}
                onChange={(e) =>
                  handleInputChange(
                    "maxVolunteersManaged",
                    parseInt(e.target.value) || undefined
                  )
                }
                min="1"
              />
            </div>

            {/* Manager */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="managerCoordinatorId">Manager</Label>
              <Select
                value={formData.managerCoordinatorId?.toString()}
                onValueChange={(value) =>
                  handleInputChange(
                    "managerCoordinatorId",
                    value ? parseInt(value) : undefined
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Manager</SelectItem>
                  {availableManagers.map((manager) => (
                    <SelectItem
                      key={manager.coordinatorId}
                      value={manager.coordinatorId.toString()}
                    >
                      {manager.fullName} - {manager.managementLevel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Emergency Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Emergency Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Contact person name"
                  value={formData.emergencyContact || ""}
                  onChange={(e) =>
                    handleInputChange("emergencyContact", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <Input
                  id="emergencyPhone"
                  placeholder="Phone number"
                  value={formData.emergencyPhone || ""}
                  onChange={(e) =>
                    handleInputChange("emergencyPhone", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Professional Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  placeholder="List relevant skills..."
                  value={formData.skills || ""}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  placeholder="List certifications..."
                  value={formData.certifications || ""}
                  onChange={(e) =>
                    handleInputChange("certifications", e.target.value)
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe relevant experience..."
                  value={formData.experience || ""}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  placeholder="Educational background..."
                  value={formData.education || ""}
                  onChange={(e) =>
                    handleInputChange("education", e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Work Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workSchedule">Work Schedule</Label>
                <Textarea
                  id="workSchedule"
                  placeholder="Describe work schedule..."
                  value={formData.workSchedule || ""}
                  onChange={(e) =>
                    handleInputChange("workSchedule", e.target.value)
                  }
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availabilityHours">Availability Hours</Label>
                <Input
                  id="availabilityHours"
                  placeholder="e.g., Mon-Fri 9AM-5PM"
                  value={formData.availabilityHours || ""}
                  onChange={(e) =>
                    handleInputChange("availabilityHours", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredEventTypes">
                  Preferred Event Types
                </Label>
                <Input
                  id="preferredEventTypes"
                  placeholder="Types of events preferred"
                  value={formData.preferredEventTypes || ""}
                  onChange={(e) =>
                    handleInputChange("preferredEventTypes", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="languagesSpoken">Languages Spoken</Label>
                <Input
                  id="languagesSpoken"
                  placeholder="e.g., English, Vietnamese"
                  value={formData.languagesSpoken || ""}
                  onChange={(e) =>
                    handleInputChange("languagesSpoken", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about the coordinator..."
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Coordinator
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
