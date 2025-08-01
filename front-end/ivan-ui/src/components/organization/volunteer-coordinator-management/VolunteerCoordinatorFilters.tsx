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
} from "../../../types/volunteer-coordinator";
import { useVolunteerCoordinator } from "../../../context/VolunteerCoordinatorContext";

interface VolunteerCoordinatorFiltersProps {
  managementLevels: ManagementLevelDto[];
  specializations: SpecializationDto[];
}

export const VolunteerCoordinatorFilters: React.FC<
  VolunteerCoordinatorFiltersProps
> = ({ managementLevels, specializations }) => {
  const { filters, setFilters, resetFilters, availableManagers } =
    useVolunteerCoordinator();
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleSearchChange = (value: string) => {
    setFilters({ search: value, page: 1 });
  };

  const handleManagementLevelChange = (level: string) => {
    const managementLevels = level === "all" ? undefined : [level];
    setFilters({ managementLevels, page: 1 });
  };

  const handleSpecializationChange = (specialization: string) => {
    const specializations =
      specialization === "all" ? undefined : [specialization];
    setFilters({ specializations, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    const isActive = value === "all" ? undefined : value === "true";
    setFilters({ isActive, page: 1 });
  };

  const handleManagerChange = (managerId: string) => {
    const managerCoordinatorId =
      managerId === "all" ? undefined : parseInt(managerId);
    setFilters({ managerCoordinatorId, page: 1 });
  };

  const handleHasManagerChange = (value: string) => {
    const hasManagerOnly = value === "all" ? undefined : value === "true";
    setFilters({ hasManagerOnly, page: 1 });
  };

  const handleDateChange = (
    field: "dateJoinedFrom" | "dateJoinedTo",
    date: Date | undefined
  ) => {
    setFilters({
      [field]: date ? date.toISOString().split("T")[0] : undefined,
      page: 1,
    });
  };

  const handleVolunteerRangeChange = (
    field: "minVolunteersManaged" | "maxVolunteersManaged",
    value: string
  ) => {
    const numValue = value ? parseInt(value) : undefined;
    setFilters({
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
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label>Search Coordinators</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or specialization..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Basic Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Management Level</Label>
            <Select
              value={filters.managementLevels?.[0] || "all"}
              onValueChange={handleManagementLevelChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
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

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={
                filters.isActive === undefined
                  ? "all"
                  : filters.isActive
                  ? "true"
                  : "false"
              }
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Specialization</Label>
            <Select
              value={filters.specializations?.[0] || "all"}
              onValueChange={handleSpecializationChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Specializations" />
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
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Manager Selection */}
              <div className="space-y-2">
                <Label>Manager</Label>
                <Select
                  value={filters.managerCoordinatorId?.toString() || "all"}
                  onValueChange={handleManagerChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Managers" />
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

              {/* Has Manager Filter */}
              <div className="space-y-2">
                <Label>Management Structure</Label>
                <Select
                  value={
                    filters.hasManagerOnly === undefined
                      ? "all"
                      : filters.hasManagerOnly
                      ? "true"
                      : "false"
                  }
                  onValueChange={handleHasManagerChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Coordinators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Coordinators</SelectItem>
                    <SelectItem value="true">With Manager</SelectItem>
                    <SelectItem value="false">Without Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <PopoverContent className="w-auto p-0">
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
                  <PopoverContent className="w-auto p-0">
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
            </div>

            {/* Volunteer Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Volunteers Managed</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minVolunteersManaged || ""}
                    onChange={(e) =>
                      handleVolunteerRangeChange(
                        "minVolunteersManaged",
                        e.target.value
                      )
                    }
                    className="pl-10"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Max Volunteers Managed</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="1000"
                    value={filters.maxVolunteersManaged || ""}
                    onChange={(e) =>
                      handleVolunteerRangeChange(
                        "maxVolunteersManaged",
                        e.target.value
                      )
                    }
                    className="pl-10"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
