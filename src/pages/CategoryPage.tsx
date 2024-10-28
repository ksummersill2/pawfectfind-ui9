import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, SortDesc, ChevronDown } from 'lucide-react';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../hooks/useFavorites';
import ProductComparison from '../components/ProductComparison';
import CompareButton from '../components/CompareButton';
import ProductFilters from '../components/ProductFilters';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from '../components/LoadingSpinner';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams();
  const { products, loading, error } = useProducts(categoryId);
  const { favorites, toggleFavorite } = useFavorites();
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('popular');

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [showBlackFridayOnly, setShowBlackFridayOnly] = useState(false);

  // Calculate min/max prices and unique vendors from products
  const maxPrice = Math.max(...products.map(p => p.price));
  const minPrice = Math.min(...products.map(p => p.price));
  const vendors = Array.from(new Set(products.map(p => p.vendor)));

  // Initialize price range when products load
  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products, minPrice, maxPrice]);

  const category = categories.find(c => c.id === categoryId);

  const filteredProducts = products
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => selectedVendors.length === 0 || selectedVendors.includes(p.vendor))
    .filter(p => !selectedBreed || p.breed_recommendations?.some(r => r.breed === selectedBreed))
    .filter(p => !selectedSize || p.size_suitability?.suitable_for_sizes?.includes(selectedSize))
    .filter(p => !showBlackFridayOnly || p.is_black_friday)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.popularity - a.popularity;
      }
    });

  const handleCompareToggle = (product: Product) => {
    setCompareProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length < 4) {
        return [...prev, product];
      }
      return prev;
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>{category?.name || 'Category'} - PawfectFind</title>
        <meta name="description" content={category?.description || 'Browse our selection of pet products'} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Category Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{category?.name}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{category?.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="w-full lg:w-64 flex-shrink-0">
                <ProductFilters
                  categoryId={categoryId || ''}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedBreed={selectedBreed}
                  setSelectedBreed={setSelectedBreed}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                  selectedVendors={selectedVendors}
                  setSelectedVendors={setSelectedVendors}
                  showBlackFridayOnly={showBlackFridayOnly}
                  setShowBlackFridayOnly={setShowBlackFridayOnly}
                  vendors={vendors}
                  maxPrice={maxPrice}
                  minPrice={minPrice}
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
                    isCompareSelected={compareProducts.some(p => p.id === product.id)}
                    onCompareToggle={() => handleCompareToggle(product)}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    No products found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>

          <CompareButton
            selectedCount={compareProducts.length}
            onClick={() => setShowComparison(true)}
          />

          {showComparison && (
            <ProductComparison
              products={compareProducts}
              onClose={() => setShowComparison(false)}
              onRemoveProduct={(productId) => {
                setCompareProducts(prev => prev.filter(p => p.id !== productId));
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;