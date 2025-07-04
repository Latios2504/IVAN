import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: {
    id: string;
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    icon?: React.ReactNode;
  }[];
  resultCount?: number;
  className?: string;
}

export function FilterSection({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  filters,
  resultCount,
  className,
}: FilterSectionProps) {
  const activeFiltersCount = filters.filter((f) => f.value !== "all").length;

  return (
    <div
      className={cn(
        "bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8",
        className
      )}
    >
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <Select
                key={filter.id}
                value={filter.value}
                onValueChange={filter.onChange}
              >
                <SelectTrigger className="w-[180px] h-10 rounded-lg border-slate-200 focus:border-blue-500">
                  {filter.icon && <span className="mr-2">{filter.icon}</span>}
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>

          {/* Results Info */}
          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                <SlidersHorizontal className="w-3 h-3 mr-1" />
                {activeFiltersCount} bộ lọc
              </Badge>
            )}
            {resultCount !== undefined && (
              <span className="text-sm text-slate-600 font-medium">
                {resultCount} kết quả
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
