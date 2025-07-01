"use server"

import { sql } from "./db"
import { revalidatePath } from "next/cache"

export async function getCustomIcons() {
  try {
    const icons = await sql`
      SELECT * FROM custom_icons 
      ORDER BY created_at DESC
    `
    return icons
  } catch (error) {
    console.error("Failed to fetch custom icons:", error)
    return []
  }
}

export async function getCustomIconById(id: number) {
  try {
    const icons = await sql`
      SELECT * FROM custom_icons 
      WHERE id = ${id}
      LIMIT 1
    `
    return icons[0] || null
  } catch (error) {
    console.error("Failed to fetch custom icon:", error)
    return null
  }
}

export async function saveCustomIcon(name: string, dataUrl: string) {
  if (!name || !dataUrl) {
    throw new Error("Name and data URL are required")
  }

  try {
    await sql`
      INSERT INTO custom_icons (name, data_url)
      VALUES (${name}, ${dataUrl})
    `
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to save custom icon:", error)
    throw new Error("Failed to save custom icon")
  }
}

export async function deleteCustomIcon(id: number) {
  try {
    await sql`
      DELETE FROM custom_icons WHERE id = ${id}
    `
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to delete custom icon:", error)
    throw new Error("Failed to delete custom icon")
  }
}
