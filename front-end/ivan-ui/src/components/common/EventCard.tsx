import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Heart,
  Eye,
  Building2,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    organization: string;
    date: string;
    time: string;
    location: string;
    volunteersNeeded: number;
    volunteersRegistered: number;
    status: "open" | "full" | "closed";
    category: string;
    image?: string;
    isUrgent?: boolean;
    isFeatured?: boolean;
    viewCount?: number;
  };
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20">
            Đang mở
          </Badge>
        );
      case "full":
        return (
          <Badge className="bg-orange-500/10 text-orange-700 border-orange-200 hover:bg-orange-500/20">
            Đã đủ
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-600 border-slate-200"
          >
            Đã đóng
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const progressPercentage = Math.min(
    (event.volunteersRegistered / event.volunteersNeeded) * 100,
    100
  );

  return (
    <Card
      className={cn(
        "group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm overflow-hidden",
        event.isFeatured && "ring-2 ring-blue-500/20 shadow-blue-500/10",
        className
      )}
    >
      <CardHeader className="p-0 relative">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-green-500 overflow-hidden">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
              <Calendar className="h-16 w-16 text-white/70" />
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Status badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {event.isUrgent && (
              <Badge className="bg-red-500 text-white border-0 shadow-lg">
                <Zap className="w-3 h-3 mr-1" />
                Khẩn cấp
              </Badge>
            )}
            {event.isFeatured && (
              <Badge className="bg-blue-500 text-white border-0 shadow-lg">
                Nổi bật
              </Badge>
            )}
          </div>

          {/* Status */}
          <div className="absolute top-3 right-3">
            {getStatusBadge(event.status)}
          </div>

          {/* View count */}
          {event.viewCount && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/80 text-sm">
              <Eye className="w-4 h-4" />
              {event.viewCount}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Title and Organization */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          <div className="flex items-center gap-2 text-slate-600 mb-3">
            <Building2 className="h-4 w-4" />
            <span className="text-sm font-medium">{event.organization}</span>
          </div>
          <p className="text-slate-600 text-sm line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Event Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{event.date}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-sm">{event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="text-sm line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Volunteer Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-slate-600">
              <Users className="h-4 w-4" />
              <span>Tình nguyện viên</span>
            </div>
            <span className="font-semibold text-slate-900">
              {event.volunteersRegistered}/{event.volunteersNeeded}
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white border-0 rounded-lg font-medium"
          >
            <Link to={`/events/${event.id}`}>Xem chi tiết</Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 hover:bg-slate-50 rounded-lg"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
