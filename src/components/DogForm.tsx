import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Upload, Dog } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

interface DogFormData {
  name: string;
  breed: string;
  breed_size_variation?: string;
  age: number;
  weight: number;
  activity_level: number;
  image?: string | null;
  health_conditions?: string[];
}

interface BreedWithSizeVariations {
  id: string;
  name: string;
  has_size_variations: boolean;
  size_variations?: Array<{
    id: string;
    size_category: string;
    size_description: string;
  }>;
}

interface DogFormProps {
  onSubmit: (data: DogFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: DogFormData;
  isSubmitting?: boolean;
}

const ENERGY_LEVELS = [
  { value: 1, label: 'Couch Potato 🛋️', description: 'Prefers naps over walks' },
  { value: 2, label: 'Lazy Lounger 😴', description: 'Short walks only, please' },
  { value: 3, label: 'Casual Walker 🦮', description: 'Enjoys leisurely strolls' },
  { value: 4, label: 'Park Explorer 🌳', description: 'Daily walks are a must' },
  { value: 5, label: 'Playful Pup 🎾', description: 'Ready for fetch anytime' },
  { value: 6, label: 'Adventure Buddy 🏃‍♂️', description: 'Loves long walks' },
  { value: 7, label: 'Energy Ball ⚡', description: 'Always ready to play' },
  { value: 8, label: 'Zoom Master 🏃‍♂️💨', description: 'Zoomies are life' },
  { value: 9, label: 'Turbo Tail 🌪️', description: 'Non-stop energy' },
  { value: 10, label: 'Rocket Dog 🚀', description: 'Unlimited power!' }
];

const DogForm: React.FC<DogFormProps> = ({ onSubmit, onCancel, initialData, isSubmitting = false }) => {
  const [formData, setFormData] = useState<DogFormData>(initialData || {
    name: '',
    breed: '',
    breed_size_variation: '',
    age: 0,
    weight: 0,
    activity_level: 5,
    image: null,
    health_conditions: []
  });

  const [breeds, setBreeds] = useState<BreedWithSizeVariations[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      const { data: breedsData, error: breedsError } = await supabase
        .from('dog_breeds')
        .select(`
          id,
          name,
          has_size_variations,
          size_variations:breed_size_variations(
            id,
            size_category,
            size_description
          )
        `)
        .order('name');

      if (breedsError) throw breedsError;
      setBreeds(breedsData || []);
    } catch (err) {
      console.error('Error fetching breeds:', err);
      setErrors(prev => ({ ...prev, breed: 'Failed to load breeds' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.breed) {
      newErrors.breed = 'Breed is required';
    }

    const selectedBreed = breeds.find(b => b.name === formData.breed);
    if (selectedBreed?.has_size_variations && !formData.breed_size_variation) {
      newErrors.breed_size_variation = 'Size variation is required for this breed';
    }

    if (formData.age < 0 || formData.age > 30) {
      newErrors.age = 'Age must be between 0 and 30 years';
    }

    if (formData.weight < 0.5 || formData.weight > 200) {
      newErrors.weight = 'Weight must be between 0.5 and 200 lbs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file: File) => {
    if (!user) return;

    try {
      setUploading(true);
      setErrors(prev => ({ ...prev, image: undefined }));

      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
      
      if (!fileExt || !allowedTypes.includes(fileExt)) {
        throw new Error('Please upload a JPG, PNG, WebP, or GIF file');
      }

      const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('dogs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('dogs')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
    } catch (err) {
      console.error('Error uploading image:', err);
      setErrors(prev => ({
        ...prev,
        image: err instanceof Error ? err.message : 'Failed to upload image'
      }));
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Error submitting form:', err);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save dog profile'
      }));
    }
  };

  const selectedBreed = breeds.find(b => b.name === formData.breed);
  const currentEnergyLevel = ENERGY_LEVELS[formData.activity_level - 1];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Dog's Photo (Optional)
        </label>
        <div className="mt-1 flex items-center space-x-4">
          {(previewUrl || formData.image) && (
            <img
              src={previewUrl || formData.image}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
          <label className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <Upload className="w-5 h-5 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Photo'}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(file);
                }
              }}
              className="hidden"
              disabled={uploading || isSubmitting}
            />
          </label>
        </div>
        {errors.image && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.image}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${
              errors.name ? 'border-red-500' : ''
            }`}
            required
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Breed
          </label>
          <select
            value={formData.breed}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                breed: e.target.value,
                breed_size_variation: '' // Reset size variation when breed changes
              }));
            }}
            className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${
              errors.breed ? 'border-red-500' : ''
            }`}
            required
            disabled={isSubmitting}
          >
            <option value="">Select a breed</option>
            {breeds.map((breed) => (
              <option key={breed.id} value={breed.name}>
                {breed.name}
              </option>
            ))}
          </select>
          {errors.breed && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.breed}
            </p>
          )}
        </div>

        {selectedBreed?.has_size_variations && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Size Variation
            </label>
            <select
              value={formData.breed_size_variation}
              onChange={(e) => setFormData(prev => ({ ...prev, breed_size_variation: e.target.value }))}
              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${
                errors.breed_size_variation ? 'border-red-500' : ''
              }`}
              required
              disabled={isSubmitting}
            >
              <option value="">Select size variation</option>
              {selectedBreed.size_variations?.map((variation) => (
                <option key={variation.id} value={variation.size_category}>
                  {variation.size_category.charAt(0).toUpperCase() + variation.size_category.slice(1)} - {variation.size_description}
                </option>
              ))}
            </select>
            {errors.breed_size_variation && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.breed_size_variation}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Age
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="number"
                value={Math.floor(formData.age)}
                onChange={(e) => {
                  const years = parseInt(e.target.value) || 0;
                  const months = formData.age % 1 * 12;
                  setFormData(prev => ({ ...prev, age: years + (months / 12) }));
                }}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                min="0"
                max="30"
                placeholder="Years"
                required
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-500 mt-1 block">Years</span>
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={Math.round(formData.age % 1 * 12)}
                onChange={(e) => {
                  const years = Math.floor(formData.age);
                  const months = parseInt(e.target.value) || 0;
                  setFormData(prev => ({ ...prev, age: years + (months / 12) }));
                }}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                min="0"
                max="11"
                placeholder="Months"
                required
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-500 mt-1 block">Months</span>
            </div>
          </div>
          {errors.age && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.age}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Weight
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="number"
                value={Math.floor(formData.weight)}
                onChange={(e) => {
                  const pounds = parseInt(e.target.value) || 0;
                  const ounces = formData.weight % 1 * 16;
                  setFormData(prev => ({ ...prev, weight: pounds + (ounces / 16) }));
                }}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                min="0"
                placeholder="Pounds"
                required
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-500 mt-1 block">Pounds</span>
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={Math.round(formData.weight % 1 * 16)}
                onChange={(e) => {
                  const pounds = Math.floor(formData.weight);
                  const ounces = parseInt(e.target.value) || 0;
                  setFormData(prev => ({ ...prev, weight: pounds + (ounces / 16) }));
                }}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                min="0"
                max="15"
                placeholder="Ounces"
                required
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-500 mt-1 block">Ounces</span>
            </div>
          </div>
          {errors.weight && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.weight}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Energy Level
          </label>
          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="10"
              value={formData.activity_level}
              onChange={(e) => setFormData(prev => ({ ...prev, activity_level: Number(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              disabled={isSubmitting}
            />
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  {currentEnergyLevel.label}
                </span>
                <Dog className={`w-6 h-6 text-blue-600 dark:text-blue-400 ${
                  formData.activity_level > 5 ? 'animate-bounce' : ''
                }`} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentEnergyLevel.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            'Save Dog'
          )}
        </button>
      </div>

      {errors.submit && (
        <p className="text-sm text-red-600 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors.submit}
        </p>
      )}
    </form>
  );
};

export default DogForm;