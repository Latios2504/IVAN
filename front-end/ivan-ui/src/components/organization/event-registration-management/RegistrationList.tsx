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
import RegistrationDetailModal from "./RegistrationDetailModal";
import ApproveRegistrationModal from "./ApproveRegistrationModal";
import { RejectRegistrationModal } from "./RejectRegistrationModal";
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
        return "bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-800 dark:to-amber-800 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600";
      case "approved":
        return "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600";
      case "rejected":
        return "bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-800 dark:to-rose-800 text-red-800 dark:text-red-200 border-red-300 dark:border-red-600";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600";
    }
  };

  const canModifyStatus = registration.statusName?.toLowerCase() === "pending";

  return (
    <Card className="hover:shadow-sm transition-shadow bg-gradient-to-br from-white/80 via-blue-50/40 to-indigo-50/60 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
      <CardContent className="p-4 bg-gradient-to-br from-transparent via-white/20 to-blue-50/30 dark:from-transparent dark:via-slate-700/20 dark:to-slate-600/30 rounded-lg">
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
              <h3 className="font-medium text-sm bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
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
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                <Calendar className="h-3 w-3 mr-1 text-blue-500 dark:text-blue-400" />
                {registration.applicationDate
                  ? new Date(registration.applicationDate).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onView}
              className="bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 dark:from-blue-800 dark:to-indigo-800 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {canModifyStatus && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 dark:from-gray-700 dark:to-slate-700 dark:hover:from-gray-600 dark:hover:to-slate-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-slate-800 dark:via-slate-700/50 dark:to-slate-600/30 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm"
                >
                  <DropdownMenuItem
                    onClick={onApprove}
                    className="hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800 dark:hover:to-emerald-800 transition-all duration-200"
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300">
                      Approve
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onReject}
                    className="hover:bg-gradient-to-r hover:from-red-100 hover:to-rose-100 dark:hover:from-red-800 dark:hover:to-rose-800 transition-all duration-200"
                  >
                    <XCircle className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                    <span className="text-red-700 dark:text-red-300">
                      Reject
                    </span>
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
      <Card
        key={i}
        className="bg-gradient-to-br from-white/80 via-blue-50/40 to-indigo-50/60 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm"
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-700 dark:to-indigo-700 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-700 dark:to-indigo-700 rounded animate-pulse w-1/3" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-slate-200 dark:from-gray-700 dark:to-slate-700 rounded animate-pulse w-1/4" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-slate-200 dark:from-gray-700 dark:to-slate-700 rounded animate-pulse w-1/5" />
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

  // Modal states
  const [selectedRegistration, setSelectedRegistration] =
    useState<RegistrationDTO | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

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
    setSelectedRegistration(registration);
    setShowDetailModal(true);
  };

  const handleShowApprovalDialog = async (registration: RegistrationDTO) => {
    setSelectedRegistration(registration);
    setShowApproveModal(true);
  };

  const handleShowRejectionDialog = async (registration: RegistrationDTO) => {
    setSelectedRegistration(registration);
    setShowRejectModal(true);
  };

  const handleApproveSubmit = async (
    registrationId: number,
    request: ApproveRegistrationRequestDTO
  ) => {
    try {
      await handleApprove(registrationId, request);
      setShowApproveModal(false);
      setSelectedRegistration(null);
    } catch (error) {
      throw error; // Let the modal handle the error
    }
  };

  const handleRejectSubmit = async (request: RejectRegistrationRequestDTO) => {
    if (!selectedRegistration) return;

    try {
      await handleReject(selectedRegistration.registrationId, request);
      setShowRejectModal(false);
      setSelectedRegistration(null);
    } catch (error) {
      throw error; // Let the modal handle the error
    }
  };

  if (loading && registrations.length === 0) {
    return <RegistrationListSkeleton />;
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-red-50/80 via-rose-50/60 to-pink-50/80 dark:from-red-900/20 dark:via-rose-900/15 dark:to-pink-900/20 border-red-200/30 dark:border-red-700/30 backdrop-blur-sm">
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
      <Card className="bg-gradient-to-br from-gray-50/80 via-slate-50/60 to-blue-50/80 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 border-gray-200/30 dark:border-slate-600/30 backdrop-blur-sm">
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
    <div className="space-y-4 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-slate-900/30 dark:via-blue-900/10 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200/20 dark:border-slate-700/20 backdrop-blur-sm">
      <Card className="bg-gradient-to-br from-white/80 via-blue-50/40 to-indigo-50/60 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-transparent via-blue-50/20 to-indigo-50/30 dark:from-transparent dark:via-slate-700/20 dark:to-slate-600/30 rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
              Event Registrations
            </span>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600"
              >
                {pagination.totalItems} total
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={loadRegistrations}
                disabled={loading}
                className="bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 dark:from-blue-800 dark:to-indigo-800 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 bg-gradient-to-br from-transparent via-white/20 to-blue-50/30 dark:from-transparent dark:via-slate-700/20 dark:to-slate-600/30 rounded-b-lg">
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
            <div className="flex justify-center items-center gap-2 pt-4 bg-gradient-to-r from-white/50 via-blue-50/30 to-indigo-50/50 dark:from-slate-800/50 dark:via-slate-700/30 dark:to-slate-600/50 p-4 rounded-lg border border-blue-200/20 dark:border-slate-600/20 backdrop-blur-sm">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                className="bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 dark:from-blue-800 dark:to-indigo-800 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 disabled:from-gray-100 disabled:to-gray-200 dark:disabled:from-gray-700 dark:disabled:to-gray-800"
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 dark:from-blue-800 dark:to-indigo-800 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 disabled:from-gray-100 disabled:to-gray-200 dark:disabled:from-gray-700 dark:disabled:to-gray-800"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedRegistration && (
        <>
          <RegistrationDetailModal
            registration={selectedRegistration}
            open={showDetailModal}
            onOpenChange={setShowDetailModal}
          />

          <ApproveRegistrationModal
            open={showApproveModal}
            onOpenChange={setShowApproveModal}
            registration={selectedRegistration}
            onApprove={handleApproveSubmit}
            loading={actionLoading}
          />

          <RejectRegistrationModal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            registration={selectedRegistration}
            onReject={handleRejectSubmit}
            isLoading={actionLoading}
          />
        </>
      )}
    </div>
  );
}
