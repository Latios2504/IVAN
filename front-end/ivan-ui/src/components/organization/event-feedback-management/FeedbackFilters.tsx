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
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Bộ lọc phản hồi
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={loading}
              className="ml-auto"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="pt-2 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600">
                Bộ lọc đang áp dụng:
              </span>
              {filters.categoryId && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {
                    feedbackCategories.find((c) => c.id === filters.categoryId)
                      ?.name
                  }
                </span>
              )}
              {filters.rating && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
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
