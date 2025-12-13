-- =====================================================
-- CrushRadar Database Schema for Supabase
-- Run this SQL in Supabase SQL Editor
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer-not')),
  class TEXT,
  batch TEXT,
  hints_remaining INTEGER DEFAULT 3 CHECK (hints_remaining >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE TO authenticated
  USING (auth.uid() = id);

-- =====================================================
-- 2. CRUSHES TABLE
-- =====================================================
CREATE TABLE public.crushes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id),
  CHECK (sender_id != receiver_id)
);

-- Enable RLS
ALTER TABLE public.crushes ENABLE ROW LEVEL SECURITY;

-- Crushes policies (CRITICAL: Users can only see their OWN sent crushes)
CREATE POLICY "Users can view own sent crushes" ON public.crushes
  FOR SELECT TO authenticated
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can insert own crushes" ON public.crushes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete own crushes" ON public.crushes
  FOR DELETE TO authenticated
  USING (auth.uid() = sender_id);

-- =====================================================
-- 3. MATCHES TABLE
-- =====================================================
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id) -- Ensures consistent ordering
);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Matches policies (Users can only see matches they're part of)
CREATE POLICY "Users can view own matches" ON public.matches
  FOR SELECT TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- =====================================================
-- 4. HINT USAGE TABLE (Optional - tracks hint usage)
-- =====================================================
CREATE TABLE public.hint_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hint_type TEXT NOT NULL CHECK (hint_type IN ('name_initial', 'class_batch', 'avatar_blur')),
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.hint_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own hint usage" ON public.hint_usage
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hint usage" ON public.hint_usage
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 5. FUNCTIONS
-- =====================================================

-- Function to handle new user signup (auto-create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, hints_remaining)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    3
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check and create match when crush is mutual
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  mutual_exists BOOLEAN;
  ordered_user1 UUID;
  ordered_user2 UUID;
BEGIN
  -- Check if the reverse crush exists
  SELECT EXISTS (
    SELECT 1 FROM public.crushes
    WHERE sender_id = NEW.receiver_id
    AND receiver_id = NEW.sender_id
  ) INTO mutual_exists;

  -- If mutual, create a match
  IF mutual_exists THEN
    -- Order user IDs consistently (smaller UUID first)
    IF NEW.sender_id < NEW.receiver_id THEN
      ordered_user1 := NEW.sender_id;
      ordered_user2 := NEW.receiver_id;
    ELSE
      ordered_user1 := NEW.receiver_id;
      ordered_user2 := NEW.sender_id;
    END IF;

    -- Insert match if not exists
    INSERT INTO public.matches (user1_id, user2_id)
    VALUES (ordered_user1, ordered_user2)
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger for auto-matching
DROP TRIGGER IF EXISTS on_crush_created ON public.crushes;
CREATE TRIGGER on_crush_created
  AFTER INSERT ON public.crushes
  FOR EACH ROW EXECUTE FUNCTION public.check_and_create_match();

-- Function to use a hint (decrements hints_remaining)
CREATE OR REPLACE FUNCTION public.use_hint(hint_type_param TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_hints INTEGER;
BEGIN
  -- Get current hints
  SELECT hints_remaining INTO current_hints
  FROM public.profiles
  WHERE id = auth.uid();

  -- Check if user has hints left
  IF current_hints <= 0 THEN
    RETURN FALSE;
  END IF;

  -- Decrement hints
  UPDATE public.profiles
  SET hints_remaining = hints_remaining - 1,
      updated_at = NOW()
  WHERE id = auth.uid();

  -- Log hint usage
  INSERT INTO public.hint_usage (user_id, hint_type)
  VALUES (auth.uid(), hint_type_param);

  RETURN TRUE;
END;
$$;

-- Function to get match count for a user
CREATE OR REPLACE FUNCTION public.get_match_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.matches
  WHERE user1_id = user_uuid OR user2_id = user_uuid;
$$;

-- Function to get crush count for a user (sent crushes only)
CREATE OR REPLACE FUNCTION public.get_crush_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.crushes
  WHERE sender_id = user_uuid;
$$;

-- =====================================================
-- 6. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_crushes_sender ON public.crushes(sender_id);
CREATE INDEX IF NOT EXISTS idx_crushes_receiver ON public.crushes(receiver_id);
CREATE INDEX IF NOT EXISTS idx_crushes_pair ON public.crushes(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON public.matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON public.matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_profiles_class_batch ON public.profiles(class, batch);

-- =====================================================
-- 7. ENABLE REALTIME (Optional)
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crushes;

-- =====================================================
-- 8. STORAGE BUCKET FOR AVATARS (Run separately if needed)
-- =====================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('avatars', 'avatars', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
-- CREATE POLICY "Avatar images are publicly accessible"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'avatars');

-- CREATE POLICY "Users can upload own avatar"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can update own avatar"
-- ON storage.objects FOR UPDATE
-- USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete own avatar"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
