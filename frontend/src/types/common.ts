export type AssetStatus = 'In Service' | 'Out of Service' | 'Scrapped' | 'Sold' | 'Other';
export type ServiceStatus = 'Open' | 'Closed' | 'On Hold' | 'In Progress' | 'Closed-Completed' | 'Closed-Incomplete';
export type ServicePriority = 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';
export type ServiceType = 'Corrective' | 'Preventive' | 'Project' | 'Upgrade' | 'Inspection' | 'Meter Reading' | 'Safety' | 'Other';
export type ScheduleFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually' | 'Quinquennial';

export interface BaseEntity {
  id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Location extends BaseEntity {
  name: string;
  description: string | null;
  parent_location_id: string | null;
}

export interface Asset extends BaseEntity {
  asset_number: string;
  name: string;
  description: string | null;
  category: string | null;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  purchase_date: string | null;
  purchase_cost: number | null;
  status: AssetStatus | null;
  location_id: string | null;
  notes: string | null;
  location?: Location | null;
}

export interface ServiceProvider extends BaseEntity {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  notes?: string;
}

export interface ServiceTeam extends BaseEntity {
  name: string;
  description?: string;
  providers?: ServiceProvider[];
}

export interface ServiceRequest extends BaseEntity {
  request_number: string;
  asset_id?: string;
  status: ServiceStatus;
  priority: ServicePriority;
  service_type: ServiceType;
  service_requested: string;
  service_performed?: string;
  start_date?: string;
  due_date?: string;
  estimated_hours?: number;
  estimated_minutes?: number;
  actual_hours?: number;
  actual_minutes?: number;
  assigned_to?: string;
  completed_by?: string;
  team_id?: string;
  asset?: Asset;
  assignedProvider?: ServiceProvider;
  completedByProvider?: ServiceProvider;
  team?: ServiceTeam;
}

export interface Supplier extends BaseEntity {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface InventoryItem extends BaseEntity {
  item_number: string;
  name: string;
  description?: string;
  category?: string;
  unit?: string;
  quantity: number;
  minimum_quantity: number;
  cost_per_unit?: number;
  location_id?: string;
  supplier_id?: string;
  notes?: string;
  location?: Location;
  supplier?: Supplier;
}

export interface ServiceSchedule extends BaseEntity {
  asset_id: string;
  name: string;
  description?: string;
  frequency: ScheduleFrequency;
  last_service_date?: string;
  next_service_date?: string;
  service_instructions?: string;
  assigned_to?: string;
  team_id?: string;
  asset?: Asset;
  assignedProvider?: ServiceProvider;
  team?: ServiceTeam;
}

export interface Requisition extends BaseEntity {
  requisition_number: string;
  supplier_id?: string;
  status: string;
  requested_by?: string;
  requested_date: string;
  required_date?: string;
  notes?: string;
  supplier?: Supplier;
  requestedBy?: ServiceProvider;
  items?: RequisitionItem[];
}

export interface RequisitionItem extends BaseEntity {
  requisition_id: string;
  inventory_id: string;
  quantity: number;
  unit_price?: number;
  notes?: string;
  inventory?: InventoryItem;
}
