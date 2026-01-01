import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { allocationService, Allocation } from "@/lib/data-service";
import { toast } from "sonner";

export function useAllocations() {
  return useQuery({
    queryKey: ["allocations"],
    queryFn: () => allocationService.getAll(),
  });
}

export function useAllocation(id: string) {
  return useQuery({
    queryKey: ["allocations", id],
    queryFn: () => allocationService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (allocation: Omit<Allocation, "id" | "createdAt" | "spent" | "remaining" | "status">) =>
      allocationService.create(allocation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Fund allocation created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create allocation");
      console.error(error);
    },
  });
}

