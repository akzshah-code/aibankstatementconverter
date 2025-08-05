export interface Transaction {
  date: string;
  narration: string;
  refNo: string | null;
  valueDate: string;
  withdrawalAmt: number | null;
  depositAmt: number | null;
  closingBalance: number;
}
