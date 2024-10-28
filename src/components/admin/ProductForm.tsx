import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import ProductMetadataForm from './ProductMetadataForm';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    rating: initialData?.rating || 0,
    popularity: initialData?.popularity || 0,
    discount: initialData?.discount || 0,
    vendor: initialData?.vendor || '',
    image: initialData?.image || '',
    additional_images: initialData?.additional_images || [],
    category_id: initialData?.category_id || '',
    tags: initialData?.tags || [],
    affiliate_type: initialData?.affiliate_type || null,
    affiliate_link: initialData?.affiliate_link || '',
    is_black_friday: initialData?.is_black_friday || false,
    black_friday_price: initialData?.black_friday_price,
    life_stages: initialData?.life_stages || {
      suitable_for_puppy: false,
      suitable_for_adult: false,
      suitable_for_senior: false,
      min_age_months: null,
      max_age_months: null
    },
    size_suitability: initialData?.size_suitability || {
      suitable_for_small: false,
      suitable_for_medium: false,
      suitable_for_large: false,
      suitable_for_giant: false,
      min_weight_kg: null,
      max_weight_kg: null
    },
    health_benefits: initialData?.health_benefits || [],
    breed_recommendations: initialData?.breed_recommendations || []
  });

  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    if (!formData.image) {
      newErrors.image = 'Product image is required';
    }

    if (formData.affiliate_type === 'amazon' && !formData.affiliate_link) {
      newErrors.affiliate_link = 'Affiliate link is required for Amazon products';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 ${
              errors.name ? 'border-red-500' : ''
            }`}
            disabled={isSubmitting}
            required
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
            Category
          </label>
          <select
            value={formData.category_id}
            onChange={e => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
            className={`w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 ${
              errors.category_id ? 'border-red-500' : ''
            }`}
            disabled={isSubmitting}
            required
          >
            <option value="">Select Category</option>
            <option value="food">Food & Nutrition</option>
            <option value="toys">Toys & Entertainment</option>
            <option value="health">Health & Wellness</option>
            <option value="grooming">Grooming & Care</option>
            <option value="training">Training & Behavior</option>
            <option value="bedding">Beds & Furniture</option>
          </select>
          {errors.category_id && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.category_id}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className={`w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 ${
              errors.description ? 'border-red-500' : ''
            }`}
            disabled={isSubmitting}
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            className={`w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 ${
              errors.price ? 'border-red-500' : ''
            }`}
            min="0"
            step="0.01"
            disabled={isSubmitting}
            required
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Vendor
          </label>
          <input
            type="text"
            value={formData.vendor}
            onChange={e => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      {/* Image URLs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Main Image URL
        </label>
        <input
          type="url"
          value={formData.image}
          onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
          className={`w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 ${
            errors.image ? 'border-red-500' : ''
          }`}
          placeholder="https://example.com/image.jpg"
          disabled={isSubmitting}
          required
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.image}
          </p>
        )}
      </div>

      {/* Affiliate Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Affiliate Settings
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Affiliate Type
          </label>
          <select
            value={formData.affiliate_type || ''}
            onChange={e => setFormData(prev => ({
              ...prev,
              affiliate_type: e.target.value === '' ? null : e.target.value as 'amazon'
            }))}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            disabled={isSubmitting}
          >
            <option value="">None</option>
            <option value="amazon">Amazon</option>
          </select>
        </div>

        {formData.affiliate_type === 'amazon' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amazon Product URL
            </label>
            <input
              type="url"
              value={formData.affiliate_link}
              onChange={e => setFormData(prev => ({ ...prev, affiliate_link: e.target.value }))}
              className={`w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 ${
                errors.affiliate_link ? 'border-red-500' : ''
              }`}
              placeholder="https://amazon.com/dp/PRODUCT_ID"
              disabled={isSubmitting}
            />
            {errors.affiliate_link && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.affiliate_link}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Black Friday Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Black Friday Settings
        </h3>

        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_black_friday}
              onChange={e => setFormData(prev => ({
                ...prev,
                is_black_friday: e.target.checked
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <span className="text-gray-700 dark:text-gray-300">Black Friday Deal</span>
          </label>

          {formData.is_black_friday && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Black Friday Price (Optional)
                </label>
                <input
                  type="number"
                  value={formData.black_friday_price || ''}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    black_friday_price: e.target.value ? parseFloat(e.target.value) : undefined
                  }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  min="0"
                  step="0.01"
                  placeholder="Leave empty to use regular price with discount"
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  If left empty, the regular price with discount will be used
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  value={formData.discount || 0}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    discount: parseInt(e.target.value)
                  }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  min="0"
                  max="100"
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Additional Product Details Button */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setShowMetadataForm(true)}
          className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          disabled={isSubmitting}
        >
          Additional Product Details
        </button>
      </div>

      {/* Product Metadata Form */}
      {showMetadataForm && (
        <div className="mt-6 border-t dark:border-gray-700 pt-6">
          <ProductMetadataForm
            initialData={{
              life_stages: formData.life_stages,
              size_suitability: formData.size_suitability,
              health_benefits: formData.health_benefits,
              breed_recommendations: formData.breed_recommendations
            }}
            onSubmit={(metadata) => {
              setFormData(prev => ({
                ...prev,
                ...metadata
              }));
              setShowMetadataForm(false);
            }}
            onCancel={() => setShowMetadataForm(false)}
          />
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Saving...
            </span>
          ) : (
            initialData ? 'Update Product' : 'Create Product'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;