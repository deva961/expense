"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateCategory } from "@/actions/category";
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
import { categorySchema } from "@/schema";
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

type Props = {
  triggerName: string;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "link"
    | "ghost"
    | "ultraGhost"
    | null;
  values: {
    id: string;
    name: string;
    notes?: string | null;
    icon?: string | null;
  };
};

export const EditCategoryForm = ({
  values,
  variant = "ultraGhost",
  triggerName,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      notes: "",
      icon: "",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formValues: z.infer<typeof categorySchema>) =>
      await updateCategory(values.id, formValues),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully!");
      form.reset();
      setIsOpen(false);
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(message);
    },
  });

  // 🔄 Reset form values every time the sheet opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: values.name,
        notes: values.notes ?? "",
        icon: values.icon ?? "",
      });
    }
  }, [isOpen, values, form]);

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    mutation.mutate(data);
  };

  const pending = mutation.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="font-normal" variant={variant}>
          {triggerName}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Category</SheetTitle>
        </SheetHeader>
        <div className="mx-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <Required />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Utilities"
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
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={pending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 🧾"
                        {...field}
                        disabled={pending}
                      />
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
            {pending ? <Spinner /> : "Save Changes"}
          </Button>
          <SheetClose asChild>
            <Button type="submit" variant={"outline"}>
              Done
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
