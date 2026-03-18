import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";

export const maxDuration = 30; // Serverless function timeout

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return new Response(JSON.stringify({ error: 'No image provided' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemInstruction = `Sen ünlü bir 'Yapay Zeka Senior Berber ve Stil Danışmanı'sın (AI Senior Barber & Grooming Consultant).
Kullanıcının yüklediği yüz fotoğrafını detaylı bir şekilde analiz etmen gerekiyor.
Öncelikle kullanıcının yüz şeklini (Oval, Kare, Yuvarlak, Elmas vb.) tespit et. Ardından cilt alt tonunu ve genel hatlarını incele.
Bu yüz tipine en uygun saç modellerini, eğer sakal/bıyık bırakmak isterse en uygun sakal kesimlerini ve son olarak cildinin veya genel görünümünün daha sağlıklı/canlı görünmesi için 1-2 temel bakım tüyosu öner.
Lütfen profesyonel, motive edici ve karizmatik bir dil kullan.`;

    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    let mimeType = "image/jpeg";
    if (image.startsWith('data:')) {
      mimeType = image.split(';')[0].split(':')[1];
    }

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
                    { text: "Lütfen yüz hatlarımı analiz et ve bana en uygun saç/sakal modellerini ve bakım tüyolarını sun." },
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
                    faceShape: {
                        type: SchemaType.STRING,
                        description: "Yüz Şekli: Tespit edilen yüz şeklinin adı (Örn: Kare, Oval, Elmas, Kalp)."
                    },
                    vibe: {
                        type: SchemaType.STRING,
                        description: "Kişisel Bakım / Görünüm Özeti: Kullanıcının genel aurasını veya yüz hatlarının verdiği mesajı özetleyen kısa, karizmatik bir başlık (Örn: \"Keskin & Modern\", \"Klasik Centilmen\")."
                    },
                    hairRecommendations: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING },
                        description: "Bu yüz şekline ve yapıya en uygun 2 ila 4 adet saç kesimi ve şekillendirme önerisi."
                    },
                    beardRecommendations: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING },
                        description: "En uygun sakal/bıyık kesimleri veya sinekkaydı tıraş tavsiyesi. 2 ila 4 adet öneri."
                    },
                    skincareTips: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING },
                        description: "Yüz/cilt veya genel bakım için yapılabilecek 1-2 temel ve etkili bakım tavsiyesi."
                    }
                },
                required: ["faceShape", "vibe", "hairRecommendations", "beardRecommendations", "skincareTips"]
            }
        }
      });

      let responseText = response.response.text();
      if (!responseText) {
          throw new Error("No text found in API response.");
      }
      
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      return new Response(responseText, {
          headers: { 'Content-Type': 'application/json' }
      });

    } catch (genErr) {
      console.error("Error inside generateContent:", genErr);
      throw genErr;
    }

  } catch (error: any) {
    console.error('Grooming analysis API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze face', 
      details: error?.message || error?.toString() || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
