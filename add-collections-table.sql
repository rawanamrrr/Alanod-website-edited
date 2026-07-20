-- Collections table: admin-managed collection cards (name + image) shown on the home page
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Anyone can read active collections (used to render the public home page)
CREATE POLICY "Collections are viewable by everyone"
  ON collections FOR SELECT
  USING (true);

-- Seed the two existing collections so the home page isn't empty right after migration
INSERT INTO collections (name, image_url, display_order, is_active)
VALUES
  ('WS26', '/Alanod-bg.jpeg', 0, true),
  ('FW26', '/Alanod-bg.jpeg', 1, true);
