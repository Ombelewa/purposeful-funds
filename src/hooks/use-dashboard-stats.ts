import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/lib/data-service";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => statsService.getDashboardStats(),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time feel
  });
}

