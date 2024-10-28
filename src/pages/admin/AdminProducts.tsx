import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { PlusCircle, Edit2, Trash2, Search } from 'lucide-react';
import ProductForm from '../../components/admin/ProductForm';
import { Product } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
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
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedData = data?.map(product => ({
        ...product,
        id: product.id.toString(),
        tags: product.tags || [],
        ingredients: product.ingredients || [],
        features: product.features || [],
        safety_warnings: product.safety_warnings || [],
        additional_images: product.additional_images || [],
        rating: product.rating || 0,
        popularity: product.popularity || 0,
        discount: product.discount || 0,
        price: parseFloat(product.price) || 0,
        black_friday_price: parseFloat(product.black_friday_price) || 0,
        life_stages: product.life_stages || {
          suitable_for_puppy: false,
          suitable_for_adult: false,
          suitable_for_senior: false,
          min_age_months: null,
          max_age_months: null
        },
        size_suitability: product.size_suitability || {
          suitable_for_small: false,
          suitable_for_medium: false,
          suitable_for_large: false,
          suitable_for_giant: false,
          min_weight_kg: null,
          max_weight_kg: null
        }
      })) || [];

      setProducts(transformedData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (productData: Omit<Product, 'id'>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const {
        life_stages,
        size_suitability,
        health_benefits,
        breed_recommendations,
        ...basicProductData
      } = productData;

      if (editingProduct) {
        // Update main product data
        const { error: productError } = await supabase
          .from('products')
          .update({
            ...basicProductData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id);

        if (productError) throw productError;

        // Delete existing related data
        await Promise.all([
          supabase.from('product_life_stages').delete().eq('product_id', editingProduct.id),
          supabase.from('product_size_suitability').delete().eq('product_id', editingProduct.id),
          supabase.from('product_health_benefits').delete().eq('product_id', editingProduct.id),
          supabase.from('product_breed_recommendations').delete().eq('product_id', editingProduct.id)
        ]);

        // Insert new related data
        if (life_stages) {
          const { error: lifeStagesError } = await supabase
            .from('product_life_stages')
            .insert({
              product_id: editingProduct.id,
              ...life_stages
            });

          if (lifeStagesError) throw lifeStagesError;
        }

        if (size_suitability) {
          const { error: sizeError } = await supabase
            .from('product_size_suitability')
            .insert({
              product_id: editingProduct.id,
              ...size_suitability
            });

          if (sizeError) throw sizeError;
        }

        if (health_benefits?.length > 0) {
          const { error: healthError } = await supabase
            .from('product_health_benefits')
            .insert(health_benefits.map(benefit => ({
              ...benefit,
              product_id: editingProduct.id
            })));

          if (healthError) throw healthError;
        }

        if (breed_recommendations?.length > 0) {
          const { error: breedError } = await supabase
            .from('product_breed_recommendations')
            .insert(breed_recommendations.map(rec => ({
              ...rec,
              product_id: editingProduct.id
            })));

          if (breedError) throw breedError;
        }
      } else {
        // Insert new product
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert([basicProductData])
          .select()
          .single();

        if (productError) throw productError;
        if (!newProduct) throw new Error('Failed to create product');

        // Insert related data
        if (life_stages) {
          const { error: lifeStagesError } = await supabase
            .from('product_life_stages')
            .insert({
              product_id: newProduct.id,
              ...life_stages
            });

          if (lifeStagesError) throw lifeStagesError;
        }

        if (size_suitability) {
          const { error: sizeError } = await supabase
            .from('product_size_suitability')
            .insert({
              product_id: newProduct.id,
              ...size_suitability
            });

          if (sizeError) throw sizeError;
        }

        if (health_benefits?.length > 0) {
          const { error: healthError } = await supabase
            .from('product_health_benefits')
            .insert(health_benefits.map(benefit => ({
              ...benefit,
              product_id: newProduct.id
            })));

          if (healthError) throw healthError;
        }

        if (breed_recommendations?.length > 0) {
          const { error: breedError } = await supabase
            .from('product_breed_recommendations')
            .insert(breed_recommendations.map(rec => ({
              ...rec,
              product_id: newProduct.id
            })));

          if (breedError) throw breedError;
        }
      }

      setShowForm(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(product => filterCategory === 'all' || product.category_id === filterCategory);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="all">All Categories</option>
              <option value="food">Food & Nutrition</option>
              <option value="toys">Toys & Entertainment</option>
              <option value="health">Health & Wellness</option>
              <option value="grooming">Grooming & Care</option>
              <option value="training">Training & Behavior</option>
              <option value="bedding">Beds & Furniture</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Edit product"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete product"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No products found matching your search criteria.
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <ProductForm
              initialData={editingProduct || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;