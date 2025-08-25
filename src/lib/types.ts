export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'Free' | 'Starter' | 'Professional';
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
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  trigger: string;
  active: boolean;
}
