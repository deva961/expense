"use client";

import { getTransactions } from "@/actions/transaction";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ChartPieDonutText } from "@/components/chart-pie-donut-text";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  // Queries

  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
  // const categoriessQuery = useQuery({
  //   queryKey: ["categories"],
  //   queryFn: getCategories,
  // });

  if (transactionsQuery.isPending) {
    return (
      <>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </>
    );
  }

  if (transactionsQuery.isError) {
    return (
      <span>
        Error:
        {transactionsQuery.error instanceof Error
          ? transactionsQuery.error.message
          : "An error occurred"}
      </span>
    );
  }

  console.log(transactionsQuery.data);

  // Separate the transactions into Income and Expense
  const incomeTransactions = transactionsQuery.data.filter(
    (item: { transactionType: string }) => item.transactionType === "INCOME"
  );
  const expenseTransactions = transactionsQuery.data.filter(
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

  const getChartData = (txs: any[]) => {
    const map: Record<string, number> = {};

    txs.forEach((tx) => {
      const name = tx.category?.name ?? "Uncategorized";
      const amount = parseFloat(tx.amount);
      map[name] = (map[name] || 0) + amount;
    });

    return Object.entries(map).map(([name, amount]) => ({
      name,
      amount,
    }));
  };

  return (
    <div className="space-y-5">
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Income</CardDescription>
            <CardTitle className={`text-3xl text-green-600`}>
              ${totalIncome}
            </CardTitle>
          </CardHeader>
          {/* <CardContent>
              <p className="text-sm">6.5% up this month</p>
            </CardContent> */}
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Expense</CardDescription>
            <CardTitle className={`text-3xl text-red-600`}>
              ${totalExpense}
            </CardTitle>
          </CardHeader>
          {/* <CardContent>
              <p className="text-sm">6.5% up this month</p>
            </CardContent> */}
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Profit</CardDescription>
            <CardTitle className={`text-3xl text-blue-600`}>
              ${profit}
            </CardTitle>
          </CardHeader>
          {/* <CardContent>
              <p className="text-sm">6.5% up this month</p>
            </CardContent> */}
        </Card>
      </div>

      <ChartAreaInteractive />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartPieDonutText
          title="Income by Category"
          description="Income Sources"
          data={getChartData(incomeTransactions)}
        />
        <ChartPieDonutText
          title="Expense by Category"
          description="Spending Breakdown"
          data={getChartData(expenseTransactions)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
