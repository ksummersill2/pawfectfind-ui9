```sql
-- Drop existing table if it exists
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    rating_count INTEGER DEFAULT 0,
    popularity INTEGER DEFAULT 0,
    discount INTEGER DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
    vendor TEXT NOT NULL,
    image TEXT NOT NULL,
    additional_images TEXT[],
    category_id TEXT NOT NULL,
    tags TEXT[],
    affiliate_type TEXT CHECK (affiliate_type IN ('amazon', NULL)),
    affiliate_link TEXT,
    
    -- Product details
    ingredients TEXT[],
    nutritional_info JSONB,
    features TEXT[],
    safety_warnings TEXT[],
    activity_level_suitable INTEGER[] CHECK (
        array_length(activity_level_suitable, 1) IS NULL OR
        (array_length(activity_level_suitable, 1) = 2 AND
         activity_level_suitable[1] >= 1 AND
         activity_level_suitable[2] <= 10)
    ),

    -- Seasonal and promotional
    is_seasonal BOOLEAN DEFAULT false,
    seasonal_type TEXT[] CHECK (seasonal_type <@ ARRAY['christmas', 'new_year', 'halloween', 'thanksgiving', 'easter', 'summer', 'winter']::TEXT[]),
    seasonal_start_date DATE,
    seasonal_end_date DATE,
    is_black_friday BOOLEAN DEFAULT false,
    black_friday_price DECIMAL(10,2) CHECK (black_friday_price IS NULL OR black_friday_price >= 0),
    promotion_type TEXT CHECK (promotion_type IN ('none', 'black_friday', 'clearance', 'new_arrival', 'best_seller')),
    promotion_start_date TIMESTAMPTZ,
    promotion_end_date TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_seasonal_dates CHECK (
        NOT is_seasonal OR (seasonal_start_date IS NOT NULL AND seasonal_end_date IS NOT NULL AND seasonal_start_date <= seasonal_end_date)
    ),
    CONSTRAINT valid_promotion_dates CHECK (
        promotion_type = 'none' OR (promotion_start_date IS NOT NULL AND promotion_end_date IS NOT NULL AND promotion_start_date <= promotion_end_date)
    )
);

-- Create product life stages table
CREATE TABLE IF NOT EXISTS product_life_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    suitable_for_puppy BOOLEAN DEFAULT false,
    suitable_for_adult BOOLEAN DEFAULT false,
    suitable_for_senior BOOLEAN DEFAULT false,
    min_age_months INTEGER,
    max_age_months INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_age_range CHECK (
        min_age_months IS NULL OR max_age_months IS NULL OR min_age_months <= max_age_months
    )
);

-- Create product size suitability table
CREATE TABLE IF NOT EXISTS product_size_suitability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    suitable_for_small BOOLEAN DEFAULT false,
    suitable_for_medium BOOLEAN DEFAULT false,
    suitable_for_large BOOLEAN DEFAULT false,
    suitable_for_giant BOOLEAN DEFAULT false,
    min_weight_kg DECIMAL(5,2),
    max_weight_kg DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_weight_range CHECK (
        min_weight_kg IS NULL OR max_weight_kg IS NULL OR min_weight_kg <= max_weight_kg
    )
);

-- Create product health benefits table
CREATE TABLE IF NOT EXISTS product_health_benefits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    health_condition_id UUID REFERENCES health_conditions(id) ON DELETE CASCADE,
    benefit_description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product breed recommendations table
CREATE TABLE IF NOT EXISTS product_breed_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    breed_id UUID REFERENCES dog_breeds(id) ON DELETE CASCADE,
    recommendation_strength INTEGER CHECK (recommendation_strength BETWEEN 1 AND 5),
    recommendation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_vendor ON products(vendor);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_is_black_friday ON products(is_black_friday);
CREATE INDEX idx_products_is_seasonal ON products(is_seasonal);
CREATE INDEX idx_products_promotion_type ON products(promotion_type);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_life_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_size_suitability ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_health_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_breed_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for products"
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Admin write access for products"
    ON products FOR ALL
    USING (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com')
    WITH CHECK (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com');

-- Create similar policies for related tables
CREATE POLICY "Public read access for product metadata"
    ON product_life_stages FOR SELECT
    USING (true);

CREATE POLICY "Public read access for size suitability"
    ON product_size_suitability FOR SELECT
    USING (true);

CREATE POLICY "Public read access for health benefits"
    ON product_health_benefits FOR SELECT
    USING (true);

CREATE POLICY "Public read access for breed recommendations"
    ON product_breed_recommendations FOR SELECT
    USING (true);

-- Admin write access policies
CREATE POLICY "Admin write access for product life stages"
    ON product_life_stages FOR ALL
    USING (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com')
    WITH CHECK (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com');

CREATE POLICY "Admin write access for size suitability"
    ON product_size_suitability FOR ALL
    USING (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com')
    WITH CHECK (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com');

CREATE POLICY "Admin write access for health benefits"
    ON product_health_benefits FOR ALL
    USING (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com')
    WITH CHECK (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com');

CREATE POLICY "Admin write access for breed recommendations"
    ON product_breed_recommendations FOR ALL
    USING (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com')
    WITH CHECK (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_life_stages_updated_at
    BEFORE UPDATE ON product_life_stages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_size_suitability_updated_at
    BEFORE UPDATE ON product_size_suitability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_health_benefits_updated_at
    BEFORE UPDATE ON product_health_benefits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_breed_recommendations_updated_at
    BEFORE UPDATE ON product_breed_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```