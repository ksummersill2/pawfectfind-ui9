export type SeasonalType = 'christmas' | 'new_year' | 'halloween' | 'thanksgiving' | 'easter' | 'summer' | 'winter';
export type PromotionType = 'none' | 'black_friday' | 'clearance' | 'new_arrival' | 'best_seller';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  popularity: number;
  discount: number;
  vendor: string;
  image: string;
  additional_images?: string[];
  category_id: string;
  tags: string[];
  affiliate_type?: 'amazon' | null;
  affiliate_link?: string;
  reviews?: Review[];
  
  // Product details
  ingredients?: string[];
  nutritional_info?: Record<string, any>;
  features?: string[];
  safety_warnings?: string[];
  activity_level_suitable?: [number, number];

  // Life stages
  life_stages?: {
    suitable_for_puppy: boolean;
    suitable_for_adult: boolean;
    suitable_for_senior: boolean;
    min_age_months?: number;
    max_age_months?: number;
  };

  // Size suitability
  size_suitability?: {
    suitable_for_small: boolean;
    suitable_for_medium: boolean;
    suitable_for_large: boolean;
    suitable_for_giant: boolean;
    min_weight_kg?: number;
    max_weight_kg?: number;
  };

  // Health benefits
  health_benefits?: Array<{
    health_condition_id: string;
    benefit_description: string;
  }>;

  // Breed recommendations
  breed_recommendations?: Array<{
    breed_id: string;
    recommendation_strength: number;
    recommendation_reason: string;
  }>;

  // Seasonal and promotional
  is_seasonal?: boolean;
  seasonal_type?: SeasonalType[];
  seasonal_start_date?: string;
  seasonal_end_date?: string;
  is_black_friday?: boolean;
  black_friday_price?: number;
  promotion_type?: PromotionType;
  promotion_start_date?: string;
  promotion_end_date?: string;

  // Metadata
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  helpful_count: number;
  verified_purchase: boolean;
  created_at: string;
  user_name: string;
}