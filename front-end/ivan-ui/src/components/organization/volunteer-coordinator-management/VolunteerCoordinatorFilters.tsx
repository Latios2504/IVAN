import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import type {
  ManagementLevelDto,
  SpecializationDto,
  VolunteerCoordinatorFilterDto,
} from "@/types/volunteerCoordinator";

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
  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    const isActive = value === "all" ? undefined : value === "true";
    onFiltersChange({ isActive, page: 1 });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.search || filters.isActive !== undefined;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
          {hasActiveFilters() && (
            <Button variant="outline" size="sm" onClick={onReset}>
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Tìm kiếm</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Tìm kiếm điều phối viên..."
                value={filters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={
                filters.isActive === undefined
                  ? "all"
                  : filters.isActive.toString()
              }
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="true">Hoạt động</SelectItem>
                <SelectItem value="false">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Applied Filters */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Tìm kiếm: {filters.search}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600 transition-colors"
                  onClick={() => handleSearchChange("")}
                />
              </Badge>
            )}
            {filters.isActive !== undefined && (
              <Badge variant="secondary" className="gap-1">
                Trạng thái: {filters.isActive ? "Hoạt động" : "Không hoạt động"}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600 transition-colors"
                  onClick={() => handleStatusChange("all")}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
