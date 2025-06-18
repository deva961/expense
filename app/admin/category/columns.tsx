"use client";

import { deleteCategory } from "@/actions/category";
import { EditCategoryForm } from "@/app/_components/category/edit-category";
import { AlertButton } from "@/components/confirm-popup";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Columns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <EditCategoryForm
          triggerName={row.original.name}
          values={row.original}
        />
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  // {
  //   accessorKey: "icon",
  //   header: "Icon",
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <ActionButtons row={row} />;
    },
  },
];

export const ActionButtons = ({ row }: { row: Row<Category> }) => {
  const item = row.original;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully!");
    },
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:!bg-destructive/10 hover:!text-destructive"
            onClick={() => setIsOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertButton
        key={item.id}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        status={mutation.isPending}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your data."
        actionBtn={() => handleDelete(item.id)}
      />
    </>
  );
};
