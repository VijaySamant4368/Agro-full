-- Run this against the existing live database (schema.sql already has this column for fresh installs).
ALTER TABLE payments ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100);
