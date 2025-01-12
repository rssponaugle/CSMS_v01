export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      asset_inventory: {
        Row: {
          asset_id: string
          inventory_id: string
        }
        Insert: {
          asset_id: string
          inventory_id: string
        }
        Update: {
          asset_id?: string
          inventory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_inventory_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_inventory_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_number: string
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          location_id: string | null
          manufacturer: string | null
          model: string | null
          name: string
          notes: string | null
          purchase_cost: number | null
          purchase_date: string | null
          serial_number: string | null
          status: Database["public"]["Enums"]["asset_status"] | null
          updated_at: string | null
        }
        Insert: {
          asset_number: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location_id?: string | null
          manufacturer?: string | null
          model?: string | null
          name: string
          notes?: string | null
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["asset_status"] | null
          updated_at?: string | null
        }
        Update: {
          asset_number?: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location_id?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          notes?: string | null
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["asset_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: string | null
          cost_per_unit: number | null
          created_at: string | null
          description: string | null
          id: string
          item_number: string
          location_id: string | null
          minimum_quantity: number | null
          name: string
          notes: string | null
          quantity: number | null
          supplier_id: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          cost_per_unit?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          item_number: string
          location_id?: string | null
          minimum_quantity?: number | null
          name: string
          notes?: string | null
          quantity?: number | null
          supplier_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          cost_per_unit?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          item_number?: string
          location_id?: string | null
          minimum_quantity?: number | null
          name?: string
          notes?: string | null
          quantity?: number | null
          supplier_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_location_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_location_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_location_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_location_id_fkey"
            columns: ["parent_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      requisition_items: {
        Row: {
          created_at: string | null
          id: string
          inventory_id: string | null
          notes: string | null
          quantity: number
          requisition_id: string | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          notes?: string | null
          quantity: number
          requisition_id?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          notes?: string | null
          quantity?: number
          requisition_id?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requisition_items_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisition_items_requisition_id_fkey"
            columns: ["requisition_id"]
            isOneToOne: false
            referencedRelation: "requisitions"
            referencedColumns: ["id"]
          },
        ]
      }
      requisitions: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          requested_by: string | null
          requested_date: string | null
          required_date: string | null
          requisition_number: string
          status: string | null
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          requested_by?: string | null
          requested_date?: string | null
          required_date?: string | null
          requisition_number: string
          status?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          requested_by?: string | null
          requested_date?: string | null
          required_date?: string | null
          requisition_number?: string
          status?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requisitions_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "service_provider"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisitions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_provider: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          asset_id: string | null
          assigned_to: string | null
          created_at: string | null
          due_date: string | null
          estimated_hours: number | null
          estimated_minutes: number | null
          id: string
          priority: Database["public"]["Enums"]["service_priority"] | null
          request_number: string
          service_performed: string | null
          service_requested: string
          service_type: Database["public"]["Enums"]["service_type"] | null
          start_date: string | null
          status: Database["public"]["Enums"]["service_status"] | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          asset_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          estimated_minutes?: number | null
          id?: string
          priority?: Database["public"]["Enums"]["service_priority"] | null
          request_number: string
          service_performed?: string | null
          service_requested: string
          service_type?: Database["public"]["Enums"]["service_type"] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["service_status"] | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          asset_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          estimated_minutes?: number | null
          id?: string
          priority?: Database["public"]["Enums"]["service_priority"] | null
          request_number?: string
          service_performed?: string | null
          service_requested?: string
          service_type?: Database["public"]["Enums"]["service_type"] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["service_status"] | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "service_provider"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "service_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      service_schedules: {
        Row: {
          asset_id: string | null
          assigned_to: string | null
          created_at: string | null
          description: string | null
          frequency: Database["public"]["Enums"]["schedule_frequency"]
          id: string
          last_service_date: string | null
          name: string
          next_service_date: string | null
          service_instructions: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          asset_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          frequency: Database["public"]["Enums"]["schedule_frequency"]
          id?: string
          last_service_date?: string | null
          name: string
          next_service_date?: string | null
          service_instructions?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          asset_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          frequency?: Database["public"]["Enums"]["schedule_frequency"]
          id?: string
          last_service_date?: string | null
          name?: string
          next_service_date?: string | null
          service_instructions?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_schedules_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_schedules_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "service_provider"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_schedules_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "service_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      service_team_members: {
        Row: {
          provider_id: string
          team_id: string
        }
        Insert: {
          provider_id: string
          team_id: string
        }
        Update: {
          provider_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_team_members_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_provider"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "service_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      service_teams: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_asset_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_requisition_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_service_request_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      asset_status:
        | "In Service"
        | "Out of Service"
        | "Scrapped"
        | "Sold"
        | "Other"
      schedule_frequency:
        | "Daily"
        | "Weekly"
        | "Monthly"
        | "Quarterly"
        | "Annually"
        | "Quinquennial"
      service_priority: "Highest" | "High" | "Medium" | "Low" | "Lowest"
      service_status:
        | "Open"
        | "Closed"
        | "On Hold"
        | "In Progress"
        | "Closed-Completed"
        | "Closed-Incomplete"
      service_type:
        | "Corrective"
        | "Preventive"
        | "Project"
        | "Upgrade"
        | "Inspection"
        | "Meter Reading"
        | "Safety"
        | "Other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
