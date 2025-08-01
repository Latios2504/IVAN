import React, { useState, useCallback, useEffect } from "react";
import { useEventRegistration } from "@/context/EventRegistrationContext";
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
import { Search, RotateCcw } from "lucide-react";
import type { RegistrationFilters as RegistrationFiltersType } from "@/types/eventRegistration";

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

export default function RegistrationFilters() {
  const { filters, setFilters, loading } = useEventRegistration();

  // Local state for search input to enable debouncing
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchInput, 300);

  // Update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== (filters.search || "")) {
      setFilters({ search: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch, filters.search, setFilters]);

  const handleStatusChange = (status: string) => {
    setFilters({
      status: status === "all" ? undefined : status,
      page: 1,
    });
  };

  const handleSortChange = (sortValue: string) => {
    const [sortBy, sortOrder] = sortValue.split("-") as [
      RegistrationFiltersType["sortBy"],
      RegistrationFiltersType["sortOrder"]
    ];
    setFilters({ sortBy, sortOrder, page: 1 });
  };

  const handleReset = () => {
    setSearchInput("");
    setFilters({
      page: 1,
      size: 20,
      sortBy: "applicationDate",
      sortOrder: "desc",
      status: undefined,
      search: undefined,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.status ||
      filters.sortBy !== "applicationDate" ||
      filters.sortOrder !== "desc"
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 px-2 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Search Volunteers
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Name, email, or skills..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Registration Status</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span>Pending</span>
                </div>
              </SelectItem>
              <SelectItem value="Approved">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Approved</span>
                </div>
              </SelectItem>
              <SelectItem value="Rejected">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>Rejected</span>
                </div>
              </SelectItem>
              <SelectItem value="Cancelled">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  <span>Cancelled</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Options */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sort By</Label>
          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onValueChange={handleSortChange}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applicationDate-desc">Newest First</SelectItem>
              <SelectItem value="applicationDate-asc">Oldest First</SelectItem>
              <SelectItem value="volunteerName-asc">Name A-Z</SelectItem>
              <SelectItem value="volunteerName-desc">Name Z-A</SelectItem>
              <SelectItem value="status-asc">Status A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick Filters</Label>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("Pending")}
              className="justify-start h-8 text-xs"
              disabled={loading}
            >
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
              Needs Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("Approved")}
              className="justify-start h-8 text-xs"
              disabled={loading}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Approved
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters({
                  sortBy: "applicationDate",
                  sortOrder: "desc",
                  page: 1,
                })
              }
              className="justify-start h-8 text-xs"
              disabled={loading}
            >
              Recent Applications
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="pt-4 border-t">
          <div className="text-xs text-gray-500">
            {loading ? "Loading..." : `Showing ${filters.size} items per page`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
