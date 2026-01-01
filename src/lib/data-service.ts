// Data service for FundGuard - handles all data operations
// For demo purposes, uses localStorage to persist data

export interface Transaction {
  id: string;
  description: string;
  vendor: string;
  vendorId?: string;
  amount: number;
  category: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  riskScore: number;
  timestamp: string;
  initiatedBy: string;
  allocationId: string;
  createdAt: string;
}

export interface Allocation {
  id: string;
  name: string;
  department: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  status: "active" | "warning" | "critical";
  allowedCategories: string[];
  createdAt: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  details: string;
  transactionId: string | null;
  timestamp: string;
  status: "open" | "investigating" | "closed";
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  registrationNumber?: string;
  bankAccount?: string;
  taxRegistered: boolean;
  verified: boolean;
  createdAt: string;
}

const STORAGE_KEYS = {
  transactions: "fundguard_transactions",
  allocations: "fundguard_allocations",
  alerts: "fundguard_alerts",
  vendors: "fundguard_vendors",
};

// Initialize with default data if storage is empty
function initializeData() {
  if (!localStorage.getItem(STORAGE_KEYS.transactions)) {
    const defaultTransactions: Transaction[] = [
      {
        id: "TXN-001",
        description: "Office Equipment Purchase",
        vendor: "Tech Solutions Namibia",
        vendorId: "VND-001",
        amount: 45000,
        category: "Equipment",
        status: "approved",
        riskScore: 15,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        initiatedBy: "Maria Shikongo",
        allocationId: "ALLOC-001",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "TXN-002",
        description: "Consulting Services",
        vendor: "Windhoek Consulting",
        vendorId: "VND-002",
        amount: 125000,
        category: "Services",
        status: "pending",
        riskScore: 45,
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        initiatedBy: "Peter Nghipondoka",
        allocationId: "ALLOC-001",
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      },
      {
        id: "TXN-003",
        description: "Vehicle Maintenance",
        vendor: "AutoFix Garage",
        vendorId: "VND-003",
        amount: 28500,
        category: "Maintenance",
        status: "flagged",
        riskScore: 72,
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        initiatedBy: "Jonas Amupolo",
        allocationId: "ALLOC-001",
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
      {
        id: "TXN-004",
        description: "Catering Services",
        vendor: "Taste of Namibia",
        vendorId: "VND-004",
        amount: 15000,
        category: "Events",
        status: "rejected",
        riskScore: 88,
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        initiatedBy: "Sarah Haufiku",
        allocationId: "ALLOC-002",
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
      {
        id: "TXN-005",
        description: "Stationery Supplies",
        vendor: "Office Mate",
        vendorId: "VND-005",
        amount: 8500,
        category: "Supplies",
        status: "approved",
        riskScore: 8,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        initiatedBy: "David Munyama",
        allocationId: "ALLOC-002",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(defaultTransactions));
  }

  if (!localStorage.getItem(STORAGE_KEYS.allocations)) {
    const defaultAllocations: Allocation[] = [
      {
        id: "ALLOC-001",
        name: "Infrastructure Development",
        department: "Public Works",
        totalBudget: 5000000,
        spent: 1250000,
        remaining: 3750000,
        status: "active",
        allowedCategories: ["Construction", "Equipment", "Materials"],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "ALLOC-002",
        name: "Healthcare Equipment",
        department: "Ministry of Health",
        totalBudget: 2500000,
        spent: 2125000,
        remaining: 375000,
        status: "warning",
        allowedCategories: ["Medical Equipment", "Supplies"],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "ALLOC-003",
        name: "Education Program",
        department: "Ministry of Education",
        totalBudget: 1800000,
        spent: 1710000,
        remaining: 90000,
        status: "critical",
        allowedCategories: ["Books", "Technology", "Training"],
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.allocations, JSON.stringify(defaultAllocations));
  }

  if (!localStorage.getItem(STORAGE_KEYS.alerts)) {
    const defaultAlerts: Alert[] = [
      {
        id: "ALT-001",
        type: "SPLIT_TRANSACTION",
        severity: "high",
        message: "Split Transaction Pattern Detected",
        details: "3 transactions totaling N$45,000 made within 15 minutes to same vendor",
        transactionId: "TXN-003",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: "open",
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: "ALT-002",
        type: "CATEGORY_VIOLATION",
        severity: "critical",
        message: "Category Violation - Blocked",
        details: "Attempted spending on 'Entertainment' - not allowed for Infrastructure Fund",
        transactionId: "TXN-004",
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        status: "open",
        createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      },
      {
        id: "ALT-003",
        type: "PERSONAL_VENDOR",
        severity: "critical",
        message: "Personal Vendor Detected",
        details: "Vendor bank account matches employee: Jonas Amupolo",
        transactionId: "TXN-003",
        timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
        status: "investigating",
        createdAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
      },
      {
        id: "ALT-004",
        type: "RAPID_DEPLETION",
        severity: "medium",
        message: "Rapid Budget Consumption",
        details: "45% of quarterly budget consumed in first 3 weeks",
        transactionId: null,
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        status: "open",
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
      {
        id: "ALT-005",
        type: "GHOST_VENDOR",
        severity: "high",
        message: "Unregistered Vendor",
        details: "Vendor 'ABC Supplies' has no tax registration on record",
        transactionId: "TXN-007",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: "open",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(defaultAlerts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.vendors)) {
    const defaultVendors: Vendor[] = [
      {
        id: "VND-001",
        name: "Tech Solutions Namibia",
        registrationNumber: "REG-2024-001",
        bankAccount: "1234567890",
        taxRegistered: true,
        verified: true,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "VND-002",
        name: "Windhoek Consulting",
        registrationNumber: "REG-2024-002",
        bankAccount: "0987654321",
        taxRegistered: true,
        verified: true,
        createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "VND-003",
        name: "AutoFix Garage",
        registrationNumber: "REG-2024-003",
        bankAccount: "1122334455",
        taxRegistered: true,
        verified: false,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "VND-004",
        name: "Taste of Namibia",
        registrationNumber: "REG-2024-004",
        bankAccount: "5566778899",
        taxRegistered: true,
        verified: true,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "VND-005",
        name: "Office Mate",
        registrationNumber: "REG-2024-005",
        bankAccount: "9988776655",
        taxRegistered: true,
        verified: true,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.vendors, JSON.stringify(defaultVendors));
  }
}

// Initialize on module load
initializeData();

// Transactions
export const transactionService = {
  getAll: (): Promise<Transaction[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.transactions);
    return Promise.resolve(data ? JSON.parse(data) : []);
  },

  getById: (id: string): Promise<Transaction | null> => {
    const transactions = localStorage.getItem(STORAGE_KEYS.transactions);
    const data = transactions ? JSON.parse(transactions) : [];
    return Promise.resolve(data.find((t: Transaction) => t.id === id) || null);
  },

  create: (transaction: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> => {
    const transactions = transactionService.getAll();
    const newTransaction: Transaction = {
      ...transaction,
      id: `TXN-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    return transactions.then((data) => {
      const updated = [...data, newTransaction];
      localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(updated));
      return newTransaction;
    });
  },

  update: (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
    return transactionService.getAll().then((transactions) => {
      const index = transactions.findIndex((t) => t.id === id);
      if (index === -1) throw new Error("Transaction not found");
      const updated = { ...transactions[index], ...updates };
      transactions[index] = updated;
      localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
      return updated;
    });
  },

  approve: async (id: string): Promise<Transaction> => {
    const transaction = await transactionService.getById(id);
    if (!transaction) throw new Error("Transaction not found");
    
    const updated = await transactionService.update(id, { status: "approved" });
    
    // Update allocation spent amount
    if (transaction.status === "pending" && transaction.allocationId) {
      const allocation = await allocationService.getById(transaction.allocationId);
      if (allocation) {
        await allocationService.update(transaction.allocationId, {
          spent: allocation.spent + transaction.amount,
          remaining: allocation.remaining - transaction.amount,
        });
      }
    }
    
    return updated;
  },

  reject: (id: string): Promise<Transaction> => {
    return transactionService.update(id, { status: "rejected" });
  },
};

// Allocations
export const allocationService = {
  getAll: (): Promise<Allocation[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.allocations);
    return Promise.resolve(data ? JSON.parse(data) : []);
  },

  getById: (id: string): Promise<Allocation | null> => {
    return allocationService.getAll().then((allocations) => {
      return allocations.find((a) => a.id === id) || null;
    });
  },

  create: (allocation: Omit<Allocation, "id" | "createdAt" | "spent" | "remaining" | "status">): Promise<Allocation> => {
    const newAllocation: Allocation = {
      ...allocation,
      id: `ALLOC-${String(Date.now()).slice(-6)}`,
      spent: 0,
      remaining: allocation.totalBudget,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    return allocationService.getAll().then((allocations) => {
      const updated = [...allocations, newAllocation];
      localStorage.setItem(STORAGE_KEYS.allocations, JSON.stringify(updated));
      return newAllocation;
    });
  },

  update: (id: string, updates: Partial<Allocation>): Promise<Allocation> => {
    return allocationService.getAll().then((allocations) => {
      const index = allocations.findIndex((a) => a.id === id);
      if (index === -1) throw new Error("Allocation not found");
      const updated = { ...allocations[index], ...updates };
      
      // Recalculate status based on remaining budget
      const percentUsed = (updated.spent / updated.totalBudget) * 100;
      if (percentUsed >= 95) updated.status = "critical";
      else if (percentUsed >= 80) updated.status = "warning";
      else updated.status = "active";
      
      allocations[index] = updated;
      localStorage.setItem(STORAGE_KEYS.allocations, JSON.stringify(allocations));
      return updated;
    });
  },
};

// Alerts
export const alertService = {
  getAll: (): Promise<Alert[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.alerts);
    return Promise.resolve(data ? JSON.parse(data) : []);
  },

  create: (alert: Omit<Alert, "id" | "createdAt">): Promise<Alert> => {
    const newAlert: Alert = {
      ...alert,
      id: `ALT-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    return alertService.getAll().then((alerts) => {
      const updated = [...alerts, newAlert];
      localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(updated));
      return newAlert;
    });
  },

  update: (id: string, updates: Partial<Alert>): Promise<Alert> => {
    return alertService.getAll().then((alerts) => {
      const index = alerts.findIndex((a) => a.id === id);
      if (index === -1) throw new Error("Alert not found");
      const updated = { ...alerts[index], ...updates };
      alerts[index] = updated;
      localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(alerts));
      return updated;
    });
  },
};

// Vendors
export const vendorService = {
  getAll: (): Promise<Vendor[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.vendors);
    return Promise.resolve(data ? JSON.parse(data) : []);
  },

  create: (vendor: Omit<Vendor, "id" | "createdAt">): Promise<Vendor> => {
    const newVendor: Vendor = {
      ...vendor,
      id: `VND-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    return vendorService.getAll().then((vendors) => {
      const updated = [...vendors, newVendor];
      localStorage.setItem(STORAGE_KEYS.vendors, JSON.stringify(updated));
      return newVendor;
    });
  },
};

// Dashboard stats
export const statsService = {
  getDashboardStats: async () => {
    const [allocations, transactions, alerts] = await Promise.all([
      allocationService.getAll(),
      transactionService.getAll(),
      alertService.getAll(),
    ]);

    const totalAllocated = allocations.reduce((sum, a) => sum + a.totalBudget, 0);
    const today = new Date().toDateString();
    const todayTransactions = transactions.filter(
      (t) => new Date(t.timestamp).toDateString() === today
    );
    const todayAmount = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
    const blockedTransactions = transactions.filter((t) => t.status === "rejected" || t.status === "flagged");
    const blockedAmount = blockedTransactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalAllocated,
      totalAllocations: allocations.length,
      todayTransactions: todayTransactions.length,
      todayAmount,
      activeAlerts: alerts.filter((a) => a.status === "open" || a.status === "investigating").length,
      criticalAlerts: alerts.filter((a) => a.severity === "critical").length,
      highAlerts: alerts.filter((a) => a.severity === "high").length,
      blockedTransactions: blockedTransactions.length,
      blockedAmount,
    };
  },
};

