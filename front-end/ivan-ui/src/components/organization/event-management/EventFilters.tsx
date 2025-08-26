import React, { useState } from "react";
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
import type { EventCategoryDto, EventStatusDto } from "../../../types/events";

interface EventFiltersProps {
  categories: EventCategoryDto[];
  statuses: EventStatusDto[];
  onFiltersChange?: (filters: any) => void;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  categories,
  statuses,
  onFiltersChange,
}) => {
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "all",
    statusId: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      search: "",
      categoryId: "all",
      statusId: "all",
    };
    setFilters(emptyFilters);
    onFiltersChange?.(emptyFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.categoryId !== "all" ||
    filters.statusId !== "all";
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categoryId !== "all") count++;
    if (filters.statusId !== "all") count++;
    return count;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
Bộ lọc Sự kiện
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
Xóa tất cả
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-semibold">
              Tìm kiếm Sự kiện
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Tìm theo tên, mô tả..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold">
              Danh mục
            </Label>
            <Select
              value={filters.categoryId}
              onValueChange={(value) => handleFilterChange("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  Tất cả Danh mục
                </SelectItem>
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
            <Label htmlFor="status" className="text-sm font-semibold">
              Trạng thái
            </Label>
            <Select
              value={filters.statusId}
              onValueChange={(value) => handleFilterChange("statusId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  Tất cả Trạng thái
                </SelectItem>
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
        </div>
      </CardContent>
    </Card>
  );
};
