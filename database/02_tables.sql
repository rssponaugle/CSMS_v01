-- Create locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_location_id UUID REFERENCES locations(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    purchase_date DATE,
    purchase_cost DECIMAL(10,2),
    status asset_status DEFAULT 'In Service',
    location_id UUID REFERENCES locations(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    unit VARCHAR(20),
    quantity INTEGER DEFAULT 0,
    minimum_quantity INTEGER DEFAULT 0,
    cost_per_unit DECIMAL(10,2),
    location_id UUID REFERENCES locations(id),
    supplier_id UUID REFERENCES suppliers(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_provider table
CREATE TABLE service_provider (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_teams table
CREATE TABLE service_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_team_members table (junction table)
CREATE TABLE service_team_members (
    team_id UUID REFERENCES service_teams(id),
    provider_id UUID REFERENCES service_provider(id),
    PRIMARY KEY (team_id, provider_id)
);

-- Create service_requests table
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(50) UNIQUE NOT NULL,
    asset_id UUID REFERENCES assets(id),
    status service_status DEFAULT 'Open',
    priority service_priority DEFAULT 'Medium',
    service_type service_type DEFAULT 'Corrective',
    service_requested TEXT NOT NULL,
    service_performed TEXT,
    start_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    estimated_hours INTEGER,
    estimated_minutes INTEGER,
    actual_hours INTEGER,
    actual_minutes INTEGER,
    completed_by UUID REFERENCES service_provider(id),
    assigned_to UUID REFERENCES service_provider(id),
    team_id UUID REFERENCES service_teams(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_schedules table
CREATE TABLE service_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    frequency schedule_frequency NOT NULL,
    last_service_date TIMESTAMPTZ,
    next_service_date TIMESTAMPTZ,
    service_instructions TEXT,
    assigned_to UUID REFERENCES service_provider(id),
    team_id UUID REFERENCES service_teams(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create requisitions table
CREATE TABLE requisitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisition_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    status VARCHAR(20) DEFAULT 'Draft',
    requested_by UUID REFERENCES service_provider(id),
    requested_date TIMESTAMPTZ DEFAULT NOW(),
    required_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create requisition_items table
CREATE TABLE requisition_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisition_id UUID REFERENCES requisitions(id),
    inventory_id UUID REFERENCES inventory(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create asset_inventory table (junction table for tracking which inventory items are used with which assets)
CREATE TABLE asset_inventory (
    asset_id UUID REFERENCES assets(id),
    inventory_id UUID REFERENCES inventory(id),
    PRIMARY KEY (asset_id, inventory_id)
);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('CREATE TRIGGER update_updated_at_timestamp
                       BEFORE UPDATE ON %I
                       FOR EACH ROW
                       EXECUTE FUNCTION update_updated_at_column()', t);
    END LOOP;
END;
$$;
