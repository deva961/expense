"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsChart } from "@/actions/transaction";

const chartConfig: ChartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Expense",
    color: "var(--chart-2)",
  },
};

function transformTransactionsToChartData(transactions: any[]) {
  const dailyMap: Record<string, { income: number; expense: number }> = {};

  for (const transaction of transactions) {
    const date = new Date(transaction.transactionDate)
      .toISOString()
      .split("T")[0]; // fix here
    const amount = parseFloat(transaction.amount);

    if (!dailyMap[date]) {
      dailyMap[date] = { income: 0, expense: 0 };
    }

    if (transaction.transactionType === "INCOME") {
      dailyMap[date].income += amount;
    } else if (transaction.transactionType === "EXPENSE") {
      dailyMap[date].expense += amount;
    }
  }

  return Object.entries(dailyMap)
    .map(([date, { income, expense }]) => ({
      date,
      income,
      expense,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function ChartAreaInteractive() {
  const [type, setType] = React.useState<"WEEK" | "ONE_MONTH" | "THREE_MONTH">(
    "THREE_MONTH"
  );

  const transactionsQuery = useQuery({
    queryKey: ["transactions_chart", type],
    queryFn: () => getTransactionsChart({ type }),
  });

  const transformedData = React.useMemo(() => {
    if (!transactionsQuery.data) return [];
    return transformTransactionsToChartData(transactionsQuery.data);
  }, [transactionsQuery.data]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Cash Flow</CardTitle>
          <CardDescription>
            Income and expense trends over selected period.
          </CardDescription>
        </div>
        <Select
          value={type}
          onValueChange={(val) => setType(val as typeof type)}
        >
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue placeholder="Select Time Range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="THREE_MONTH">Last 3 months</SelectItem>
            <SelectItem value="ONE_MONTH">Last 30 days</SelectItem>
            <SelectItem value="WEEK">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={transformedData}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="expense"
              type="natural"
              fill="url(#fillExpense)"
              stroke="var(--color-expense)"
              stackId="a"
            />
            <Area
              dataKey="income"
              type="natural"
              fill="url(#fillIncome)"
              stroke="var(--color-income)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
