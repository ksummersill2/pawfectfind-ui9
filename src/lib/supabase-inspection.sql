-- Check storage buckets
SELECT * FROM storage.buckets;

-- Check storage bucket policies
SELECT * FROM pg_policies WHERE schemaname = 'storage';

-- Check dog breeds table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'dog_breeds';

-- Check breed size variations table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'breed_size_variations';

-- Check dogs table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'dogs';

-- Check storage objects table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'storage' 
AND table_name = 'objects';

-- Check existing storage policies
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'storage';

-- Check if the dogs bucket exists and its configuration
SELECT * FROM storage.buckets WHERE id = 'dogs';

-- Check existing RLS policies for the dogs table
SELECT * FROM pg_policies WHERE tablename = 'dogs';

-- Sample breed data to verify structure
SELECT id, name, has_size_variations 
FROM dog_breeds 
LIMIT 5;

-- Sample size variations to verify structure
SELECT id, breed_id, size_category 
FROM breed_size_variations 
LIMIT 5;