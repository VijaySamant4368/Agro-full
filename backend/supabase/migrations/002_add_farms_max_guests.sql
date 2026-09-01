-- Run this against the existing live database (schema.sql already has this column for fresh installs).
-- Backfills existing farms with a default capacity of 10 seats.
ALTER TABLE farms ADD COLUMN IF NOT EXISTS max_guests INT NOT NULL DEFAULT 10 CHECK (max_guests > 0);
