-- Create the custom_icons table
CREATE TABLE IF NOT EXISTS custom_icons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  data_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_custom_icons_created_at ON custom_icons(created_at DESC);
