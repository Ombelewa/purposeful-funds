// Database types for FundGuard Namibia

export type AppRole = 'system_admin' | 'treasury' | 'department_head' | 'officer' | 'auditor' | 'anti_corruption';
export type OrganizationType = 'government' | 'soe' | 'ngo' | 'private';
export type ProjectStatus = 'active' | 'suspended' | 'closed';
export type WalletStatus = 'active' | 'suspended' | 'frozen';
export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'flagged' | 'blocked';
export type ApprovalDecision = 'approved' | 'rejected' | 'escalated';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  employee_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  organization_id: string | null;
  department_id: string | null;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  registration_number: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  organization_id: string;
  name: string;
  cost_center_code: string | null;
  head_user_id: string | null;
  budget_limit: number;
  created_at: string;
  updated_at: string;
  organization?: Organization;
}

export interface Project {
  id: string;
  department_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  total_budget: number;
  spent_amount: number;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface SpendingCategory {
  id: string;
  name: string;
  description: string | null;
  is_restricted: boolean;
  created_at: string;
}

export interface FundAllocation {
  id: string;
  source: string;
  organization_id: string;
  department_id: string | null;
  project_id: string | null;
  amount: number;
  remaining_amount: number;
  currency: string;
  allowed_categories: string[];
  forbidden_categories: string[];
  start_date: string;
  end_date: string | null;
  notes: string | null;
  allocated_by: string | null;
  created_at: string;
  updated_at: string;
  organization?: Organization;
  department?: Department;
  project?: Project;
}

export interface BudgetWallet {
  id: string;
  fund_allocation_id: string;
  department_id: string | null;
  project_id: string | null;
  balance: number;
  currency: string;
  status: WalletStatus;
  created_at: string;
  updated_at: string;
  fund_allocation?: FundAllocation;
  department?: Department;
  project?: Project;
}

export interface Vendor {
  id: string;
  name: string;
  registration_number: string | null;
  tax_reference: string | null;
  bank_account_hash: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  risk_score: number;
  is_blacklisted: boolean;
  blacklist_reason: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  vendor_id: string | null;
  category_id: string | null;
  initiated_by: string;
  amount: number;
  currency: string;
  description: string | null;
  reference_number: string | null;
  risk_score: number;
  status: TransactionStatus;
  status_reason: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  wallet?: BudgetWallet;
  vendor?: Vendor;
  category?: SpendingCategory;
}

export interface Approval {
  id: string;
  transaction_id: string;
  approver_id: string;
  decision: ApprovalDecision;
  comments: string | null;
  decided_at: string;
}

export interface FraudRule {
  id: string;
  name: string;
  description: string | null;
  rule_code: string;
  severity: AlertSeverity;
  is_blocking: boolean;
  is_active: boolean;
  parameters: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FraudAlert {
  id: string;
  transaction_id: string | null;
  rule_id: string | null;
  severity: AlertSeverity;
  title: string;
  explanation: string | null;
  status: AlertStatus;
  assigned_to: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  transaction?: Transaction;
  rule?: FraudRule;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
