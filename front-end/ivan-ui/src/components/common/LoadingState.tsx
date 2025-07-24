import { LoadingGrid } from "@/components/ui/skeletons";

interface LoadingStateProps {
  loading: boolean;
  count?: number;
}

export const LoadingState = ({ loading, count = 6 }: LoadingStateProps) => {
  if (!loading) return null;

  return <LoadingGrid count={count} />;
};
