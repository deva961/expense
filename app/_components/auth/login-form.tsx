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

import { CircleCheckBig, Eye, EyeOff, TriangleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Spinner } from "@/components/spinner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/schema/auth-schema";

export const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const searchParams = useSearchParams();

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const { email, password } = values;
    const nextPage = searchParams.get("redirect") || "/admin";

    await authClient.signIn.email(
      {
        email,
        password,
        /**
         * a url to redirect to after the user verifies their email (optional)
         */
        callbackURL: nextPage,
      },
      {
        onSuccess: (ctx) => {
          setError(null);
          form.reset();
          setMessage(ctx.response.statusText);
        },
        onError: (ctx) => {
          setMessage(null);
          if (ctx.error.status === 403) {
            setError("Please verify your email address");
            form.reset();
          } else {
            setError(ctx.error.message);
          }
        },
      }
    );
  }

  // Render error or success messages
  const renderMessage = () => {
    if (!error && !message) return null;

    return (
      <div
        className={cn(
          error
            ? "bg-red-300/20 text-red-600"
            : "bg-green-300/20 text-green-600",
          "flex items-center justify-center text-sm mb-5 p-2.5 rounded-lg"
        )}
      >
        {message && (
          <>
            <CircleCheckBig className="h-5 w-5 mr-2" /> {message}
          </>
        )}
        {error && (
          <>
            <TriangleAlert className="h-4 w-4 mr-1.5" /> {error}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {renderMessage()}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    autoFocus
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
              <FormItem className="gap-0">
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Button
                    asChild
                    variant={"link"}
                    className="text-muted-foreground focus-visible:shadow-none focus-visible:outline-none text-xs sm:text-sm"
                  >
                    <Link href="/forgot-password">Forgot your password?</Link>
                  </Button>
                </div>
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

          <Button type="submit" disabled={isSubmitting} className="flex w-full">
            {isSubmitting ? <Spinner /> : "Login"}
          </Button>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?&nbsp;
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign Up
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
};
