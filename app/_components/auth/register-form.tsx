"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Spinner } from "@/components/spinner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { CircleCheckBig, Eye, EyeOff, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { signupSchema } from "@/schema/auth-schema";

export const SignUpForm = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    const { name, email, password } = values;

    await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/email-verified",
      },
      {
        onSuccess: () => {
          setError(null);
          setMessage("Verification Email Sent!");
          form.reset();
        },
        onError: (ctx) => {
          setMessage(null);
          setError(ctx.error.message);
        },
      }
    );
  }

  return (
    <>
      {(error || message) && (
        <div
          className={cn(
            error && "bg-red-300/20 text-red-600",
            message && "bg-green-300/20 text-green-600",
            "flex items-center text-center justify-center text-sm mb-5 p-2.5 rounded-lg"
          )}
        >
          {message && (
            <>
              <CircleCheckBig className="h-5 w-5 mr-2" /> {message}!
            </>
          )}
          {error && (
            <>
              <TriangleAlert className="h-4 w-4 mr-1.5" /> {error}!
            </>
          )}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="John Doe"
                    className="focus-visible:ring-0 focus:outline-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="example@user.com"
                    className="focus-visible:ring-0 focus:outline-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex items-center rounded-md border border-input focus-within:ring-1 focus-within:ring-primaryWeb focus-within:border-transparent">
                    <Input
                      disabled={isSubmitting}
                      placeholder="******"
                      className="flex-1 border-none focus:outline-none focus-visible:ring-0"
                      type={passwordVisible ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="px-2 h-6 text-muted-foreground focus-visible:outline-none"
                    >
                      {passwordVisible ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Confirm Password</FormLabel>

                <FormControl>
                  <div className="flex items-center rounded-md border border-input focus-within:ring-1 focus-within:ring-primaryWeb focus-within:border-transparent">
                    <Input
                      disabled={isSubmitting}
                      placeholder="******"
                      className="flex-1 border-none focus:outline-none focus-visible:ring-0"
                      type={passwordVisible ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="px-2 h-6 text-muted-foreground focus-visible:outline-none"
                    >
                      {passwordVisible ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full cursor-pointer"
          >
            {isSubmitting ? <Spinner /> : "Sign Up"}
          </Button>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?&nbsp;
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
};
