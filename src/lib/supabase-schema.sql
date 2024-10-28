-- Drop existing tables if they exist
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for categories"
    ON categories FOR SELECT
    USING (true);

CREATE POLICY "Admin write access for categories"
    ON categories FOR ALL
    USING (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com')
    WITH CHECK (auth.role() = 'authenticated' AND auth.email() = 'admin@pawfectfind.com');

-- Create indexes
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_created_at ON categories(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();