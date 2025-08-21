import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw, Star } from "lucide-react";

interface FeedbackFilters {
  page: number;
  size: number;
  categoryId?: number;
  rating?: number;
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
  // Predefined feedback categories (matching the ones from PublicEventDetailPage)
  const feedbackCategories = [
    { id: 1, name: "Tổ chức sự kiện" },
    { id: 2, name: "Nội dung chương trình" },
    { id: 3, name: "Cơ sở vật chất" },
    { id: 4, name: "Đội ngũ tổ chức" },
    { id: 5, name: "Truyền thông" },
    { id: 6, name: "Đăng ký tham gia" },
    { id: 7, name: "Khác" },
  ];

  // Handle category filter change
  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      onFiltersChange({
        categoryId: categoryId === "all" ? undefined : Number(categoryId),
        page: 1, // Reset to first page when filtering
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
      categoryId: undefined,
      rating: undefined,
      page: 1,
    });
  }, [onFiltersChange]);

  // Check if any filters are active
  const hasActiveFilters = !!filters.categoryId || !!filters.rating;

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
          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category-filter">Loại phản hồi</Label>
            <Select
              value={filters.categoryId?.toString() || "all"}
              onValueChange={handleCategoryChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả loại phản hồi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại phản hồi</SelectItem>
                {feedbackCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                      {star === 5 && " trở lên"}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters summary */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-blue-200/30 dark:border-slate-600/30 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-cyan-50/80 dark:from-emerald-900/20 dark:via-teal-900/15 dark:to-cyan-900/20 rounded-lg p-3 border border-emerald-200/40 dark:border-emerald-700/30">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium bg-gradient-to-r from-gray-700 via-slate-700 to-gray-700 dark:from-gray-300 dark:via-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                Bộ lọc đang áp dụng:
              </span>
              {filters.categoryId && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-600 rounded-full">
                  {
                    feedbackCategories.find((c) => c.id === filters.categoryId)
                      ?.name
                  }
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
