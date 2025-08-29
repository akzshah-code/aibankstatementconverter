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
  planRenews: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string; // Full content for the blog post page
  featuredImage?: string; // Store the name or path of the image
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
  description: string;
  amount: number;
  currency: string;
  type: 'Credit' | 'Debit';
}