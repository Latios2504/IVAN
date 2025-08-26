import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw } from "lucide-react";
import type { RegistrationFilters } from "@/types/eventRegistration";

interface RegistrationFiltersProps {
  filters: RegistrationFilters;
  onFiltersChange: (filters: Partial<RegistrationFilters>) => void;
  loading?: boolean;
}

export default function RegistrationFilters({
  filters,
  onFiltersChange,
  loading = false,
}: RegistrationFiltersProps) {
  // Handle status filter change
  const handleStatusChange = useCallback(
    (status: string) => {
      onFiltersChange({
        status: status === "all" ? undefined : status,
        page: 1, // Reset to first page when filtering
      });
    },
    [onFiltersChange]
  );

  // Handle reset filters
  const handleReset = useCallback(() => {
    onFiltersChange({
      status: undefined,
      page: 1,
    });
  }, [onFiltersChange]);

  // Check if any filters are active
  const hasActiveFilters = !!filters.status;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <span>Filter Registrations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Registration Status</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={loading || !hasActiveFilters}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filter
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <div className="text-sm text-muted-foreground mb-2">
              Active filter:
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.status && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                  Status: {filters.status}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
