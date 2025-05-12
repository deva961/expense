"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createCategory } from "@/actions/category";
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
import { Spinner } from "@/components/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionSchema } from "@/schema";

import { Textarea } from "@/components/ui/textarea";
import { Required } from "@/components/required";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { createTransaction } from "@/actions/transaction";

export const CreateTransactionForm = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: "",
      notes: "",
      transactionType: "INCOME",
      transactionDate: "",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction created successfully!");
      form.reset();
      setIsOpen(false);
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong!";
      //   form.setError("name", {
      //     type: "server",
      //     message,
      //   });
      toast.error(message);
    },
  });

  const onSubmit = (values: z.infer<typeof transactionSchema>) => {
    mutation.mutate(values);
  };

  const pending = mutation.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>+ Create</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Category</SheetTitle>
        </SheetHeader>
        <div className="mx-5">
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Amount
                      <Required />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 1200"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transactionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        placeholder="e.g. 🧾"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes </FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={pending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <SheetFooter>
          <Button
            type="submit"
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={pending}
          >
            {pending ? <Spinner /> : "Submit"}
          </Button>
          <SheetClose asChild>
            <Button variant={"outline"}>Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
