import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw, Star, Search } from "lucide-react";

interface FeedbackFilters {
  page: number;
  size: number;
  rating?: number;
  search?: string;
}

interface FeedbackFiltersProps {
  filters: FeedbackFilters;
  onFiltersChange: (filters: Partial<FeedbackFilters>) => void;
  loading?: boolean;
}

export default function FeedbackFilters({
  filters,
  onFiltersChange,
  loading = false,
}: FeedbackFiltersProps) {
  // Handle search change
  const handleSearchChange = useCallback(
    (search: string) => {
      onFiltersChange({
        search: search.trim() || undefined,
        page: 1, // Reset to first page when searching
      });
    },
    [onFiltersChange]
  );

  // Handle rating filter change
  const handleRatingChange = useCallback(
    (rating: string) => {
      onFiltersChange({
        rating: rating === "all" ? undefined : Number(rating),
        page: 1, // Reset to first page when filtering
      });
    },
    [onFiltersChange]
  );

  // Handle reset filters
  const handleReset = useCallback(() => {
    onFiltersChange({
      rating: undefined,
      search: undefined,
      page: 1,
    });
  }, [onFiltersChange]);

  // Check if any filters are active
  const hasActiveFilters = !!filters.rating || !!filters.search;

  return (
    <Card className="bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-slate-800/80 dark:via-blue-900/20 dark:to-indigo-900/30 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-400/20 dark:via-indigo-400/20 dark:to-purple-400/20 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
        <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent font-bold">
          <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Bộ lọc phản hồi
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={loading}
              className="ml-auto bg-gradient-to-r from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200 dark:from-red-800 dark:to-rose-800 dark:hover:from-red-700 dark:hover:to-rose-700 border-red-300 dark:border-red-600 text-red-700 dark:text-red-200 transition-all duration-300"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-gradient-to-br from-white/60 via-blue-50/40 to-indigo-50/60 dark:from-slate-700/60 dark:via-slate-600/40 dark:to-slate-500/60 rounded-lg p-4 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-slate-50/80 dark:from-slate-800/80 dark:via-gray-800/60 dark:to-slate-800/80 rounded-lg p-4 border border-slate-200/30 dark:border-slate-600/30">
          {/* Search Filter */}
          <div className="space-y-2">
            <Label htmlFor="search-filter">Tìm kiếm</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search-filter"
                type="text"
                placeholder="Tìm theo tiêu đề hoặc nội dung..."
                value={filters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={loading}
                className="pl-10"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <Label htmlFor="rating-filter">Đánh giá</Label>
            <Select
              value={filters.rating?.toString() || "all"}
              onValueChange={handleRatingChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả đánh giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đánh giá</SelectItem>
                {[5, 4, 3, 2, 1].map((star) => (
                  <SelectItem key={star} value={star.toString()}>
                    <div className="flex items-center">
                      {Array.from({ length: star }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-0.5"
                        />
                      ))}
                      <span className="ml-2">{star} sao</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters summary */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-blue-200/30 dark:border-slate-600/30 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-cyan-50/80 dark:from-emerald-900/20 dark:via-teal-900/15 dark:to-cyan-900/20 rounded-lg p-3 border">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium bg-gradient-to-r from-gray-700 via-slate-700 to-gray-700 dark:from-gray-300 dark:via-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                Bộ lọc đang áp dụng:
              </span>
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-600 rounded-full">
                  <Search className="w-3 h-3 mr-1" />
                  "{filters.search}"
                </span>
              )}
              {filters.rating && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-800 dark:to-amber-800 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-600 rounded-full">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {filters.rating} sao
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
