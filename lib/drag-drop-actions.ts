"use server"

import { sql } from "./db"
import { revalidatePath } from "next/cache"

export async function updateLinksOrder(linkIds: number[]) {
  try {
    // Update each link's display_order based on its position in the array
    for (let i = 0; i < linkIds.length; i++) {
      await sql`
        UPDATE links 
        SET display_order = ${i + 1}, updated_at = datetime('now')
        WHERE id = ${linkIds[i]}
      `
    }
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to update links order:", error)
    throw new Error("Failed to update links order")
  }
}

export async function getLinksOrderedByPosition() {
  try {
    const links = await sql`
      SELECT * FROM links 
      ORDER BY display_order ASC, created_at ASC
    `
    return links
  } catch (error) {
    console.error("Failed to fetch ordered links:", error)
    return []
  }
}
