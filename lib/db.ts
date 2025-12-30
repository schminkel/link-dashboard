import { createClient } from "@libsql/client"
import Database from "better-sqlite3"
import path from "path"

// Determine if using remote or local database
const isRemote = process.env.DATABASE_URI && process.env.DATABASE_AUTH_TOKEN
let db: any
let client: any

if (isRemote) {
  // Remote LibSQL/Turso connection
  client = createClient({
    url: process.env.DATABASE_URI!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  })
} else {
  // Local SQLite connection
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "database.db")
  db = new Database(dbPath)
  db.pragma("foreign_keys = ON")
}

// Helper function to convert template literal style to prepared statements
export async function sql(strings: TemplateStringsArray, ...values: any[]) {
  // Build the SQL query by replacing template placeholders with ?
  let query = strings[0]
  for (let i = 0; i < values.length; i++) {
    query += "?" + strings[i + 1]
  }
  
  // Execute the query
  try {
    if (isRemote) {
      // Remote LibSQL execution
      const result = await client.execute({
        sql: query,
        args: values,
      })
      return result.rows
    } else {
      // Local SQLite execution
      const stmt = db.prepare(query)
      const isSelect = query.trim().toUpperCase().startsWith("SELECT")
      
      if (isSelect) {
        return stmt.all(...values)
      } else {
        return stmt.run(...values)
      }
    }
  } catch (error) {
    console.error("SQL Error:", error)
    console.error("Query:", query)
    console.error("Values:", values)
    throw error
  }
}

export { db, client }

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
