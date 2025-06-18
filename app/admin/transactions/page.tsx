"use client";

import { useQuery } from "@tanstack/react-query";

import { getTransactions } from "@/actions/transaction";
import { CreateTransactionForm } from "@/app/_components/transaction/create-transaction";
import { DataTable } from "@/components/data-table";
import { Columns } from "./columns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Transactions = () => {
  // Queries
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  console.log("data", data);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  // Separate the transactions into Income and Expense
  const incomeTransactions = data.filter(
    (item: { transactionType: string }) => item.transactionType === "INCOME"
  );
  const expenseTransactions = data.filter(
    (item: { transactionType: string }) => item.transactionType === "EXPENSE"
  );

  // // Calculate the total amount for Income and Expense
  const totalIncome = incomeTransactions.reduce(
    (acc: number, item: { amount: string }) => acc + parseFloat(item.amount),
    0
  );

  const totalExpense = expenseTransactions.reduce(
    (acc: number, item: { amount: string }) => acc + parseFloat(item.amount),
    0
  );

  // Calculate the profit (Income - Expense)
  const profit = totalIncome - totalExpense;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-end">
        <CreateTransactionForm />
      </div>
      <DataTable columns={Columns} data={data} />

      <div className="max-w-sm mx-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-green-600">Income</TableHead>
              <TableHead className="text-destructive">Expense</TableHead>
              <TableHead className="text-blue-600">Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>${totalIncome.toFixed(2)}</TableCell>
              <TableCell>${totalExpense.toFixed(2)}</TableCell>
              <TableCell>${profit.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Transactions;
