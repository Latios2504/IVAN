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
        <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
          Đang tải thông tin sự kiện...
        </p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive" className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-red-200 dark:border-red-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadEvent} className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 text-white border-0 shadow-lg" variant="outline">
          Thử Lại
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-gradient-to-r border-green-200 dark:border-green-800 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                Đăng Ký Thành Công!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Đăng ký của bạn cho sự kiện "{event?.eventName}" đã được gửi.
                Bạn sẽ được thông báo về trạng thái phê duyệt.
              </p>
              <div className="space-x-4">
                <Button onClick={() => navigate("/volunteer/dashboard")} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-700 dark:to-emerald-700 dark:hover:from-green-800 dark:hover:to-emerald-800 text-white border-0 shadow-lg">
                  Về Trang Chủ
                </Button>
                <Button variant="outline" onClick={() => navigate("/events")} className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                  Xem Thêm Sự Kiện
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
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-gradient-to-r border-blue-200 dark:border-blue-800 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-t-lg">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2 text-white">
                  {event.eventName}
                </CardTitle>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">{event.statusName}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                  <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{event.location}</span>
                </div>
              )}

              {event.registrationEndDate && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Hạn đăng ký:{" "}
                    {formatDate(event.registrationEndDate)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registration Form */}
      <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-gradient-to-r border-green-200 dark:border-green-800 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Đăng Ký Tham Gia Sự Kiện
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isRegistrationOpen() && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Thời gian đăng ký cho sự kiện này đã kết thúc.
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
              <Label htmlFor="motivationLetter" className="text-gray-700 dark:text-gray-300 font-medium">
                Thư Động Lực <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="motivationLetter"
                placeholder="Hãy cho chúng tôi biết tại sao bạn muốn tham gia tình nguyện cho sự kiện này..."
                value={formData.motivationLetter}
                onChange={(e) =>
                  handleInputChange("motivationLetter", e.target.value)
                }
                className="mt-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-green-200 dark:border-green-700 focus:border-green-400 dark:focus:border-green-500 focus:ring-green-200 dark:focus:ring-green-800"
                rows={4}
                maxLength={2000}
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.motivationLetter.length}/2000 ký tự
              </p>
            </div>

            <div>
              <Label htmlFor="additionalInfo" className="text-gray-700 dark:text-gray-300 font-medium">Thông Tin Bổ Sung</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Thông tin bổ sung bạn muốn chia sẻ (kỹ năng, kinh nghiệm, v.v.)"
                value={formData.additionalInfo}
                onChange={(e) =>
                  handleInputChange("additionalInfo", e.target.value)
                }
                className="mt-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-green-200 dark:border-green-700 focus:border-green-400 dark:focus:border-green-500 focus:ring-green-200 dark:focus:ring-green-800"
                rows={3}
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.additionalInfo.length}/1000 ký tự
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={submitting || !isRegistrationOpen()}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-700 dark:to-emerald-700 dark:hover:from-green-800 dark:hover:to-emerald-800 text-white border-0 shadow-lg"
              >
                {submitting ? "Đang Gửi..." : "Gửi Đăng Ký"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
