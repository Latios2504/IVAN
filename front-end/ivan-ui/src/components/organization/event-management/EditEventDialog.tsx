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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 border-gradient-to-r border-blue-200 dark:border-blue-800 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-6 -m-6 mb-6">
          <DialogTitle className="text-xl font-bold">Edit Event: {event.eventName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Event Name *</Label>
              <Input
                id="eventName"
                value={formData.eventName}
                onChange={(e) => handleInputChange("eventName", e.target.value)}
                className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                required
              />
            </div>

            <div>
              <Label htmlFor="categoryId" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category *</Label>
              <Select
                value={formData.categoryId.toString()}
                onValueChange={(value) =>
                  handleInputChange("categoryId", parseInt(value))
                }
              >
                <SelectTrigger className="bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-green-200 dark:border-green-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-200 shadow-sm hover:shadow-md">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 shadow-xl">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.categoryId}
                      value={category.categoryId.toString()}
                      className="hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Short Description</Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value)
              }
              className="bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="bg-gradient-to-r from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="bg-gradient-to-r from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20 border-orange-200 dark:border-orange-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all duration-200 shadow-sm hover:shadow-md"
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="bg-gradient-to-r from-white to-red-50 dark:from-gray-800 dark:to-red-900/20 border-red-200 dark:border-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200 shadow-sm hover:shadow-md"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="bg-gradient-to-r from-white to-teal-50 dark:from-gray-800 dark:to-teal-900/20 border-teal-200 dark:border-teal-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 transition-all duration-200 shadow-sm hover:shadow-md"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minVolunteers" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Min Volunteers</Label>
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
                className="bg-gradient-to-r from-white to-cyan-50 dark:from-gray-800 dark:to-cyan-900/20 border-cyan-200 dark:border-cyan-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-800 transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <Label htmlFor="maxVolunteers" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Max Volunteers</Label>
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
                className="bg-gradient-to-r from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          <div className="flex gap-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  handleInputChange("isFeatured", checked)
                }
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
              />
              <Label htmlFor="isFeatured" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">Featured Event</Label>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="isUrgent"
                checked={formData.isUrgent}
                onCheckedChange={(checked) =>
                  handleInputChange("isUrgent", checked)
                }
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-500 data-[state=checked]:to-orange-500"
              />
              <Label htmlFor="isUrgent" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">Urgent Event</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
