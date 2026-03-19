import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = createClient();

    // Parse query parameters
    const url = new URL(req.url);
    const categoryFilter = url.searchParams.get('category');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const timeframe = url.searchParams.get('timeframe') || 'all'; // 'weekly', 'monthly', 'all'

    // Build the query
    let query = supabase
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
            id,
            username,
            avatar_url,
            full_name,
            is_public
        )
      `)
      .order('total_score', { ascending: false })
      .limit(limit);

    if (categoryFilter && categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }
    
    // NOTE: In a real production app you'd want a proper materialized view or complex SQL for timeframes.
    // For now we do simple filtering by post creation date.
    if (timeframe === 'weekly') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      query = query.gte('created_at', lastWeek.toISOString());
    } else if (timeframe === 'monthly') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      query = query.gte('created_at', lastMonth.toISOString());
    }

    const { data: leaderboard, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ leaderboard: leaderboard || [] });

  } catch (error: any) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
