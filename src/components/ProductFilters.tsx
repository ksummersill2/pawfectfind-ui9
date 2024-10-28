import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import BreedSelect from './BreedSelect';
import { formatCurrency } from '../utils/formatters';

interface FilterProps {
  categoryId: string;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedBreed: string;
  setSelectedBreed: (breed: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedVendors: string[];
  setSelectedVendors: (vendors: string[]) => void;
  showBlackFridayOnly: boolean;
  setShowBlackFridayOnly: (show: boolean) => void;
  vendors: string[];
  maxPrice: number;
  minPrice: number;
}

const SIZE_CATEGORIES = [
  { value: '', label: 'All Sizes' },
  { value: 'toy', label: 'Toy' },
  { value: 'mini', label: 'Mini' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'standard', label: 'Standard' },
  { value: 'large', label: 'Large' },
  { value: 'giant', label: 'Giant' }
];

const ProductFilters: React.FC<FilterProps> = ({
  categoryId,
  priceRange,
  setPriceRange,
  selectedBreed,
  setSelectedBreed,
  selectedSize,
  setSelectedSize,
  selectedVendors,
  setSelectedVendors,
  showBlackFridayOnly,
  setShowBlackFridayOnly,
  vendors,
  maxPrice,
  minPrice
}) => {
  return (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Price Range</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-blue-600"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      {/* Breed Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Filter by Breed</h3>
        <BreedSelect
          value={selectedBreed}
          onChange={setSelectedBreed}
          placeholder="All Breeds"
        />
      </div>

      {/* Size Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Dog Size</h3>
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
        >
          {SIZE_CATEGORIES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Vendor Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Vendors</h3>
        <div className="space-y-2">
          {vendors.map((vendor) => (
            <label key={vendor} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedVendors.includes(vendor)}
                onChange={(e) => {
                  setSelectedVendors(
                    e.target.checked
                      ? [...selectedVendors, vendor]
                      : selectedVendors.filter(v => v !== vendor)
                  );
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">{vendor}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Black Friday Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showBlackFridayOnly}
            onChange={(e) => setShowBlackFridayOnly(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">Black Friday Deals Only</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;