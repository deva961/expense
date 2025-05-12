export type Category = {
  id: string;
  name: string;
  icon?: string | null;
  notes?: string | null;
};

export type Transaction = {
  id: string;
  amount: string;
  notes?: string | null;
  transactionDate: Date;
  transactionType: "INCOME" | "EXPENSE";
  category: Category;
};
