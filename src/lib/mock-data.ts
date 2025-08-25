import { User, BlogPost, EmailTemplate } from './types';

export const users: User[] = [
  {
    id: 'usr_admin',
    name: 'ADMIN',
    email: 'admin@bankconverts.com',
    role: 'admin',
    plan: 'Free',
    usage: { used: 0, total: 5 },
    planRenews: '9/23/2025',
  },
  {
    id: 'usr_001',
    name: 'Satoshi Nakamoto',
    email: 'satoshi@example.com',
    role: 'user',
    plan: 'Professional',
    usage: { used: 450, total: 1000 },
    planRenews: '10/15/2024',
  },
    {
    id: 'usr_002',
    name: 'Vitalik Buterin',
    email: 'vitalik@example.com',
    role: 'user',
    plan: 'Starter',
    usage: { used: 120, total: 400 },
    planRenews: '10/22/2024',
  },
];

export const blogPosts: BlogPost[] = [
    {
        id: 'post_001',
        title: 'How to Maximize Your Financial Data',
        author: 'Admin',
        date: '2024-08-15',
        excerpt: 'Learn the best practices for converting and analyzing your bank statements to gain valuable insights into your financial health...',
        content: 'Learn the best practices for converting and analyzing your bank statements to gain valuable insights into your financial health. In this post, we will cover topics such as choosing the right format, cleaning your data, and using advanced tools for analysis. By the end, you will be able to turn raw data into actionable intelligence.'
    },
    {
        id: 'post_002',
        title: 'Understanding CSV vs. Excel for Financial Analysis',
        author: 'Admin',
        date: '2024-07-30',
        excerpt: 'A deep dive into the pros and cons of each format for your financial needs, helping you decide which is best for your workflow...',
        content: 'A deep dive into the pros and cons of each format for your financial needs, helping you decide which is best for your workflow. We compare CSV and Excel based on file size, compatibility, features, and ease of use. This guide will help you make an informed decision for your financial data management strategy.'
    }
];

export const emailTemplates: EmailTemplate[] = [
    {
        id: 'email_001',
        name: 'Welcome Email',
        subject: 'Welcome to BankConverts!',
        trigger: 'On User Registration',
        active: true,
    },
    {
        id: 'email_002',
        name: 'Usage Limit Warning',
        subject: 'You\'re approaching your monthly limit',
        trigger: 'On 80% Usage',
        active: true,
    },
     {
        id: 'email_003',
        name: 'Subscription Renewal Reminder',
        subject: 'Your BankConverts plan is renewing soon',
        trigger: '7 Days Before Renewal',
        active: false,
    }
];