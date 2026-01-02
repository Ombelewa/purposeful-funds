export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      approvals: {
        Row: {
          approver_id: string
          comments: string | null
          decided_at: string
          decision: Database["public"]["Enums"]["approval_decision"]
          id: string
          transaction_id: string
        }
        Insert: {
          approver_id: string
          comments?: string | null
          decided_at?: string
          decision: Database["public"]["Enums"]["approval_decision"]
          id?: string
          transaction_id: string
        }
        Update: {
          approver_id?: string
          comments?: string | null
          decided_at?: string
          decision?: Database["public"]["Enums"]["approval_decision"]
          id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Relationships: []
      }
      budget_wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          department_id: string | null
          fund_allocation_id: string
          id: string
          project_id: string | null
          status: Database["public"]["Enums"]["wallet_status"]
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          department_id?: string | null
          fund_allocation_id: string
          id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["wallet_status"]
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          department_id?: string | null
          fund_allocation_id?: string
          id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["wallet_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_wallets_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_wallets_fund_allocation_id_fkey"
            columns: ["fund_allocation_id"]
            isOneToOne: false
            referencedRelation: "fund_allocations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_wallets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          budget_limit: number | null
          cost_center_code: string | null
          created_at: string
          head_user_id: string | null
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          budget_limit?: number | null
          cost_center_code?: string | null
          created_at?: string
          head_user_id?: string | null
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          budget_limit?: number | null
          cost_center_code?: string | null
          created_at?: string
          head_user_id?: string | null
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_alerts: {
        Row: {
          assigned_to: string | null
          created_at: string
          explanation: string | null
          id: string
          resolved_at: string | null
          resolved_by: string | null
          rule_id: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status: Database["public"]["Enums"]["alert_status"]
          title: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          rule_id?: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"]
          title: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          rule_id?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"]
          title?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "fraud_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_rules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          is_blocking: boolean | null
          name: string
          parameters: Json | null
          rule_code: string
          severity: Database["public"]["Enums"]["alert_severity"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_blocking?: boolean | null
          name: string
          parameters?: Json | null
          rule_code: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_blocking?: boolean | null
          name?: string
          parameters?: Json | null
          rule_code?: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          updated_at?: string
        }
        Relationships: []
      }
      fund_allocations: {
        Row: {
          allocated_by: string | null
          allowed_categories: string[] | null
          amount: number
          created_at: string
          currency: string
          department_id: string | null
          end_date: string | null
          forbidden_categories: string[] | null
          id: string
          notes: string | null
          organization_id: string
          project_id: string | null
          remaining_amount: number
          source: string
          start_date: string
          updated_at: string
        }
        Insert: {
          allocated_by?: string | null
          allowed_categories?: string[] | null
          amount: number
          created_at?: string
          currency?: string
          department_id?: string | null
          end_date?: string | null
          forbidden_categories?: string[] | null
          id?: string
          notes?: string | null
          organization_id: string
          project_id?: string | null
          remaining_amount: number
          source: string
          start_date: string
          updated_at?: string
        }
        Update: {
          allocated_by?: string | null
          allowed_categories?: string[] | null
          amount?: number
          created_at?: string
          currency?: string
          department_id?: string | null
          end_date?: string | null
          forbidden_categories?: string[] | null
          id?: string
          notes?: string | null
          organization_id?: string
          project_id?: string | null
          remaining_amount?: number
          source?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_allocations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fund_allocations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fund_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          registration_number: string | null
          type: Database["public"]["Enums"]["organization_type"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          registration_number?: string | null
          type?: Database["public"]["Enums"]["organization_type"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          registration_number?: string | null
          type?: Database["public"]["Enums"]["organization_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          employee_id: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          employee_id?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          employee_id?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          department_id: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          spent_amount: number
          start_date: string
          status: Database["public"]["Enums"]["project_status"]
          total_budget: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          spent_amount?: number
          start_date: string
          status?: Database["public"]["Enums"]["project_status"]
          total_budget?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          spent_amount?: number
          start_date?: string
          status?: Database["public"]["Enums"]["project_status"]
          total_budget?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      spending_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_restricted: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_restricted?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_restricted?: boolean | null
          name?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          initiated_by: string
          reference_number: string | null
          risk_score: number | null
          status: Database["public"]["Enums"]["transaction_status"]
          status_reason: string | null
          transaction_date: string
          updated_at: string
          vendor_id: string | null
          wallet_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          initiated_by: string
          reference_number?: string | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          status_reason?: string | null
          transaction_date?: string
          updated_at?: string
          vendor_id?: string | null
          wallet_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          initiated_by?: string
          reference_number?: string | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          status_reason?: string | null
          transaction_date?: string
          updated_at?: string
          vendor_id?: string | null
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "spending_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "budget_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          department_id: string | null
          id: string
          organization_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          id?: string
          organization_id?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_roles_department"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_roles_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          bank_account_hash: string | null
          blacklist_reason: string | null
          created_at: string
          email: string | null
          id: string
          is_blacklisted: boolean | null
          name: string
          phone: string | null
          registration_number: string | null
          risk_score: number | null
          tax_reference: string | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          address?: string | null
          bank_account_hash?: string | null
          blacklist_reason?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_blacklisted?: boolean | null
          name: string
          phone?: string | null
          registration_number?: string | null
          risk_score?: number | null
          tax_reference?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          address?: string | null
          bank_account_hash?: string | null
          blacklist_reason?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_blacklisted?: boolean | null
          name?: string
          phone?: string | null
          registration_number?: string | null
          risk_score?: number | null
          tax_reference?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_org_ids: { Args: { _user_id: string }; Returns: string[] }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_system_admin: { Args: { _user_id: string }; Returns: boolean }
      user_in_department: {
        Args: { _dept_id: string; _user_id: string }
        Returns: boolean
      }
      user_in_organization: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      alert_severity: "low" | "medium" | "high" | "critical"
      alert_status: "open" | "investigating" | "resolved" | "dismissed"
      app_role:
        | "system_admin"
        | "treasury"
        | "department_head"
        | "officer"
        | "auditor"
        | "anti_corruption"
      approval_decision: "approved" | "rejected" | "escalated"
      organization_type: "government" | "soe" | "ngo" | "private"
      project_status: "active" | "suspended" | "closed"
      transaction_status:
        | "pending"
        | "approved"
        | "rejected"
        | "flagged"
        | "blocked"
      wallet_status: "active" | "suspended" | "frozen"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["low", "medium", "high", "critical"],
      alert_status: ["open", "investigating", "resolved", "dismissed"],
      app_role: [
        "system_admin",
        "treasury",
        "department_head",
        "officer",
        "auditor",
        "anti_corruption",
      ],
      approval_decision: ["approved", "rejected", "escalated"],
      organization_type: ["government", "soe", "ngo", "private"],
      project_status: ["active", "suspended", "closed"],
      transaction_status: [
        "pending",
        "approved",
        "rejected",
        "flagged",
        "blocked",
      ],
      wallet_status: ["active", "suspended", "frozen"],
    },
  },
} as const
