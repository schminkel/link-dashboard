"use server"

import { sql } from "./db"
import { revalidatePath } from "next/cache"

export async function getCategories() {
  try {
    const categories = await sql`
      SELECT * FROM categories 
      ORDER BY display_order ASC, created_at ASC
    `
    return categories
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string
  const color = (formData.get("color") as string) || "#3B82F6"
  const icon = (formData.get("icon") as string) || "folder"
  const iconType = (formData.get("icon_type") as "predefined" | "uploaded" | "custom") || "predefined"

  if (!name) {
    throw new Error("Category name is required")
  }

  try {
    // Get the next display_order value
    const maxOrderResult = await sql`
      SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM categories
    `
    const nextOrder = maxOrderResult[0]?.next_order || 1

    await sql`
      INSERT INTO categories (name, color, icon, icon_type, display_order)
      VALUES (${name}, ${color}, ${icon}, ${iconType}, ${nextOrder})
    `
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to create category:", error)
    if (error instanceof Error && error.message.includes("unique")) {
      throw new Error("A category with this name already exists")
    }
    throw new Error("Failed to create category")
  }
}

export async function updateCategory(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const color = formData.get("color") as string
  const icon = formData.get("icon") as string
  const iconType = (formData.get("icon_type") as "predefined" | "uploaded" | "custom") || "predefined"

  if (!id || !name) {
    throw new Error("ID and name are required")
  }

  try {
    await sql`
      UPDATE categories 
      SET name = ${name}, color = ${color}, icon = ${icon}, icon_type = ${iconType}, updated_at = datetime('now')
      WHERE id = ${Number.parseInt(id)}
    `
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to update category:", error)
    if (error instanceof Error && error.message.includes("unique")) {
      throw new Error("A category with this name already exists")
    }
    throw new Error("Failed to update category")
  }
}

export async function deleteCategory(id: number) {
  try {
    // Check if category has links
    const linksCount = await sql`
      SELECT COUNT(*) as count FROM links WHERE category_id = ${id}
    `

    if (linksCount[0]?.count > 0) {
      // Move links to default category (id: 1) before deleting
      await sql`
        UPDATE links SET category_id = 1 WHERE category_id = ${id}
      `
    }

    await sql`
      DELETE FROM categories WHERE id = ${id}
    `
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to delete category:", error)
    throw new Error("Failed to delete category")
  }
}

export async function updateCategoriesOrder(categoryIds: number[]) {
  try {
    for (let i = 0; i < categoryIds.length; i++) {
      await sql`
        UPDATE categories 
        SET display_order = ${i + 1}, updated_at = datetime('now')
        WHERE id = ${categoryIds[i]}
      `
    }
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to update categories order:", error)
    throw new Error("Failed to update categories order")
  }
}

export async function getLinksByCategory(categoryId: number) {
  try {
    const links = await sql`
      SELECT * FROM links 
      WHERE category_id = ${categoryId}
      ORDER BY display_order ASC, created_at ASC
    `
    return links
  } catch (error) {
    console.error("Failed to fetch links by category:", error)
    return []
  }
}
