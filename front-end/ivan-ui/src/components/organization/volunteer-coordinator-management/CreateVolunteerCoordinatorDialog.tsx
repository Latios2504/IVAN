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
  VolunteerCoordinatorDto,
} from "../../../types/volunteer-coordinator";
import {
  useCoordinatorOperations,
  useCoordinatorLookups,
} from "@/hooks/useVolunteerCoordinatorData";

interface CreateVolunteerCoordinatorDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organizationId: number;
  managementLevels?: ManagementLevelDto[];
  specializations?: SpecializationDto[];
}

export const CreateVolunteerCoordinatorDialog: React.FC<
  CreateVolunteerCoordinatorDialogProps
> = ({
  open,
  onClose,
  onSuccess,
  organizationId,
  managementLevels,
  specializations,
}) => {
  const { createCoordinator, loading: isCreating } =
    useCoordinatorOperations(organizationId);
  const { availableManagers } = useCoordinatorLookups(organizationId);

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
      await createCoordinator(formData as CreateVolunteerCoordinatorDto);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Failed to create coordinator:", error);
      alert("Failed to create coordinator. Please try again.");
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create New Volunteer Coordinator
          </DialogTitle>
          <DialogDescription>
            Add a new volunteer coordinator to your organization. Fill in the
            required information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="userId">
                  User ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userId"
                  type="number"
                  value={formData.userId || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "userId",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="managementLevel">
                  Management Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.managementLevel}
                  onValueChange={(value) =>
                    handleInputChange("managementLevel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select management level" />
                  </SelectTrigger>
                  <SelectContent>
                    {managementLevels?.map((level) => (
                      <SelectItem key={level.levelId} value={level.levelName}>
                        {level.levelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                    {specializations?.map((spec) => (
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

              <div className="space-y-2">
                <Label htmlFor="maxVolunteersManaged">
                  Max Volunteers Managed
                </Label>
                <Input
                  id="maxVolunteersManaged"
                  type="number"
                  min="1"
                  value={formData.maxVolunteersManaged || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "maxVolunteersManaged",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="Maximum number of volunteers"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerCoordinatorId">Manager</Label>
                <Select
                  value={formData.managerCoordinatorId?.toString() || ""}
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
                    {availableManagers?.map((manager) => (
                      <SelectItem
                        key={manager.coordinatorId}
                        value={manager.coordinatorId.toString()}
                      >
                        {manager.managerCoordinatorName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact & Availability */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact & Availability</h3>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    handleInputChange("emergencyContact", e.target.value)
                  }
                  placeholder="Emergency contact name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) =>
                    handleInputChange("emergencyPhone", e.target.value)
                  }
                  placeholder="Emergency phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workSchedule">Work Schedule</Label>
                <Textarea
                  id="workSchedule"
                  value={formData.workSchedule}
                  onChange={(e) =>
                    handleInputChange("workSchedule", e.target.value)
                  }
                  placeholder="Describe work schedule availability"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availabilityHours">Availability Hours</Label>
                <Input
                  id="availabilityHours"
                  value={formData.availabilityHours}
                  onChange={(e) =>
                    handleInputChange("availabilityHours", e.target.value)
                  }
                  placeholder="e.g., Monday-Friday 9AM-5PM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languagesSpoken">Languages Spoken</Label>
                <Input
                  id="languagesSpoken"
                  value={formData.languagesSpoken}
                  onChange={(e) =>
                    handleInputChange("languagesSpoken", e.target.value)
                  }
                  placeholder="e.g., English, Spanish, French"
                />
              </div>
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Skills & Experience</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder="List relevant skills"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) =>
                    handleInputChange("certifications", e.target.value)
                  }
                  placeholder="List certifications"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  placeholder="Describe relevant experience"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) =>
                    handleInputChange("education", e.target.value)
                  }
                  placeholder="Educational background"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredEventTypes">Preferred Event Types</Label>
              <Input
                id="preferredEventTypes"
                value={formData.preferredEventTypes}
                onChange={(e) =>
                  handleInputChange("preferredEventTypes", e.target.value)
                }
                placeholder="e.g., Community Service, Education, Healthcare"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                <Input
                  id="profileImageUrl"
                  value={formData.profileImageUrl}
                  onChange={(e) =>
                    handleInputChange("profileImageUrl", e.target.value)
                  }
                  placeholder="URL to profile image"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialMediaLinks">Social Media Links</Label>
                <Input
                  id="socialMediaLinks"
                  value={formData.socialMediaLinks}
                  onChange={(e) =>
                    handleInputChange("socialMediaLinks", e.target.value)
                  }
                  placeholder="Social media profile links"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes about the coordinator"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalNotes">Personal Notes</Label>
              <Textarea
                id="personalNotes"
                value={formData.personalNotes}
                onChange={(e) =>
                  handleInputChange("personalNotes", e.target.value)
                }
                placeholder="Personal notes (private)"
                rows={3}
              />
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
            disabled={
              isCreating || !formData.userId || !formData.managementLevel
            }
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Coordinator
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
