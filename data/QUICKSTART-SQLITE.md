# SQLite Quick Start

## Local vs Remote Database

This project supports both:
- **Local SQLite**: File-based database on your machine
- **Remote LibSQL**: Cloud-hosted database via [Turso](https://turso.tech)

## Setup - Local Database

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

## Setup - Remote Database (Turso)

1. **Configure environment:**
   
   Create `.env` file:
   ```bash
   DATABASE_URI=libsql://your-database.turso.io
   DATABASE_AUTH_TOKEN=your-auth-token-here
   ```

3. **Create database schema:**
   
   Import the schema to Turso:
   ```bash
   turso db import ./link-dashboard-01.db
   ```
   
   Or manually execute the schema using Turso CLI or dashboard.

4. **Start development server:**
   ```bash
   pnpm dev
   ```

## Configuration

### Local Database
Create `.env`:
```bash
DATABASE_PATH=./data/database.db  # Optional, this is the default
```

**Note:** If `DATABASE_URI` and `DATABASE_AUTH_TOKEN` are set, the remote database takes priority.

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
