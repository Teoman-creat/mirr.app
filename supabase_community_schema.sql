-- 1. Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  analysis_id UUID REFERENCES analyses NOT NULL UNIQUE,
  category TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS on community_posts
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone." 
ON community_posts FOR SELECT USING (true);

CREATE POLICY "Users can insert their own posts." 
ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Create community_votes table
CREATE TABLE IF NOT EXISTS community_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  score INTEGER, -- 1-10 for Aura
  reaction TEXT, -- 'fire', 'meh'
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 4. Enable RLS on community_votes
ALTER TABLE community_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes are viewable by everyone." 
ON community_votes FOR SELECT USING (true);

CREATE POLICY "Users can insert their own votes." 
ON community_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes." 
ON community_votes FOR UPDATE USING (auth.uid() = user_id);

-- 5. Helper function to safely update the post score when a user votes
CREATE OR REPLACE FUNCTION increment_post_score()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts
    SET total_score = total_score + COALESCE(NEW.score, 0),
        vote_count = vote_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE community_posts
    SET total_score = total_score - COALESCE(OLD.score, 0) + COALESCE(NEW.score, 0)
    WHERE id = NEW.post_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Attach trigger
DROP TRIGGER IF EXISTS on_vote_update ON community_votes;
CREATE TRIGGER on_vote_update
AFTER INSERT OR UPDATE ON community_votes
FOR EACH ROW
EXECUTE FUNCTION increment_post_score();
