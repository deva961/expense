"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { transactionSchema } from "@/schema";

export const getTransactions = async () => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
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
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
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
  const validatedFields = transactionSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Please fill all the required fields!");
  }

  const { amount, transactionType, categoryId, transactionDate } =
    validatedFields.data;

  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existingCategory) {
    throw new Error("No Category Found");
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        categoryId,
        transactionType,
        transactionDate,
      },
    });
    return transaction;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};
