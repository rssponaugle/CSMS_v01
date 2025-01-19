-- Rename purchase_cost to purchase_price in assets table
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'assets'
        AND column_name = 'purchase_cost'
    ) THEN
        ALTER TABLE assets RENAME COLUMN purchase_cost TO purchase_price;
    END IF;
END $$;

-- Add new columns to assets table
ALTER TABLE assets
ADD COLUMN IF NOT EXISTS warranty_expiry timestamp with time zone,
ADD COLUMN IF NOT EXISTS in_service_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS where_used text;
