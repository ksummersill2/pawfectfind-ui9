-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Create buckets table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage.buckets (
    id text PRIMARY KEY,
    name text NOT NULL,
    owner uuid REFERENCES auth.users,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    public boolean DEFAULT FALSE,
    avif_autodetection boolean DEFAULT FALSE,
    file_size_limit bigint,
    allowed_mime_types text[]
);

-- Create required buckets with proper MIME types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('dogs', 'dogs', true, 5242880, ARRAY[
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif'
    ])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public Access"
ON storage.buckets FOR SELECT
USING (true);

-- Create policies for authenticated users
CREATE POLICY "Users can upload dog photos"
ON storage.buckets FOR INSERT
TO authenticated
WITH CHECK (id = 'dogs');

-- Create policy for users to manage their own uploads
CREATE POLICY "Users can manage their own uploads"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'dogs' AND auth.uid()::text = owner::text);