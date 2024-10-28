-- Drop existing profiles table and recreate with correct structure
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_is_admin ON profiles(is_admin);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin has full access" ON profiles;

-- Create simplified policies
CREATE POLICY "Public read access for profiles"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND NOT is_admin);

CREATE POLICY "Admin has full access"
    ON profiles FOR ALL
    USING (
        (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
        OR auth.jwt() ->> 'email' = 'admin@pawfectfind.com'
    );

-- Create admin user if not exists
DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- Create admin user if not exists
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
            jsonb_build_object('provider', 'email', 'providers', array['email']),
            jsonb_build_object('is_admin', true),
            NOW(),
            NOW()
        )
        RETURNING id INTO admin_id;

        -- Create admin profile
        INSERT INTO profiles (id, email, display_name, is_admin)
        VALUES (admin_id, 'admin@pawfectfind.com', 'Admin', true);
    ELSE
        -- Update existing admin profile
        UPDATE profiles
        SET is_admin = true
        WHERE email = 'admin@pawfectfind.com';
    END IF;
END $$;