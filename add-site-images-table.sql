-- Site images table: stores editable hero/section image URLs used across the public pages
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS site_images (
  key TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_site_images_updated_at BEFORE UPDATE ON site_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

-- Anyone can read the current site images (used to render public pages)
CREATE POLICY "Site images are viewable by everyone"
  ON site_images FOR SELECT
  USING (true);

-- Only the server (using the service role key) can write; no public insert/update/delete policy is defined.
