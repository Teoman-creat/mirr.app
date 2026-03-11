-- Supabase Schema for Mirr App

-- Users Table (Extended from auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  aura_score INTEGER DEFAULT 0,
  style_dna JSONB DEFAULT '{}'::jsonb, -- e.g., { "vibe": "Minimalist", "color_palette": "Dark" }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Wardrobe Items
CREATE TABLE public.wardrobe_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT, -- e.g., Tops, Bottoms, Outerwear, Footwear
  color TEXT,
  season TEXT,
  brand TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Style Analyses (AI Results)
CREATE TABLE public.analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  type TEXT NOT NULL, -- "OUTFIT", "GROOMING", "FACE"
  aura_score INTEGER,
  strengths TEXT[],
  improvements TEXT[],
  style_references TEXT[],
  raw_ai_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Community Feed Posts
CREATE TABLE public.community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Can be null for anonymous
  is_anonymous BOOLEAN DEFAULT false,
  fire_count INTEGER DEFAULT 0,
  meh_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Community Ratings (Swipe-to-rate)
CREATE TABLE public.post_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  rater_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating_type TEXT NOT NULL, -- 'FIRE' or 'MEH'
  notes TEXT, -- Optional feedback
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(post_id, rater_id) -- One rating per user per post
);
