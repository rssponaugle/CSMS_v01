-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    type text NOT NULL,
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Add type constraint if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'categories_type_check') THEN
        ALTER TABLE categories
        ADD CONSTRAINT categories_type_check 
        CHECK (type IN ('Equipment', 'Facility', 'Tool', 'Other'));
    END IF;
END $$;
