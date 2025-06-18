"use server";

import { z } from "zod";

import { prisma } from "@/lib/db";
import { categorySchema } from "@/schema";
import { getSession } from "@/lib/get-session";

// Fetch zero or more Categories
export const getCategories = async () => {
  const session = await getSession();
  if (!session) {
    return { message: "Unauthorized!", status: 401 };
  }

  try {
    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return { categories, status: 200, message: "success" };
  } catch (error) {
    console.error(error);
    return { message: "Something went wrong!", status: 500 };
  }
};

// Fetch category by ID
export const getCategoryById = async (id: string) => {
  const session = await getSession();
  if (!session) {
    return { message: "Unauthorized!", status: 401 };
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id, userId: session.user.id },
    });
    if (!category) {
      return { message: "Category not found", status: 404 };
    }
    return { category, status: 200, message: "success" };
  } catch (error) {
    console.error(error);
    return { message: "Something went wrong!", status: 500 };
  }
};

// Create a category
export const createCategory = async (
  values: z.infer<typeof categorySchema>
) => {
  const session = await getSession();
  if (!session) {
    return { message: "Unauthorized!", status: 401 };
  }

  const validatedFields = categorySchema.safeParse(values);
  if (!validatedFields.success) {
    return { message: "Invalid input data", status: 400 };
  }

  const { name, notes, icon } = validatedFields.data;
  try {
    const category = await prisma.category.create({
      data: { name, notes, icon, userId: session.user.id },
    });
    return { category, status: 201, message: "Category created successfully" };
  } catch (error) {
    console.error(error);
    return { message: "Something went wrong!", status: 500 };
  }
};

// Update a category
export const updateCategory = async (
  id: string,
  values: z.infer<typeof categorySchema>
) => {
  const session = await getSession();
  if (!session) {
    return { message: "Unauthorized!", status: 401 };
  }

  const { name, notes, icon } = values;
  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id, userId: session.user.id },
    });
    if (!existingCategory) {
      return { message: "Category not found!", status: 404 };
    }

    const updatedCategory = await prisma.category.update({
      where: { id, userId: session.user.id },
      data: { name, notes, icon },
    });
    return {
      updatedCategory,
      status: 200,
      message: "Category updated successfully",
    };
  } catch (error) {
    console.error(error);
    return { message: "Something went wrong!", status: 500 };
  }
};

// Delete a category
export const deleteCategory = async (id: string) => {
  const session = await getSession();
  if (!session) {
    return { message: "Unauthorized!", status: 401 };
  }

  try {
    // Ensure to handle delete of related transactions properly
    const result = await prisma.$transaction([
      prisma.transaction.deleteMany({
        where: { categoryId: id, userId: session.user.id },
      }),
      prisma.category.delete({ where: { id } }),
    ]);

    if (!result) {
      return { message: "Category not found", status: 404 };
    }

    return { message: "Category deleted successfully", status: 200 };
  } catch (error) {
    console.error("Delete category failed:", error);
    return { message: "Something went wrong!", status: 500 };
  }
};
