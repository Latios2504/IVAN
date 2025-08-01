import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Checkbox } from "../../ui/checkbox";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { cn } from "../../../lib/utils";
import type {
  EventDto,
  EventCategoryDto,
  CreateEventDto,
} from "../../../types/event";
import { useEvent } from "../../../context/EventContext";
import { ImageUpload } from "./ImageUpload";

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventDto | null;
  categories: EventCategoryDto[];
  onSuccess?: () => void;
}

// Form data type for editing (Partial of CreateEventDto)
interface EditFormData extends Partial<CreateEventDto> {
  eventName: string;
  categoryId: number;
  description: string;
  location: string;
  maxVolunteers: number;
  minVolunteers: number;
  startDate: string;
  endDate: string;
}

export const EditEventDialog: React.FC<EditEventDialogProps> = ({
  open,
  onClose,
  event,
  categories,
  onSuccess,
}) => {
  const { updateEvent, loading } = useEvent();

  const [formData, setFormData] = useState<EditFormData>({
    eventName: "",
    categoryId: 0,
    description: "",
    shortDescription: "",
    startDate: "",
    endDate: "",
    registrationStartDate: "",
    registrationEndDate: "",
    location: "",
    detailedAddress: "",
    wardCommune: "",
    district: "",
    province: "",
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
    galleryImages: "",
    isFeatured: false,
    isUrgent: false,
    priority: 1,
    budget: 0,
    currency: "VND",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [regStartDate, setRegStartDate] = useState<Date>();
  const [regEndDate, setRegEndDate] = useState<Date>();

  // Initialize form with event data when event changes
  useEffect(() => {
    if (event) {
      setFormData({
        eventName: event.eventName,
        categoryId: event.categoryId,
        description: event.description,
        shortDescription: event.shortDescription || "",
        startDate: event.startDate,
        endDate: event.endDate,
        registrationStartDate: event.registrationStartDate || "",
        registrationEndDate: event.registrationEndDate || "",
        location: event.location,
        detailedAddress: event.detailedAddress || "",
        wardCommune: event.wardCommune || "",
        district: event.district || "",
        province: event.province || "",
        maxVolunteers: event.maxVolunteers,
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
        galleryImages: event.galleryImages || "",
        isFeatured: event.isFeatured || false,
        isUrgent: event.isUrgent || false,
        priority: event.priority || 1,
        budget: event.budget || 0,
        currency: event.currency || "VND",
      });

      // Set date objects for calendar components
      setStartDate(new Date(event.startDate));
      setEndDate(new Date(event.endDate));
      if (event.registrationStartDate) {
        setRegStartDate(new Date(event.registrationStartDate));
      }
      if (event.registrationEndDate) {
        setRegEndDate(new Date(event.registrationEndDate));
      }
    }
  }, [event]);

  const handleInputChange = (field: keyof EditFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      const isoString = date.toISOString();
      setFormData((prev) => ({ ...prev, [field]: isoString }));

      // Update corresponding state
      switch (field) {
        case "startDate":
          setStartDate(date);
          break;
        case "endDate":
          setEndDate(date);
          break;
        case "registrationStartDate":
          setRegStartDate(date);
          break;
        case "registrationEndDate":
          setRegEndDate(date);
          break;
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventName.trim()) {
      newErrors.eventName = "Event name is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.maxVolunteers < 1) {
      newErrors.maxVolunteers = "Maximum volunteers must be at least 1";
    }

    if (
      formData.minVolunteers &&
      formData.minVolunteers > formData.maxVolunteers
    ) {
      newErrors.minVolunteers = "Minimum volunteers cannot exceed maximum";
    }

    // Registration date validation
    if (formData.registrationStartDate && formData.registrationEndDate) {
      if (
        new Date(formData.registrationStartDate) >=
        new Date(formData.registrationEndDate)
      ) {
        newErrors.registrationEndDate =
          "Registration end date must be after start date";
      }
    }

    if (formData.registrationEndDate && formData.startDate) {
      if (
        new Date(formData.registrationEndDate) > new Date(formData.startDate)
      ) {
        newErrors.registrationEndDate =
          "Registration must end before event starts";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !event) {
      return;
    }

    try {
      // Create update payload with eventId
      const updatePayload = { ...formData, eventId: event.eventId };
      await updateEvent(event.eventId, updatePayload);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update event:", error);
      setErrors({ submit: "Failed to update event. Please try again." });
    }
  };

  const handleClose = () => {
    setFormData({
      eventName: "",
      categoryId: 0,
      description: "",
      shortDescription: "",
      startDate: "",
      endDate: "",
      registrationStartDate: "",
      registrationEndDate: "",
      location: "",
      detailedAddress: "",
      wardCommune: "",
      district: "",
      province: "",
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
      galleryImages: "",
      isFeatured: false,
      isUrgent: false,
      priority: 1,
      budget: 0,
      currency: "VND",
    });
    setErrors({});
    setStartDate(undefined);
    setEndDate(undefined);
    setRegStartDate(undefined);
    setRegEndDate(undefined);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the event information. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name *</Label>
                <Input
                  id="eventName"
                  value={formData.eventName}
                  onChange={(e) =>
                    handleInputChange("eventName", e.target.value)
                  }
                  className={errors.eventName ? "border-red-500" : ""}
                />
                {errors.eventName && (
                  <p className="text-sm text-red-500">{errors.eventName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId.toString()}
                  onValueChange={(value) =>
                    handleInputChange("categoryId", parseInt(value))
                  }
                >
                  <SelectTrigger
                    className={errors.categoryId ? "border-red-500" : ""}
                  >
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
                {errors.categoryId && (
                  <p className="text-sm text-red-500">{errors.categoryId}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) =>
                  handleInputChange("shortDescription", e.target.value)
                }
                rows={2}
                placeholder="Brief summary for preview cards..."
              />
            </div>
          </div>

          {/* Event Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Event Schedule</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                        errors.startDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate
                        ? startDate.toLocaleDateString("vi-VN")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => handleDateChange("startDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground",
                        errors.endDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate
                        ? endDate.toLocaleDateString("vi-VN")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => handleDateChange("endDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Registration Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !regStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {regStartDate
                        ? regStartDate.toLocaleDateString("vi-VN")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={regStartDate}
                      onSelect={(date) =>
                        handleDateChange("registrationStartDate", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Registration End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !regEndDate && "text-muted-foreground",
                        errors.registrationEndDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {regEndDate
                        ? regEndDate.toLocaleDateString("vi-VN")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={regEndDate}
                      onSelect={(date) =>
                        handleDateChange("registrationEndDate", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.registrationEndDate && (
                  <p className="text-sm text-red-500">
                    {errors.registrationEndDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location Details</h3>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailedAddress">Detailed Address</Label>
              <Input
                id="detailedAddress"
                value={formData.detailedAddress}
                onChange={(e) =>
                  handleInputChange("detailedAddress", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wardCommune">Ward/Commune</Label>
                <Input
                  id="wardCommune"
                  value={formData.wardCommune}
                  onChange={(e) =>
                    handleInputChange("wardCommune", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) =>
                    handleInputChange("district", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) =>
                    handleInputChange("province", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Volunteer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Volunteer Requirements</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxVolunteers">Maximum Volunteers *</Label>
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
                  className={errors.maxVolunteers ? "border-red-500" : ""}
                />
                {errors.maxVolunteers && (
                  <p className="text-sm text-red-500">{errors.maxVolunteers}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="minVolunteers">Minimum Volunteers</Label>
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
                  className={errors.minVolunteers ? "border-red-500" : ""}
                />
                {errors.minVolunteers && (
                  <p className="text-sm text-red-500">{errors.minVolunteers}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredSkills">Required Skills</Label>
              <Textarea
                id="requiredSkills"
                value={formData.requiredSkills}
                onChange={(e) =>
                  handleInputChange("requiredSkills", e.target.value)
                }
                rows={2}
                placeholder="List any specific skills or experience required..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageRequirement">Age Requirement</Label>
                <Input
                  id="ageRequirement"
                  value={formData.ageRequirement}
                  onChange={(e) =>
                    handleInputChange("ageRequirement", e.target.value)
                  }
                  placeholder="e.g., 18+, 16-65"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genderRequirement">Gender Requirement</Label>
                <Select
                  value={formData.genderRequirement}
                  onValueChange={(value) =>
                    handleInputChange("genderRequirement", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Additional Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) =>
                  handleInputChange("requirements", e.target.value)
                }
                rows={3}
                placeholder="Any other requirements or conditions..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits for Volunteers</Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => handleInputChange("benefits", e.target.value)}
                rows={3}
                placeholder="What volunteers will gain from this experience..."
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    handleInputChange("contactPerson", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Event Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Event Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    handleInputChange("isFeatured", checked)
                  }
                />
                <Label htmlFor="isFeatured">Featured Event</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isUrgent"
                  checked={formData.isUrgent}
                  onCheckedChange={(checked) =>
                    handleInputChange("isUrgent", checked)
                  }
                />
                <Label htmlFor="isUrgent">Urgent Event</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority (1-10)</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange("priority", parseInt(e.target.value) || 1)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  value={formData.budget}
                  onChange={(e) =>
                    handleInputChange("budget", parseFloat(e.target.value) || 0)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VND">VND</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Event Images</h3>
            <ImageUpload
              bannerUrl={formData.bannerImageUrl}
              galleryImages={formData.galleryImages}
              onBannerChange={(url: string) =>
                handleInputChange("bannerImageUrl", url)
              }
              onGalleryChange={(images: string) =>
                handleInputChange("galleryImages", images)
              }
            />
          </div>

          {errors.submit && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
              {errors.submit}
            </div>
          )}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
