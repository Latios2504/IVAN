import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Award,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Registration } from "@/types/eventRegistration";

interface RegistrationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: Registration | null;
  onApprove?: (registration: Registration) => void;
  onReject?: (registration: Registration) => void;
}

export const RegistrationDetailDialog: React.FC<
  RegistrationDetailDialogProps
> = ({ open, onOpenChange, registration, onApprove, onReject }) => {
  if (!registration) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getVolunteerInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const volunteerName =
    registration.volunteer?.fullName || registration.fullName || "Unknown";
  const volunteerEmail = registration.volunteer?.email || "No email";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={registration.volunteer?.profileImage} />
              <AvatarFallback>
                {getVolunteerInitials(volunteerName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{volunteerName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(registration.statusName)}>
                  {registration.statusName}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Registration #{registration.registrationId}
                </span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Volunteer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Volunteer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{volunteerEmail}</span>
                </div>
                {registration.volunteer?.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {registration.volunteer.phoneNumber}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {registration.volunteer?.totalEventsJoined || 0} events
                    joined
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {registration.volunteer?.totalHoursVolunteered || 0} hours
                    volunteered
                  </span>
                </div>
                {registration.volunteer?.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {registration.volunteer.rating}/5 rating
                    </span>
                  </div>
                )}
              </div>

              {registration.volunteer?.skills &&
                registration.volunteer.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {registration.volunteer.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {registration.volunteer?.experience && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Experience</h4>
                  <p className="text-sm text-muted-foreground">
                    {registration.volunteer.experience}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Registration Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Applied on {formatDate(registration.applicationDate)}
                </span>
              </div>

              {registration.motivationLetter && (
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Motivation Letter
                  </h4>
                  <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                    {registration.motivationLetter}
                  </p>
                </div>
              )}

              {registration.additionalInfo && (
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Additional Information
                  </h4>
                  <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                    {registration.additionalInfo}
                  </p>
                </div>
              )}

              {registration.approvedDate && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Approved on {formatDate(registration.approvedDate)}
                  </span>
                </div>
              )}

              {registration.rejectedDate && registration.rejectionReason && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">
                      Rejected on {formatDate(registration.rejectedDate)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Rejection Reason
                    </h4>
                    <p className="text-sm text-muted-foreground p-3 bg-red-50 rounded-md border border-red-200">
                      {registration.rejectionReason}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Information */}
          {registration.performance && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Performance Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registration.performance.checkInTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Check-in:{" "}
                        {formatDate(registration.performance.checkInTime)}
                      </span>
                    </div>
                  )}
                  {registration.performance.checkOutTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Check-out:{" "}
                        {formatDate(registration.performance.checkOutTime)}
                      </span>
                    </div>
                  )}
                  {registration.performance.actualHours !== undefined && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Actual hours: {registration.performance.actualHours}
                      </span>
                    </div>
                  )}
                  {registration.performance.certificateIssued !== undefined && (
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Certificate:{" "}
                        {registration.performance.certificateIssued
                          ? "Issued"
                          : "Not issued"}
                      </span>
                    </div>
                  )}
                </div>

                {registration.performance.performanceNotes && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Performance Notes
                    </h4>
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                      {registration.performance.performanceNotes}
                    </p>
                  </div>
                )}

                {registration.performance.review && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Review</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                      {registration.performance.review}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          {registration.statusName.toLowerCase() === "pending" && (
            <>
              {onReject && (
                <Button
                  variant="outline"
                  onClick={() => onReject(registration)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              )}
              {onApprove && (
                <Button
                  onClick={() => onApprove(registration)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              )}
            </>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDetailDialog;
