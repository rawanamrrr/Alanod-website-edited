-- Optionally link a dashboard collection to a real product category (winter/summer)
-- so its name can drive the section title on the /products page.
-- Run this in your Supabase SQL Editor

ALTER TABLE collections
ADD COLUMN IF NOT EXISTS category TEXT;

COMMENT ON COLUMN collections.category IS 'Optional: "winter" or "summer" — links this collection card to a real product category section on /products';
