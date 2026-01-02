import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project, ProjectStatus } from "@/types/database";
import { toast } from "sonner";

export function useProjects(departmentId?: string) {
  return useQuery({
    queryKey: ["projects", departmentId],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*, department:departments(*, organization:organizations(*))")
        .eq("status", "active")
        .order("name");

      if (departmentId) {
        query = query.eq("department_id", departmentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: {
      department_id: string;
      name: string;
      description?: string;
      start_date: string;
      end_date?: string;
      total_budget: number;
    }) => {
      const { data, error } = await supabase
        .from("projects")
        .insert(project)
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create project");
      console.error(error);
    },
  });
}
