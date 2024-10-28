import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Dog as DogIcon, Package, Book, MessageSquare, Heart } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Dog } from '../types';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../hooks/useFavorites';
import LoadingSpinner from '../components/LoadingSpinner';

const DogDashboard: React.FC = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const [dog, setDog] = useState<Dog | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchDogData = async () => {
      if (!dogId) return;

      try {
        setLoading(true);
        const { data: dogData, error: dogError } = await supabase
          .from('dogs')
          .select('*')
          .eq('id', dogId)
          .single();

        if (dogError) throw dogError;
        if (!dogData) throw new Error('Dog not found');

        setDog(dogData);

        // Fetch recommended products based on breed and size
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            breed_recommendations!inner(*)
          `)
          .eq('breed_recommendations.breed', dogData.breed)
          .limit(6);

        if (productsError) throw productsError;
        setRecommendedProducts(products || []);

      } catch (err) {
        console.error('Error fetching dog data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dog data');
      } finally {
        setLoading(false);
      }
    };

    fetchDogData();
  }, [dogId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !dog) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error || 'Dog not found'}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dog Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center space-x-4">
          {dog.image ? (
            <img
              src={dog.image}
              alt={dog.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <DogIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {dog.name}'s Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {dog.breed} • {dog.age} years old • {dog.weight} kg
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recommended Products */}
        <div className="col-span-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recommended Products
            </h2>
            <Link
              to={`/search?breed=${encodeURIComponent(dog.breed)}`}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center"
            >
              View All
              <Package className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>

        {/* Breed Guide */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Breed Guide
            </h2>
            <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Learn everything about caring for your {dog.breed}
          </p>
          <Link
            to={`/breeds/${encodeURIComponent(dog.breed)}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Read More
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Community */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Community
            </h2>
            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Connect with other {dog.breed} owners
          </p>
          <Link
            to={`/community?breed=${encodeURIComponent(dog.breed)}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Join Discussion
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Health & Care */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Health & Care
            </h2>
            <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Track health records and care routines
          </p>
          <Link
            to={`/dog/${dogId}/health`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            View Records
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DogDashboard;