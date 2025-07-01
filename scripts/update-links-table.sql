-- Add icon column to existing links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS icon_type VARCHAR(20) DEFAULT 'predefined';
ALTER TABLE links ADD COLUMN IF NOT EXISTS icon_value TEXT DEFAULT 'link';

-- Update existing records to have default icon
UPDATE links SET icon_type = 'predefined', icon_value = 'link' WHERE icon_type IS NULL;
