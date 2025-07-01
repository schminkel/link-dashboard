-- Create the links table
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO links (title, url) VALUES
  ('GitHub', 'https://github.com'),
  ('Vercel', 'https://vercel.com'),
  ('Next.js Documentation', 'https://nextjs.org/docs'),
  ('Tailwind CSS', 'https://tailwindcss.com'),
  ('shadcn/ui', 'https://ui.shadcn.com')
ON CONFLICT DO NOTHING;
