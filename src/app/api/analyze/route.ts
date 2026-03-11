import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

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

    console.log("Analyzing image with Google SDK...", { styleGoal, previewLength: image.length });
    
    // Initialize the SDK
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
    
    // We use gemini-1.5-pro for vision tasks and complex reasoning
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
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
                    strengths: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING },
                        description: "Renk Raporu, Silüet & Oran ve Detay & Aksesuar kısımlarındaki güçlü/olumlu yönler. Her biri 1-2 cümlelik 2 ile 4 adet madde."
                    },
                    improvements: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING },
                        description: "Alternatif Reçete veya eleştirel kısımlar: Nasıl daha iyi olabilirdi? Gelişim alanları. Her biri 1-2 cümlelik 2 ile 4 adet madde."
                    }
                },
                required: ["auraScore", "vibe", "strengths", "improvements"]
            }
        }
    });

    const systemInstruction = `Sen ünlü bir 'Yapay Zeka Senior Moda Danışmanı'sın (AI Senior Fashion Consultant).
Kullanıcının yüklediği fotoğraftaki kıyafeti ve stili detaylı bir şekilde analiz etmen gerekiyor.
Öncelikle fotoğraftaki objeleri (kıyafet parçaları, renkler, kesimler, aksesuarlar) tespit et, sonra bu objelerin birbiriyle uyumunu analiz et.
${styleGoal ? `\nÖNEMLİ: Kullanıcının bu kıyafet için belirttiği özel 'Stil Hedefi' (Style Goal): "${styleGoal}". Analizini bu hedefe uyum bağlamında değerlendir ve hedefi tutturup tutturmadığını eleştirilerinde belirt.` : ''}

Lütfen puanlamada objektif ol, gerektiğinde acımasız ama her zaman yapıcı eleştiriler sun. Moda terimleri kullanarak profesyonel konuş.`;

    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    // Extract mime type if present, otherwise default to image/jpeg
    let mimeType = "image/jpeg";
    if (image.startsWith('data:')) {
      mimeType = image.split(';')[0].split(':')[1];
    }

    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType
        }
    };

    console.log("Calling model.generateContent...");
    try {
      const result = await model.generateContent([
          systemInstruction, 
          { text: "Bu stili/kıyafeti detaylı şekilde analiz et." }, 
          imagePart
      ]);
      console.log("Received response from model.");
      const responseText = result.response.text();
      console.log("Response text:", responseText);
      
      return new Response(responseText, {
          headers: { 'Content-Type': 'application/json' }
      });
    } catch (genErr) {
      console.error("Error inside generateContent:", genErr);
      throw genErr;
    }

  } catch (error) {
    console.error('Image analysis API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze image' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
