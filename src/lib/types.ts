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