-- Create the categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50) DEFAULT 'folder',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, color, icon, display_order) VALUES
  ('General', '#3B82F6', 'folder', 1),
  ('Work', '#10B981', 'briefcase', 2),
  ('Personal', '#F59E0B', 'user', 3),
  ('Resources', '#8B5CF6', 'book-open', 4)
ON CONFLICT (name) DO NOTHING;

-- Add category_id to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) DEFAULT 1;

-- Update existing links to have the default category
UPDATE links SET category_id = 1 WHERE category_id IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_links_category_id ON links(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
