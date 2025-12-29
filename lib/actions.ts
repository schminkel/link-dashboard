"use server"

import { sql } from "./db"
import { revalidatePath } from "next/cache"

export async function getLinks() {
  try {
    const links = await sql`
      SELECT l.*, c.name as category_name, c.color as category_color
      FROM links l
      LEFT JOIN categories c ON l.category_id = c.id
      ORDER BY l.display_order ASC, l.created_at ASC
    `
    return links
  } catch (error) {
    console.error("Failed to fetch links:", error)
    return []
  }
}

export async function getLinksByCategory(categoryId: number) {
  try {
    const links = await sql`
      SELECT l.*, c.name as category_name, c.color as category_color
      FROM links l
      LEFT JOIN categories c ON l.category_id = c.id
      WHERE l.category_id = ${categoryId}
      ORDER BY l.display_order ASC, l.created_at ASC
    `
    return links
  } catch (error) {
    console.error("Failed to fetch links by category:", error)
    return []
  }
}

export async function createLink(formData: FormData) {
  const title = formData.get("title") as string
  const url = formData.get("url") as string
  const iconType = (formData.get("iconType") as string) || "predefined"
  const iconValue = (formData.get("iconValue") as string) || "link"
  const categoryId = Number.parseInt((formData.get("categoryId") as string) || "1")

  // Ensure iconType is valid
  const validIconType = ["predefined", "uploaded", "custom"].includes(iconType) ? iconType : "predefined"

  if (!title || !url) {
    throw new Error("Title and URL are required")
  }

  try {
    // Get the next display_order value for this category
    const maxOrderResult = await sql`
      SELECT COALESCE(MAX(display_order), 0) + 1 as next_order 
      FROM links 
      WHERE category_id = ${categoryId}
    `
    const nextOrder = maxOrderResult[0]?.next_order || 1

    await sql`
      INSERT INTO links (title, url, icon_type, icon_value, category_id, display_order)
      VALUES (${title}, ${url}, ${validIconType}, ${iconValue}, ${categoryId}, ${nextOrder})
    `
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to create link:", error)
    throw new Error("Failed to create link")
  }
}

export async function updateLink(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const url = formData.get("url") as string
  const iconType = formData.get("iconType") as string
  const iconValue = formData.get("iconValue") as string
  const categoryId = Number.parseInt((formData.get("categoryId") as string) || "1")

  // Ensure iconType is valid
  const validIconType = ["predefined", "uploaded", "custom"].includes(iconType) ? iconType : "predefined"

  if (!id || !title || !url) {
    throw new Error("ID, title, and URL are required")
  }

  try {
    await sql`
      UPDATE links 
      SET title = ${title}, url = ${url}, icon_type = ${validIconType}, 
          icon_value = ${iconValue}, category_id = ${categoryId}, updated_at = datetime('now')
      WHERE id = ${Number.parseInt(id)}
    `
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to update link:", error)
    throw new Error("Failed to update link")
  }
}

export async function deleteLink(id: number) {
  try {
    await sql`
      DELETE FROM links WHERE id = ${id}
    `
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to delete link:", error)
    throw new Error("Failed to delete link")
  }
}
