"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Transaction } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

import { EditTransactionForm } from "@/app/_components/transaction/edit-transaction";
import { AlertButton } from "@/components/confirm-popup";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { EditableCell } from "../category/editable-cell";

export const Columns: ColumnDef<Transaction>[] = [
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
        <EditableCell
          value={row.original.name}
          onChange={(newValue) => {
            console.log("New name:", newValue);
          }}
        />
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <EditTransactionForm
          triggerName={row.original.category.name}
          values={row.original}
        />
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return <>${row.original.amount}</>;
    },
  },
  {
    accessorKey: "transactionType",
    header: "Transaction Type",
    cell: ({ row }) => {
      return <>{row.original.transactionType}</>;
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "transactionDate",
    header: "Transaction Date",
    cell: ({ row }) => {
      return (
        <> {format(new Date(row.original.transactionDate), "MMM d, yyyy")}</>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <ActionButtons row={row} />;
    },
  },
];

export const ActionButtons = ({ row }: { row: Row<Transaction> }) => {
  const item = row.original;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      // await deleteCategory(id);
      console.log(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully!");
    },
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  // if (editTabOpen) {
  //   return (
  //     <EditCategoryForm triggerName={row.original.name} values={row.original} />
  //   );
  // }

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
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
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
