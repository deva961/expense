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
  amount: z
    .string({
      required_error: "Please enter a valid name",
    })
    .trim()
    .min(2, {
      message: "Category must be at least 2 characters.",
    }),
  notes: z.string().optional(),
  transactionDate: z.string().date(),
  transactionType: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string(),
});
