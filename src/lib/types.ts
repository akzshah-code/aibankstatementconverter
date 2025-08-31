

// FIX: Removed a circular import that was causing a conflict with the local declaration.
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'Free' | 'Starter' | 'Professional' | 'Business';
  usage: {
    used: number;
    total: number;
  };
  dailyUsage: {
    pagesUsed: number;
    resetTimestamp: number;
  };
  planRenews: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string; 
  featuredImage?: string; 
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  trigger: string;
  active: boolean;
}

export interface EmailRoute {
  id: string;
  address: string;
  action: string;
  destination: string;
  active: boolean;
}

export interface ExtractedTransaction {
  date: string;
  valueDate: string;
  description: string;
  reference: string | null;
  debit: number | null;
  credit: number | null;
  balance: number;
  category: string;
}

// --- New Types for Bulk Upload Feature ---

export interface FileState {
    id: string;
    file: File;
    status: 'queued' | 'processing' | 'success' | 'error' | 'locked';
    progress: number;
    transactions: ExtractedTransaction[];
    error: string | null;
    pages: number;
    password: string | null;
}

export interface ConversionResult {
    transactions: number;
    pages: number;
    fileCount: number;
    successfulFiles: number;
    processingTime: number;
}

// AuthUser is a simplified version of the main User type for prop drilling.
// Let's use the main User type and ensure it has all required properties.
export type AuthUser = User;