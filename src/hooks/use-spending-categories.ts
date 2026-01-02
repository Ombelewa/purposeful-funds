import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SpendingCategory } from "@/types/database";

export function useSpendingCategories() {
  return useQuery({
    queryKey: ["spending-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spending_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as SpendingCategory[];
    },
  });
}

export function useAllowedCategories() {
  return useQuery({
    queryKey: ["spending-categories", "allowed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spending_categories")
        .select("*")
        .eq("is_restricted", false)
        .order("name");

      if (error) throw error;
      return data as SpendingCategory[];
    },
  });
}

export function useRestrictedCategories() {
  return useQuery({
    queryKey: ["spending-categories", "restricted"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spending_categories")
        .select("*")
        .eq("is_restricted", true)
        .order("name");

      if (error) throw error;
      return data as SpendingCategory[];
    },
  });
}
