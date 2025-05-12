"use client";

import { useQuery } from "@tanstack/react-query";

import { getTransactions } from "@/actions/transaction";
import { DataTable } from "@/components/data-table";
import { Columns } from "./columns";

const Transactions = () => {
  // Queries
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="space-y-2.5">
      <DataTable columns={Columns} data={data} />
    </div>
  );
};

export default Transactions;
