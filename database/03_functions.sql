-- Function to generate the next service request number
CREATE OR REPLACE FUNCTION generate_service_request_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    year_prefix TEXT;
BEGIN
    year_prefix := to_char(CURRENT_DATE, 'YY');
    
    SELECT COALESCE(MAX(NULLIF(regexp_replace(request_number, '^SR\d{2}', ''), '')), '0')::INTEGER + 1
    INTO next_number
    FROM service_requests
    WHERE request_number LIKE 'SR' || year_prefix || '%';
    
    RETURN 'SR' || year_prefix || LPAD(next_number::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate the next requisition number
CREATE OR REPLACE FUNCTION generate_requisition_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    year_prefix TEXT;
BEGIN
    year_prefix := to_char(CURRENT_DATE, 'YY');
    
    SELECT COALESCE(MAX(NULLIF(regexp_replace(requisition_number, '^REQ\d{2}', ''), '')), '0')::INTEGER + 1
    INTO next_number
    FROM requisitions
    WHERE requisition_number LIKE 'REQ' || year_prefix || '%';
    
    RETURN 'REQ' || year_prefix || LPAD(next_number::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate the next asset number
CREATE OR REPLACE FUNCTION generate_asset_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
BEGIN
    SELECT COALESCE(MAX(NULLIF(regexp_replace(asset_number, '^A', ''), '')), '0')::INTEGER + 1
    INTO next_number
    FROM assets;
    
    RETURN 'A' || LPAD(next_number::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;
