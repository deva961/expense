import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string({
      required_error: "Please enter a valid name",
    })
    .trim()
    .min(2, {
      message: "Category must be at least 2 characters.",
    }),
  notes: z.string().optional(),
  icon: z.string().optional(),
});

export const transactionSchema = z.object({
  name: z
    .string({
      required_error: "Please enter a valid name",
    })
    .min(2, {
      message: "Please enter a valid name",
    }),
  amount: z
    .string({
      required_error: "Please enter a valid amount",
    })
    .trim()
    .min(1, {
      message: "Amount must be at least 1 characters.",
    }),
  notes: z.string().optional(),
  transactionDate: z.string().transform((val) => new Date(val).toISOString()),
  transactionType: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string(),
});
