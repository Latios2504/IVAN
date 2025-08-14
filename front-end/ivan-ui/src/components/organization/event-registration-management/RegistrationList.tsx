import React, { useEffect, useState, useCallback, useMemo } from "react";
import { eventRegistrationService } from "@/services/eventRegistrationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import {
  CheckCircle,
  XCircle,
  Eye,
  MoreVertical,
  Mail,
  Calendar,
  Clock,
  RefreshCw,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import type {
  RegistrationDTO,
  RegistrationFilters,
  ApproveRegistrationRequestDTO,
  RejectRegistrationRequestDTO,
} from "@/types/eventRegistration";

interface RegistrationListProps {
  eventId: number | string;
  filters?: RegistrationFilters;
  onFiltersChange?: (filters: Partial<RegistrationFilters>) => void;
}

interface RegistrationCardProps {
  registration: RegistrationDTO;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const RegistrationCard: React.FC<RegistrationCardProps> = ({
  registration,
  onView,
  onApprove,
  onReject,
}) => {
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

  const canModifyStatus = registration.statusName?.toLowerCase() === "pending";

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={registration.fullName || "User"} />
              <AvatarFallback>
                {registration.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">
                {registration.fullName || "Unknown User"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(
                    registration.statusName || "pending"
                  )}`}
                >
                  {registration.statusName || "Pending"}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Calendar className="h-3 w-3 mr-1" />
                {registration.applicationDate
                  ? new Date(registration.applicationDate).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>

            {canModifyStatus && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onApprove}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onReject}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RegistrationListSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/5" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function RegistrationList({
  eventId,
  filters,
  onFiltersChange,
}: RegistrationListProps) {
  const [registrations, setRegistrations] = useState<RegistrationDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    totalPages: 0,
    totalItems: 0,
  });

  // Modal states - simplified (no dialogs for now)
  const [selectedRegistration, setSelectedRegistration] =
    useState<RegistrationDTO | null>(null);

  const numericEventId =
    typeof eventId === "string" ? parseInt(eventId) : eventId;

  const currentFilters: RegistrationFilters = useMemo(
    () => ({
      status: filters?.status,
      sortBy: filters?.sortBy || "applicationDate",
      sortDirection: filters?.sortDirection || "desc",
      page: filters?.page || pagination.page,
      size: filters?.size || pagination.size,
    }),
    [filters, pagination.page, pagination.size]
  );

  const loadRegistrations = useCallback(async () => {
    if (!numericEventId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await eventRegistrationService.getEventRegistrations(
        numericEventId,
        currentFilters.status,
        currentFilters.page,
        currentFilters.size
      );

      setRegistrations(result.items || []);
      // Only update pagination metadata, not page/size that would trigger a loop
      setPagination((prev) => ({
        ...prev,
        totalPages: result.totalPages || 0,
        totalItems: result.totalCount || 0,
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load registrations"
      );
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [
    numericEventId,
    currentFilters.status,
    currentFilters.page,
    currentFilters.size,
  ]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  // Sync pagination with filters
  useEffect(() => {
    if (filters?.page !== undefined && filters.page !== pagination.page) {
      setPagination((prev) => ({ ...prev, page: filters.page || 1 }));
    }
    if (filters?.size !== undefined && filters.size !== pagination.size) {
      setPagination((prev) => ({ ...prev, size: filters.size || 10 }));
    }
  }, [filters?.page, filters?.size, pagination.page, pagination.size]);

  const handleApprove = async (
    registrationId: number,
    request: ApproveRegistrationRequestDTO
  ) => {
    setActionLoading(true);
    try {
      await eventRegistrationService.approveRegistration(
        numericEventId,
        registrationId,
        request
      );
      await loadRegistrations();
    } catch (err) {
      console.error("Failed to approve registration:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (
    registrationId: number,
    request: RejectRegistrationRequestDTO
  ) => {
    setActionLoading(true);
    try {
      await eventRegistrationService.rejectRegistration(
        numericEventId,
        registrationId,
        request
      );
      await loadRegistrations();
    } catch (err) {
      console.error("Failed to reject registration:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    if (onFiltersChange) {
      onFiltersChange({ page });
    }
  };

  const handleViewDetails = async (registration: RegistrationDTO) => {
    // Simple alert for now - can be enhanced with dialog later
    alert(
      `Registration Details:\n\nName: ${registration.fullName}\nStatus: ${
        registration.statusName
      }\nDate: ${
        registration.applicationDate
          ? new Date(registration.applicationDate).toLocaleDateString()
          : "N/A"
      }`
    );
  };

  const handleShowApprovalDialog = async (registration: RegistrationDTO) => {
    const notes = prompt(
      `Approve registration for ${registration.fullName}?\n\nOptional notes:`
    );
    if (notes !== null) {
      // User clicked OK (even if notes is empty)
      try {
        await handleApprove(registration.registrationId, {
          notes: notes || undefined,
        });
        alert("Registration approved successfully!");
      } catch (error) {
        alert("Failed to approve registration. Please try again.");
      }
    }
  };

  const handleShowRejectionDialog = async (registration: RegistrationDTO) => {
    const reason = prompt(
      `Reject registration for ${registration.fullName}?\n\nReason (required):`
    );
    if (reason && reason.trim()) {
      // User provided a reason
      try {
        await handleReject(registration.registrationId, {
          reason: reason.trim(),
        });
        alert("Registration rejected successfully!");
      } catch (error) {
        alert("Failed to reject registration. Please try again.");
      }
    } else if (reason !== null) {
      // User clicked OK but didn't provide reason
      alert("Please provide a reason for rejection.");
    }
  };

  if (loading && registrations.length === 0) {
    return <RegistrationListSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <EmptyState
            icon={AlertCircle}
            title="Error loading registrations"
            description={error}
            show={true}
          />
        </CardContent>
      </Card>
    );
  }

  if (registrations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <EmptyState
            icon={UserPlus}
            title="No registrations found"
            description="There are no volunteer registrations for this event yet."
            show={true}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Event Registrations</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{pagination.totalItems} total</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={loadRegistrations}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {registrations.map((registration) => (
            <RegistrationCard
              key={registration.registrationId}
              registration={registration}
              onView={() => handleViewDetails(registration)}
              onApprove={() => handleShowApprovalDialog(registration)}
              onReject={() => handleShowRejectionDialog(registration)}
            />
          ))}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs removed for simplicity - using browser prompts instead */}
    </div>
  );
}
