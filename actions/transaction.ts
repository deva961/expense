"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { transactionSchema } from "@/schema";

import { subDays, subMonths } from "date-fns";
import { getSession } from "@/lib/get-session";

export const getTransactionsChart = async ({
  type,
}: // transactionType,
{
  type: "ONE_MONTH" | "THREE_MONTH" | "WEEK";
  // transactionType?: "INCOME" | "EXPENSE";
}) => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized!");
  }

  let filterDate = (() => {
    switch (type) {
      case "WEEK":
        return subDays(new Date(), 7); // Get the date from 1 week ago
      case "THREE_MONTH":
        return subMonths(new Date(), 3); // Get the date from 3 month ago
      default: // "ONE_MONTH"
        return subMonths(new Date(), 1); // Get the date from 1 months ago
    }
  })();

  const whereClause: any = {
    userId: session.user.id,
    transactionDate: {
      gte: filterDate,
    },
  };

  // if (transactionType) {
  //   whereClause.transactionType = transactionType;
  // }

  try {
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: {
        transactionDate: "desc",
      },
      include: {
        category: true,
      },
    });
    return transactions;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};

export const getTransactions = async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized!");
  }

  const oneMonthAgo = subMonths(new Date(), 1); // Get the date from 1 month ago

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        transactionDate: {
          gte: oneMonthAgo,
        },
      },
      orderBy: {
        transactionDate: "desc",
      },
      include: {
        category: true,
      },
    });
    return transactions;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};

export const getTransactionById = async (id: string) => {
  const session = await getSession();
  if (!session) {
    return { message: "Unauthorized!", status: 401 };
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });
    return transaction;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};

export const createTransaction = async (
  values: z.infer<typeof transactionSchema>
) => {
  const session = await getSession();
  if (!session) {
    return { message: "Unauthorized!", status: 401 };
  }

  const validatedFields = transactionSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Please fill all the required fields!");
  }

  const { name, amount, transactionType, categoryId, notes, transactionDate } =
    validatedFields.data;

  // Convert transactionDate to a Date object
  const parsedTransactionDate = new Date(transactionDate);

  if (isNaN(parsedTransactionDate.getTime())) {
    throw new Error("Invalid transaction date!");
  }

  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId, userId: session.user.id },
  });

  if (!existingCategory) {
    throw new Error("No Category Found");
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        name,
        amount,
        categoryId,
        transactionType,
        notes,
        transactionDate: parsedTransactionDate,
        userId: session.user.id,
      },
    });
    return transaction;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};
