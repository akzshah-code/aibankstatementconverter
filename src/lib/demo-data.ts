export interface DemoTransaction {
    date: string;
    description: string;
    amount: number;
    currency: string;
    type: 'Credit' | 'Debit';
}

export const demoTransactions: DemoTransaction[] = [
    { date: 'Jul 1, 2024', description: 'ONLINE PAYMENT - AMAZON.COM', amount: -125.50, currency: 'USD', type: 'Debit' },
    { date: 'Jul 2, 2024', description: 'STARBUCKS #12345', amount: -8.75, currency: 'USD', type: 'Debit' },
    { date: 'Jul 3, 2024', description: 'DIRECT DEPOSIT - ACME CORP', amount: 2500.00, currency: 'USD', type: 'Credit' },
    { date: 'Jul 5, 2024', description: 'ATM WITHDRAWAL #9876', amount: -200.00, currency: 'USD', type: 'Debit' },
    { date: 'Jul 6, 2024', description: 'TRANSFER TO SAVINGS ACC 1234', amount: -500.00, currency: 'USD', type: 'Debit' },
    { date: 'Jul 8, 2024', description: 'ZELLE PAYMENT FROM JANE DOE', amount: 75.00, currency: 'USD', type: 'Credit' },
    { date: 'Jul 10, 2024', description: 'UTILITY BILL - POWER & LIGHT', amount: -85.20, currency: 'USD', type: 'Debit' },
    { date: 'Jul 12, 2024', description: 'VENMO PAYMENT - PIZZA NIGHT', amount: -25.00, currency: 'USD', type: 'Debit' },
    { date: 'Jul 15, 2024', description: 'PAYCHECK - ACME CORP', amount: 2500.00, currency: 'USD', type: 'Credit' },
    { date: 'Jul 16, 2024', description: 'SPOTIFY MONTHLY', amount: -10.99, currency: 'USD', type: 'Debit' },
    { date: 'Jul 18, 2024', description: 'GAS STATION - SHELL #555', amount: -45.60, currency: 'USD', type: 'Debit' },
    { date: 'Jul 20, 2024', description: 'GROCERY STORE - KROGER', amount: -150.35, currency: 'USD', type: 'Debit' },
    { date: 'Jul 22, 2024', description: 'ONLINE PURCHASE - EBAY', amount: -32.00, currency: 'USD', type: 'Debit' },
    { date: 'Jul 25, 2024', description: 'MOBILE PHONE BILL - VERIZON', amount: -95.00, currency: 'USD', type: 'Debit' },
    { date: 'Jul 28, 2024', description: 'RESTAURANT - THE CHEESECAKE FACTORY', amount: -65.80, currency: 'USD', type: 'Debit' },
    { date: 'Jul 30, 2024', description: 'INTEREST PAYMENT - SAVINGS', amount: 12.50, currency: 'USD', type: 'Credit' },
];