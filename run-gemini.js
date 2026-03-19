const fs = require('fs');
const dotenvConfig = fs.readFileSync('.env.local', 'utf8');
dotenvConfig.split('\n').filter(l => l.startsWith('NEXT_PUBLIC_') || l.startsWith('GOOGLE_')).forEach(l => {
  const i = l.indexOf('=');
  if (i > -1) {
    process.env[l.substring(0, i).trim()] = l.substring(i+1).trim().replace(/['"]/g, '');
  }
});

const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

async function testGemini() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const outfitInstruction = `Sen kullanıcının en yakın arkadaşı gibi davranan, pratik ve doğal konuşan bir dijital stilistisin.
Kullanıcının yüklediği kıyafeti analiz et.

KURALLAR:
1. ASLA moda jargonu (silüet, proporsiyon, monokrom vb.) kullanma.
2. ÇOK KISA, ÖZ ve GÜNLÜK DİLDE konuş. Destan yazma, kısa ve öz ol.
3. Mutlaka en az 2 olumlu yön (strengths) ve en az 2 pratik tavsiye (improvements) üret! Boş bırakma.
4. "Kravat yerine papyon dene", "Pantolon biraz uzun, kıvırabilirsin" gibi son derece pratik ve doğrudan tavsiyeler ver.`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: outfitInstruction,
  });

  console.log('Sending request to Gemini...');
  try {
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Bana rastgele bir erkek kombini için analiz yap. Beyaz tişört ve siyah pantolon giymiş olsun." }] }],
      generationConfig: {
          temperature: 0.8,
          responseMimeType: "application/json",
          responseSchema: {
              type: SchemaType.OBJECT,
              properties: {
                  auraScore: { type: SchemaType.NUMBER, description: "Nihai Puan" },
                  vibe: { type: SchemaType.STRING, description: "Genel Stil Özeti" },
                  faceShape: { type: SchemaType.STRING, description: "Yüz şekli" },
                  strengths: {
                      type: SchemaType.ARRAY,
                      items: { type: SchemaType.STRING },
                      description: "Fotoğraftaki saçı, sakalı veya cildiyle ilgili en iyi 2 yönü. Sadece 1 cümlelik, aşırı basit, günlük ifadeler."
                  },
                  improvements: {
                      type: SchemaType.ARRAY,
                      items: { type: SchemaType.STRING },
                      description: "Saç, sakal veya cilt için ne yapması gerektiğine dair çok çok basit 2 tavsiye (Örn: 'Saçını biraz kısalt')."
                  }
              },
              required: ["auraScore", "vibe", "strengths", "improvements"]
          }
      }
    });
    
    console.log('Gemini Response:');
    console.log(response.response.text());
  } catch(e) { console.error('Error:', e); }
}

testGemini();
