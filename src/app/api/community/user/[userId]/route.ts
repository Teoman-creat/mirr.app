import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = createClient();
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Check if the user is public
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, is_public, style_dna, city, country')
      .eq('id', userId)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!profile.is_public) {
      return NextResponse.json({ error: 'This profile is private' }, { status: 403 });
    }

    // Fetch this user's community posts
    const { data: posts, error: postsErr } = await supabase
      .from('community_posts')
      .select(`
        id,
        category,
        total_score,
        vote_count,
        created_at,
        analyses:analysis_id (
            image_url,
            vibe,
            reasoning
        ),
        profiles:user_id (
            username,
            avatar_url,
            full_name
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (postsErr) {
      throw postsErr;
    }

    // We also need to see if the current logged-in user has voted on these posts
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    let postsWithUserVote = posts || [];
    if (currentUser && posts && posts.length > 0) {
      const postIds = posts.map(p => p.id);
      const { data: userVotes } = await supabase
        .from('community_votes')
        .select('post_id, score, reaction')
        .eq('user_id', currentUser.id)
        .in('post_id', postIds);
        
      if (userVotes && userVotes.length > 0) {
        postsWithUserVote = posts.map(p => {
            const vote = userVotes.find(v => v.post_id === p.id);
            return {
                ...p,
                user_vote: vote || null
            };
        });
      }
    }

    return NextResponse.json({ 
      profile, 
      posts: postsWithUserVote 
    });

  } catch (error: any) {
    console.error('Public Profile API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
