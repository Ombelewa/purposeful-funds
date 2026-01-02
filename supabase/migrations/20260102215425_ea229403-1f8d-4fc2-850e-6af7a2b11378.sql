
-- =====================================================
-- FUNDGUARD NAMIBIA - COMPLETE DATABASE SCHEMA
-- =====================================================

-- 1. ENUM TYPES
-- =====================================================

CREATE TYPE public.app_role AS ENUM ('system_admin', 'treasury', 'department_head', 'officer', 'auditor', 'anti_corruption');
CREATE TYPE public.organization_type AS ENUM ('government', 'soe', 'ngo', 'private');
CREATE TYPE public.project_status AS ENUM ('active', 'suspended', 'closed');
CREATE TYPE public.wallet_status AS ENUM ('active', 'suspended', 'frozen');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'approved', 'rejected', 'flagged', 'blocked');
CREATE TYPE public.approval_decision AS ENUM ('approved', 'rejected', 'escalated');
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.alert_status AS ENUM ('open', 'investigating', 'resolved', 'dismissed');

-- 2. CORE TABLES
-- =====================================================

-- 2.1 User Profiles (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    employee_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 User Roles (separate table for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    organization_id UUID,
    department_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role, organization_id)
);

-- 2.3 Organizations
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type organization_type NOT NULL DEFAULT 'government',
    registration_number TEXT UNIQUE,
    address TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 Departments
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cost_center_code TEXT,
    head_user_id UUID REFERENCES auth.users(id),
    budget_limit DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add foreign key for user_roles.organization_id
ALTER TABLE public.user_roles 
ADD CONSTRAINT fk_user_roles_organization 
FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Add foreign key for user_roles.department_id
ALTER TABLE public.user_roles 
ADD CONSTRAINT fk_user_roles_department 
FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE CASCADE;

-- 2.5 Projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    total_budget DECIMAL(15,2) NOT NULL DEFAULT 0,
    spent_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    status project_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.6 Spending Categories
CREATE TABLE public.spending_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_restricted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.7 Fund Allocations
CREATE TABLE public.fund_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    amount DECIMAL(15,2) NOT NULL,
    remaining_amount DECIMAL(15,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NAD',
    allowed_categories UUID[] DEFAULT '{}',
    forbidden_categories UUID[] DEFAULT '{}',
    start_date DATE NOT NULL,
    end_date DATE,
    notes TEXT,
    allocated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.8 Budget Wallets
CREATE TABLE public.budget_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_allocation_id UUID NOT NULL REFERENCES public.fund_allocations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'NAD',
    status wallet_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.9 Vendors
CREATE TABLE public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    registration_number TEXT,
    tax_reference TEXT,
    bank_account_hash TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    is_blacklisted BOOLEAN DEFAULT false,
    blacklist_reason TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.10 Transactions
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.budget_wallets(id) ON DELETE RESTRICT,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.spending_categories(id),
    initiated_by UUID NOT NULL REFERENCES auth.users(id),
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NAD',
    description TEXT,
    reference_number TEXT,
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    status transaction_status NOT NULL DEFAULT 'pending',
    status_reason TEXT,
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.11 Approvals
CREATE TABLE public.approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES auth.users(id),
    decision approval_decision NOT NULL,
    comments TEXT,
    decided_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.12 Fraud Rules
CREATE TABLE public.fraud_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    rule_code TEXT NOT NULL UNIQUE,
    severity alert_severity NOT NULL DEFAULT 'medium',
    is_blocking BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    parameters JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.13 Fraud Alerts
CREATE TABLE public.fraud_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
    rule_id UUID REFERENCES public.fraud_rules(id) ON DELETE SET NULL,
    severity alert_severity NOT NULL,
    title TEXT NOT NULL,
    explanation TEXT,
    status alert_status NOT NULL DEFAULT 'open',
    assigned_to UUID REFERENCES auth.users(id),
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.14 Audit Logs (IMMUTABLE)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_org ON public.user_roles(organization_id);
CREATE INDEX idx_departments_org ON public.departments(organization_id);
CREATE INDEX idx_projects_dept ON public.projects(department_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_fund_allocations_org ON public.fund_allocations(organization_id);
CREATE INDEX idx_fund_allocations_dept ON public.fund_allocations(department_id);
CREATE INDEX idx_budget_wallets_allocation ON public.budget_wallets(fund_allocation_id);
CREATE INDEX idx_transactions_wallet ON public.transactions(wallet_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX idx_transactions_initiated_by ON public.transactions(initiated_by);
CREATE INDEX idx_fraud_alerts_status ON public.fraud_alerts(status);
CREATE INDEX idx_fraud_alerts_severity ON public.fraud_alerts(severity);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at);

-- 4. SECURITY DEFINER FUNCTIONS
-- =====================================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

-- Check if user is system admin
CREATE OR REPLACE FUNCTION public.is_system_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(_user_id, 'system_admin')
$$;

-- Check if user belongs to organization
CREATE OR REPLACE FUNCTION public.user_in_organization(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND organization_id = _org_id
    )
$$;

-- Check if user belongs to department
CREATE OR REPLACE FUNCTION public.user_in_department(_user_id UUID, _dept_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND department_id = _dept_id
    )
$$;

-- Get user's organization IDs
CREATE OR REPLACE FUNCTION public.get_user_org_ids(_user_id UUID)
RETURNS UUID[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT ARRAY_AGG(DISTINCT organization_id)
    FROM public.user_roles
    WHERE user_id = _user_id AND organization_id IS NOT NULL
$$;

-- 5. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spending_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 5.1 Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT TO authenticated USING (public.is_system_admin(auth.uid()));

-- 5.2 User Roles Policies
CREATE POLICY "Admins can manage roles" ON public.user_roles
    FOR ALL TO authenticated USING (public.is_system_admin(auth.uid()));
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 5.3 Organizations Policies
CREATE POLICY "Authenticated users can view organizations" ON public.organizations
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage organizations" ON public.organizations
    FOR ALL TO authenticated USING (public.is_system_admin(auth.uid()));

-- 5.4 Departments Policies
CREATE POLICY "Users can view departments in their org" ON public.departments
    FOR SELECT TO authenticated
    USING (public.user_in_organization(auth.uid(), organization_id) OR public.is_system_admin(auth.uid()));
CREATE POLICY "Admins can manage departments" ON public.departments
    FOR ALL TO authenticated USING (public.is_system_admin(auth.uid()));

-- 5.5 Projects Policies
CREATE POLICY "Users can view projects in their dept" ON public.projects
    FOR SELECT TO authenticated
    USING (
        public.user_in_department(auth.uid(), department_id) 
        OR public.is_system_admin(auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.departments d 
            WHERE d.id = department_id 
            AND public.user_in_organization(auth.uid(), d.organization_id)
        )
    );
CREATE POLICY "Dept heads can manage projects" ON public.projects
    FOR ALL TO authenticated
    USING (
        public.is_system_admin(auth.uid()) 
        OR (public.has_role(auth.uid(), 'department_head') AND public.user_in_department(auth.uid(), department_id))
    );

-- 5.6 Spending Categories Policies (public read)
CREATE POLICY "Anyone can view categories" ON public.spending_categories
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage categories" ON public.spending_categories
    FOR ALL TO authenticated USING (public.is_system_admin(auth.uid()));

-- 5.7 Fund Allocations Policies
CREATE POLICY "Users can view allocations in their org" ON public.fund_allocations
    FOR SELECT TO authenticated
    USING (public.user_in_organization(auth.uid(), organization_id) OR public.is_system_admin(auth.uid()));
CREATE POLICY "Treasury can manage allocations" ON public.fund_allocations
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'treasury') OR public.is_system_admin(auth.uid()));

-- 5.8 Budget Wallets Policies
CREATE POLICY "Users can view wallets in their dept" ON public.budget_wallets
    FOR SELECT TO authenticated
    USING (
        public.user_in_department(auth.uid(), department_id) 
        OR public.is_system_admin(auth.uid())
        OR public.has_role(auth.uid(), 'treasury')
    );
CREATE POLICY "Treasury can manage wallets" ON public.budget_wallets
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'treasury') OR public.is_system_admin(auth.uid()));

-- 5.9 Vendors Policies
CREATE POLICY "Authenticated users can view vendors" ON public.vendors
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and treasury can manage vendors" ON public.vendors
    FOR ALL TO authenticated
    USING (public.is_system_admin(auth.uid()) OR public.has_role(auth.uid(), 'treasury'));

-- 5.10 Transactions Policies
CREATE POLICY "Users can view their transactions" ON public.transactions
    FOR SELECT TO authenticated
    USING (
        initiated_by = auth.uid()
        OR public.is_system_admin(auth.uid())
        OR public.has_role(auth.uid(), 'treasury')
        OR public.has_role(auth.uid(), 'auditor')
        OR public.has_role(auth.uid(), 'anti_corruption')
    );
CREATE POLICY "Officers can create transactions" ON public.transactions
    FOR INSERT TO authenticated
    WITH CHECK (initiated_by = auth.uid());
CREATE POLICY "Admins can manage transactions" ON public.transactions
    FOR ALL TO authenticated USING (public.is_system_admin(auth.uid()));

-- 5.11 Approvals Policies
CREATE POLICY "Users can view approvals for their transactions" ON public.approvals
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.transactions t WHERE t.id = transaction_id AND t.initiated_by = auth.uid())
        OR approver_id = auth.uid()
        OR public.is_system_admin(auth.uid())
        OR public.has_role(auth.uid(), 'auditor')
    );
CREATE POLICY "Approvers can create approvals" ON public.approvals
    FOR INSERT TO authenticated
    WITH CHECK (
        public.has_role(auth.uid(), 'department_head') 
        OR public.has_role(auth.uid(), 'treasury')
        OR public.is_system_admin(auth.uid())
    );

-- 5.12 Fraud Rules Policies
CREATE POLICY "Users can view active fraud rules" ON public.fraud_rules
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage fraud rules" ON public.fraud_rules
    FOR ALL TO authenticated USING (public.is_system_admin(auth.uid()));

-- 5.13 Fraud Alerts Policies
CREATE POLICY "Relevant users can view alerts" ON public.fraud_alerts
    FOR SELECT TO authenticated
    USING (
        assigned_to = auth.uid()
        OR public.is_system_admin(auth.uid())
        OR public.has_role(auth.uid(), 'anti_corruption')
        OR public.has_role(auth.uid(), 'auditor')
        OR public.has_role(auth.uid(), 'treasury')
    );
CREATE POLICY "Anti-corruption can manage alerts" ON public.fraud_alerts
    FOR ALL TO authenticated
    USING (
        public.has_role(auth.uid(), 'anti_corruption') 
        OR public.is_system_admin(auth.uid())
    );

-- 5.14 Audit Logs Policies (read-only for auditors)
CREATE POLICY "Auditors and admins can view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (
        public.has_role(auth.uid(), 'auditor') 
        OR public.has_role(auth.uid(), 'anti_corruption')
        OR public.is_system_admin(auth.uid())
    );

-- 6. TRIGGERS
-- =====================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_fund_allocations_updated_at BEFORE UPDATE ON public.fund_allocations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_budget_wallets_updated_at BEFORE UPDATE ON public.budget_wallets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_fraud_rules_updated_at BEFORE UPDATE ON public.fraud_rules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_fraud_alerts_updated_at BEFORE UPDATE ON public.fraud_alerts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. SEED DATA
-- =====================================================

-- Default Spending Categories
INSERT INTO public.spending_categories (name, description, is_restricted) VALUES
    ('Salaries & Wages', 'Employee compensation', false),
    ('Office Supplies', 'Stationery and office materials', false),
    ('Travel & Accommodation', 'Business travel expenses', false),
    ('Equipment & Machinery', 'Capital equipment purchases', false),
    ('Professional Services', 'Consulting and legal fees', false),
    ('Utilities', 'Electricity, water, internet', false),
    ('Maintenance & Repairs', 'Building and equipment maintenance', false),
    ('Training & Development', 'Staff training programs', false),
    ('Entertainment', 'Official entertainment expenses', true),
    ('Cash Withdrawal', 'Cash withdrawals - RESTRICTED', true),
    ('Personal Items', 'Personal purchases - RESTRICTED', true),
    ('Gifts & Donations', 'Gifts and charitable donations', true);

-- Default Fraud Rules
INSERT INTO public.fraud_rules (name, description, rule_code, severity, is_blocking, parameters) VALUES
    ('Category Violation', 'Transaction uses forbidden spending category', 'CATEGORY_VIOLATION', 'critical', true, '{}'),
    ('Personal Vendor Detection', 'Vendor bank account matches employee account', 'PERSONAL_VENDOR', 'critical', true, '{}'),
    ('Split Transaction Fraud', 'Multiple small transactions to avoid approval limits', 'SPLIT_TRANSACTION', 'high', false, '{"threshold_count": 3, "time_window_hours": 24, "amount_threshold": 10000}'),
    ('Rapid Budget Depletion', 'Spending more than 40% of budget in less than 20% of project duration', 'RAPID_DEPLETION', 'high', false, '{"budget_threshold_pct": 40, "time_threshold_pct": 20}'),
    ('Round Amount Suspicion', 'Transaction with suspicious round amounts', 'ROUND_AMOUNT', 'medium', false, '{"consecutive_count": 3}'),
    ('After Hours Transaction', 'Transaction initiated outside business hours', 'AFTER_HOURS', 'medium', false, '{"start_hour": 8, "end_hour": 17}'),
    ('Weekend Transaction', 'Transaction initiated on weekend', 'WEEKEND_TRANSACTION', 'medium', false, '{}'),
    ('Repeated Vendor Usage', 'Same vendor used excessively in short period', 'REPEATED_VENDOR', 'medium', false, '{"max_count": 5, "time_window_days": 7}'),
    ('Unregistered Vendor', 'Vendor has no registration or tax reference', 'GHOST_VENDOR', 'critical', true, '{}'),
    ('Blacklisted Vendor', 'Transaction with blacklisted vendor', 'BLACKLISTED_VENDOR', 'critical', true, '{}'),
    ('High Value Transaction', 'Transaction exceeds high-value threshold', 'HIGH_VALUE', 'high', false, '{"threshold": 100000}'),
    ('First Time Vendor', 'First transaction with this vendor', 'FIRST_TIME_VENDOR', 'low', false, '{}');

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fraud_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.budget_wallets;
