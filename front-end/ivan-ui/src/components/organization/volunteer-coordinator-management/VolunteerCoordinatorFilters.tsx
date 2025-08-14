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
import { Search, Filter, X } from "lucide-react";
import type {
  ManagementLevelDto,
  SpecializationDto,
  VolunteerCoordinatorFilterDto,
} from "../../../types/volunteerCoordinator";

interface VolunteerCoordinatorFiltersProps {
  organizationId: number;
  managementLevels: ManagementLevelDto[];
  specializations: SpecializationDto[];
  availableManagers: any[];
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

  const handleDepartmentChange = (value: string) => {
    const department = value === "all" ? undefined : value;
    onFiltersChange({ department, page: 1 });
  };

  const handlePositionChange = (value: string) => {
    const position = value === "all" ? undefined : value;
    onFiltersChange({ position, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    const isActive = value === "all" ? undefined : value === "true";
    onFiltersChange({ isActive, page: 1 });
  };

  const handleManagerChange = (value: string) => {
    const managerId = value === "all" ? undefined : parseInt(value);
    onFiltersChange({ managerId, page: 1 });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    onFiltersChange({ sortBy, sortOrder, page: 1 });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.department ||
      filters.position ||
      filters.isActive !== undefined ||
      filters.managerId
    );
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.department) count++;
    if (filters.position) count++;
    if (filters.isActive !== undefined) count++;
    if (filters.managerId) count++;
    return count;
  };

  // Get unique departments and positions from available data - use mock data for now
  const uniqueDepartments = ["IT", "HR", "Marketing", "Operations", "Finance"];
  const uniquePositions = ["Manager", "Coordinator", "Assistant", "Lead"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Basic" : "Advanced"}
            </Button>
            {hasActiveFilters() && (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search coordinators..."
                value={filters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={filters.department || "all"}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {uniqueDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select
              value={filters.position || "all"}
              onValueChange={handlePositionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {uniquePositions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Manager */}
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Select
                  value={filters.managerId?.toString() || "all"}
                  onValueChange={handleManagerChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Managers</SelectItem>
                    {availableManagers.map((manager) => (
                      <SelectItem
                        key={manager.userId}
                        value={manager.userId.toString()}
                      >
                        {manager.fullName || manager.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <Label htmlFor="sort">Sort By</Label>
                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CreatedAt-desc">Newest First</SelectItem>
                    <SelectItem value="CreatedAt-asc">Oldest First</SelectItem>
                    <SelectItem value="Position-asc">Position A-Z</SelectItem>
                    <SelectItem value="Position-desc">Position Z-A</SelectItem>
                    <SelectItem value="Department-asc">
                      Department A-Z
                    </SelectItem>
                    <SelectItem value="Department-desc">
                      Department Z-A
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Applied Filters */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.search}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleSearchChange("")}
                />
              </Badge>
            )}
            {filters.department && (
              <Badge variant="secondary" className="gap-1">
                Department: {filters.department}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleDepartmentChange("all")}
                />
              </Badge>
            )}
            {filters.position && (
              <Badge variant="secondary" className="gap-1">
                Position: {filters.position}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handlePositionChange("all")}
                />
              </Badge>
            )}
            {filters.isActive !== undefined && (
              <Badge variant="secondary" className="gap-1">
                Status: {filters.isActive ? "Active" : "Inactive"}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleStatusChange("all")}
                />
              </Badge>
            )}
            {filters.managerId && (
              <Badge variant="secondary" className="gap-1">
                Manager:{" "}
                {availableManagers.find((m) => m.userId === filters.managerId)
                  ?.fullName ||
                  availableManagers.find((m) => m.userId === filters.managerId)
                    ?.email ||
                  "Selected"}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleManagerChange("all")}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
