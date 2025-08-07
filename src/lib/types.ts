export interface Transaction {
  date: string;
  narration: string;
  refNo: string | null;
  valueDate: string;
  withdrawalAmt: number | null;
  depositAmt: number | null;
  closingBalance: number;
}

// --- New Types for User Accounts and Subscriptions ---

export type PlanName = 'Free' | 'Starter' | 'Professional' | 'Business';

export interface Plan {
  name: PlanName;
  priceMonthly: number;
  priceAnnual: number;
  pagesPerMonth: number;
}

export interface Subscription {
  planName: PlanName;
  pagesQuota: number;
  pagesUsed: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
  isAnnual: boolean;
}

export interface ConversionHistoryItem {
  id: string;
  date: string; // ISO string
  fileName: string;
  pages: number;
  status: 'Completed' | 'Failed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: Subscription;
  history: ConversionHistoryItem[];
}
