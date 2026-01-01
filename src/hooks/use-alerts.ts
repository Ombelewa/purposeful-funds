import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertService, Alert } from "@/lib/data-service";
import { toast } from "sonner";

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: () => alertService.getAll(),
  });
}

export function useUpdateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Alert> }) =>
      alertService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error) => {
      toast.error("Failed to update alert");
      console.error(error);
    },
  });
}

