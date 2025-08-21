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
    <Card className="mb-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 border-gradient-to-r border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Event Filters
            {hasActiveFilters && (
              <Badge
                variant="secondary"
                className="ml-2 bg-white/20 text-white hover:bg-white/30"
              >
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="h-8 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="space-y-2">
            <Label
              htmlFor="search"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Search Events
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
              <Input
                id="search"
                placeholder="Search by name, description..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Category
            </Label>
            <Select
              value={filters.categoryId}
              onValueChange={(value) => handleFilterChange("categoryId", value)}
            >
              <SelectTrigger className="bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-green-200 dark:border-green-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-200 shadow-sm hover:shadow-md">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 shadow-xl">
                <SelectItem
                  value="all"
                  className="hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  All Categories
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.categoryId}
                    value={category.categoryId.toString()}
                    className="hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label
              htmlFor="status"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Status
            </Label>
            <Select
              value={filters.statusId}
              onValueChange={(value) => handleFilterChange("statusId", value)}
            >
              <SelectTrigger className="bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-200 shadow-sm hover:shadow-md">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 shadow-xl">
                <SelectItem
                  value="all"
                  className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  All Statuses
                </SelectItem>
                {statuses.map((status) => (
                  <SelectItem
                    key={status.statusId}
                    value={status.statusId.toString()}
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
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
