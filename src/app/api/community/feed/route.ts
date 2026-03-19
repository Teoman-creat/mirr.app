import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Parse query parameters
    const url = new URL(req.url);
    const categoryFilter = url.searchParams.get('category');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Build the query
    // We want to fetch community posts along with their analysis details (image_url, etc)
    let query = supabase
      .from('community_posts')
      .select(`
        id,
        category,
        total_score,
        vote_count,
        created_at,
        analyses:analysis_id (
            id,
            image_url,
            vibe,
            reasoning,
            aura_score
        ),
        profiles:user_id (
            username,
            avatar_url,
            full_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (categoryFilter && categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }

    const { data: posts, error } = await query;

    if (error) {
      throw error;
    }

    // If user is logged in, optionally filter out posts they already voted on
    // Or just attach a flag to each post indicating if they voted
    if (user && posts && posts.length > 0) {
      const postIds = posts.map(p => p.id);
      const { data: userVotes } = await supabase
        .from('community_votes')
        .select('post_id, score, reaction')
        .eq('user_id', user.id)
        .in('post_id', postIds);
        
      const votesMap = new Map(userVotes?.map(v => [v.post_id, v]) || []);
      
      const enrichedPosts = posts.map(p => ({
        ...p,
        user_vote: votesMap.get(p.id) || null
      }));
      
      return NextResponse.json({ posts: enrichedPosts });
    }

    return NextResponse.json({ posts: posts || [] });

  } catch (error: any) {
    console.error('Feed API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
