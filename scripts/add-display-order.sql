-- Add display_order column to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Set initial display_order values based on creation date
UPDATE links 
SET display_order = subquery.row_num 
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num 
  FROM links 
  WHERE display_order IS NULL
) AS subquery 
WHERE links.id = subquery.id AND links.display_order IS NULL;

-- Create index for faster ordering queries
CREATE INDEX IF NOT EXISTS idx_links_display_order ON links(display_order);
