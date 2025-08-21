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
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventCategoryDto, CreateEventDto } from "../../../types/events";
import { eventsService } from "../../../services/eventsService";

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: EventCategoryDto[];
}

export const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  open,
  onClose,
  onSuccess,
  categories,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<CreateEventDto>>({
    eventName: "",
    description: "",
    shortDescription: "",
    location: "",
    maxVolunteers: 1,
    categoryId: undefined,
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (
    field: keyof CreateEventDto,
    value: string | number | Date | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (
    field: "startDate" | "endDate",
    date: Date | undefined
  ) => {
    if (date) {
      handleInputChange(field, date.toISOString().split("T")[0]);
    } else {
      handleInputChange(field, "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.eventName ||
      !formData.description ||
      !formData.location ||
      !formData.categoryId ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await eventsService.createEvent(formData as CreateEventDto);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      eventName: "",
      description: "",
      shortDescription: "",
      location: "",
      maxVolunteers: 1,
      categoryId: undefined,
      startDate: "",
      endDate: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 border-gradient-to-r border-blue-200 dark:border-blue-800 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-6 -m-6 mb-6">
          <DialogTitle className="text-xl font-bold">Create New Event</DialogTitle>
          <DialogDescription className="text-blue-100">
            Create a new volunteer event for your organization
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Event Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="eventName"
                value={formData.eventName || ""}
                onChange={(e) => handleInputChange("eventName", e.target.value)}
                placeholder="Enter event name"
                className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.categoryId?.toString() || ""}
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the event details..."
              rows={4}
              className="bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-200 shadow-sm hover:shadow-md resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Short Description</Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription || ""}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value)
              }
              placeholder="Brief description (optional)"
              className="bg-gradient-to-r from-white to-amber-50 dark:from-gray-800 dark:to-amber-900/20 border-amber-200 dark:border-amber-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Event location"
              className="bg-gradient-to-r from-white to-teal-50 dark:from-gray-800 dark:to-teal-900/20 border-teal-200 dark:border-teal-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 transition-all duration-200 shadow-sm hover:shadow-md"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate
                      ? new Date(formData.startDate).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.startDate
                        ? new Date(formData.startDate)
                        : undefined
                    }
                    onSelect={(date) => handleDateChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>
                End Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate
                      ? new Date(formData.endDate).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.endDate ? new Date(formData.endDate) : undefined
                    }
                    onSelect={(date) => handleDateChange("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Volunteers */}
          <div className="space-y-2">
            <Label htmlFor="maxVolunteers" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Maximum Volunteers <span className="text-red-500">*</span>
            </Label>
            <Input
              id="maxVolunteers"
              type="number"
              min="1"
              value={formData.maxVolunteers || 1}
              onChange={(e) =>
                handleInputChange("maxVolunteers", parseInt(e.target.value))
              }
              className="bg-gradient-to-r from-white to-cyan-50 dark:from-gray-800 dark:to-cyan-900/20 border-cyan-200 dark:border-cyan-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-800 transition-all duration-200 shadow-sm hover:shadow-md"
              required
            />
          </div>

          <DialogFooter className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
