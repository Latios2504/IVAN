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
import {
  Search,
  Filter,
  X,
  Calendar as CalendarIcon,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ManagementLevelDto,
  SpecializationDto,
  VolunteerCoordinatorFilterDto,
  VolunteerCoordinatorDto,
} from "../../../types/volunteer-coordinator";

interface VolunteerCoordinatorFiltersProps {
  organizationId: number;
  managementLevels: ManagementLevelDto[];
  specializations: SpecializationDto[];
  availableManagers: VolunteerCoordinatorDto[];
  filters: VolunteerCoordinatorFilterDto;
  onFiltersChange: (filters: Partial<VolunteerCoordinatorFilterDto>) => void;
  onReset: () => void;
}

export const VolunteerCoordinatorFilters: React.FC<
  VolunteerCoordinatorFiltersProps
> = ({
  organizationId,
  managementLevels,
  specializations,
  availableManagers,
  filters,
  onFiltersChange,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value, page: 1 });
  };

  const handleManagementLevelChange = (level: string) => {
    const managementLevels = level === "all" ? undefined : [level];
    onFiltersChange({ managementLevels, page: 1 });
  };

  const handleSpecializationChange = (specialization: string) => {
    const specializations =
      specialization === "all" ? undefined : [specialization];
    onFiltersChange({ specializations, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    const isActive = value === "all" ? undefined : value === "true";
    onFiltersChange({ isActive, page: 1 });
  };

  const handleManagerChange = (managerId: string) => {
    const managerCoordinatorId =
      managerId === "all" ? undefined : parseInt(managerId);
    onFiltersChange({ managerCoordinatorId, page: 1 });
  };

  const handleHasManagerChange = (value: string) => {
    const hasManagerOnly = value === "all" ? undefined : value === "true";
    onFiltersChange({ hasManagerOnly, page: 1 });
  };

  const handleDateChange = (
    field: "dateJoinedFrom" | "dateJoinedTo",
    date: Date | undefined
  ) => {
    onFiltersChange({
      [field]: date ? date.toISOString().split("T")[0] : undefined,
      page: 1,
    });
  };

  const handleVolunteerRangeChange = (
    field: "minVolunteersManaged" | "maxVolunteersManaged",
    value: string
  ) => {
    const numValue = value ? parseInt(value) : undefined;
    onFiltersChange({
      [field]: numValue,
      page: 1,
    });
  };

  const hasActiveFilters = React.useMemo(() => {
    return (
      filters.search ||
      filters.managementLevels?.length ||
      filters.specializations?.length ||
      filters.isActive !== undefined ||
      filters.managerCoordinatorId ||
      filters.hasManagerOnly !== undefined ||
      filters.dateJoinedFrom ||
      filters.dateJoinedTo ||
      filters.minVolunteersManaged ||
      filters.maxVolunteersManaged
    );
  }, [filters]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.managementLevels?.length) count++;
    if (filters.specializations?.length) count++;
    if (filters.isActive !== undefined) count++;
    if (filters.managerCoordinatorId) count++;
    if (filters.hasManagerOnly !== undefined) count++;
    if (filters.dateJoinedFrom || filters.dateJoinedTo) count++;
    if (filters.minVolunteersManaged || filters.maxVolunteersManaged) count++;
    return count;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </div>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Simple" : "Advanced"}
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={onReset}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search coordinators..."
                value={filters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Management Level */}
          <div className="space-y-2">
            <Label htmlFor="managementLevel">Management Level</Label>
            <Select
              value={filters.managementLevels?.[0] || "all"}
              onValueChange={handleManagementLevelChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {managementLevels.map((level) => (
                  <SelectItem key={level.levelId} value={level.levelName}>
                    {level.levelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Specialization */}
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Select
              value={filters.specializations?.[0] || "all"}
              onValueChange={handleSpecializationChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All specializations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map((spec) => (
                  <SelectItem
                    key={spec.specializationId}
                    value={spec.specializationName}
                  >
                    {spec.specializationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={
                filters.isActive === undefined
                  ? "all"
                  : filters.isActive.toString()
              }
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Manager */}
          <div className="space-y-2">
            <Label htmlFor="manager">Manager</Label>
            <Select
              value={filters.managerCoordinatorId?.toString() || "all"}
              onValueChange={handleManagerChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All managers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Managers</SelectItem>
                {availableManagers.map((manager) => (
                  <SelectItem
                    key={manager.coordinatorId}
                    value={manager.coordinatorId.toString()}
                  >
                    {manager.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Has Manager */}
          <div className="space-y-2">
            <Label htmlFor="hasManager">Management</Label>
            <Select
              value={
                filters.hasManagerOnly === undefined
                  ? "all"
                  : filters.hasManagerOnly.toString()
              }
              onValueChange={handleHasManagerChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All coordinators" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coordinators</SelectItem>
                <SelectItem value="true">Has Manager</SelectItem>
                <SelectItem value="false">No Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <h4 className="text-sm font-medium text-gray-700">
              Advanced Filters
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Joined From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateJoinedFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateJoinedFrom ? (
                        new Date(filters.dateJoinedFrom).toLocaleDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        filters.dateJoinedFrom
                          ? new Date(filters.dateJoinedFrom)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleDateChange("dateJoinedFrom", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Date Joined To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateJoinedTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateJoinedTo ? (
                        new Date(filters.dateJoinedTo).toLocaleDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        filters.dateJoinedTo
                          ? new Date(filters.dateJoinedTo)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleDateChange("dateJoinedTo", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Volunteers Managed Range */}
              <div className="space-y-2">
                <Label htmlFor="minVolunteers">Min Volunteers Managed</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="minVolunteers"
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={filters.minVolunteersManaged || ""}
                    onChange={(e) =>
                      handleVolunteerRangeChange(
                        "minVolunteersManaged",
                        e.target.value
                      )
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxVolunteers">Max Volunteers Managed</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="maxVolunteers"
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={filters.maxVolunteersManaged || ""}
                    onChange={(e) =>
                      handleVolunteerRangeChange(
                        "maxVolunteersManaged",
                        e.target.value
                      )
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="outline" className="gap-1">
                  Search: {filters.search}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleSearchChange("")}
                  />
                </Badge>
              )}
              {filters.managementLevels?.map((level) => (
                <Badge key={level} variant="outline" className="gap-1">
                  Level: {level}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleManagementLevelChange("all")}
                  />
                </Badge>
              ))}
              {filters.specializations?.map((spec) => (
                <Badge key={spec} variant="outline" className="gap-1">
                  Spec: {spec}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleSpecializationChange("all")}
                  />
                </Badge>
              ))}
              {filters.isActive !== undefined && (
                <Badge variant="outline" className="gap-1">
                  Status: {filters.isActive ? "Active" : "Inactive"}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleStatusChange("all")}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
