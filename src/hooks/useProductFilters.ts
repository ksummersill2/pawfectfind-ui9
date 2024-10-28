import { useState, useEffect } from 'react';
import { useDogProfiles } from './useDogProfiles';

export const useProductFilters = () => {
  const { dogs, activeDogId } = useDogProfiles();
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  // Automatically set filters based on active dog
  useEffect(() => {
    if (activeDogId) {
      const activeDog = dogs.find(dog => dog.id === activeDogId);
      if (activeDog) {
        setSelectedBreed(activeDog.breed);
        
        // Determine size category based on weight
        const weight = activeDog.weight;
        let size = '';
        if (weight <= 4) size = 'toy';
        else if (weight <= 12) size = 'mini';
        else if (weight <= 25) size = 'small';
        else if (weight <= 50) size = 'medium';
        else if (weight <= 90) size = 'large';
        else size = 'giant';
        
        setSelectedSize(size);
      }
    }
  }, [activeDogId, dogs]);

  return {
    selectedBreed,
    setSelectedBreed,
    selectedSize,
    setSelectedSize,
    clearFilters: () => {
      setSelectedBreed('');
      setSelectedSize('');
    }
  };
};

export default useProductFilters;