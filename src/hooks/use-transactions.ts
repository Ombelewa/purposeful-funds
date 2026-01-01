import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService, Transaction } from "@/lib/data-service";
import { toast } from "sonner";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionService.getAll(),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
  });
}

export function useApproveTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
      toast.success("Transaction approved successfully");
    },
    onError: (error) => {
      toast.error("Failed to approve transaction");
      console.error(error);
    },
  });
}

export function useRejectTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Transaction rejected");
    },
    onError: (error) => {
      toast.error("Failed to reject transaction");
      console.error(error);
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transaction: Omit<Transaction, "id" | "createdAt">) =>
      transactionService.create(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
      toast.success("Transaction created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create transaction");
      console.error(error);
    },
  });
}

