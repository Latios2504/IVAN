import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  className?: string;
}

export function ActionButton({
  to,
  icon: Icon,
  children,
  variant = "default",
  className = "w-full justify-start",
}: ActionButtonProps) {
  return (
    <Button className={className} variant={variant} asChild>
      <Link to={to}>
        <Icon className="mr-2 h-4 w-4" />
        {children}
      </Link>
    </Button>
  );
}
