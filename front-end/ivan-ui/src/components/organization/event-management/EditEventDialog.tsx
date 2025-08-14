import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
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
import { Switch } from "../../ui/switch";
import { eventsService } from "../../../services/eventsService";
import type {
  EventDto,
  EventCategoryDto,
  UpdateEventDto,
} from "../../../types/events";

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventDto | null;
  categories: EventCategoryDto[];
  onSuccess?: () => void;
}

export const EditEventDialog: React.FC<EditEventDialogProps> = ({
  open,
  onClose,
  event,
  categories,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    categoryId: 0,
    description: "",
    shortDescription: "",
    startDate: "",
    endDate: "",
    location: "",
    detailedAddress: "",
    province: "",
    district: "",
    maxVolunteers: 1,
    minVolunteers: 1,
    requiredSkills: "",
    ageRequirement: "",
    genderRequirement: "",
    requirements: "",
    benefits: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    bannerImageUrl: "",
    isFeatured: false,
    isUrgent: false,
  });

  // Initialize form with event data
  useEffect(() => {
    if (event) {
      setFormData({
        eventName: event.eventName || "",
        categoryId: event.categoryId || 0,
        description: event.description || "",
        shortDescription: event.shortDescription || "",
        startDate: event.startDate ? event.startDate.split("T")[0] : "",
        endDate: event.endDate ? event.endDate.split("T")[0] : "",
        location: event.location || "",
        detailedAddress: event.detailedAddress || "",
        province: event.province || "",
        district: event.district || "",
        maxVolunteers: event.maxVolunteers || 1,
        minVolunteers: event.minVolunteers || 1,
        requiredSkills: event.requiredSkills || "",
        ageRequirement: event.ageRequirement || "",
        genderRequirement: event.genderRequirement || "",
        requirements: event.requirements || "",
        benefits: event.benefits || "",
        contactPerson: event.contactPerson || "",
        contactPhone: event.contactPhone || "",
        contactEmail: event.contactEmail || "",
        bannerImageUrl: event.bannerImageUrl || "",
        isFeatured: event.isFeatured || false,
        isUrgent: event.isUrgent || false,
      });
    }
  }, [event]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event || !formData.eventName.trim() || !formData.location.trim()) {
      alert("Please fill in required fields");
      return;
    }

    try {
      setLoading(true);

      const updatePayload: UpdateEventDto = {
        eventName: formData.eventName,
        categoryId: formData.categoryId,
        description: formData.description || undefined,
        shortDescription: formData.shortDescription || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        detailedAddress: formData.detailedAddress || undefined,
        province: formData.province || undefined,
        district: formData.district || undefined,
        maxVolunteers: formData.maxVolunteers,
        minVolunteers: formData.minVolunteers,
        requiredSkills: formData.requiredSkills || undefined,
        ageRequirement: formData.ageRequirement || undefined,
        genderRequirement: formData.genderRequirement || undefined,
        requirements: formData.requirements || undefined,
        benefits: formData.benefits || undefined,
        contactPerson: formData.contactPerson || undefined,
        contactPhone: formData.contactPhone || undefined,
        contactEmail: formData.contactEmail || undefined,
        bannerImageUrl: formData.bannerImageUrl || undefined,
        isFeatured: formData.isFeatured,
        isUrgent: formData.isUrgent,
      };

      await eventsService.updateEvent(event.eventId, updatePayload);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update event:", error);
      alert("Failed to update event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event: {event.eventName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventName">Event Name *</Label>
              <Input
                id="eventName"
                value={formData.eventName}
                onChange={(e) => handleInputChange("eventName", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="categoryId">Category *</Label>
              <Select
                value={formData.categoryId.toString()}
                onValueChange={(value) =>
                  handleInputChange("categoryId", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.categoryId}
                      value={category.categoryId.toString()}
                    >
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value)
              }
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minVolunteers">Min Volunteers</Label>
              <Input
                id="minVolunteers"
                type="number"
                min="1"
                value={formData.minVolunteers}
                onChange={(e) =>
                  handleInputChange(
                    "minVolunteers",
                    parseInt(e.target.value) || 1
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="maxVolunteers">Max Volunteers</Label>
              <Input
                id="maxVolunteers"
                type="number"
                min="1"
                value={formData.maxVolunteers}
                onChange={(e) =>
                  handleInputChange(
                    "maxVolunteers",
                    parseInt(e.target.value) || 1
                  )
                }
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  handleInputChange("isFeatured", checked)
                }
              />
              <Label htmlFor="isFeatured">Featured Event</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isUrgent"
                checked={formData.isUrgent}
                onCheckedChange={(checked) =>
                  handleInputChange("isUrgent", checked)
                }
              />
              <Label htmlFor="isUrgent">Urgent Event</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
