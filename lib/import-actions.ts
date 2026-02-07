"use server"

import { sql } from "./db"
import { revalidatePath } from "next/cache"

type ExportCategory = {
  id: number
  name: string
  color: string
  icon: string
  icon_type?: "predefined" | "uploaded" | "custom"
  display_order: number
  created_at: string
  updated_at: string
}

type ExportLink = {
  id: number
  title: string
  url: string
  icon_type: "predefined" | "uploaded" | "custom"
  icon_value: string
  category_id: number
  display_order: number
  created_at: string
  updated_at: string
}

type ExportCustomIcon = {
  id: number
  name: string
  data_url: string
  created_at: string
}

type ExportPayload = {
  version?: number
  exported_at?: string
  categories: ExportCategory[]
  links: ExportLink[]
  custom_icons: ExportCustomIcon[]
}

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.length > 0
const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value)

const isCategory = (value: unknown): value is ExportCategory => {
  if (!value || typeof value !== "object") return false
  const category = value as ExportCategory

  return (
    isNumber(category.id) &&
    isNonEmptyString(category.name) &&
    isNonEmptyString(category.color) &&
    isNonEmptyString(category.icon) &&
    isNumber(category.display_order) &&
    isNonEmptyString(category.created_at) &&
    isNonEmptyString(category.updated_at)
  )
}

const isLink = (value: unknown): value is ExportLink => {
  if (!value || typeof value !== "object") return false
  const link = value as ExportLink

  return (
    isNumber(link.id) &&
    isNonEmptyString(link.title) &&
    isNonEmptyString(link.url) &&
    isNonEmptyString(link.icon_type) &&
    isNonEmptyString(link.icon_value) &&
    isNumber(link.category_id) &&
    isNumber(link.display_order) &&
    isNonEmptyString(link.created_at) &&
    isNonEmptyString(link.updated_at)
  )
}

const isCustomIcon = (value: unknown): value is ExportCustomIcon => {
  if (!value || typeof value !== "object") return false
  const icon = value as ExportCustomIcon

  return (
    isNumber(icon.id) &&
    isNonEmptyString(icon.name) &&
    isNonEmptyString(icon.data_url) &&
    isNonEmptyString(icon.created_at)
  )
}

const isValidPayload = (payload: ExportPayload) => {
  if (payload.version !== 1) return false
  if (!Array.isArray(payload.categories) || !Array.isArray(payload.links) || !Array.isArray(payload.custom_icons)) {
    return false
  }

  return (
    payload.categories.every(isCategory) &&
    payload.links.every(isLink) &&
    payload.custom_icons.every(isCustomIcon)
  )
}

export async function importAllData(payload: ExportPayload) {
  if (!payload || !isValidPayload(payload)) {
    throw new Error("Invalid import file format")
  }

  try {
    await sql`DELETE FROM links`
    await sql`DELETE FROM custom_icons`
    await sql`DELETE FROM categories`

    for (const category of payload.categories) {
      await sql`
        INSERT INTO categories (id, name, color, icon, icon_type, display_order, created_at, updated_at)
        VALUES (
          ${category.id},
          ${category.name},
          ${category.color},
          ${category.icon},
          ${category.icon_type || "predefined"},
          ${category.display_order},
          ${category.created_at},
          ${category.updated_at}
        )
      `
    }

    for (const link of payload.links) {
      await sql`
        INSERT INTO links (
          id, title, url, icon_type, icon_value, category_id, display_order, created_at, updated_at
        )
        VALUES (
          ${link.id},
          ${link.title},
          ${link.url},
          ${link.icon_type},
          ${link.icon_value},
          ${link.category_id},
          ${link.display_order},
          ${link.created_at},
          ${link.updated_at}
        )
      `
    }

    for (const icon of payload.custom_icons) {
      await sql`
        INSERT INTO custom_icons (id, name, data_url, created_at)
        VALUES (${icon.id}, ${icon.name}, ${icon.data_url}, ${icon.created_at})
      `
    }

    revalidatePath("/")

    return {
      categories: payload.categories.length,
      links: payload.links.length,
      custom_icons: payload.custom_icons.length,
    }
  } catch (error) {
    console.error("Failed to import data:", error)
    throw new Error("Failed to import data")
  }
}