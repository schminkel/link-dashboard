import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }

export interface Link {
  id: number
  title: string
  url: string
  created_at: string
  updated_at: string
  icon_type: "predefined" | "uploaded" | "custom"
  icon_value: string
  display_order: number
  category_id: number
}

export interface CustomIcon {
  id: number
  name: string
  data_url: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  color: string
  icon: string
  icon_type?: "predefined" | "uploaded" | "custom"
  display_order: number
  created_at: string
  updated_at: string
}
