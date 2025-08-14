import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventsService } from "@/services/eventsService";
import { eventRegistrationService } from "@/services/eventRegistrationService";
import { useAuth } from "@/hooks/useAuth";
import type { EventDto } from "@/types/events";
import type { RegistrationRequestDTO } from "@/types/eventRegistration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingState } from "@/components/common/LoadingState";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function VolunteerEventRegistrationPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<RegistrationRequestDTO>({
    additionalInfo: "",
    motivationLetter: "",
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "volunteer") {
      navigate("/unauthorized");
      return;
    }

    if (eventId) {
      loadEvent();
    }
  }, [eventId, isAuthenticated, user, navigate]);

  const loadEvent = async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await eventsService.getEvent(Number(eventId));
      setEvent(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors =
      eventRegistrationService.validateRegistrationRequest(formData);
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!eventId) {
      setError("Event ID is required");
      return;
    }

    if (!user?.volunteerId) {
      setError("Volunteer profile not found. Please contact support.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await eventRegistrationService.registerForEvent(
        Number(eventId),
        formData
      );
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit registration"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof RegistrationRequestDTO,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear form errors when user starts typing
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isRegistrationOpen = () => {
    if (!event?.registrationStartDate || !event?.registrationEndDate) {
      return true; // If no registration period specified, assume it's open
    }

    const now = new Date();
    const startDate = new Date(event.registrationStartDate);
    const endDate = new Date(event.registrationEndDate);

    return now >= startDate && now <= endDate;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <LoadingState loading={true} />
        <p className="text-center text-gray-600 mt-4">
          Loading event details...
        </p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadEvent} className="mt-4" variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Registration Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your registration for "{event?.eventName}" has been submitted.
                You will be notified about the approval status.
              </p>
              <div className="space-x-4">
                <Button onClick={() => navigate("/volunteer/dashboard")}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate("/events")}>
                  Browse More Events
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Event Information */}
      {event && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">
                  {event.eventName}
                </CardTitle>
                <Badge variant="outline">{event.statusName}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{event.location}</span>
                </div>
              )}

              {event.registrationEndDate && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Registration deadline:{" "}
                    {formatDate(event.registrationEndDate)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Register for Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isRegistrationOpen() && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Registration period for this event has ended.
              </AlertDescription>
            </Alert>
          )}

          {formErrors.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="motivationLetter">
                Motivation Letter <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="motivationLetter"
                placeholder="Tell us why you want to volunteer for this event..."
                value={formData.motivationLetter}
                onChange={(e) =>
                  handleInputChange("motivationLetter", e.target.value)
                }
                className="mt-2"
                rows={4}
                maxLength={2000}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.motivationLetter.length}/2000 characters
              </p>
            </div>

            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Any additional information you'd like to share (skills, experience, etc.)"
                value={formData.additionalInfo}
                onChange={(e) =>
                  handleInputChange("additionalInfo", e.target.value)
                }
                className="mt-2"
                rows={3}
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.additionalInfo.length}/1000 characters
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={submitting || !isRegistrationOpen()}
                className="flex-1"
              >
                {submitting ? "Submitting..." : "Submit Registration"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
