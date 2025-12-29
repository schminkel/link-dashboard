import Database from "better-sqlite3"
import path from "path"

// Initialize SQLite database
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "database.db")
const db = new Database(dbPath)

// Enable foreign keys
db.pragma("foreign_keys = ON")

// Helper function to convert template literal style to prepared statements
export function sql(strings: TemplateStringsArray, ...values: any[]) {
  // Build the SQL query by replacing template placeholders with ?
  let query = strings[0]
  for (let i = 0; i < values.length; i++) {
    query += "?" + strings[i + 1]
  }
  
  // Execute the query
  try {
    const stmt = db.prepare(query)
    
    // Determine if it's a SELECT query or a modification query
    const isSelect = query.trim().toUpperCase().startsWith("SELECT")
    
    if (isSelect) {
      return stmt.all(...values)
    } else {
      return stmt.run(...values)
    }
  } catch (error) {
    console.error("SQL Error:", error)
    console.error("Query:", query)
    console.error("Values:", values)
    throw error
  }
}

export { db }

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
