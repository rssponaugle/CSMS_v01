-- Create custom types for enumerated values
CREATE TYPE asset_status AS ENUM ('In Service', 'Out of Service', 'Scrapped', 'Sold', 'Other');
CREATE TYPE service_status AS ENUM ('Open', 'Closed', 'On Hold', 'In Progress', 'Closed-Completed', 'Closed-Incomplete');
CREATE TYPE service_priority AS ENUM ('Highest', 'High', 'Medium', 'Low', 'Lowest');
CREATE TYPE service_type AS ENUM ('Corrective', 'Preventive', 'Project', 'Upgrade', 'Inspection', 'Meter Reading', 'Safety', 'Other');
CREATE TYPE schedule_frequency AS ENUM ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'Quinquennial');
