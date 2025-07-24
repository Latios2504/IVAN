import type { ReactNode } from "react";

interface ContentGridProps {
  children: ReactNode;
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  gridClassName?: string;
}

export const ContentGrid = ({
  children,
  loading,
  error,
  isEmpty,
  gridClassName = "grid gap-6",
}: ContentGridProps) => {
  // Only show content if not loading, no error, and has items
  if (loading || error || isEmpty) return null;

  return <div className={gridClassName}>{children}</div>;
};
