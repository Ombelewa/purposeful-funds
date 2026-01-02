import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Department } from "@/types/database";
import { toast } from "sonner";

export function useDepartments(organizationId?: string) {
  return useQuery({
    queryKey: ["departments", organizationId],
    queryFn: async () => {
      let query = supabase
        .from("departments")
        .select("*, organization:organizations(*)")
        .order("name");

      if (organizationId) {
        query = query.eq("organization_id", organizationId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Department[];
    },
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dept: {
      organization_id: string;
      name: string;
      cost_center_code?: string;
      budget_limit?: number;
    }) => {
      const { data, error } = await supabase
        .from("departments")
        .insert(dept)
        .select()
        .single();

      if (error) throw error;
      return data as Department;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create department");
      console.error(error);
    },
  });
}
