import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analysis_id, category } = await req.json();

    if (!analysis_id || !category) {
      return NextResponse.json({ error: 'Missing analysis_id or category' }, { status: 400 });
    }

    // Verify the analysis belongs to the user
    const { data: analysisData, error: analysisError } = await supabase
      .from('analyses')
      .select('id')
      .eq('id', analysis_id)
      .eq('user_id', user.id)
      .single();

    if (analysisError || !analysisData) {
      return NextResponse.json({ error: 'Analysis not found or permission denied' }, { status: 403 });
    }

    // Ensure the user's profile exists to satisfy the foreign key constraint
    // Some older users might not have a profile row if the trigger didn't run
    await supabase.from('profiles').upsert({ id: user.id }, { onConflict: 'id', ignoreDuplicates: true });

    // Create the community post
    const { data: postData, error: postError } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        analysis_id,
        category
      })
      .select()
      .single();

    if (postError) {
      if (postError.code === '23505') {
        return NextResponse.json({ error: 'This analysis is already published to the community.' }, { status: 409 });
      }
      throw postError;
    }

    return NextResponse.json({ success: true, post: postData });

  } catch (error: any) {
    console.error('Publish API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
