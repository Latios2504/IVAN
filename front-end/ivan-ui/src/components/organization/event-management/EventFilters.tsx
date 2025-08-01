import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Search, Filter, X, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventCategoryDto, EventStatusDto } from "../../../types/event";
import { useEvent } from "../../../context/EventContext";

interface EventFiltersProps {
  categories: EventCategoryDto[];
  statuses: EventStatusDto[];
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  categories,
  statuses,
}) => {
  const { filters, setFilters, resetFilters } = useEvent();
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleSearchChange = (value: string) => {
    setFilters({ search: value, page: 1 });
  };

  const handleCategoryChange = (categoryId: string) => {
    const categoryIds =
      categoryId === "all" ? undefined : [parseInt(categoryId)];
    setFilters({ categoryIds, page: 1 });
  };

  const handleStatusChange = (statusId: string) => {
    const statusIds = statusId === "all" ? undefined : [parseInt(statusId)];
    setFilters({ statusIds, page: 1 });
  };

  const handleDateChange = (
    field: "startDateFrom" | "startDateTo" | "endDateFrom" | "endDateTo",
    date: Date | undefined
  ) => {
    setFilters({
      [field]: date ? date.toISOString().split("T")[0] : undefined,
      page: 1,
    });
  };

  const handleLocationChange = (
    field: "province" | "district",
    value: string
  ) => {
    setFilters({
      [field]: value || undefined,
      page: 1,
    });
  };

  const handleFeaturedChange = (value: string) => {
    const isFeatured = value === "all" ? undefined : value === "true";
    setFilters({ isFeatured, page: 1 });
  };

  const handleUrgentChange = (value: string) => {
    const isUrgent = value === "all" ? undefined : value === "true";
    setFilters({ isUrgent, page: 1 });
  };

  const hasActiveFilters = React.useMemo(() => {
    return (
      filters.search ||
      filters.categoryIds?.length ||
      filters.statusIds?.length ||
      filters.startDateFrom ||
      filters.startDateTo ||
      filters.endDateFrom ||
      filters.endDateTo ||
      filters.province ||
      filters.district ||
      filters.isFeatured !== undefined ||
      filters.isUrgent !== undefined
    );
  }, [filters]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categoryIds?.length) count++;
    if (filters.statusIds?.length) count++;
    if (filters.startDateFrom || filters.startDateTo) count++;
    if (filters.endDateFrom || filters.endDateTo) count++;
    if (filters.province) count++;
    if (filters.district) count++;
    if (filters.isFeatured !== undefined) count++;
    if (filters.isUrgent !== undefined) count++;
    return count;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="h-8"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-8"
            >
              {showAdvanced ? "Less" : "More"} Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search events..."
                value={filters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.categoryIds?.[0]?.toString() || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.categoryId}
                    value={category.categoryId.toString()}
                  >
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.statusIds?.[0]?.toString() || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem
                    key={status.statusId}
                    value={status.statusId.toString()}
                  >
                    {status.statusName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Featured */}
          <div className="space-y-2">
            <Label htmlFor="featured">Featured</Label>
            <Select
              value={
                filters.isFeatured === undefined
                  ? "all"
                  : filters.isFeatured.toString()
              }
              onValueChange={handleFeaturedChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="true">Featured Only</SelectItem>
                <SelectItem value="false">Not Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Date Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date Range</Label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !filters.startDateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startDateFrom
                          ? new Date(filters.startDateFrom).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          filters.startDateFrom
                            ? new Date(filters.startDateFrom)
                            : undefined
                        }
                        onSelect={(date) =>
                          handleDateChange("startDateFrom", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-muted-foreground">to</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !filters.startDateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startDateTo
                          ? new Date(filters.startDateTo).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          filters.startDateTo
                            ? new Date(filters.startDateTo)
                            : undefined
                        }
                        onSelect={(date) =>
                          handleDateChange("startDateTo", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>End Date Range</Label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !filters.endDateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.endDateFrom
                          ? new Date(filters.endDateFrom).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          filters.endDateFrom
                            ? new Date(filters.endDateFrom)
                            : undefined
                        }
                        onSelect={(date) =>
                          handleDateChange("endDateFrom", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-muted-foreground">to</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !filters.endDateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.endDateTo
                          ? new Date(filters.endDateTo).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          filters.endDateTo
                            ? new Date(filters.endDateTo)
                            : undefined
                        }
                        onSelect={(date) => handleDateChange("endDateTo", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Location Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  placeholder="Enter province..."
                  value={filters.province || ""}
                  onChange={(e) =>
                    handleLocationChange("province", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  placeholder="Enter district..."
                  value={filters.district || ""}
                  onChange={(e) =>
                    handleLocationChange("district", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgent">Urgent</Label>
                <Select
                  value={
                    filters.isUrgent === undefined
                      ? "all"
                      : filters.isUrgent.toString()
                  }
                  onValueChange={handleUrgentChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="true">Urgent Only</SelectItem>
                    <SelectItem value="false">Not Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
