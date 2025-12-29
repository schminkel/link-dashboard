const Database = require("better-sqlite3")
const fs = require("fs")
const path = require("path")

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, "..", "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize database
const dbPath = path.join(dataDir, "database.db")
const db = new Database(dbPath)

// Read and execute schema
const schemaPath = path.join(__dirname, "..", "schema.sql")
const schema = fs.readFileSync(schemaPath, "utf8")

// Split by semicolon and execute each statement
const statements = schema
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0)

db.exec("PRAGMA foreign_keys = ON;")

for (const statement of statements) {
  try {
    db.exec(statement)
  } catch (error) {
    console.error("Error executing statement:", statement)
    console.error(error)
  }
}

console.log("Database initialized successfully at:", dbPath)
db.close()
