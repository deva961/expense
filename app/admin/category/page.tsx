"use client";

import { getCategories } from "@/actions/category";
import { CreateCategoryForm } from "@/app/_components/category/create-category";
import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/data-table";
import { Category } from "@/types";
import { useEffect, useState } from "react";
import { Columns } from "./columns";

const Categories = () => {
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);

  // Queries
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (data?.categories) {
      setCategoriesData(data.categories);
    }
  }, [data]); // This ensures we update the state only when `data` changes

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-end">
        <CreateCategoryForm />
      </div>
      <DataTable columns={Columns} data={categoriesData} />
    </div>
  );
};

export default Categories;
