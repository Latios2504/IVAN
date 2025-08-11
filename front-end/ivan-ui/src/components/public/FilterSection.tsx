import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

export interface QuickSearchOption {
  value: string;
  label: string;
  description?: string;
  category?: string;
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
    useCommand?: boolean; // New prop to enable Command component for this filter
  }[];
  resultCount?: number;
  className?: string;
  // Advanced search props
  quickSearchOptions?: QuickSearchOption[];
  onQuickSearchSelect?: (value: string) => void;
  enableAdvancedSearch?: boolean;
}

export function FilterSection({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  filters,
  resultCount,
  className,
  quickSearchOptions = [],
  onQuickSearchSelect,
  enableAdvancedSearch = false,
}: FilterSectionProps) {
  const [openCommandFilters, setOpenCommandFilters] = useState<
    Record<string, boolean>
  >({});
  const activeFiltersCount = filters.filter((f) => f.value !== "all").length;

  // Command filter component for enhanced dropdowns
  const CommandFilter = ({ filter }: { filter: (typeof filters)[0] }) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[180px] h-10 justify-between rounded-lg border-slate-200 focus:border-blue-500"
          >
            <div className="flex items-center">
              {filter.icon && <span className="mr-2">{filter.icon}</span>}
              <span className="truncate">
                {filter.value !== "all"
                  ? filter.options.find((opt) => opt.value === filter.value)
                      ?.label
                  : filter.label}
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder={`Tìm ${filter.label.toLowerCase()}...`}
            />
            <CommandList>
              <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
              <CommandGroup>
                {filter.options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue: string) => {
                      filter.onChange(
                        currentValue === filter.value ? "all" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        filter.value === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div
      className={cn(
        "bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8",
        className
      )}
    >
      <div className="flex flex-col space-y-4">
        {/* Enhanced Search Bar with Command */}
        <div className="relative">
          {enableAdvancedSearch && quickSearchOptions.length > 0 ? (
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 z-10" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-12 pr-4 h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl cursor-pointer"
                    onFocus={(e) => e.target.blur()} // Prevent normal input focus, use popover instead
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onValueChange={onSearchChange}
                  />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                    {quickSearchOptions.length > 0 && (
                      <>
                        {/* Group by category if available */}
                        {Array.from(
                          new Set(
                            quickSearchOptions
                              .map((opt) => opt.category)
                              .filter(Boolean)
                          )
                        ).map((category) => (
                          <CommandGroup key={category} heading={category}>
                            {quickSearchOptions
                              .filter((opt) => opt.category === category)
                              .map((option) => (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={(value: string) => {
                                    onQuickSearchSelect?.(value);
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    {option.description && (
                                      <span className="text-sm text-muted-foreground">
                                        {option.description}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        ))}
                        {/* Uncategorized options */}
                        {quickSearchOptions.filter((opt) => !opt.category)
                          .length > 0 && (
                          <CommandGroup heading="Tìm kiếm nhanh">
                            {quickSearchOptions
                              .filter((opt) => !opt.category)
                              .map((option) => (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={(value: string) => {
                                    onQuickSearchSelect?.(value);
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    {option.description && (
                                      <span className="text-sm text-muted-foreground">
                                        {option.description}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        )}
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-4 h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Enhanced Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) =>
              filter.useCommand ? (
                <CommandFilter key={filter.id} filter={filter} />
              ) : (
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
              )
            )}
          </div>

          {/* Results Info */}
          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20"
              >
                <SlidersHorizontal className="w-3 h-3 mr-1" />
                {activeFiltersCount} bộ lọc
              </Badge>
            )}
            {resultCount !== undefined && (
              <span className="text-sm text-muted-foreground font-medium">
                {resultCount} kết quả
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
