import { type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

    return (
      <div className="flex items-center gap-1">
        {visibleActions.map((action, index) => (
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
        ))}
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
    <div className={cn("rounded-md border", className)}>
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
  );
};
