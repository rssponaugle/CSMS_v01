import { supabase } from './supabase';
import { Location } from '../types/common';

export const locationService = {
  async getAll(): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching location:', error);
      throw error;
    }

    return data;
  },

  async create(location: Pick<Location, 'name'> & Partial<Omit<Location, 'name'>>): Promise<Location> {
    const { data, error } = await supabase
      .from('locations')
      .insert([location])
      .select()
      .single();

    if (error) {
      console.error('Error creating location:', error);
      throw error;
    }

    return data;
  },

  async update(id: string, location: Partial<Location>): Promise<Location> {
    const { data, error } = await supabase
      .from('locations')
      .update(location)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating location:', error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  },

  async importCsv(file: File): Promise<{ success: number; errors: number }> {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split('\n').map(row => row.split(','));
          const headers = rows[0];
          const locations = rows.slice(1).map(row => {
            const location: Record<string, any> = {};
            headers.forEach((header, index) => {
              location[header.trim()] = row[index]?.trim() || null;
            });
            return location;
          });

          let success = 0;
          let errors = 0;

          for (const location of locations) {
            try {
              if (!location.name) {
                throw new Error('Location name is required');
              }
              await this.create(location as Pick<Location, 'name'> & Partial<Omit<Location, 'name'>>);
              success++;
            } catch (err) {
              console.error('Error importing location:', err);
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
