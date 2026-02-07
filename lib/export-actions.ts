"use server"

import { sql } from "./db"

export async function exportAllData() {
  try {
    const [categories, links, customIcons] = await Promise.all([
      sql`
        SELECT * FROM categories
        ORDER BY display_order ASC, created_at ASC
      `,
      sql`
        SELECT * FROM links
        ORDER BY display_order ASC, created_at ASC
      `,
      sql`
        SELECT * FROM custom_icons
        ORDER BY created_at ASC
      `,
    ])

    return JSON.parse(
      JSON.stringify({
        version: 1,
        exported_at: new Date().toISOString(),
        categories,
        links,
        custom_icons: customIcons,
      })
    )
  } catch (error) {
    console.error("Failed to export data:", error)
    throw new Error("Failed to export data")
  }
}