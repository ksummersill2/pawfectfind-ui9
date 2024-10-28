-- Drop existing table if it exists
DROP TABLE IF EXISTS product_ratings CASCADE;

-- Create product ratings table
CREATE TABLE product_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    helpful_count INTEGER DEFAULT 0,
    verified_purchase BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_product_ratings_product ON product_ratings(product_id);
CREATE INDEX idx_product_ratings_user ON product_ratings(user_id);
CREATE INDEX idx_product_ratings_rating ON product_ratings(rating);
CREATE INDEX idx_product_ratings_created ON product_ratings(created_at);

-- Enable RLS
ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for ratings"
    ON product_ratings FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can rate products"
    ON product_ratings FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
    ON product_ratings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
    ON product_ratings FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_rating_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_product_ratings_updated_at
    BEFORE UPDATE ON product_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_rating_updated_at_column();

-- Create function to update product rating statistics
CREATE OR REPLACE FUNCTION update_product_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE products
        SET 
            rating = COALESCE((
                SELECT AVG(rating)::DECIMAL(3,2)
                FROM product_ratings
                WHERE product_id = OLD.product_id
            ), 0),
            rating_count = COALESCE((
                SELECT COUNT(*)
                FROM product_ratings
                WHERE product_id = OLD.product_id
            ), 0)
        WHERE id = OLD.product_id;
    ELSE
        UPDATE products
        SET 
            rating = COALESCE((
                SELECT AVG(rating)::DECIMAL(3,2)
                FROM product_ratings
                WHERE product_id = NEW.product_id
            ), 0),
            rating_count = COALESCE((
                SELECT COUNT(*)
                FROM product_ratings
                WHERE product_id = NEW.product_id
            ), 0)
        WHERE id = NEW.product_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating statistics
DROP TRIGGER IF EXISTS update_product_rating_stats_trigger ON product_ratings;
CREATE TRIGGER update_product_rating_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON product_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating_stats();

-- Add helpful votes tracking
CREATE TABLE product_rating_helpful_votes (
    rating_id UUID REFERENCES product_ratings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (rating_id, user_id)
);

-- Enable RLS on helpful votes
ALTER TABLE product_rating_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for helpful votes
CREATE POLICY "Public read access for helpful votes"
    ON product_rating_helpful_votes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can vote"
    ON product_rating_helpful_votes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can remove own votes"
    ON product_rating_helpful_votes FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update helpful count
CREATE OR REPLACE FUNCTION update_rating_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE product_ratings
        SET helpful_count = helpful_count + 1
        WHERE id = NEW.rating_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE product_ratings
        SET helpful_count = helpful_count - 1
        WHERE id = OLD.rating_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for helpful count
CREATE TRIGGER update_rating_helpful_count_trigger
    AFTER INSERT OR DELETE ON product_rating_helpful_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_rating_helpful_count();

-- Add comments
COMMENT ON TABLE product_ratings IS 'Product ratings and reviews from users';
COMMENT ON TABLE product_rating_helpful_votes IS 'Tracks helpful votes on product ratings';