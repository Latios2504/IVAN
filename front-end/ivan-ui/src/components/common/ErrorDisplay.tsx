import { AlertTriangle, XCircle, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorDisplayProps {
  error?: string | Error | null;
  onRetry?: () => void;
  variant?: "page" | "component" | "alert";
  title?: string;
  retryLabel?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  variant = "alert",
  title = "Đã xảy ra lỗi",
  retryLabel = "Thử lại",
}: ErrorDisplayProps) {
  // Don't render if no error
  if (!error) return null;

  const errorMessage =
    error instanceof Error ? error.message : error || "Lỗi không xác định";

  // Full-page error (for detail pages, major failures)
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
                  {retryLabel}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Component-level error (inline, takes more space)
  if (variant === "component") {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <AlertTriangle className="h-8 w-8 text-yellow-500 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-center mb-4">{errorMessage}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryLabel}
          </Button>
        )}
      </div>
    );
  }

  // Alert-style error (compact, for listing pages)
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {errorMessage}
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-2"
          >
            {retryLabel}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Export aliases for backward compatibility and clarity
export const ErrorBoundary = ErrorDisplay;
export const ErrorState = (props: Omit<ErrorDisplayProps, "variant">) => (
  <ErrorDisplay {...props} variant="alert" />
);
