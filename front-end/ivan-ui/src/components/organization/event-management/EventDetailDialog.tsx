import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import type {
  EventDto,
  EventCategoryDto,
  EventStatusDto,
} from "../../../types/events";

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
}) => {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 border-gradient-to-r border-blue-200 dark:border-blue-800 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-6 -m-6 mb-6">
          <DialogTitle className="text-2xl font-bold">
            {event.eventName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Basic Event Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-300">Event Details</h3>
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
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(event.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Max Volunteers:</strong> {event.maxVolunteers || 0}
                </p>
                <p>
                  <strong>Min Volunteers:</strong> {event.minVolunteers}
                </p>
              </div>
            </div>

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

          {/* Description */}
          {event.description && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <h3 className="text-lg font-semibold mb-3 text-purple-800 dark:text-purple-300">Description</h3>
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

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
