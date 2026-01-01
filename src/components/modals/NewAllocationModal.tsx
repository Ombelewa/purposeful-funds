import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateAllocation } from "@/hooks/use-allocations";

const allocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
  totalBudget: z.number().min(1, "Budget must be greater than 0"),
  allowedCategories: z.string().min(1, "At least one category is required"),
});

type AllocationFormValues = z.infer<typeof allocationSchema>;

interface NewAllocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAllocationModal({ open, onOpenChange }: NewAllocationModalProps) {
  const createAllocation = useCreateAllocation();
  const form = useForm<AllocationFormValues>({
    resolver: zodResolver(allocationSchema),
    defaultValues: {
      name: "",
      department: "",
      totalBudget: 0,
      allowedCategories: "",
    },
  });

  const onSubmit = (values: AllocationFormValues) => {
    const categories = values.allowedCategories.split(",").map((c) => c.trim()).filter(Boolean);
    createAllocation.mutate(
      {
        name: values.name,
        department: values.department,
        totalBudget: values.totalBudget,
        allowedCategories: categories,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Fund Allocation</DialogTitle>
          <DialogDescription>
            Set up a new budget allocation with spending categories and limits.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allocation Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Infrastructure Development" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Public Works" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Budget (N$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5000000"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the total budget amount in Namibian Dollars
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allowedCategories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed Categories</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Construction, Equipment, Materials"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of allowed spending categories
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createAllocation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createAllocation.isPending}>
                {createAllocation.isPending ? "Creating..." : "Create Allocation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

