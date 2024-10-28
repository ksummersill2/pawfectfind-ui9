import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  activity_level: number;
  image: string | null;
  health_conditions?: string[];
}

export interface DogFormData {
  name: string;
  breed: string;
  age: number;
  weight: number;
  activity_level: number;
  image?: string | null;
  health_conditions?: string[];
}

export const useDogProfiles = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [activeDogId, setActiveDogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDogs();
    } else {
      setDogs([]);
      setActiveDogId(null);
      setLoading(false);
    }
  }, [user]);

  const fetchDogs = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('dogs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setDogs(data || []);
      if (data?.length > 0 && !activeDogId) {
        setActiveDogId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching dogs:', err);
      setError('Failed to load dogs');
    } finally {
      setLoading(false);
    }
  };

  const addDog = async (dogData: DogFormData): Promise<Dog | null> => {
    if (!user) return null;

    try {
      const { data, error: insertError } = await supabase
        .from('dogs')
        .insert([{
          user_id: user.id,
          name: dogData.name,
          breed: dogData.breed,
          age: dogData.age,
          weight: dogData.weight,
          activity_level: dogData.activity_level,
          image: dogData.image || null,
          health_conditions: dogData.health_conditions || []
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      setDogs(prev => [data, ...prev]);
      setActiveDogId(data.id);
      return data;
    } catch (err) {
      console.error('Error adding dog:', err);
      throw err;
    }
  };

  const updateDog = async (id: string, dogData: Partial<DogFormData>) => {
    if (!user) return;

    try {
      const { data, error: updateError } = await supabase
        .from('dogs')
        .update({
          name: dogData.name,
          breed: dogData.breed,
          age: dogData.age,
          weight: dogData.weight,
          activity_level: dogData.activity_level,
          image: dogData.image,
          health_conditions: dogData.health_conditions
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setDogs(prev => prev.map(dog => dog.id === id ? data : dog));
      return data;
    } catch (err) {
      console.error('Error updating dog:', err);
      throw err;
    }
  };

  const removeDog = async (id: string) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('dogs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setDogs(prev => prev.filter(dog => dog.id !== id));
      if (activeDogId === id) {
        const remainingDogs = dogs.filter(dog => dog.id !== id);
        setActiveDogId(remainingDogs[0]?.id || null);
      }
    } catch (err) {
      console.error('Error removing dog:', err);
      throw err;
    }
  };

  return {
    dogs,
    activeDogId,
    setActiveDogId,
    addDog,
    updateDog,
    removeDog,
    loading,
    error,
    refreshDogs: fetchDogs
  };
};

export default useDogProfiles;