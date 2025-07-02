-- Add icon_type column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_type VARCHAR(50) DEFAULT 'predefined';
