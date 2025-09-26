import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Users, Clock, Building2, Zap } from "lucide-react";

interface EventListItemProps {
  event: {
    id: string;
    title: string;
    description: string;
    organization: string;
    startDate: string;
    endDate: string;
    time: string;
    location?: string;
    detailedAddress?: string;
    province?: string;
    district?: string;
    maxVolunteers?: number;
    minVolunteers: number;
    volunteersRegistered?: number;
    registrationEndDate?: string;
    registrationStartDate?: string;
    status: "ongoing" | "published" | "completed" | "closed";
    category: string;
    image?: string;
    isUrgent?: boolean;
    isFeatured?: boolean;
    requirements?: string;
    benefits?: string;
    contactPerson?: string;
    contactPhone?: string;
    contactEmail?: string;
  };
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  ongoing: {
    label: "Đang diễn ra",
    variant: "default" as const,
    color: "text-emerald-600",
  },
  published: {
    label: "Đã duyệt",
    variant: "secondary" as const,
    color: "text-blue-600",
  },
  completed: {
    label: "Đã hoàn thành",
    variant: "outline" as const,
    color: "text-purple-600",
  },
  closed: {
    label: "Đã đóng",
    variant: "destructive" as const,
    color: "text-red-600",
  },
};

export function EventListItem({
  event,
  isSelected = false,
  onClick,
  className,
}: EventListItemProps) {
  const statusInfo = statusConfig[event.status];

  return (
    <div
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        "bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 hover:from-rose-100 hover:via-pink-100 hover:to-fuchsia-100",
        "dark:from-rose-950/30 dark:via-pink-950/30 dark:to-fuchsia-950/30 dark:hover:from-rose-900/40 dark:hover:via-pink-900/40 dark:hover:to-fuchsia-900/40",
        "border-rose-200 dark:border-rose-800/50",
        isSelected
          ? "border-2 border-rose-400 dark:border-rose-600 shadow-lg shadow-pink-200/50 dark:shadow-pink-800/30"
          : "border hover:border-rose-300 dark:hover:border-rose-700",
        className
      )}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                {event.title}
              </h3>
              <div className="flex items-center gap-1">
                {event.isUrgent && (
                  <Zap className="h-3 w-3 text-orange-500 flex-shrink-0" />
                )}
                {event.isFeatured && (
                  <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                    Nổi bật
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <Building2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {event.organization}
              </span>
            </div>
          </div>
          <Badge variant={statusInfo.variant} className="text-xs flex-shrink-0">
            {statusInfo.label}
          </Badge>
        </div>

        {/* Category */}
        <Badge variant="outline" className="text-xs">
          {event.category}
        </Badge>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
          {event.description}
        </p>

        {/* Date & Time */}
        <div className="space-y-1">
          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>
                {new Date(event.startDate).toLocaleDateString("vi-VN")}
                {event.endDate &&
                  new Date(event.startDate).toDateString() !==
                    new Date(event.endDate).toDateString() && (
                    <span>
                      {" "}
                      - {new Date(event.endDate).toLocaleDateString("vi-VN")}
                    </span>
                  )}
              </span>
            </div>
            {event.time && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>{event.time}</span>
              </div>
            )}
          </div>
          {event.registrationEndDate && (
            <div className="text-xs text-orange-600">
              Hạn đăng ký:{" "}
              {new Date(event.registrationEndDate).toLocaleDateString("vi-VN")}
            </div>
          )}
        </div>

        {/* Location */}
        {(event.location || event.detailedAddress) && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
              {event.detailedAddress || event.location}
              {event.district && `, ${event.district}`}
              {event.province && `, ${event.province}`}
            </span>
          </div>
        )}

        {/* Volunteers Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {event.volunteersRegistered !== undefined
                ? `${event.volunteersRegistered}/${
                    event.maxVolunteers || event.minVolunteers
                  } tình nguyện viên`
                : `Cần ${event.minVolunteers}${
                    event.maxVolunteers &&
                    event.maxVolunteers !== event.minVolunteers
                      ? `-${event.maxVolunteers}`
                      : ""
                  } tình nguyện viên`}
            </span>
          </div>

          {/* Progress bar - only show if we have registration data */}
          {event.volunteersRegistered !== undefined && event.maxVolunteers && (
            <div className="flex-1 max-w-16 ml-2">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    event.status === "open"
                      ? "bg-green-500"
                      : event.status === "full"
                      ? "bg-orange-500"
                      : "bg-red-500"
                  )}
                  style={{
                    width: `${Math.min(
                      (event.volunteersRegistered / event.maxVolunteers) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
