import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FundAllocation, BudgetWallet } from "@/types/database";
import { toast } from "sonner";

export function useFundAllocations() {
  return useQuery({
    queryKey: ["fund-allocations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fund_allocations")
        .select(`
          *,
          organization:organizations(*),
          department:departments(*),
          project:projects(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FundAllocation[];
    },
  });
}

export function useFundAllocation(id: string) {
  return useQuery({
    queryKey: ["fund-allocations", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fund_allocations")
        .select(`
          *,
          organization:organizations(*),
          department:departments(*),
          project:projects(*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as FundAllocation | null;
    },
    enabled: !!id,
  });
}

export interface CreateAllocationInput {
  source: string;
  organization_id: string;
  department_id?: string;
  project_id?: string;
  amount: number;
  allowed_categories: string[];
  forbidden_categories: string[];
  start_date: string;
  end_date?: string;
  notes?: string;
}

export function useCreateFundAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAllocationInput) => {
      // Get current user for allocated_by
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create the fund allocation
      const { data: allocation, error: allocationError } = await supabase
        .from("fund_allocations")
        .insert({
          source: input.source,
          organization_id: input.organization_id,
          department_id: input.department_id || null,
          project_id: input.project_id || null,
          amount: input.amount,
          remaining_amount: input.amount,
          allowed_categories: input.allowed_categories,
          forbidden_categories: input.forbidden_categories,
          start_date: input.start_date,
          end_date: input.end_date || null,
          notes: input.notes || null,
          allocated_by: user?.id || null,
        })
        .select()
        .single();

      if (allocationError) throw allocationError;

      // Create the budget wallet for this allocation
      const { error: walletError } = await supabase
        .from("budget_wallets")
        .insert({
          fund_allocation_id: allocation.id,
          department_id: input.department_id || null,
          project_id: input.project_id || null,
          balance: input.amount,
          currency: "NAD",
          status: "active",
        });

      if (walletError) throw walletError;

      return allocation as FundAllocation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fund-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["budget-wallets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Fund allocation created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create allocation: ${error.message}`);
      console.error(error);
    },
  });
}

export function useBudgetWallets() {
  return useQuery({
    queryKey: ["budget-wallets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budget_wallets")
        .select(`
          *,
          fund_allocation:fund_allocations(*),
          department:departments(*),
          project:projects(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BudgetWallet[];
    },
  });
}
