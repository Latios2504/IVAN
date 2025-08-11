import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Clock,
  Star,
  Edit,
  Share2,
  Download,
} from "lucide-react";
import { EditEventDialog } from "./EditEventDialog";
import { StatusTransitionDialog } from "./StatusTransitionDialog";
import type {
  EventDto,
  EventCategoryDto,
  EventStatusDto,
} from "../../../types/event";

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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  if (!event) return null;

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleStatusChange = () => {
    setShowStatusDialog(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.eventName,
          text: event.shortDescription || event.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "planning":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    onEventUpdated?.();
  };

  const handleStatusSuccess = () => {
    setShowStatusDialog(false);
    onEventUpdated?.();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getStatusVariant(event.statusName)}>
                    {event.statusName}
                  </Badge>
                  {event.isFeatured && (
                    <Badge variant="default">Featured</Badge>
                  )}
                  {event.isUrgent && (
                    <Badge variant="destructive">Urgent</Badge>
                  )}
                  <Badge variant="outline">{event.categoryName}</Badge>
                </div>
                <DialogTitle className="text-2xl">
                  {event.eventName}
                </DialogTitle>
                {event.shortDescription && (
                  <DialogDescription className="text-base">
                    {event.shortDescription}
                  </DialogDescription>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.startDate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-gray-600">
                        {Math.ceil(
                          (new Date(event.endDate).getTime() -
                            new Date(event.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        day(s)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Volunteers</p>
                      <p className="text-sm text-gray-600">
                        {event.currentVolunteers || 0} / {event.maxVolunteers}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Rating</p>
                      <p className="text-sm text-gray-600">
                        {event.rating ? `${event.rating}/5` : "No ratings yet"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Banner Image */}
            {event.bannerImageUrl && (
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img
                  src={event.bannerImageUrl}
                  alt={event.eventName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-medium text-sm">Event Period</p>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(event.startDate)} -{" "}
                          {formatDateTime(event.endDate)}
                        </p>
                      </div>

                      {event.registrationStartDate &&
                        event.registrationEndDate && (
                          <div>
                            <p className="font-medium text-sm">
                              Registration Period
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDateTime(event.registrationStartDate)} -{" "}
                              {formatDateTime(event.registrationEndDate)}
                            </p>
                          </div>
                        )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Registrations:</span>
                        <span className="font-medium">
                          {event.registrationCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Views:</span>
                        <span className="font-medium">
                          {event.viewCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Priority:</span>
                        <span className="font-medium">
                          {event.priority || 1}/10
                        </span>
                      </div>
                      {event.budget && (
                        <div className="flex justify-between text-sm">
                          <span>Budget:</span>
                          <span className="font-medium">
                            {event.budget.toLocaleString()} {event.currency}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Gallery */}
                {event.galleryImages && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {event.galleryImages
                          .split(",")
                          .filter(Boolean)
                          .map((imageUrl, index) => (
                            <img
                              key={index}
                              src={imageUrl}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => {
                                window.open(imageUrl, "_blank");
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Volunteer Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-medium text-sm">Volunteer Count</p>
                        <p className="text-sm text-gray-600">
                          Minimum: {event.minVolunteers || "Not specified"}
                          <br />
                          Maximum: {event.maxVolunteers}
                        </p>
                      </div>

                      {event.ageRequirement && (
                        <div>
                          <p className="font-medium text-sm">Age Requirement</p>
                          <p className="text-sm text-gray-600">
                            {event.ageRequirement}
                          </p>
                        </div>
                      )}

                      {event.genderRequirement && (
                        <div>
                          <p className="font-medium text-sm">
                            Gender Requirement
                          </p>
                          <p className="text-sm text-gray-600">
                            {event.genderRequirement}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skills & Benefits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {event.requiredSkills && (
                        <div>
                          <p className="font-medium text-sm">Required Skills</p>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {event.requiredSkills}
                          </p>
                        </div>
                      )}

                      {event.benefits && (
                        <div>
                          <p className="font-medium text-sm">Benefits</p>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {event.benefits}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {event.requirements && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {event.requirements}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Event Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">{event.location}</p>
                      {event.detailedAddress && (
                        <p className="text-sm text-gray-600">
                          {event.detailedAddress}
                        </p>
                      )}
                    </div>

                    {(event.wardCommune ||
                      event.district ||
                      event.province) && (
                      <div className="text-sm text-gray-600">
                        {[event.wardCommune, event.district, event.province]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}

                    <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                      <p className="text-gray-500 text-sm">
                        Map integration coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {event.contactPerson && (
                        <div>
                          <p className="font-medium text-sm">Contact Person</p>
                          <p className="text-sm text-gray-600">
                            {event.contactPerson}
                          </p>
                        </div>
                      )}

                      {event.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a
                            href={`tel:${event.contactPhone}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {event.contactPhone}
                          </a>
                        </div>
                      )}

                      {event.contactEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a
                            href={`mailto:${event.contactEmail}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {event.contactEmail}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Organization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-medium">{event.organizationName}</p>
                        <p className="text-sm text-gray-600">Event Organizer</p>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleStatusChange}
                      >
                        Update Event Status
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {showEditDialog && (
        <EditEventDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          event={event}
          categories={categories}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Status Transition Dialog */}
      {showStatusDialog && (
        <StatusTransitionDialog
          open={showStatusDialog}
          onClose={() => setShowStatusDialog(false)}
          event={event}
          statuses={statuses}
          onSuccess={handleStatusSuccess}
        />
      )}
    </>
  );
};
