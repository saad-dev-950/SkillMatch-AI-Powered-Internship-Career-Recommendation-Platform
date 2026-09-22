"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categorySchema, CategoryInput } from "@/lib/validations/category";
import { revalidatePath } from "next/cache";

async function checkAdminAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { isAuthorized: false as const, error: "Unauthorized: Admin privileges required." };
  }
  return { isAuthorized: true as const, session };
}

// 1. Create Category
export async function createCategoryAction(input: CategoryInput) {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.isAuthorized) {
      return { success: false, error: authCheck.error };
    }

    const validated = categorySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid category data" };
    }

    const { name, slug } = validated.data;

    // Check duplicate name or slug
    const existing = await db.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    });

    if (existing) {
      return { success: false, error: "A category with this name or slug already exists." };
    }

    await db.category.create({
      data: { name, slug },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/internships");

    return { success: true, message: "Category created successfully!" };
  } catch (error) {
    console.error("Error in createCategoryAction:", error);
    return { success: false, error: "Failed to create category." };
  }
}

// 2. Update Category
export async function updateCategoryAction(id: string, input: CategoryInput) {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.isAuthorized) {
      return { success: false, error: authCheck.error };
    }

    const validated = categorySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid category data" };
    }

    const { name, slug } = validated.data;

    await db.category.update({
      where: { id },
      data: { name, slug },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/internships");

    return { success: true, message: "Category updated successfully!" };
  } catch (error) {
    console.error("Error in updateCategoryAction:", error);
    return { success: false, error: "Failed to update category." };
  }
}

// 3. Delete Category (Safely handle references)
export async function deleteCategoryAction(id: string) {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.isAuthorized) {
      return { success: false, error: authCheck.error };
    }

    // Check if category is referenced by any internships
    const linkedCount = await db.internship.count({
      where: { categoryId: id },
    });

    if (linkedCount > 0) {
      return {
        success: false,
        error: `Cannot delete category: ${linkedCount} internship listing(s) belong to this category. Please reassign or delete them first.`,
      };
    }

    await db.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/internships");

    return { success: true, message: "Category deleted successfully!" };
  } catch (error) {
    console.error("Error in deleteCategoryAction:", error);
    return { success: false, error: "Failed to delete category." };
  }
}
