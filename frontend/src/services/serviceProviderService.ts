import { supabase } from './supabase';
import { ServiceProvider } from '../types/common';

export const serviceProviderService = {
  async getAll(): Promise<ServiceProvider[]> {
    const { data, error } = await supabase
      .from('service_provider')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching service providers:', error);
      throw error;
    }

    // Transform null values to undefined and ensure required fields are strings
    return (data || []).map(provider => ({
      id: provider.id,
      name: provider.name,
      email: provider.email ?? undefined,
      phone: provider.phone ?? undefined,
      role: provider.role ?? undefined,
      notes: provider.notes ?? undefined,
      created_at: provider.created_at ?? new Date().toISOString(),
      updated_at: provider.updated_at ?? new Date().toISOString()
    }));
  },

  async search(query: string): Promise<ServiceProvider[]> {
    const { data, error } = await supabase
      .from('service_provider')
      .select('*')
      .or(`
        name.ilike.%${query}%,
        email.ilike.%${query}%
      `)
      .order('name')
      .limit(10);

    if (error) {
      console.error('Error searching service providers:', error);
      throw error;
    }

    return (data || []).map(provider => ({
      id: provider.id,
      name: provider.name,
      email: provider.email ?? undefined,
      phone: provider.phone ?? undefined,
      role: provider.role ?? undefined,
      notes: provider.notes ?? undefined,
      created_at: provider.created_at ?? new Date().toISOString(),
      updated_at: provider.updated_at ?? new Date().toISOString()
    }));
  }
};
