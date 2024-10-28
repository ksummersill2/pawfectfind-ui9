import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product } from '../types';
import { generateAffiliateLink } from '../lib/amazonAffiliateLink';

export const useProducts = (categoryId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
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
        `);
      
      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId.toLowerCase());
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      const transformedData = data?.map(product => ({
        ...product,
        id: product.id.toString(),
        affiliate_link: product.affiliate_type === 'amazon' && product.affiliate_link 
          ? generateAffiliateLink(product.affiliate_link)
          : product.affiliate_link,
        tags: product.tags || [],
        ingredients: product.ingredients || [],
        features: product.features || [],
        safety_warnings: product.safety_warnings || [],
        additional_images: product.additional_images || [],
        rating: product.rating || 0,
        popularity: product.popularity || 0,
        discount: product.discount || 0,
        price: parseFloat(product.price) || 0,
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

  const refreshProducts = () => {
    fetchProducts();
  };

  return { products, loading, error, refreshProducts };
};