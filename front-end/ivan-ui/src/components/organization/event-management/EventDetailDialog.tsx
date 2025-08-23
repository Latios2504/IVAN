import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "../../ui/alert";
import type {
  EventDto,
  EventCategoryDto,
  EventStatusDto,
} from "../../../types/events";
import { eventsService } from "../../../services/eventsService";

interface EventDetailDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventDto | null;
  categories: EventCategoryDto[];
  statuses: EventStatusDto[];
  onEventUpdated?: () => void;
}

export const EventDetailDialog: React.FC<EventDetailDialogProps> = ({
  open,
  onClose,
  event,
  categories,
  statuses,
  onEventUpdated,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  if (!event) return null;

  // Get valid next statuses based on current status
  const getValidNextStatuses = (currentStatusId: number): EventStatusDto[] => {
    const validTransitions: { [key: number]: number[] } = {
      2: [3, 5], // Published -> Ongoing, Cancelled
      3: [4, 5], // Ongoing -> Completed, Cancelled
    };

    const validStatusIds = validTransitions[currentStatusId] || [];
    return statuses.filter(status => validStatusIds.includes(status.statusId));
  };

  const validNextStatuses = getValidNextStatuses(event.statusId);
  const canUpdateStatus = validNextStatuses.length > 0;

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;

    setIsUpdatingStatus(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      await eventsService.updateEventStatus(event.eventId, {
        status: selectedStatus,
      });
      setUpdateSuccess(true);
      setSelectedStatus("");
      onEventUpdated?.();
      
      // Auto close success message after 2 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 2000);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Failed to update event status"
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 border-gradient-to-r border-blue-200 dark:border-blue-800 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-6 -m-6 mb-6">
          <DialogTitle className="text-2xl font-bold">
            {event.eventName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Main Information Grid - 3 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Basic Event Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-300">Event Information</h3>
              <div className="space-y-3">
                <p>
                  <strong>Category:</strong> {event.categoryName}
                </p>
                <p>
                  <strong className="text-gray-700 dark:text-gray-300">Status:</strong>{" "}
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">{event.statusName}</Badge>
                </p>
                <p>
                  <strong>Organization:</strong> {event.organizationName}
                </p>
                {event.shortDescription && (
                  <p>
                    <strong>Short Description:</strong> {event.shortDescription}
                  </p>
                )}
                {(event.isFeatured || event.isUrgent) && (
                  <div className="mt-4 flex gap-2">
                    {event.isFeatured && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Featured
                      </Badge>
                    )}
                    {event.isUrgent && (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Urgent
                      </Badge>
                    )}
                  </div>
                )}
                {(event.createdAt || event.updatedAt) && (
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 border-t pt-3">
                    {event.createdAt && (
                      <p>
                        <strong>Created:</strong> {new Date(event.createdAt).toLocaleString()}
                      </p>
                    )}
                    {event.updatedAt && (
                      <p>
                        <strong>Last Updated:</strong> {new Date(event.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Dates & Volunteers */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <h3 className="text-lg font-semibold mb-3 text-purple-800 dark:text-purple-300">Schedule & Volunteers</h3>
              <div className="space-y-3">
                <div className="border-b pb-3 mb-3">
                  <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Event Dates</h4>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>
                </div>
                {(event.registrationStartDate || event.registrationEndDate) && (
                  <div className="border-b pb-3 mb-3">
                    <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Registration Period</h4>
                    {event.registrationStartDate && (
                      <p>
                        <strong>Registration Start:</strong>{" "}
                        {new Date(event.registrationStartDate).toLocaleDateString()}
                      </p>
                    )}
                    {event.registrationEndDate && (
                      <p>
                        <strong>Registration End:</strong>{" "}
                        {new Date(event.registrationEndDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Volunteer Information</h4>
                  <p>
                    <strong>Registered:</strong> {event.volunteersRegistered || 0}
                  </p>
                  <p>
                    <strong>Min Required:</strong> {event.minVolunteers}
                  </p>
                  <p>
                    <strong>Max Allowed:</strong> {event.maxVolunteers || "No limit"}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Location */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <h3 className="text-lg font-semibold mb-3 text-green-800 dark:text-green-300">Location</h3>
              <div className="space-y-3">
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                {event.detailedAddress && (
                  <p>
                    <strong>Address:</strong> {event.detailedAddress}
                  </p>
                )}
                {event.district && (
                  <p>
                    <strong>District:</strong> {event.district}
                  </p>
                )}
                {event.province && (
                  <p>
                    <strong>Province:</strong> {event.province}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Images Section */}
          {(event.bannerImageUrl || event.galleryImages) && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
              <h3 className="text-lg font-semibold mb-3 text-amber-800 dark:text-amber-300">Event Images</h3>
              <div className="space-y-4">
                {event.bannerImageUrl && (
                  <div>
                    <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-2">Banner Image</h4>
                    <img 
                      src={event.bannerImageUrl} 
                      alt="Event Banner" 
                      className="max-w-full h-auto rounded-lg shadow-md max-h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {event.galleryImages && (
                  <div>
                    <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-2">Gallery Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {event.galleryImages.split(',').map((url, index) => (
                        <img 
                          key={index}
                          src={url.trim()} 
                          alt={`Gallery ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <h3 className="text-lg font-semibold mb-3 text-indigo-800 dark:text-indigo-300">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
            <h3 className="text-lg font-semibold mb-3 text-orange-800 dark:text-orange-300">Contact Information</h3>
            <div className="space-y-3">
              {event.contactPerson && (
                <p>
                  <strong>Contact Person:</strong> {event.contactPerson}
                </p>
              )}
              {event.contactPhone && (
                <p>
                  <strong>Phone:</strong> {event.contactPhone}
                </p>
              )}
              {event.contactEmail && (
                <p>
                  <strong>Email:</strong> {event.contactEmail}
                </p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-700">
            <h3 className="text-lg font-semibold mb-3 text-cyan-800 dark:text-cyan-300">
              Additional Information
            </h3>
            <div className="space-y-3">
              {event.requiredSkills && (
                <p>
                  <strong>Required Skills:</strong> {event.requiredSkills}
                </p>
              )}
              {event.ageRequirement && (
                <p>
                  <strong>Age Requirement:</strong> {event.ageRequirement}
                </p>
              )}
              {event.genderRequirement && (
                <p>
                  <strong>Gender Requirement:</strong> {event.genderRequirement}
                </p>
              )}
              {event.requirements && (
                <p>
                  <strong>Requirements:</strong> {event.requirements}
                </p>
              )}
              {event.benefits && (
                <p>
                  <strong>Benefits:</strong> {event.benefits}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status Update Messages */}
        {updateError && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              {updateError}
            </AlertDescription>
          </Alert>
        )}
        
        {updateSuccess && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Event status updated successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          {/* Status Update Section */}
          {canUpdateStatus && (
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Update Status:</span>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {validNextStatuses.map((status) => (
                    <SelectItem key={status.statusId} value={status.statusName}>
                      {status.statusName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || isUpdatingStatus}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                {isUpdatingStatus ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
