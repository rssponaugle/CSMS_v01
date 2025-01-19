-- Insert category types if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Production Equipment') THEN
        INSERT INTO categories (type, name, description)
        VALUES ('Equipment', 'Production Equipment', 'Manufacturing and production related equipment');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Facility Equipment') THEN
        INSERT INTO categories (type, name, description)
        VALUES ('Equipment', 'Facility Equipment', 'Building and facility related equipment');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Test Equipment') THEN
        INSERT INTO categories (type, name, description)
        VALUES ('Equipment', 'Test Equipment', 'Quality control and testing equipment');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Building Systems') THEN
        INSERT INTO categories (type, name, description)
        VALUES ('Facility', 'Building Systems', 'Core building infrastructure systems');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Utilities') THEN
        INSERT INTO categories (type, name, description)
        VALUES ('Facility', 'Utilities', 'Utility systems and components');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Safety Systems') THEN
        INSERT INTO categories (type, name, description)
        VALUES ('Facility', 'Safety Systems', 'Safety and emergency systems');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Hand Tools') THEN
        INSERT INTO categories (type, name, description)
        VALUES ('Tool', 'Hand Tools', 'Manual tools and implements');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Power Tools') THEN
        INSERT INTO categories (type, name, description)
        VALUES ('Tool', 'Power Tools', 'Electrically powered tools');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Specialty Tools') THEN
        INSERT INTO categories (type, name, description)
        VALUES ('Tool', 'Specialty Tools', 'Specialized tools for specific tasks');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Miscellaneous') THEN
        INSERT INTO categories (type, name, description)
        VALUES ('Other', 'Miscellaneous', 'Items that don''t fit other categories');
    END IF;
END $$;
