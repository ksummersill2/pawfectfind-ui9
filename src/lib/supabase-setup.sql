-- Drop existing tables and policies
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table with correct structure
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_role CHECK (role IN ('user', 'admin'))
);

-- Create indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admin has full access" ON profiles;

-- Create new policies with proper permissions
CREATE POLICY "Public read access"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin full access"
    ON profiles FOR ALL
    USING (
        auth.jwt() ->> 'email' = 'admin@pawfectfind.com'
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
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

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create admin user if not exists
DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- Check if admin exists in auth.users
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@pawfectfind.com'
    ) THEN
        -- Create admin user
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
            jsonb_build_object(
                'provider', 'email',
                'providers', array['email']
            ),
            jsonb_build_object(
                'role', 'admin'
            ),
            NOW(),
            NOW()
        )
        RETURNING id INTO admin_id;

        -- Create admin profile
        INSERT INTO public.profiles (
            id,
            email,
            role,
            display_name
        )
        VALUES (
            admin_id,
            'admin@pawfectfind.com',
            'admin',
            'Admin'
        );
    END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify setup
SELECT EXISTS (
    SELECT 1 
    FROM auth.users u 
    JOIN profiles p ON u.id = p.id 
    WHERE u.email = 'admin@pawfectfind.com' 
    AND p.role = 'admin'
) as admin_exists;