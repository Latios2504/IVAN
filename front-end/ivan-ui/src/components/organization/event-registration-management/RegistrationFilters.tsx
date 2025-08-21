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
    <Card className="bg-gradient-to-br from-white/80 via-blue-50/40 to-indigo-50/60 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
      <CardHeader className="pb-4 bg-gradient-to-r from-transparent via-blue-50/20 to-indigo-50/30 dark:from-transparent dark:via-slate-700/20 dark:to-slate-600/30 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">Filter Registrations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-gradient-to-br from-transparent via-white/20 to-blue-50/30 dark:from-transparent dark:via-slate-700/20 dark:to-slate-600/30 rounded-b-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-700 dark:text-gray-300 font-medium">Registration Status</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusChange}
              disabled={loading}
            >
              <SelectTrigger className="bg-gradient-to-r from-white to-blue-50/50 dark:from-slate-700 dark:to-slate-600/50 border-blue-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-slate-500 transition-colors">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-slate-800 dark:via-slate-700/50 dark:to-slate-600/30 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
                <SelectItem value="all" className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800 dark:hover:to-indigo-800">All Statuses</SelectItem>
                <SelectItem value="Pending" className="hover:bg-gradient-to-r hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-800 dark:hover:to-amber-800">Pending</SelectItem>
                <SelectItem value="Approved" className="hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800 dark:hover:to-emerald-800">Approved</SelectItem>
                <SelectItem value="Rejected" className="hover:bg-gradient-to-r hover:from-red-100 hover:to-rose-100 dark:hover:from-red-800 dark:hover:to-rose-800">Rejected</SelectItem>
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
              className="flex items-center gap-2 bg-gradient-to-r from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200 dark:from-red-800 dark:to-rose-800 dark:hover:from-red-700 dark:hover:to-rose-700 text-red-700 dark:text-red-300 border-red-300 dark:border-red-600 disabled:from-gray-100 disabled:to-gray-200 dark:disabled:from-gray-700 dark:disabled:to-gray-800"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filter
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-blue-200/30 dark:border-slate-600/30">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Active filter:
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.status && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-blue-800 dark:text-blue-200 text-xs border border-blue-200 dark:border-blue-600">
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
