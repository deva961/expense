import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export const signupSchema = z
  .object({
    name: z
      .string({
        required_error: "Please enter a valid name",
      })
      .min(3, {
        message: "Please enter a valid name",
      }),
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(2, {
      message: "Confirm password must be at least 2 characters.",
    }),
    image: z.string().url().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
