import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  variant?: "default" | "compact";
}

export function EventCard({
  event,
  showActions = true,
  variant = "default",
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Đã xuất bản";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Nháp";
    }
  };

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">
              {event.title}
            </h3>
            <Badge className={getStatusColor(event.status)}>
              {getStatusText(event.status)}
            </Badge>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {event.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatDate(event.startDate)}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {event.registeredVolunteers}/{event.maxVolunteers}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
            <p className="text-gray-600 line-clamp-2">{event.description}</p>
          </div>
          <Badge className={getStatusColor(event.status)}>
            {getStatusText(event.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays className="h-5 w-5" />
            <span>
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-5 w-5" />
            <span>
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <span>
              {event.location.address}, {event.location.city}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-5 w-5" />
            <span>
              {event.registeredVolunteers}/{event.maxVolunteers} tình nguyện
              viên
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary">{event.organizationName}</Badge>
            {event.requirements.slice(0, 2).map((req, index) => (
              <Badge key={index} variant="outline">
                {req.skill}
              </Badge>
            ))}
            {event.requirements.length > 2 && (
              <Badge variant="outline">
                +{event.requirements.length - 2} khác
              </Badge>
            )}
          </div>

          {showActions && (
            <div className="flex gap-2 pt-4">
              <Button asChild className="flex-1">
                <Link to={`/events/${event.id}`}>Xem chi tiết</Link>
              </Button>
              {event.status === "published" &&
                event.registeredVolunteers < event.maxVolunteers && (
                  <Button variant="outline" asChild>
                    <Link to={`/events/${event.id}/register`}>Đăng ký</Link>
                  </Button>
                )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
