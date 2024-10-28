-- Drop existing table if it exists
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table with all required columns
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_role CHECK (role IN ('user', 'admin'))
);

-- Create index on email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin has full access" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create more permissive policies
CREATE POLICY "Anyone can read profiles"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin full access"
    ON profiles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR auth.jwt() ->> 'email' = 'admin@pawfectfind.com'
    );

-- Create or replace function to handle new user profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        display_name,
        role
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        CASE 
            WHEN NEW.email = 'admin@pawfectfind.com' THEN 'admin'
            ELSE 'user'
        END
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name,
        role = CASE 
            WHEN EXCLUDED.email = 'admin@pawfectfind.com' THEN 'admin'
            ELSE profiles.role
        END,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Ensure admin user exists and has proper permissions
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- First, ensure admin user exists in auth.users
    IF NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'admin@pawfectfind.com'
    ) THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@pawfectfind.com',
            crypt('admin123', gen_salt('bf')),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"role": "admin"}',
            NOW(),
            NOW()
        )
        RETURNING id INTO admin_user_id;
    ELSE
        SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@pawfectfind.com';
    END IF;

    -- Then ensure admin profile exists with correct role
    INSERT INTO public.profiles (id, email, role, display_name)
    VALUES (
        admin_user_id,
        'admin@pawfectfind.com',
        'admin',
        'Admin'
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        role = 'admin',
        email = EXCLUDED.email,
        updated_at = NOW();
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;