import { supabase } from './supabase';
import { Asset } from '../types/common';

export const assetService = {
  async getAll(): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        location:locations(*)
      `)
      .order('asset_number');

    if (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }

    return data || [];
  },

  async search(query: string): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        location:locations(*)
      `)
      .or(`
        asset_number.ilike.%${query}%,
        name.ilike.%${query}%,
        description.ilike.%${query}%
      `)
      .order('asset_number')
      .limit(10);

    if (error) {
      console.error('Error searching assets:', error);
      throw error;
    }

    return data || [];
  }
};
