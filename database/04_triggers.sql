-- Trigger for automatically generating service request numbers
CREATE OR REPLACE FUNCTION set_service_request_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.request_number IS NULL THEN
        NEW.request_number := generate_service_request_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_service_request_number_trigger
    BEFORE INSERT ON service_requests
    FOR EACH ROW
    EXECUTE FUNCTION set_service_request_number();

-- Trigger for automatically generating requisition numbers
CREATE OR REPLACE FUNCTION set_requisition_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.requisition_number IS NULL THEN
        NEW.requisition_number := generate_requisition_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_requisition_number_trigger
    BEFORE INSERT ON requisitions
    FOR EACH ROW
    EXECUTE FUNCTION set_requisition_number();

-- Trigger for automatically generating asset numbers
CREATE OR REPLACE FUNCTION set_asset_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.asset_number IS NULL THEN
        NEW.asset_number := generate_asset_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_asset_number_trigger
    BEFORE INSERT ON assets
    FOR EACH ROW
    EXECUTE FUNCTION set_asset_number();
