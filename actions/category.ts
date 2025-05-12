"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/schema";

// Fetch zero or more Categories
export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });
    return {
      categories,
      status: 200,
      message: "success",
    };
  } catch (error) {
    return {
      message: "Something went wrong!",
      status: 500,
    };
  }
};

// Fetch categories by id
export const getCategoryById = async (id: string) => {
  try {
    const categories = await prisma.category.findUnique({
      where: {
        id,
      },
    });
    return {
      categories,
      status: 200,
      message: "success",
    };
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong!");
  }
};

//create a category
export const createCategory = async (
  values: z.infer<typeof categorySchema>
) => {
  const validatedFields = categorySchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Please fill all the required fields!");
  }

  const { name, notes, icon } = validatedFields.data;
  try {
    const existingCategory = await prisma.category.findUnique({
      where: {
        name,
      },
    });

    if (existingCategory) {
      throw new Error("Category already exists!");
    }

    const category = await prisma.category.create({
      data: {
        name,
        notes,
        icon,
      },
    });
    return {
      category,
      status: 200,
      message: "success",
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error?.message || "Something went wrong!");
  }
};

//update category
export const updateCategory = async (
  id: string,
  values: z.infer<typeof categorySchema>
) => {
  const { name, notes, icon } = values;
  try {
    const existingCategory = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!existingCategory) {
      throw new Error("Category not found!");
    }

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        notes,
        icon,
      },
    });
    return {
      category,
      status: 200,
      message: "success",
    };
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};

//delete category
export const deleteCategory = async (id: string) => {
  try {
    await prisma.$transaction([
      prisma.transaction.deleteMany({ where: { categoryId: id } }),
      prisma.category.delete({ where: { id } }),
    ]);

    return {
      status: 200,
      message: "success",
    };
  } catch (error) {
    console.error("Delete category failed:", error);
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
};
