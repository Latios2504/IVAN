import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eventsService } from "@/services/eventsService";
import { eventRegistrationService } from "@/services/eventRegistrationService";
import { useAuth } from "@/hooks/useAuth";
import type { EventDto } from "@/types/events";
import type {
  RegistrationDTO,
  RegistrationRequestDTO,
} from "@/types/eventRegistration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingState } from "@/components/common/LoadingState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Edit3,
  X,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";

interface RegistrationWithEvent extends RegistrationDTO {
  event?: EventDto;
}

export default function MyEventRegistrationsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [registrations, setRegistrations] = useState<RegistrationWithEvent[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Edit modal state
  const [editingRegistration, setEditingRegistration] =
    useState<RegistrationWithEvent | null>(null);
  const [editFormData, setEditFormData] = useState<RegistrationRequestDTO>({
    additionalInfo: "",
    motivationLetter: "",
  });
  const [editFormErrors, setEditFormErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "volunteer") {
      navigate("/unauthorized");
      return;
    }

    loadRegistrations();
  }, [isAuthenticated, user, navigate]);

  const loadRegistrations = async () => {
    if (!user?.volunteerId) {
      setError("Volunteer profile not found. Please contact support.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get registrations for this specific volunteer
      const registrationsResult =
        await eventRegistrationService.getRegistrationsByVolunteer(
          user.volunteerId,
          {
            page: 1,
            size: 100,
          }
        );

      // Load event details for each registration
      const registrationsWithEvents = await Promise.all(
        registrationsResult.items.map(async (registration) => {
          try {
            const event = await eventsService.getEvent(registration.eventId);
            return { ...registration, event };
          } catch (err) {
            console.warn(`Failed to load event ${registration.eventId}:`, err);
            return registration;
          }
        })
      );

      setRegistrations(registrationsWithEvents);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load registrations"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statusName: string) => {
    switch (statusName) {
      case "Chờ duyệt":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "Đã duyệt":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "Bị từ chối":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "Đã hủy":
        return (
          <Badge variant="secondary">
            <X className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{statusName}</Badge>;
    }
  };

  const canEditRegistration = (registration: RegistrationWithEvent) => {
    return registration.statusName === "Chờ duyệt";
  };

  const canCancelRegistration = (registration: RegistrationWithEvent) => {
    return (
      registration.statusName === "Chờ duyệt" ||
      registration.statusName === "Đã duyệt"
    );
  };

  const handleEditRegistration = (registration: RegistrationWithEvent) => {
    setEditingRegistration(registration);
    setEditFormData({
      additionalInfo: registration.additionalInfo || "",
      motivationLetter: registration.motivationLetter || "",
    });
    setEditFormErrors([]);
  };

  const handleUpdateRegistration = async () => {
    if (!editingRegistration) return;

    const errors =
      eventRegistrationService.validateRegistrationRequest(editFormData);
    setEditFormErrors(errors);

    if (errors.length > 0) {
      return;
    }

    setActionLoading(editingRegistration.registrationId);

    try {
      await eventRegistrationService.updateRegistration(
        editingRegistration.eventId,
        editingRegistration.registrationId,
        editFormData
      );

      // Refresh registrations
      await loadRegistrations();
      setEditingRegistration(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update registration"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelRegistration = async (
    registration: RegistrationWithEvent
  ) => {
    if (!confirm("Are you sure you want to cancel this registration?")) {
      return;
    }

    setActionLoading(registration.registrationId);

    try {
      await eventRegistrationService.cancelRegistration(
        registration.eventId,
        registration.registrationId
      );

      // Refresh registrations
      await loadRegistrations();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel registration"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <LoadingState loading={true} />
        <p className="text-center text-gray-600 mt-4">
          Loading your registrations...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-cyan-950/40 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-800/50">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">My Event Registrations</h1>
        <p className="text-muted-foreground">
          Manage your event registrations and track their status
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {registrations.length === 0 && !loading ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No registrations found</h3>
          <p className="text-muted-foreground mb-6">
            You haven't registered for any events yet. Browse events to get
            started!
          </p>
          <Button onClick={() => navigate("/events")}>Browse Events</Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {registrations.map((registration) => (
            <Card key={registration.registrationId} className="bg-gradient-to-br from-slate-50/80 via-gray-50/80 to-zinc-50/80 dark:from-slate-950/50 dark:via-gray-950/50 dark:to-zinc-950/50 border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50/60 via-indigo-50/60 to-purple-50/60 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-t-lg border-b border-blue-200/30 dark:border-blue-800/30">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-foreground">
                      {registration.event?.eventName || "Event Name"}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      {getStatusBadge(registration.statusName)}
                      <span className="text-sm text-muted-foreground">
                        Applied:{" "}
                        {registration.applicationDate
                          ? formatDate(registration.applicationDate.toString())
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {canEditRegistration(registration) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRegistration(registration)}
                        disabled={actionLoading === registration.registrationId}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200/50 dark:border-green-800/50 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 transition-all duration-300"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    {canCancelRegistration(registration) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelRegistration(registration)}
                        disabled={actionLoading === registration.registrationId}
                        className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 border-red-200/50 dark:border-red-800/50 hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900/50 dark:hover:to-rose-900/50 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="bg-gradient-to-br from-white/50 via-slate-50/30 to-gray-50/30 dark:from-slate-900/30 dark:via-gray-900/30 dark:to-zinc-900/30">
                {registration.event && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {formatDate(registration.event.startDate)} -{" "}
                        {formatDate(registration.event.endDate)}
                      </span>
                    </div>
                    {registration.event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {registration.event.location}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {registration.motivationLetter && (
                  <div className="mb-3">
                    <h4 className="font-medium text-sm text-foreground mb-1">
                      Motivation Letter
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {registration.motivationLetter}
                    </p>
                  </div>
                )}

                {registration.additionalInfo && (
                  <div>
                    <h4 className="font-medium text-sm text-foreground mb-1">
                      Additional Information
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {registration.additionalInfo}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Registration Dialog */}
      <Dialog
        open={!!editingRegistration}
        onOpenChange={(open) => !open && setEditingRegistration(null)}
      >
        <DialogContent className="sm:max-w-[525px] bg-gradient-to-br from-slate-50/95 via-gray-50/95 to-zinc-50/95 dark:from-slate-950/95 dark:via-gray-950/95 dark:to-zinc-950/95 border-slate-200/50 dark:border-slate-800/50">
          <DialogHeader className="bg-gradient-to-r from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/40 dark:via-emerald-950/40 dark:to-teal-950/40 rounded-lg p-4 border border-green-200/50 dark:border-green-800/50">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Edit Registration</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update your registration details for "
              {editingRegistration?.event?.eventName}"
            </DialogDescription>
          </DialogHeader>

          {editFormErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {editFormErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-motivation">Motivation Letter</Label>
              <Textarea
                id="edit-motivation"
                value={editFormData.motivationLetter}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    motivationLetter: e.target.value,
                  }))
                }
                rows={4}
                maxLength={2000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {editFormData.motivationLetter.length}/2000 characters
              </p>
            </div>

            <div>
              <Label htmlFor="edit-additional">Additional Information</Label>
              <Textarea
                id="edit-additional"
                value={editFormData.additionalInfo}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    additionalInfo: e.target.value,
                  }))
                }
                rows={3}
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {editFormData.additionalInfo.length}/1000 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingRegistration(null)}
              className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/50 dark:to-slate-950/50 border-gray-200/50 dark:border-gray-800/50 hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-900/50 dark:hover:to-slate-900/50 text-gray-700 dark:text-gray-300 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRegistration}
              disabled={actionLoading === editingRegistration?.registrationId}
              className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 hover:from-green-600 hover:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 text-white border-0 transition-all duration-300"
            >
              {actionLoading === editingRegistration?.registrationId
                ? "Updating..."
                : "Update Registration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
