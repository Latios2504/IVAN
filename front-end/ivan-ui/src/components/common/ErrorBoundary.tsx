import { AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorBoundaryProps {
  error?: string | Error;
  onRetry?: () => void;
  variant?: "page" | "component";
  title?: string;
}

export function ErrorBoundary({
  error,
  onRetry,
  variant = "component",
  title = "Đã xảy ra lỗi",
}: ErrorBoundaryProps) {
  const errorMessage =
    error instanceof Error ? error.message : error || "Lỗi không xác định";

  if (variant === "page") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h2>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              {onRetry && (
                <Button onClick={onRetry} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Thử lại
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <AlertTriangle className="h-8 w-8 text-yellow-500 mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-4">{errorMessage}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Thử lại
        </Button>
      )}
    </div>
  );
}
