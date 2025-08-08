import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw, Filter, CalendarDays } from "lucide-react";
import type { RegistrationFilters } from "@/types/eventRegistration";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

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
  // Local state for immediate UI updates
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [dateFrom, setDateFrom] = useState(filters.dateRange?.startDate || "");
  const [dateTo, setDateTo] = useState(filters.dateRange?.endDate || "");

  // Sync local state with props when filters change externally
  useEffect(() => {
    setSearchValue(filters.search || "");
  }, [filters.search]);

  useEffect(() => {
    setDateFrom(filters.dateRange?.startDate || "");
    setDateTo(filters.dateRange?.endDate || "");
  }, [filters.dateRange?.startDate, filters.dateRange?.endDate]);

  // Debounced search
  const debouncedSearch = useDebounce(searchValue, 300);

  // Effect to update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ search: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch, filters.search, onFiltersChange]);

  // Handle status filter change
  const handleStatusChange = useCallback(
    (status: string) => {
      onFiltersChange({
        status: status === "all" ? undefined : status,
        page: 1,
      });
    },
    [onFiltersChange]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (sortBy: string) => {
      onFiltersChange({ sortBy: sortBy as any, page: 1 });
    },
    [onFiltersChange]
  );

  // Handle sort order change
  const handleSortOrderChange = useCallback(
    (sortOrder: string) => {
      onFiltersChange({ sortOrder: sortOrder as "asc" | "desc", page: 1 });
    },
    [onFiltersChange]
  );

  // Handle date range change
  const handleDateRangeChange = useCallback(() => {
    if (dateFrom || dateTo) {
      onFiltersChange({
        dateRange: {
          startDate: dateFrom,
          endDate: dateTo,
        },
        page: 1,
      });
    } else {
      onFiltersChange({
        dateRange: undefined,
        page: 1,
      });
    }
  }, [dateFrom, dateTo, onFiltersChange]);

  // Handle reset filters
  const handleReset = useCallback(() => {
    setSearchValue("");
    setDateFrom("");
    setDateTo("");
    onFiltersChange({
      search: undefined,
      status: undefined,
      dateRange: undefined,
      sortBy: "applicationDate",
      sortOrder: "desc",
      page: 1,
    });
  }, [onFiltersChange]);

  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.dateRange?.startDate ||
    filters.dateRange?.endDate ||
    filters.sortBy !== "applicationDate" ||
    filters.sortOrder !== "desc";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
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

          {/* Sort By */}
          <div className="space-y-2">
            <Label htmlFor="sort-by">Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={handleSortChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applicationDate">
                  Application Date
                </SelectItem>
                <SelectItem value="volunteerName">Volunteer Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sort-order">Order</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={handleSortOrderChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Application Date Range
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              placeholder="From date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              placeholder="To date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleDateRangeChange}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <div className="text-sm text-muted-foreground mb-2">
              Active filters:
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs">
                  Status: {filters.status}
                </span>
              )}
              {filters.dateRange?.startDate && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-800 text-xs">
                  From: {filters.dateRange.startDate}
                </span>
              )}
              {filters.dateRange?.endDate && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-800 text-xs">
                  To: {filters.dateRange.endDate}
                </span>
              )}
              {filters.sortBy !== "applicationDate" && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-xs">
                  Sort: {filters.sortBy}
                </span>
              )}
              {filters.sortOrder !== "desc" && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-xs">
                  Order:{" "}
                  {filters.sortOrder === "asc" ? "Ascending" : "Descending"}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
