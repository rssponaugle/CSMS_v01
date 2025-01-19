-- Add new columns to service_requests table
ALTER TABLE service_requests
ADD COLUMN IF NOT EXISTS performed_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS purchased_from uuid REFERENCES suppliers(id);
