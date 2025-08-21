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
    <Card className="bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-slate-800/80 dark:via-blue-900/20 dark:to-indigo-900/30 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-400/20 dark:via-indigo-400/20 dark:to-purple-400/20 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent font-bold">
            <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Filters
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-800 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-600">
                {getActiveFilterCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 dark:from-blue-800 dark:to-indigo-800 dark:hover:from-blue-700 dark:hover:to-indigo-700 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-200 transition-all duration-300"
            >
              {showAdvanced ? "Basic" : "Advanced"}
            </Button>
            {hasActiveFilters() && (
              <Button variant="outline" size="sm" onClick={onReset} className="bg-gradient-to-r from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200 dark:from-red-800 dark:to-rose-800 dark:hover:from-red-700 dark:hover:to-rose-700 border-red-300 dark:border-red-600 text-red-700 dark:text-red-200 transition-all duration-300">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 bg-gradient-to-br from-white/60 via-blue-50/40 to-indigo-50/60 dark:from-slate-700/60 dark:via-slate-600/40 dark:to-slate-500/60 rounded-lg p-4 backdrop-blur-sm">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-slate-50/80 dark:from-slate-800/80 dark:via-gray-800/60 dark:to-slate-800/80 rounded-lg p-4 border border-slate-200/30 dark:border-slate-600/30">
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
          <div className="border-t border-blue-200/30 dark:border-slate-600/30 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-rose-50/80 dark:from-purple-900/20 dark:via-pink-900/15 dark:to-rose-900/20 rounded-lg p-4 border border-purple-200/40 dark:border-purple-700/30">
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
          <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-200/30 dark:border-slate-600/30 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-cyan-50/80 dark:from-emerald-900/20 dark:via-teal-900/15 dark:to-cyan-900/20 rounded-lg p-3 border border-emerald-200/40 dark:border-emerald-700/30">
            {filters.search && (
              <Badge variant="secondary" className="gap-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600">
                Search: {filters.search}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  onClick={() => handleSearchChange("")}
                />
              </Badge>
            )}
            {filters.department && (
              <Badge variant="secondary" className="gap-1 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-800 dark:to-amber-800 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-600">
                Department: {filters.department}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  onClick={() => handleDepartmentChange("all")}
                />
              </Badge>
            )}
            {filters.position && (
              <Badge variant="secondary" className="gap-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600">
                Position: {filters.position}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  onClick={() => handlePositionChange("all")}
                />
              </Badge>
            )}
            {filters.isActive !== undefined && (
              <Badge variant="secondary" className="gap-1 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-800 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-600">
                Status: {filters.isActive ? "Active" : "Inactive"}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  onClick={() => handleStatusChange("all")}
                />
              </Badge>
            )}
            {filters.managerId && (
              <Badge variant="secondary" className="gap-1 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-800 dark:to-pink-800 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-600">
                Manager:{" "}
                {availableManagers.find((m) => m.userId === filters.managerId)
                  ?.fullName ||
                  availableManagers.find((m) => m.userId === filters.managerId)
                    ?.email ||
                  "Selected"}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors"
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
