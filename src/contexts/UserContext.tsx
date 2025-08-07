import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, Plan, Subscription, PlanName } from '../lib/types';

// --- Hardcoded plan details ---
export const PLANS: Record<PlanName, Plan> = {
  'Free': { name: 'Free', priceMonthly: 0, priceAnnual: 0, pagesPerMonth: 5 },
  'Starter': { name: 'Starter', priceMonthly: 10, priceAnnual: 60, pagesPerMonth: 400 },
  'Professional': { name: 'Professional', priceMonthly: 21, priceAnnual: 126, pagesPerMonth: 1000 },
  'Business': { name: 'Business', priceMonthly: 35, priceAnnual: 210, pagesPerMonth: 4000 },
};

// --- Context Type Definition ---
interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  register: (name: string, email: string) => boolean;
  purchasePlan: (planName: PlanName, isAnnual: boolean) => void;
  recordConversion: (fileName: string, pages: number, status: 'Completed' | 'Failed') => boolean;
  checkAnonymousUsage: () => boolean;
  recordAnonymousUsage: () => void;
  pendingPurchase: PlanName | null;
  setPendingPurchase: (plan: PlanName | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// --- LocalStorage Helper Functions (Simulating a DB) ---
const db = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem('users') || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem('users', JSON.stringify(users)),
  getLoggedInUser: () => JSON.parse(localStorage.getItem('loggedInUser') || 'null'),
  setLoggedInUser: (user: User | null) => localStorage.setItem('loggedInUser', JSON.stringify(user)),
  getAnonymousUsage: (): { count: number; date: string } => JSON.parse(localStorage.getItem('anonymousUsage') || '{"count":0, "date":""}'),
  setAnonymousUsage: (usage: { count: number; date: string }) => localStorage.setItem('anonymousUsage', JSON.stringify(usage)),
};

// --- Provider Component ---
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingPurchase, setPendingPurchase] = useState<PlanName | null>(null);

  useEffect(() => {
    // On initial load, check for a logged-in user from localStorage
    const loggedInUser = db.getLoggedInUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    setLoading(false);
  }, []);

  const updateUserInDb = (updatedUser: User) => {
    const users = db.getUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      db.saveUsers(users);
      db.setLoggedInUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const login = (email: string): boolean => {
    const users = db.getUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      db.setLoggedInUser(foundUser);
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    db.setLoggedInUser(null);
    setUser(null);
    setPendingPurchase(null); // Clear pending purchase on logout
  };

  const register = (name: string, email: string): boolean => {
    const users = db.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false; // User already exists
    }
    const now = new Date();
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      subscription: {
        planName: 'Free',
        pagesQuota: PLANS['Free'].pagesPerMonth,
        pagesUsed: 0,
        startDate: now.toISOString(),
        endDate: new Date(now.setMonth(now.getMonth() + 1)).toISOString(),
        isAnnual: false,
      },
      history: [],
    };
    users.push(newUser);
    db.saveUsers(users);
    return true;
  };

  const purchasePlan = (planName: PlanName, isAnnual: boolean) => {
    if (!user) return;
    const plan = PLANS[planName];
    const now = new Date();
    const endDate = isAnnual
      ? new Date(new Date(now).setFullYear(now.getFullYear() + 1))
      : new Date(new Date(now).setMonth(now.getMonth() + 1));
    
    const newSubscription: Subscription = {
      planName,
      pagesQuota: plan.pagesPerMonth,
      pagesUsed: 0,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      isAnnual,
    };

    const updatedUser = { ...user, subscription: newSubscription, history: [] };
    updateUserInDb(updatedUser);
  };

  const recordConversion = (fileName: string, pages: number, status: 'Completed' | 'Failed'): boolean => {
    if (!user) return false;

    if (status === 'Completed') {
      const remainingPages = user.subscription.pagesQuota - user.subscription.pagesUsed;
      if (pages > remainingPages) return false; // Not enough pages
    }

    const updatedUser = { ...user };
    
    if (status === 'Completed') {
      updatedUser.subscription.pagesUsed += pages;
    }

    const newHistoryItem = {
      id: `hist_${Date.now()}`,
      date: new Date().toISOString(),
      fileName,
      pages,
      status,
    };

    // Keep history for the last 30 days
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    updatedUser.history = [newHistoryItem, ...updatedUser.history].filter(item => new Date(item.date) > thirtyDaysAgo);

    updateUserInDb(updatedUser);
    return true;
  };

  // For anonymous users (1 page per 24 hours)
  const checkAnonymousUsage = (): boolean => {
    const usage = db.getAnonymousUsage();
    const today = new Date().toISOString().split('T')[0];
    if (usage.date !== today) return true; // New day, quota reset
    return usage.count < 1;
  };

  const recordAnonymousUsage = () => {
    let usage = db.getAnonymousUsage();
    const today = new Date().toISOString().split('T')[0];
    if (usage.date !== today) {
      usage = { count: 1, date: today };
    } else {
      usage.count += 1;
    }
    db.setAnonymousUsage(usage);
  };

  const value = { user, loading, login, logout, register, purchasePlan, recordConversion, checkAnonymousUsage, recordAnonymousUsage, pendingPurchase, setPendingPurchase };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// --- Custom Hook ---
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};