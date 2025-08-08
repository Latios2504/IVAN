import React, { useEffect, useState } from "react";
import { eventRegistrationService } from "@/services/eventRegistrationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/common/Pagination";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import {
  CheckCircle,
  XCircle,
  Eye,
  MoreVertical,
  Mail,
  Calendar,
  Award,
  Clock,
  Star,
  MessageSquare,
  Users,
} from "lucide-react";
import type { Registration } from "@/types/eventRegistration";

interface RegistrationListProps {
  eventId: number | string;
  filters?: {
    status?: string;
    search?: string;
    dateRange?: any;
    sortBy: string;
    sortOrder: "asc" | "desc";
    page: number;
    size: number;
  };
}

interface RegistrationCardProps {
  registration: Registration;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const getStatusConfig = (statusName: string) => {
  const configs = {
    Pending: {
      backgroundColor: "#fef3c7",
      textColor: "#d97706",
      borderColor: "#f59e0b",
    },
    Approved: {
      backgroundColor: "#d1fae5",
      textColor: "#065f46",
      borderColor: "#10b981",
    },
    Rejected: {
      backgroundColor: "#fee2e2",
      textColor: "#991b1b",
      borderColor: "#ef4444",
    },
    Cancelled: {
      backgroundColor: "#f3f4f6",
      textColor: "#374151",
      borderColor: "#6b7280",
    },
  };
  return configs[statusName as keyof typeof configs] || configs.Pending;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const RegistrationCard: React.FC<RegistrationCardProps> = ({
  registration,
  isSelected,
  onSelect,
  onView,
  onApprove,
  onReject,
}) => {
  const statusConfig = getStatusConfig(registration.statusName);

  return (
    <div
      className={`p-6 hover:bg-gray-50 transition-colors border-b border-gray-200 ${
        isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        {/* Volunteer Information */}
        <div className="flex items-start space-x-4 flex-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="mt-1"
          />

          <div className="flex-shrink-0">
            <Avatar className="w-12 h-12">
              <AvatarImage src={registration.volunteer.profileImage} />
              <AvatarFallback>
                {registration.volunteer.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-lg font-medium text-gray-900 truncate">
                {registration.volunteer.fullName}
              </h4>
              {registration.volunteer.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">
                    {registration.volunteer.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{registration.volunteer.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Applied {formatDate(registration.applicationDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 flex-shrink-0" />
                <span>{registration.volunteer.totalEventsJoined} events</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>
                  {registration.volunteer.totalHoursVolunteered} hours
                </span>
              </div>
            </div>

            {registration.motivationLetter && (
              <div className="bg-gray-50 rounded-md p-3 mb-3">
                <p className="text-sm text-gray-700 line-clamp-2">
                  "{registration.motivationLetter}"
                </p>
              </div>
            )}

            {registration.volunteer.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {registration.volunteer.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {registration.volunteer.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{registration.volunteer.skills.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-start space-x-3 flex-shrink-0">
          <Badge
            variant="outline"
            className="border-0 px-3 py-1"
            style={{
              backgroundColor: statusConfig.backgroundColor,
              color: statusConfig.textColor,
            }}
          >
            {registration.statusName}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {registration.statusName === "Pending" && (
                <>
                  <DropdownMenuItem onClick={onApprove}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onReject}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Volunteer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

const RegistrationListSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="p-6 border-b border-gray-200">
        <div className="flex items-start space-x-4">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyRegistrationsState: React.FC = () => (
  <div className="text-center py-12">
    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No registrations yet
    </h3>
    <p className="text-gray-600">
      Volunteers haven't registered for this event yet. Share your event to
      attract volunteers!
    </p>
  </div>
);

export default function RegistrationList({
  eventId,
  filters,
}: RegistrationListProps) {
  const numericEventId =
    typeof eventId === "string" ? parseInt(eventId) : eventId;

  // Service adapter for event registrations
  const registrationsService = {
    getAll: async (): Promise<Registration[]> => {
      const result = await eventRegistrationService.getRegistrations(
        numericEventId,
        {
          status: filters?.status,
          search: filters?.search,
          dateRange: filters?.dateRange,
          sortBy:
            (filters?.sortBy as
              | "applicationDate"
              | "status"
              | "volunteerName") || "applicationDate",
          sortOrder: filters?.sortOrder || "desc",
          page: filters?.page || 1,
          size: filters?.size || 20,
        }
      );
      return result.items;
    },
  };

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract pagination info (simplified for now)
  const pagination = {
    currentPage: filters?.page || 1,
    totalPages: Math.ceil(registrations.length / (filters?.size || 20)),
    totalCount: registrations.length,
    pageSize: filters?.size || 20,
  };

  const [localSelectedRegistrations, setLocalSelectedRegistrations] = useState<
    number[]
  >([]);
  const [internalFilters, setInternalFilters] = useState({
    page: 1,
    size: 20,
    sortBy: "applicationDate" as const,
    sortOrder: "desc" as const,
  });

  // Use external filters if provided, otherwise use internal filters
  const activeFilters = filters || internalFilters;

  // Load registrations when component mounts or eventId changes
  useEffect(() => {
    if (eventId) {
      const loadRegistrations = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await registrationsService.getAll();
          setRegistrations(result);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load registrations"
          );
        } finally {
          setLoading(false);
        }
      };

      loadRegistrations();
    }
  }, [eventId]);

  const handleSelectAll = () => {
    if (localSelectedRegistrations.length === (registrations?.length || 0)) {
      setLocalSelectedRegistrations([]);
    } else {
      const allIds =
        registrations?.map((r: Registration) => r.registrationId) || [];
      setLocalSelectedRegistrations(allIds);
    }
  };

  const toggleRegistrationSelection = (registrationId: number) => {
    setLocalSelectedRegistrations((prev) =>
      prev.includes(registrationId)
        ? prev.filter((id) => id !== registrationId)
        : [...prev, registrationId]
    );
  };

  const openRegistrationDetail = (registration: Registration) => {
    // TODO: Implement modal opening logic
    console.log("Opening registration detail:", registration);
  };

  const openApprovalDialog = (registration: Registration) => {
    // TODO: Implement approval dialog
    console.log("Opening approval dialog:", registration);
  };

  const openRejectionDialog = (registration: Registration) => {
    // TODO: Implement rejection dialog
    console.log("Opening rejection dialog:", registration);
  };

  const handleSelectRegistration = (
    registrationId: number,
    selected: boolean
  ) => {
    toggleRegistrationSelection(registrationId);
    if (selected) {
      setLocalSelectedRegistrations((prev) => [...prev, registrationId]);
    } else {
      setLocalSelectedRegistrations((prev) =>
        prev.filter((id) => id !== registrationId)
      );
    }
  };

  const isAllSelected =
    registrations.length > 0 &&
    localSelectedRegistrations.length === registrations.length;
  const isSomeSelected =
    localSelectedRegistrations.length > 0 &&
    localSelectedRegistrations.length < registrations.length;

  return (
    <Card>
      {/* Header with Bulk Actions */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-lg font-medium text-gray-900">
              Registration Applications
            </CardTitle>
            <Badge variant="secondary">{pagination.totalCount} total</Badge>
          </div>

          {localSelectedRegistrations.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Open bulk approval dialog
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Selected ({localSelectedRegistrations.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Open bulk rejection dialog
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Selected ({localSelectedRegistrations.length})
              </Button>
            </div>
          )}
        </div>

        {/* Select All */}
        {registrations.length > 0 && (
          <div className="flex items-center space-x-2 pt-4">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-gray-600">
              {isAllSelected
                ? `All ${registrations.length} registrations selected`
                : isSomeSelected
                ? `${localSelectedRegistrations.length} of ${registrations.length} selected`
                : "Select all registrations"}
            </span>
          </div>
        )}
      </CardHeader>

      {/* Registration Cards */}
      <CardContent className="p-0">
        {loading ? (
          <RegistrationListSkeleton />
        ) : registrations.length === 0 ? (
          <EmptyRegistrationsState />
        ) : (
          <div>
            {registrations.map((registration: Registration) => (
              <RegistrationCard
                key={registration.registrationId}
                registration={registration}
                isSelected={localSelectedRegistrations.includes(
                  registration.registrationId
                )}
                onSelect={(selected) =>
                  handleSelectRegistration(
                    registration.registrationId,
                    selected
                  )
                }
                onView={() => openRegistrationDetail(registration)}
                onApprove={() => openApprovalDialog(registration)}
                onReject={() => openRejectionDialog(registration)}
              />
            ))}
          </div>
        )}
      </CardContent>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="border-t px-6 py-4">
          <Pagination
            pagination={{
              page: pagination.currentPage,
              size: pagination.pageSize,
              totalPages: pagination.totalPages,
              totalItems: pagination.totalCount,
              hasNextPage: pagination.currentPage < pagination.totalPages,
              hasPreviousPage: pagination.currentPage > 1,
            }}
            onPageChange={(page) =>
              setInternalFilters((prev) => ({ ...prev, page }))
            }
            itemName="registration"
          />
        </div>
      )}
    </Card>
  );
}
