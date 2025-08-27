import { type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TableColumn<T = any> {
  key: string;
  header: string;
  className?: string;
  render?: (value: any, item: T, index: number) => ReactNode;
  sortable?: boolean;
}

export interface TableAction<T = any> {
  label: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: (item: T) => boolean;
  visible?: (item: T) => boolean;
  tooltip?: string; // New tooltip prop
  tooltipSide?: "top" | "right" | "bottom" | "left"; // Tooltip position
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  getRowClassName?: (item: T, index: number) => string;
  // Pagination props
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  showPagination?: boolean;
  // Tooltip props
  enableTooltips?: boolean;
  actionTooltips?: {
    [key: string]: string; // Map action labels to custom tooltips
  };
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  actions,
  loading = false,
  emptyMessage = "Không có dữ liệu",
  className,
  onRowClick,
  getRowClassName,
  pagination,
  showPagination = false,
  enableTooltips = true,
  actionTooltips = {},
}: DataTableProps<T>) => {
  const renderCellValue = (column: TableColumn<T>, item: T, index: number) => {
    const value = item[column.key];

    if (column.render) {
      return column.render(value, item, index);
    }

    // Default rendering logic
    if (typeof value === "boolean") {
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Có" : "Không"}
        </Badge>
      );
    }

    if (value === null || value === undefined) {
      return <span className="text-gray-400">--</span>;
    }

    return String(value);
  };

  const renderActions = (item: T) => {
    if (!actions || actions.length === 0) return null;

    const visibleActions = actions.filter(
      (action) => !action.visible || action.visible(item)
    );

    if (visibleActions.length === 0) return null;

    const ActionButton = ({
      action,
      index,
    }: {
      action: TableAction<T>;
      index: number;
    }) => {
      const button = (
        <Button
          key={index}
          variant={action.variant || "ghost"}
          size={action.size || "sm"}
          onClick={(e) => {
            e.stopPropagation();
            action.onClick(item);
          }}
          disabled={action.disabled?.(item)}
          className="h-8"
        >
          {action.icon && <span className="mr-1">{action.icon}</span>}
          {action.label}
        </Button>
      );

      // Determine tooltip content
      const tooltipContent =
        action.tooltip ||
        actionTooltips[action.label] ||
        (enableTooltips ? action.label : null);

      // Return button with or without tooltip
      if (enableTooltips && tooltipContent) {
        return (
          <Tooltip key={index}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side={action.tooltipSide || "top"}>
              <p>{tooltipContent}</p>
            </TooltipContent>
          </Tooltip>
        );
      }

      return button;
    };

    return (
      <div className="flex items-center gap-1">
        {enableTooltips ? (
          <TooltipProvider>
            {visibleActions.map((action, index) => (
              <ActionButton key={index} action={action} index={index} />
            ))}
          </TooltipProvider>
        ) : (
          visibleActions.map((action, index) => (
            <ActionButton key={index} action={action} index={index} />
          ))
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {actions && actions.length > 0 && (
                <TableHead className="w-[100px]">Thao tác</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={item.id || index}
                className={cn(
                  onRowClick && "cursor-pointer hover:bg-muted/50",
                  getRowClassName?.(item, index)
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {renderCellValue(column, item, index)}
                  </TableCell>
                ))}
                {actions && actions.length > 0 && (
                  <TableCell>{renderActions(item)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Component */}
      {showPagination && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.currentPage > 1) {
                      pagination.onPageChange(pagination.currentPage - 1);
                    }
                  }}
                  className={cn(
                    pagination.currentPage <= 1 &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {/* First page */}
              {pagination.currentPage > 3 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        pagination.onPageChange(1);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {pagination.currentPage > 4 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}

              {/* Current page and neighbors */}
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (
                    pagination.currentPage >=
                    pagination.totalPages - 2
                  ) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  if (pageNum < 1 || pageNum > pagination.totalPages)
                    return null;

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={pageNum === pagination.currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          pagination.onPageChange(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              {/* Last page */}
              {pagination.currentPage < pagination.totalPages - 2 && (
                <>
                  {pagination.currentPage < pagination.totalPages - 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        pagination.onPageChange(pagination.totalPages);
                      }}
                    >
                      {pagination.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.currentPage < pagination.totalPages) {
                      pagination.onPageChange(pagination.currentPage + 1);
                    }
                  }}
                  className={cn(
                    pagination.currentPage >= pagination.totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
