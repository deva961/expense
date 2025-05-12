"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Transaction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return <>{row.original.amount}</>;
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "icon",
    header: "Icon",
  },
];
