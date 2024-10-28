```sql
-- First, drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for products" ON products;
DROP POLICY IF EXISTS "Admin write access for products" ON products;
DROP POLICY IF EXISTS "Public read access for product metadata" ON product_life_stages;
DROP POLICY IF EXISTS "Admin write access for product life stages" ON product_life_stages;
DROP POLICY IF EXISTS "Public read access for size suitability" ON product_size_suitability;
DROP POLICY IF EXISTS "Admin write access for size suitability" ON product_size_suitability;
DROP POLICY IF EXISTS "Public read access for health benefits" ON product_health_benefits;
DROP POLICY IF EXISTS "Admin write access for health benefits" ON product_health_benefits;
DROP POLICY IF EXISTS "Public read access for breed recommendations" ON product_breed_recommendations;
DROP POLICY IF EXISTS "Admin write access for breed recommendations" ON product_breed_recommendations;

-- Recreate policies with proper checks
CREATE POLICY "Public read access for products"
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Admin write access for products"
    ON products FOR ALL
    USING (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com')
    WITH CHECK (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com');

CREATE POLICY "Public read access for product metadata"
    ON product_life_stages FOR SELECT
    USING (true);

CREATE POLICY "Admin write access for product life stages"
    ON product_life_stages FOR ALL
    USING (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com')
    WITH CHECK (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com');

CREATE POLICY "Public read access for size suitability"
    ON product_size_suitability FOR SELECT
    USING (true);

CREATE POLICY "Admin write access for size suitability"
    ON product_size_suitability FOR ALL
    USING (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com')
    WITH CHECK (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com');

CREATE POLICY "Public read access for health benefits"
    ON product_health_benefits FOR SELECT
    USING (true);

CREATE POLICY "Admin write access for health benefits"
    ON product_health_benefits FOR ALL
    USING (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com')
    WITH CHECK (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com');

CREATE POLICY "Public read access for breed recommendations"
    ON product_breed_recommendations FOR SELECT
    USING (true);

CREATE POLICY "Admin write access for breed recommendations"
    ON product_breed_recommendations FOR ALL
    USING (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com')
    WITH CHECK (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com');

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
```