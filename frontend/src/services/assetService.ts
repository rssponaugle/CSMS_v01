import { supabase } from './supabase';
import { Asset } from '../types/common';

export const assetService = {
  async getAll(): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*, location:locations(*)')
      .order('asset_number');

    if (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }

    // Type assertion here is safe because Supabase ensures the shape matches our Asset type
    return (data as unknown as Asset[]) || [];
  },

  async getById(id: string): Promise<Asset | null> {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        location:locations(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching asset:', error);
      throw error;
    }

    // Type assertion here is safe because Supabase ensures the shape matches our Asset type
    return (data as unknown as Asset) || null;
  },

  async create(asset: Pick<Asset, 'asset_number' | 'name'> & Partial<Asset>): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .insert(asset)
      .select()
      .single();

    if (error) {
      console.error('Error creating asset:', error);
      throw error;
    }

    // Type assertion here is safe because Supabase ensures the shape matches our Asset type
    return (data as unknown as Asset);
  },

  async update(id: string, asset: Partial<Asset>): Promise<Asset> {
    console.log('Updating asset with data:', { id, asset });
    const { data, error } = await supabase
      .from('assets')
      .update(asset)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating asset:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from update');
    }

    // Type assertion here is safe because Supabase ensures the shape matches our Asset type
    return (data as unknown as Asset);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  },

  async search(query: string): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*, location:locations(*)')
      .or(`
        asset_number.ilike.%${query}%,
        name.ilike.%${query}%,
        description.ilike.%${query}%,
        manufacturer.ilike.%${query}%,
        model.ilike.%${query}%,
        serial_number.ilike.%${query}%
      `)
      .order('asset_number');

    if (error) {
      console.error('Error searching assets:', error);
      throw error;
    }

    // Type assertion here is safe because Supabase ensures the shape matches our Asset type
    return (data as unknown as Asset[]) || [];
  },

  async importCsv(file: File): Promise<{ success: number; errors: number }> {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split('\n').map(row => row.split(','));
          const headers = rows[0];
          const assets = rows.slice(1).map((row) => {
            const asset: Record<string, any> = {};
            headers.forEach((header, index) => {
              asset[header.trim()] = row[index]?.trim() || null;
            });
            
            // Validate required fields
            if (!asset.asset_number || !asset.name) {
              throw new Error(`Asset number and name are required fields`);
            }
            
            return asset as Pick<Asset, 'asset_number' | 'name'> & Partial<Asset>;
          });

          let success = 0;
          let errors = 0;

          for (const asset of assets) {
            try {
              await this.create(asset);
              success++;
            } catch (err) {
              console.error('Error importing asset:', err);
              errors++;
            }
          }

          resolve({ success, errors });
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      reader.readAsText(file);
    });
  }
};
