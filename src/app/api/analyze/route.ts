import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";

export const maxDuration = 30; // Serverless function timeout

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, styleGoal } = body;

    if (!image) {
      return new Response(JSON.stringify({ error: 'No image provided' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemInstruction = `Sen ünlü bir 'Yapay Zeka Senior Moda Danışmanı'sın (AI Senior Fashion Consultant).
Kullanıcının yüklediği fotoğraftaki kıyafeti ve stili detaylı bir şekilde analiz etmen gerekiyor.
Öncelikle fotoğraftaki objeleri (kıyafet parçaları, renkler, kesimler, aksesuarlar) tespit et, sonra bu objelerin birbiriyle uyumunu analiz et.
${styleGoal ? `\nÖNEMLİ: Kullanıcının bu kıyafet için belirttiği özel 'Stil Hedefi' (Style Goal): "${styleGoal}". Analizini bu hedefe uyum bağlamında değerlendir ve hedefi tutturup tutturmadığını eleştirilerinde belirt.` : ''}

Lütfen puanlamada objektif ol, gerektiğinde acımasız ama her zaman yapıcı eleştiriler sun. Moda terimleri kullanarak profesyonel konuş.

AŞAĞIDAKİ JSON FORMATINDA YANIT VER (başka hiçbir metin veya markdown bloğu kullanma, sadece JSON dizesi olsun):
{
  "auraScore": 85,
  "vibe": "Zarif Minimalizm",
  "strengths": ["Güçlü yön 1", "Güçlü yön 2"],
  "improvements": ["Gelişim alanı 1", "Gelişim alanı 2"]
}`;

    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    let mimeType = "image/jpeg";
    if (image.startsWith('data:')) {
      mimeType = image.split(';')[0].split(':')[1];
    }

    console.log("Calling explicitly v1 REST API for generateContent...");
    
    // We bypass the official SDK to force the `v1` endpoint since v1beta returns 404 for some versions
    try {
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              contents: [
                  {
                      parts: [
                          { text: systemInstruction },
                          { text: "Bu stili/kıyafeti detaylı şekilde analiz et." },
                          {
                              inlineData: {
                                  data: base64Data,
                                  mimeType: mimeType
                              }
                          }
                      ]
                  }
              ],
              generationConfig: {
                  temperature: 0.8
              }
          })
      });

      if (!response.ok) {
          const errorText = await response.text();
          console.error("Gemini API Error details:", response.status, errorText);
          throw new Error(`Google API returned ${response.status}: ${errorText}`);
      }
      
      const resultData = await response.json();
      console.log("Received response from model via fetch.");
      
      let responseText = resultData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
          throw new Error("No text found in API response.");
      }
      
      // Clean markdown formatting if present (since we can't use responseMimeType="application/json")
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      console.log("Response text:", responseText);

      // Attempt to save to Supabase
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            const parsedData = JSON.parse(responseText);
            let imageUrl = '';

            try {
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
                } else {
                    const { data: { publicUrl } } = supabase.storage
                        .from('analyses')
                        .getPublicUrl(fileName);
                    imageUrl = publicUrl;
                }
            } catch (err) {
                console.error("Exception uploading to storage:", err);
            }

            if (imageUrl) {
                const { error: dbError } = await supabase.from('analyses').insert({
                    user_id: user.id,
                    image_url: imageUrl,
                    type: "OUTFIT",
                    aura_score: parsedData.auraScore,
                    strengths: parsedData.strengths,
                    improvements: parsedData.improvements,
                    raw_ai_response: parsedData
                });
                
                if (dbError) {
                    console.error("Error saving to database:", dbError);
                } else {
                    console.log("Analysis successfully saved to database.");
                }
            } else {
                console.log("Skipping database save because image upload failed.");
            }
        } else {
            console.log("No authenticated user found, skipping database save.");
        }
      } catch (dbEx) {
        console.error("Exception while saving to database:", dbEx);
      }
      
      return new Response(responseText, {
          headers: { 'Content-Type': 'application/json' }
      });
    } catch (genErr) {
      console.error("Error inside generateContent:", genErr);
      throw genErr;
    }

  } catch (error: any) {
    console.error('Image analysis API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze image', 
      details: error?.message || error?.toString() || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
