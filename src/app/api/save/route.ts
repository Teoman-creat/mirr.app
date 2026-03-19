import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, parsedData, type = 'OUTFIT' } = body;

    if (!image || !parsedData) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    let mimeType = "image/jpeg";
    if (image.startsWith('data:')) {
      mimeType = image.split(';')[0].split(':')[1];
    }

    let imageUrl = '';

    // Upload image to Storage
    const fileName = `${user.id}/${Date.now()}.${mimeType.split('/')[1] || 'jpeg'}`;
    const buffer = Buffer.from(base64Data, 'base64');
    
    const { error: uploadError } = await supabase.storage
        .from('analyses')
        .upload(fileName, buffer, {
            contentType: mimeType,
            upsert: false
        });

    if (uploadError) {
        console.error("Error uploading image to storage:", uploadError);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
    
    const { data: { publicUrl } } = supabase.storage
        .from('analyses')
        .getPublicUrl(fileName);
    imageUrl = publicUrl;

    // Ensure we have a reasoning string
    let reasoning = "Stil DNA'nızı yansıtan harika bir kombin.";
    if (type === 'OUTFIT') {
        reasoning = parsedData.improvements && parsedData.improvements.length > 0 
          ? parsedData.improvements[0] 
          : reasoning;
    } else if (type === 'GROOMING') {
        reasoning = parsedData.skincareTips && parsedData.skincareTips.length > 0
          ? parsedData.skincareTips[0]
          : "Yüz hatlarınıza özel stil önerisi.";
    }

    const { data: insertedData, error: dbError } = await supabase.from('analyses').insert({
        user_id: user.id,
        image_url: imageUrl,
        type: type,
        aura_score: type === 'OUTFIT' ? parsedData.auraScore : null,
        vibe: parsedData.vibe || (type === 'GROOMING' ? parsedData.faceShape : ""),
        reasoning: reasoning,
        strengths: type === 'OUTFIT' ? parsedData.strengths : parsedData.hairRecommendations, // Reuse columns for now or rely entirely on raw_ai_response
        improvements: type === 'OUTFIT' ? parsedData.improvements : parsedData.beardRecommendations,
        raw_ai_response: parsedData
    }).select('id').single();
    
    if (dbError) {
        console.error("Error saving to database:", dbError);
        return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
    }

    return NextResponse.json({ success: true, analysis_id: insertedData?.id });

  } catch (error: any) {
    console.error('Save result API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
