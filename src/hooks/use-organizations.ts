import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Organization, OrganizationType } from "@/types/database";
import { toast } from "sonner";

export function useOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Organization[];
    },
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (org: {
      name: string;
      type: OrganizationType;
      registration_number?: string;
      address?: string;
      phone?: string;
      email?: string;
    }) => {
      const { data, error } = await supabase
        .from("organizations")
        .insert(org)
        .select()
        .single();

      if (error) throw error;
      return data as Organization;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create organization");
      console.error(error);
    },
  });
}
