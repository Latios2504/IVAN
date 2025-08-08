import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  RefreshCw,
  UserPlus,
} from "lucide-react";
import type {
  Registration,
  RegistrationFilters,
  ApproveRegistrationRequest,
  RejectRegistrationRequest,
} from "@/types/eventRegistration";

// Import modal components
import RegistrationDetailDialog from "./RegistrationDetailDialog";
import ApprovalDialog from "./ApprovalDialog";
import RejectionDialog from "./RejectionDialog";
import BulkActionsDialog from "./BulkActionsDialog";

interface RegistrationListProps {
  eventId: number | string;
  filters?: RegistrationFilters;
  onFiltersChange?: (filters: Partial<RegistrationFilters>) => void;
}

interface RegistrationCardProps {
  registration: Registration;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const RegistrationCard: React.FC<RegistrationCardProps> = ({
  registration,
  isSelected,
  onSelect,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
              <AvatarImage src={registration.volunteer?.profileImage} />
              <AvatarFallback>
                {getVolunteerInitials(volunteerName)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-lg font-medium text-gray-900 truncate">
                {volunteerName}
              </h4>
              {registration.volunteer?.rating && (
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
                <span className="truncate">{volunteerEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Applied {formatDate(registration.applicationDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 flex-shrink-0" />
                <span>
                  {registration.volunteer?.totalEventsJoined || 0} events
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>
                  {registration.volunteer?.totalHoursVolunteered || 0} hours
                </span>
              </div>
            </div>

            {/* Skills */}
            {registration.volunteer?.skills &&
              registration.volunteer.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {registration.volunteer.skills
                    .slice(0, 3)
                    .map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  {registration.volunteer.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{registration.volunteer.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

            {/* Motivation Letter Preview */}
            {registration.motivationLetter && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {registration.motivationLetter}
              </p>
            )}
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(registration.statusName)}>
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
              {registration.statusName.toLowerCase() === "pending" && (
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

export default function RegistrationList({
  eventId,
  filters,
  onFiltersChange,
}: RegistrationListProps) {
  const numericEventId =
    typeof eventId === "string" ? parseInt(eventId) : eventId;

  // State
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRegistrations, setSelectedRegistrations] = useState<number[]>(
    []
  );

  // Modal states
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Default filters
  const currentFilters: RegistrationFilters = useMemo(
    () => ({
      page: 1,
      size: 20,
      sortBy: "applicationDate",
      sortOrder: "desc",
      ...filters,
    }),
    [filters]
  );

  // Load registrations
  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await eventRegistrationService.getRegistrations(
        numericEventId,
        currentFilters
      );
      setRegistrations(result.items);
      setTotalItems(result.totalCount);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load registrations"
      );
      console.error("Failed to load registrations:", err);
    } finally {
      setLoading(false);
    }
  }, [numericEventId, currentFilters]);

  // Effects
  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  // Actions
  const handleApproveRegistration = async (
    registrationId: number,
    request: ApproveRegistrationRequest
  ) => {
    setActionLoading(true);
    try {
      await eventRegistrationService.approveRegistration(
        numericEventId,
        registrationId,
        request
      );
      await loadRegistrations(); // Refresh the list
      console.log("Registration approved successfully");
    } catch (err) {
      console.error("Failed to approve registration:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRegistration = async (
    registrationId: number,
    request: RejectRegistrationRequest
  ) => {
    setActionLoading(true);
    try {
      await eventRegistrationService.rejectRegistration(
        numericEventId,
        registrationId,
        request
      );
      await loadRegistrations(); // Refresh the list
      console.log("Registration rejected successfully");
    } catch (err) {
      console.error("Failed to reject registration:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkApprove = async (
    registrationIds: number[],
    notes?: string
  ) => {
    setActionLoading(true);
    try {
      await eventRegistrationService.bulkApproveRegistrations(
        numericEventId,
        registrationIds,
        notes
      );
      setSelectedRegistrations([]);
      await loadRegistrations();
      console.log("Registrations approved successfully");
    } catch (err) {
      console.error("Failed to approve registrations:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkReject = async (
    registrationIds: number[],
    reason: string
  ) => {
    setActionLoading(true);
    try {
      await eventRegistrationService.bulkRejectRegistrations(
        numericEventId,
        registrationIds,
        reason
      );
      setSelectedRegistrations([]);
      await loadRegistrations();
      console.log("Registrations rejected successfully");
    } catch (err) {
      console.error("Failed to reject registrations:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRegistrations(registrations.map((r) => r.registrationId));
    } else {
      setSelectedRegistrations([]);
    }
  };

  const handleSelectRegistration = (
    registrationId: number,
    selected: boolean
  ) => {
    if (selected) {
      setSelectedRegistrations((prev) => [...prev, registrationId]);
    } else {
      setSelectedRegistrations((prev) =>
        prev.filter((id) => id !== registrationId)
      );
    }
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    onFiltersChange?.({ page });
  };

  // Modal handlers
  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setDetailDialogOpen(true);
  };

  const handleOpenApproval = (registration: Registration) => {
    setSelectedRegistration(registration);
    setApprovalDialogOpen(true);
  };

  const handleOpenRejection = (registration: Registration) => {
    setSelectedRegistration(registration);
    setRejectionDialogOpen(true);
  };

  const handleOpenBulkActions = () => {
    setBulkDialogOpen(true);
  };

  // Computed values
  const totalPages = Math.ceil(totalItems / currentFilters.size);
  const isAllSelected =
    selectedRegistrations.length === registrations.length &&
    registrations.length > 0;
  const isPartiallySelected =
    selectedRegistrations.length > 0 &&
    selectedRegistrations.length < registrations.length;
  const selectedRegistrationObjects = registrations
    .filter((r) => selectedRegistrations.includes(r.registrationId))
    .map((r) => ({
      registrationId: r.registrationId,
      volunteer: {
        fullName: r.volunteer?.fullName || r.fullName || "Unknown",
        email: r.volunteer?.email || "No email",
      },
    }));

  if (loading && registrations.length === 0) {
    return (
      <Card>
        <CardContent>
          <RegistrationListSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="text-red-600 mb-2">
              Failed to load registrations
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadRegistrations} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (registrations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={Users}
            title="No registrations found"
            description="No volunteer registrations match your current filters."
            show={true}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Registrations ({totalItems})
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedRegistrations.length > 0 && (
                <Button
                  onClick={handleOpenBulkActions}
                  variant="outline"
                  size="sm"
                >
                  Bulk Actions ({selectedRegistrations.length})
                </Button>
              )}
              <Button onClick={loadRegistrations} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Select All */}
          {registrations.length > 0 && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                {isAllSelected
                  ? "All registrations selected"
                  : selectedRegistrations.length > 0
                  ? `${selectedRegistrations.length} registration${
                      selectedRegistrations.length !== 1 ? "s" : ""
                    } selected`
                  : "Select all registrations"}
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {registrations.map((registration) => (
              <RegistrationCard
                key={registration.registrationId}
                registration={registration}
                isSelected={selectedRegistrations.includes(
                  registration.registrationId
                )}
                onSelect={(selected) =>
                  handleSelectRegistration(
                    registration.registrationId,
                    selected
                  )
                }
                onView={() => handleViewDetails(registration)}
                onApprove={() => handleOpenApproval(registration)}
                onReject={() => handleOpenRejection(registration)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentFilters.page - 1) * currentFilters.size + 1}{" "}
                  -{" "}
                  {Math.min(
                    currentFilters.page * currentFilters.size,
                    totalItems
                  )}{" "}
                  of {totalItems} registrations
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentFilters.page - 1)}
                    disabled={currentFilters.page <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentFilters.page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentFilters.page + 1)}
                    disabled={currentFilters.page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <RegistrationDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        registration={selectedRegistration}
        onApprove={handleOpenApproval}
        onReject={handleOpenRejection}
      />

      <ApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        registration={selectedRegistration}
        onConfirm={handleApproveRegistration}
        loading={actionLoading}
      />

      <RejectionDialog
        open={rejectionDialogOpen}
        onOpenChange={setRejectionDialogOpen}
        registration={selectedRegistration}
        onConfirm={handleRejectRegistration}
        loading={actionLoading}
      />

      <BulkActionsDialog
        open={bulkDialogOpen}
        onOpenChange={setBulkDialogOpen}
        selectedRegistrationIds={selectedRegistrations}
        selectedRegistrations={selectedRegistrationObjects}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
        loading={actionLoading}
      />
    </>
  );
}
