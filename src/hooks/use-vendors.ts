import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorService, Vendor } from "@/lib/data-service";
import { toast } from "sonner";

export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => vendorService.getAll(),
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vendor: Omit<Vendor, "id" | "createdAt">) =>
      vendorService.create(vendor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add vendor");
      console.error(error);
    },
  });
}

