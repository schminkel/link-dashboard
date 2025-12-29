# SQLite Quick Start

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Build native bindings:**
   
   `better-sqlite3` requires native C++ bindings. Build them for your system:
   ```bash
   pnpm approve-builds  # Approve better-sqlite3 build scripts
   pnpm rebuild better-sqlite3
   ```

3. **Initialize database:**
   ```bash
   pnpm db:init
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

## Troubleshooting

**Error: "Could not locate the bindings file"**
- Run `pnpm rebuild better-sqlite3` to compile native bindings
- Ensure you have build tools installed (Xcode Command Line Tools on macOS)

**Build script blocked by pnpm**
- Run `pnpm approve-builds` and select `better-sqlite3`

## Configuration

Database is stored in `./data/database.db` by default.

To customize the path, create `.env`:
```bash
DATABASE_PATH=./data/database.db
```

## Database Management

- **Reset database:** Delete `./data/database.db` and run `pnpm db:init`
- **Backup:** Copy `./data/database.db` to safe location
- **View data:** Use [DB Browser for SQLite](https://sqlitebrowser.org/) or similar tool

## File Structure

```
data/
  └── database.db          # SQLite database
schema.sql                 # Database schema
scripts/
  └── init-db.js          # Initialization script
lib/
  └── db.ts               # Database connection
```

Done!
