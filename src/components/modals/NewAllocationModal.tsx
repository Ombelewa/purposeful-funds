import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateFundAllocation } from "@/hooks/use-fund-allocations";
import { useOrganizations } from "@/hooks/use-organizations";
import { useDepartments } from "@/hooks/use-departments";
import { useProjects } from "@/hooks/use-projects";
import { useSpendingCategories } from "@/hooks/use-spending-categories";
import { Calendar, Building2, FolderOpen, Wallet, Shield, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const allocationSchema = z.object({
  source: z.string().min(1, "Funding source is required").max(100, "Source must be less than 100 characters"),
  organization_id: z.string().min(1, "Organization is required"),
  department_id: z.string().optional(),
  project_id: z.string().optional(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
  allowed_categories: z.array(z.string()).min(1, "Select at least one allowed category"),
  forbidden_categories: z.array(z.string()).optional(),
});

type AllocationFormValues = z.infer<typeof allocationSchema>;

interface NewAllocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAllocationModal({ open, onOpenChange }: NewAllocationModalProps) {
  const createAllocation = useCreateFundAllocation();
  const { data: organizations, isLoading: orgsLoading } = useOrganizations();
  const { data: categories, isLoading: categoriesLoading } = useSpendingCategories();
  
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  
  const { data: departments, isLoading: deptsLoading } = useDepartments(selectedOrgId);
  const { data: projects, isLoading: projectsLoading } = useProjects(selectedDeptId);

  const form = useForm<AllocationFormValues>({
    resolver: zodResolver(allocationSchema),
    defaultValues: {
      source: "",
      organization_id: "",
      department_id: "",
      project_id: "",
      amount: 0,
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      notes: "",
      allowed_categories: [],
      forbidden_categories: [],
    },
  });

  // Reset department and project when organization changes
  useEffect(() => {
    if (selectedOrgId) {
      form.setValue("department_id", "");
      form.setValue("project_id", "");
      setSelectedDeptId("");
    }
  }, [selectedOrgId, form]);

  // Reset project when department changes
  useEffect(() => {
    if (selectedDeptId) {
      form.setValue("project_id", "");
    }
  }, [selectedDeptId, form]);

  const onSubmit = (values: AllocationFormValues) => {
    createAllocation.mutate(
      {
        source: values.source.trim(),
        organization_id: values.organization_id,
        department_id: values.department_id || undefined,
        project_id: values.project_id || undefined,
        amount: values.amount,
        allowed_categories: values.allowed_categories,
        forbidden_categories: values.forbidden_categories || [],
        start_date: values.start_date,
        end_date: values.end_date || undefined,
        notes: values.notes?.trim() || undefined,
      },
      {
        onSuccess: () => {
          form.reset();
          setSelectedOrgId("");
          setSelectedDeptId("");
          onOpenChange(false);
        },
      }
    );
  };

  const allowedCategories = categories?.filter((c) => !c.is_restricted) || [];
  const restrictedCategories = categories?.filter((c) => c.is_restricted) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Create New Fund Allocation
          </DialogTitle>
          <DialogDescription>
            Allocate funds to an organization, department, or specific project with spending category restrictions.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Funding Source */}
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funding Source</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Treasury, World Bank Grant, Ministry Budget" 
                        {...field} 
                        maxLength={100}
                      />
                    </FormControl>
                    <FormDescription>
                      Origin of the funds (Treasury, Donor, Investor, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Organization Selection */}
              <FormField
                control={form.control}
                name="organization_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Organization
                    </FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedOrgId(value);
                      }} 
                      value={field.value}
                      disabled={orgsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={orgsLoading ? "Loading..." : "Select organization"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {organizations?.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department Selection (Optional) */}
              <FormField
                control={form.control}
                name="department_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      Department (Optional)
                    </FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedDeptId(value);
                      }} 
                      value={field.value}
                      disabled={!selectedOrgId || deptsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !selectedOrgId 
                              ? "Select organization first" 
                              : deptsLoading 
                                ? "Loading..." 
                                : "Select department (optional)"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None (Organization-wide)</SelectItem>
                        {departments?.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} {dept.cost_center_code && `(${dept.cost_center_code})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Leave empty for organization-wide allocation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project Selection (Optional) */}
              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project (Optional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!selectedDeptId || projectsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !selectedDeptId 
                              ? "Select department first" 
                              : projectsLoading 
                                ? "Loading..." 
                                : "Select project (optional)"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None (Department-wide)</SelectItem>
                        {projects?.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Allocate to a specific project within the department
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allocation Amount (N$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5000000"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Total budget amount in Namibian Dollars
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Start Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Allowed Categories */}
              <FormField
                control={form.control}
                name="allowed_categories"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="flex items-center gap-2 text-base">
                        <Shield className="h-4 w-4 text-success" />
                        Allowed Spending Categories
                      </FormLabel>
                      <FormDescription>
                        Select the categories that can be used with this allocation
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {categoriesLoading ? (
                        <p className="text-sm text-muted-foreground">Loading categories...</p>
                      ) : (
                        allowedCategories.map((category) => (
                          <FormField
                            key={category.id}
                            control={form.control}
                            name="allowed_categories"
                            render={({ field }) => (
                              <FormItem
                                key={category.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, category.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== category.id)
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {category.name}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Forbidden Categories */}
              <FormField
                control={form.control}
                name="forbidden_categories"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="flex items-center gap-2 text-base">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        Explicitly Forbidden Categories
                      </FormLabel>
                      <FormDescription>
                        These restricted categories will trigger a block if attempted
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                      {categoriesLoading ? (
                        <p className="text-sm text-muted-foreground">Loading categories...</p>
                      ) : (
                        restrictedCategories.map((category) => (
                          <FormField
                            key={category.id}
                            control={form.control}
                            name="forbidden_categories"
                            render={({ field }) => (
                              <FormItem
                                key={category.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      return checked
                                        ? field.onChange([...current, category.id])
                                        : field.onChange(
                                            current.filter((value) => value !== category.id)
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer text-destructive">
                                  {category.name}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes about this allocation..."
                        className="resize-none"
                        rows={3}
                        maxLength={500}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
