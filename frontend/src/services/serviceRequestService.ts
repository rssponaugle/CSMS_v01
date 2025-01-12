import { supabase } from './supabase';
import { ServiceRequest } from '../types/common';

export const serviceRequestService = {
  async getAll(): Promise<ServiceRequest[]> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        asset:assets(*),
        assignedProvider:service_provider(*),
        team:service_teams(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching service requests:', error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<ServiceRequest | null> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        asset:assets(*),
        assignedProvider:service_provider(*),
        team:service_teams(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching service request:', error);
      throw error;
    }

    return data;
  },

  async create(serviceRequest: Partial<ServiceRequest>): Promise<ServiceRequest> {
    const { data, error } = await supabase
      .from('service_requests')
      .insert([serviceRequest])
      .select()
      .single();

    if (error) {
      console.error('Error creating service request:', error);
      throw error;
    }

    return data;
  },

  async update(id: string, serviceRequest: Partial<ServiceRequest>): Promise<ServiceRequest> {
    const { data, error } = await supabase
      .from('service_requests')
      .update(serviceRequest)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service request:', error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service request:', error);
      throw error;
    }
  }
};
