import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
// Removed unused imports
import type { OnSiteTaskFilterDto } from "@/types/onSiteTask";

interface Event {
  eventId: number;
  eventName: string;
  startDate: string;
  endDate: string;
}

interface TaskFiltersProps {
  events: Event[];
  filters: OnSiteTaskFilterDto;
  onFiltersChange: (filters: OnSiteTaskFilterDto) => void;
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  showAdvanced?: boolean;
  taskCount?: number;
  filteredCount?: number;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  events,
  filters,
  onFiltersChange,
  onSearch,
  searchTerm,
  showAdvanced = true,
  taskCount = 0,
  filteredCount = 0,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleFilterChange = (key: keyof OnSiteTaskFilterDto, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  // Remove unused date range handler

  const resetFilters = () => {
    const defaultFilters: OnSiteTaskFilterDto = {
      pageNumber: 1,
      pageSize: 10,
      eventId: undefined,
      categoryId: undefined,
      statusId: undefined,
      startDateFrom: undefined,
      startDateTo: undefined,
      endDateFrom: undefined,
      endDateTo: undefined,
      search: undefined,
    };
    onFiltersChange(defaultFilters);
    onSearch("");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (filters.eventId) count++;
    if (filters.categoryId) count++;
    if (filters.statusId) count++;
    if (filters.startDateFrom || filters.startDateTo) count++;
    return count;
  };

  const getStatusLabel = (statusId?: number) => {
    switch (statusId) {
      case 1: return "Chờ thực hiện";
      case 2: return "Đang thực hiện";
      case 3: return "Hoàn thành";
      default: return "Tất cả trạng thái";
    }
  };



  const getCategoryLabel = (categoryId?: number) => {
    switch (categoryId) {
      case 1: return "Chuẩn bị";
      case 2: return "Thực hiện";
      case 3: return "Dọn dẹp";
      default: return "Tất cả danh mục";
    }
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold">Bộ lọc nhiệm vụ</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount} bộ lọc
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {taskCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {filteredCount} / {taskCount} nhiệm vụ
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Đặt lại
          </Button>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Tìm kiếm nhiệm vụ..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Event Filter */}
        <Select
          value={filters.eventId?.toString() || ""}
          onValueChange={(value) => handleFilterChange("eventId", value ? parseInt(value) : undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn sự kiện" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả sự kiện</SelectItem>
            {events.map((event) => (
              <SelectItem key={event.eventId} value={event.eventId.toString()}>
                {event.eventName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.statusId?.toString() || ""}
          onValueChange={(value) => handleFilterChange("statusId", value ? parseInt(value) : undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả trạng thái</SelectItem>
            <SelectItem value="1">Chờ thực hiện</SelectItem>
            <SelectItem value="2">Đang thực hiện</SelectItem>
            <SelectItem value="3">Hoàn thành</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={filters.categoryId?.toString() || ""}
          onValueChange={(value) => handleFilterChange("categoryId", value ? parseInt(value) : undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả danh mục</SelectItem>
            <SelectItem value="1">Chuẩn bị</SelectItem>
            <SelectItem value="2">Thực hiện</SelectItem>
            <SelectItem value="3">Dọn dẹp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Bộ lọc nâng cao</span>
              {isAdvancedOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Start Date From */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Từ ngày
                </Label>
                <Input
                  type="date"
                  value={filters.startDateFrom ? new Date(filters.startDateFrom).toISOString().split('T')[0] : ""}
                  onChange={(e) => handleFilterChange("startDateFrom", e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                />
              </div>

              {/* Start Date To */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Đến ngày
                </Label>
                <Input
                  type="date"
                  value={filters.startDateTo ? new Date(filters.startDateTo).toISOString().split('T')[0] : ""}
                  onChange={(e) => handleFilterChange("startDateTo", e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Bộ lọc đang áp dụng:</Label>
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Search className="w-3 h-3" />
                Tìm kiếm: "{searchTerm}"
                <button
                  onClick={() => onSearch("")}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            
            {filters.eventId && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Sự kiện: {events.find(e => e.eventId === filters.eventId)?.eventName}
                <button
                  onClick={() => handleFilterChange("eventId", undefined)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            
            {filters.statusId && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Trạng thái: {getStatusLabel(filters.statusId)}
                <button
                  onClick={() => handleFilterChange("statusId", undefined)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            
            {filters.categoryId && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Danh mục: {getCategoryLabel(filters.categoryId)}
                <button
                  onClick={() => handleFilterChange("categoryId", undefined)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            
            {(filters.startDateFrom || filters.startDateTo) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Thời gian: {filters.startDateFrom && new Date(filters.startDateFrom).toLocaleDateString("vi-VN")} - {filters.startDateTo && new Date(filters.startDateTo).toLocaleDateString("vi-VN")}
                <button
                  onClick={() => {
                    handleFilterChange("startDateFrom", undefined);
                    handleFilterChange("startDateTo", undefined);
                  }}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;