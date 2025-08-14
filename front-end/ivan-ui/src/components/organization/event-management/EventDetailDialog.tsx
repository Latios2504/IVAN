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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {event.eventName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Event Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Event Details</h3>
              <div className="space-y-2">
                <p>
                  <strong>Category:</strong> {event.categoryName}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge variant="outline">{event.statusName}</Badge>
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

            <div>
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <div className="space-y-2">
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
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{event.description}</p>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <div className="space-y-2">
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
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Additional Information
            </h3>
            <div className="space-y-2">
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

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
