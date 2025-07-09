import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PublicPageLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function PublicPageLayout({
  children,
  title,
  description,
  className,
}: PublicPageLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            {title}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
