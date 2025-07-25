import { Button } from "@/components/ui/button";

interface PaginationInfo {
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  loading?: boolean;
  error?: string | null;
  itemName?: string; // e.g., "sự kiện", "tổ chức", "đối tác", "tình nguyện viên"
}

export const Pagination = ({
  pagination,
  onPageChange,
  loading = false,
  error = null,
  itemName = "mục",
}: PaginationProps) => {
  // Don't show pagination if loading, error, or only 1 page
  if (loading || error || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center mt-8 gap-4">
      {/* Items count display */}
      <div className="text-sm text-muted-foreground">
        Hiển thị {(pagination.page - 1) * pagination.size + 1} -{" "}
        {Math.min(pagination.page * pagination.size, pagination.totalItems)} của{" "}
        {pagination.totalItems} {itemName}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.hasPreviousPage}
        >
          Trước
        </Button>

        {/* Page number buttons */}
        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
          const pageNum = Math.max(1, pagination.page - 2) + i;
          if (pageNum > pagination.totalPages) return null;

          return (
            <Button
              key={pageNum}
              variant={pageNum === pagination.page ? "default" : "outline"}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasNextPage}
        >
          Sau
        </Button>
      </div>
    </div>
  );
};

export type { PaginationInfo };
