import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";

export const maxDuration = 30; // Serverless function timeout

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, styleGoal, type } = body;
    const isGrooming = type === 'grooming';

    if (!image) {
      return new Response(JSON.stringify({ error: 'No image provided' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const outfitInstruction = `Sen kullanıcının en yakın arkadaşı gibi davranan, pratik ve doğal konuşan profesyonel bir dijital stilistisin.
Kullanıcının yüklediği kıyafeti veya görünümü analiz et. Eksik parçalar varsa (örneğin sadece üst giyim varsa) alt giyim (pantolon, etek vb.) tavsiyesinde bulun.
${styleGoal ? `\nÖNEMLİ: Kullanıcının "Hedefi": "${styleGoal}". Buna göre nokta atışı yorumlar yap.` : ''}

KURALLAR:
1. Moda jargonu yerine herkesin anlayabileceği gündelik ve anlaşılır bir dil kullan.
2. Tavsiyelerin detaylı ve spesifik olsun! Sadece "gömlek giy" demek yerine gömleğin rengini, desenini, kol boyunu (kısa kol, uzun kol) ve pantolon/etek eşleştirmesini mutlaka belirt.
3. Mutlaka en az 2 detaylı olumlu yön (strengths) ve en az 3 spesifik, pratik tavsiye (improvements) üret! Boş bırakma.
4. Renk uyumlarına dikkat et ve önereceğin alternatif kıyafetlerin kesin renklerini ve tarzlarını (örn: "koyu lacivert keten pantolon", "kısa kollu beyaz basic tişört") açıkça vurgula.`;


    const groomingInstruction = `Sen kullanıcının kişisel berberi ve cilt bakım uzmanı gibi davranan, samimi ve pratik konuşan bir danışmansın.
Kullanıcının yüklediği yüz fotoğrafını inceleyerek SAÇ KESİMİ, SAKAL ve YÜZ/CİLT hakkında analiz yap.
${styleGoal ? `\nÖNEMLİ: Kullanıcının "Hedefi": "${styleGoal}".` : ''}

KURALLAR:
1. Karmaşık dermatoloji veya kozmetik terimlerine girmeden basit konuş.
2. ÇOK KISA ve ÖZ ol.
3. Mutlaka en az 2 olumlu yön (strengths) ve en az 2 net tavsiye (improvements) üret! Boş bırakma.
4. Yüz şekline göre net öneriler ver (Örn: "Yanları kısa kestir, yüzün ince görünür", "Sakallarını biraz toparlamalısın", "Yüzün kuru duruyor, nemlendirici sür").`;

    const systemInstruction = isGrooming ? groomingInstruction : outfitInstruction;

    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    let mimeType = "image/jpeg";
    if (image.startsWith('data:')) {
      mimeType = image.split(';')[0].split(':')[1];
    }

    console.log("Calling Gemini API via official SDK...");
    
    try {
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: systemInstruction,
      });

      const response = await model.generateContent({
        contents: [
            {
                role: "user",
                parts: [
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
            temperature: 0.8,
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    auraScore: {
                        type: SchemaType.NUMBER,
                        description: "Nihai Puan (Final Score): 100 üzerinden genel stil ve aura puanı."
                    },
                    vibe: {
                        type: SchemaType.STRING,
                        description: "Genel Stil Özeti (Vibe): Kıyafetin genel havasını özetleyen karizmatik bir başlık veya kısa tanım (Örn: \"Zarif Minimalizm\")."
                    },
                    faceShape: {
                        type: SchemaType.STRING,
                        description: "SADECE YÜZ ANALİZİNDE: Yüz şekli (Örn: 'Oval', 'Köşeli', 'Kalp', 'Yuvarlak'). Kıyafet analiziyse boş bırak."
                    },
                    strengths: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING },
                        description: isGrooming 
                            ? "Fotoğraftaki saçı, sakalı veya cildiyle ilgili en iyi 2 yönü. Sadece 1 cümlelik, aşırı basit, günlük ifadeler."
                            : "Kombindeki en iyi özellikler. Renk uyumu, parça seçimi gibi detayları belirten, açıklayıcı ve samimi dilde övgüler. (Örn: 'Ceketinin rengi ten renginle harika uyum sağlamış'). En az 2 madde."
                    },
                    improvements: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING },
                        description: isGrooming
                            ? "Saç, sakal veya cilt için ne yapması gerektiğine dair çok çok basit 2 tavsiye (Örn: 'Saçını biraz kısalt')."
                            : "Kıyafeti için oldukça spesifik ve detaylı tavsiyeler. Eksik parçalar için pantolon/etek önerisi yap, renkleri ve kol boyu (kısa/uzun) gibi detayları MUTLAKA belirt (Örn: 'Bu gömleğin altına koyu lacivert, dar kesim bir kot pantolon çok iyi gider', 'Üstüne kısa kollu, açık mavi bir keten gömlek deneyebilirsin'). En az 3 madde."
                    }
                },
                required: ["auraScore", "vibe", "strengths", "improvements"]
            }
        }
      });

      console.log("Received response from model via SDK.");
      
      let responseText = response.response.text();
      if (!responseText) {
          throw new Error("No text found in API response.");
      }
      
      // Clean markdown formatting if present
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      console.log("Response text:", responseText);

      // Attempt to save to Supabase
      try {
        const supabase = createClient();
        console.log("Supabase client initialized in API route. Checking auth...");
        
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        
        console.log("Auth user result:", { userId: user?.id, error: authErr?.message });

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
                // Ensure we have a reasoning string (can use first improvement or a combined string)
                const reasoning = parsedData.improvements && parsedData.improvements.length > 0 
                  ? parsedData.improvements[0] 
                  : "Stil DNA'nızı yansıtan harika bir kombin.";

                const { error: dbError } = await supabase.from('analyses').insert({
                    user_id: user.id,
                    image_url: imageUrl,
                    type: isGrooming ? "GROOMING" : "OUTFIT",
                    aura_score: parsedData.auraScore,
                    vibe: parsedData.vibe, // explicitly save vibe
                    reasoning: reasoning, // explicitly save reasoning for the profile card
                    strengths: parsedData.strengths,
                    improvements: parsedData.improvements,
                    raw_ai_response: parsedData
                });
                
                if (dbError) {
                    console.error("Error saving to database:", dbError);
                } else {
                    console.log("Analysis successfully saved to database with vibe and reasoning.");
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
