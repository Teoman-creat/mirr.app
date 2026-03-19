import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { post_id, score, reaction, comment } = await req.json();

    if (!post_id) {
      return NextResponse.json({ error: 'Missing post_id' }, { status: 400 });
    }

    if (score === undefined && !reaction) {
      return NextResponse.json({ error: 'Must provide either score or reaction' }, { status: 400 });
    }

    // Insert or update the vote
    const { data: voteData, error: voteError } = await supabase
      .from('community_votes')
      .upsert({
        post_id,
        user_id: user.id,
        score: score || null,
        reaction: reaction || null,
        comment: comment || null
      }, { onConflict: 'post_id,user_id' })
      .select()
      .single();

    if (voteError) {
      return NextResponse.json({ error: voteError.message }, { status: 500 });
    }

    // Recalculate and update the community_posts total_score and vote_count
    const { data: allVotes } = await supabase
      .from('community_votes')
      .select('score')
      .eq('post_id', post_id);
      
    if (allVotes) {
       const votesWithScore = allVotes.filter(v => v.score !== null);
       const sumScore = votesWithScore.reduce((acc, curr) => acc + (curr.score || 0), 0);
       const voteCount = allVotes.length;
       
       await supabase.from('community_posts')
         .update({ total_score: sumScore, vote_count: voteCount })
         .eq('id', post_id);
    }

    return NextResponse.json({ success: true, vote: voteData });

  } catch (error: any) {
    console.error('Vote API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
