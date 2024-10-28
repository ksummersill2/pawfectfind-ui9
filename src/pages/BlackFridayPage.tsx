import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Tag, Filter, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../hooks/useFavorites';
import { Product } from '../types';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductFilters from '../components/ProductFilters';

const BlackFridayPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();
  const [showFilters, setShowFilters] = useState(false);
  const [minDiscount, setMinDiscount] = useState(0);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState<'discount' | 'price'>('discount');
  const [error, setError] = useState<string | null>(null);

  // Calculate min/max prices and unique vendors from products
  const maxPrice = Math.max(...products.map(p => p.price));
  const minPrice = Math.min(...products.map(p => p.price));
  const vendors = Array.from(new Set(products.map(p => p.vendor)));
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  useEffect(() => {
    fetchBlackFridayDeals();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products, minPrice, maxPrice]);

  const fetchBlackFridayDeals = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          life_stages:product_life_stages(*),
          size_suitability:product_size_suitability(*),
          health_benefits:product_health_benefits(
            *,
            health_condition:health_conditions(*)
          ),
          breed_recommendations:product_breed_recommendations(
            *,
            breed:dog_breeds(*)
          ),
          ratings:product_ratings(*)
        `)
        .eq('is_black_friday', true)
        .order('discount', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedData = data?.map(product => ({
        ...product,
        id: product.id.toString(),
        tags: product.tags || [],
        rating: product.rating || 0,
        popularity: product.popularity || 0,
        discount: product.discount || 0,
        price: parseFloat(product.price) || 0,
        black_friday_price: parseFloat(product.black_friday_price) || 0,
      })) || [];

      setProducts(transformedData);
    } catch (err) {
      console.error('Error fetching Black Friday deals:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => selectedVendors.length === 0 || selectedVendors.includes(p.vendor))
    .filter(p => !selectedBreed || p.breed_recommendations?.some(r => r.breed === selectedBreed))
    .filter(p => !selectedSize || (p.size_suitability && (
      (selectedSize === 'toy' && p.size_suitability.suitable_for_small) ||
      (selectedSize === 'mini' && p.size_suitability.suitable_for_small) ||
      (selectedSize === 'small' && p.size_suitability.suitable_for_small) ||
      (selectedSize === 'medium' && p.size_suitability.suitable_for_medium) ||
      (selectedSize === 'large' && p.size_suitability.suitable_for_large) ||
      (selectedSize === 'giant' && p.size_suitability.suitable_for_giant)
    )))
    .sort((a, b) => {
      if (sortBy === 'discount') {
        return b.discount - a.discount;
      }
      return a.black_friday_price - b.black_friday_price;
    });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEO 
        title="Black Friday Pet Deals"
        description="Exclusive Black Friday deals on premium pet products. Save big on food, toys, accessories and more!"
      />

      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Tag className="w-6 h-6 text-red-500" />
            <span className="text-red-500 font-semibold">BLACK FRIDAY</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Biggest Pet Deals of the Year
          </h1>
          <p className="text-xl text-gray-300 text-center">
            Save up to 70% on premium pet products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-1 transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'discount' | 'price')}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="discount">Biggest Discounts</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-full lg:w-64 flex-shrink-0">
              <ProductFilters
                categoryId=""
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedBreed={selectedBreed}
                setSelectedBreed={setSelectedBreed}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedVendors={selectedVendors}
                setSelectedVendors={setSelectedVendors}
                vendors={vendors}
                maxPrice={maxPrice}
                minPrice={minPrice}
                showBlackFridayOnly={false}
                setShowBlackFridayOnly={() => {}}
              />
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No Black Friday deals found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlackFridayPage;