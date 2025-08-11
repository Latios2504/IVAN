import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  show: boolean;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  show,
}: EmptyStateProps) => {
  if (!show) return null;

  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
